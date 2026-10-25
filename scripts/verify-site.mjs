import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { publicAssets } from './assets.mjs';
import { content, siteUrl } from './content.mjs';

const root = new URL('../dist/client/', import.meta.url);
const htmlFiles = [...publicAssets.keys()].filter(path => path.endsWith('.html'));
const pages = new Map(await Promise.all(htmlFiles.map(async path => [path, await readFile(new URL(path, root), 'utf8')])));
let checkedLinks = 0;
for (const path of publicAssets.keys()) assert.ok((await stat(new URL(path, root))).size > 0, `Empty asset: ${path}`);
for (const [path, html] of pages) {
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: single h1`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: duplicate IDs`);
  const locale = path.startsWith('en/') ? 'en' : path.startsWith('es/') ? 'es' : 'pt';
  assert.ok(html.includes(`<html lang="${content[locale].lang}">`), `${path}: language`);
  assert.ok(html.includes(`rel="canonical" href="${siteUrl}${path.replace(/index\.html$/, '')}"`), `${path}: canonical`);
  for (const match of html.matchAll(/<(?:img|a|link|script)\b[^>]*>/g)) {
    const tag = match[0];
    if (tag.startsWith('<img')) assert.ok(/\balt="[^"]+"/.test(tag), `${path}: image alt`);
    if (/target="_blank"/.test(tag)) assert.ok(/rel="noopener noreferrer"/.test(tag), `${path}: external link protection`);
    const value = tag.match(/\b(?:href|src)="([^"]+)"/)?.[1];
    if (!value || /^(?:https?:|mailto:|tel:)/.test(value)) continue;
    const url = new URL(value, new URL(path, 'https://local.test/'));
    let target = decodeURIComponent(url.pathname.slice(1));
    if (!target || target.endsWith('/')) target += 'index.html';
    assert.ok(publicAssets.has(target), `${path}: missing asset ${value} (${target})`);
    if (url.hash) assert.ok(pages.get(target)?.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: missing anchor ${value}`);
    checkedLinks++;
  }
  for (const id of [...html.matchAll(/aria-labelledby="([^"]+)"/g)].flatMap(match => match[1].split(' '))) assert.ok(ids.includes(id), `${path}: missing aria label ${id}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)) JSON.parse(match[1]);
}

// Exercise the only enhanced interaction, including missing and denied clipboard access.
const main = await readFile(new URL('js/main.js', root), 'utf8');
for (const lang of ['pt-BR', 'en', 'es']) {
  for (const mode of ['success', 'denied', 'unavailable', 'no-footer']) {
    let callback; let copied;
    const status = { textContent: '' };
    const button = { hidden: true, addEventListener: (_, fn) => { callback = fn; } };
    const elements = { '#year': {}, '.copy-email': button, '.copy-status': status, '.email-link': { textContent: 'dvponce3@gmail.com' } };
    const context = {
      document: { documentElement: { lang }, querySelector: key => mode === 'no-footer' ? null : elements[key] },
      navigator: mode === 'unavailable' ? {} : { clipboard: { writeText: async text => { if (mode === 'denied') throw new Error('Denied'); copied = text; } } },
      clearTimeout() {}, setTimeout() { return 1; },
    };
    vm.runInNewContext(main, context);
    if (mode === 'success' || mode === 'denied') {
      assert.equal(button.hidden, false);
      await callback();
      assert.ok(status.textContent.length > 0);
      if (mode === 'success') assert.equal(copied, 'dvponce3@gmail.com');
    } else assert.equal(callback, undefined);
  }
}

// Check deep links and asset responses through the real preview server.
const server = spawn(process.execPath, ['scripts/serve.mjs', '--dist'], {
  cwd: fileURLToPath(new URL('../', import.meta.url)), env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
});
try {
  const address = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview startup timed out')), 10000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Preview exited: ${code}`)); });
    server.stdout.on('data', chunk => {
      const match = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) { clearTimeout(timeout); resolve(match[0]); }
    });
  });
  for (const path of publicAssets.keys()) {
    const response = await fetch(`${address}/${path.replace(/index\.html$/, '')}`);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('content-type').startsWith(publicAssets.get(path).split(';')[0]), path);
    await response.arrayBuffer();
  }
  const redirect = await fetch(`${address}/en?from=test`, { redirect: 'manual' });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('location'), '/en/?from=test');
  assert.equal((await fetch(`${address}/scripts/content.mjs`)).status, 404);
  assert.equal((await fetch(`${address}/index.html`, { method: 'POST' })).status, 405);
  const head = await fetch(`${address}/output/pdf/davi-manieri-resume-en.pdf`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
} finally {
  server.kill();
  if (server.exitCode === null) await once(server, 'exit');
}
console.log(`OK: ${pages.size} pages, ${checkedLinks} internal links, ${publicAssets.size} HTTP assets, metadata, anchors and clipboard in 3 languages.`);
