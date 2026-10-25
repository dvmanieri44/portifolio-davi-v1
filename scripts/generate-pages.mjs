import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { content, repositories, siteUrl } from './content.mjs';
import { resume } from './resume-content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const route = (lang, slug = '') => `${lang === 'pt' ? '' : `${lang}/`}${slug ? `projects/${slug}/` : ''}`;
const names = { clareza: 'Clareza', lectio: 'Lectio Divina', erp: 'PremieRpet Operations ERP' };
const languageNames = { pt: 'Português', en: 'English', es: 'Español' };
const external = (href, label, c, className = '') => `<a class="${className}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span><span class="sr-only"> (${c.external})</span></a>`;

function head(lang, prefix, pageRoute, title, description, slug = '') {
  const c = content[lang];
  return `<!DOCTYPE html>
<html lang="${c.lang}"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title><meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#0c1c38"><link rel="canonical" href="${siteUrl}${pageRoute}">
  ${Object.entries(content).map(([key, value]) => `<link rel="alternate" hreflang="${value.lang}" href="${siteUrl}${route(key, slug)}">`).join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${siteUrl}${route('pt', slug)}">
  <meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${siteUrl}${pageRoute}"><meta property="og:locale" content="${{ pt: 'pt_BR', en: 'en_US', es: 'es_ES' }[lang]}">
  <meta property="og:image" content="${siteUrl}img/social-card.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Davi Manieri — Software Engineer">
  <meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${prefix}img/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="${prefix}img/davi-manieri.jpg">
  <link rel="stylesheet" href="${prefix}styles.css"><script src="${prefix}js/main.js" defer></script>
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: 'Davi Ponce Manieri', alternateName: 'Davi Manieri', url: siteUrl, image: `${siteUrl}img/davi-manieri.jpg`, jobTitle: 'Software Engineer', sameAs: ['https://github.com/dvmanieri44', 'https://www.linkedin.com/in/davi-ponce-manieri/'] }).replaceAll('<', '\\u003c')}</script>
</head>`;
}

function header(lang, prefix, slug = '') {
  const c = content[lang];
  const home = `${prefix}${route(lang)}` || './';
  return `<a class="skip-link" href="#conteudo">${c.skip}</a><div class="masthead" id="inicio"><header class="site-header container">
    <a class="brand" href="${home}" aria-label="Davi Manieri — ${c.home}">dm<span aria-hidden="true">.</span></a>
    <nav aria-label="${c.nav.join(', ')}">${['projetos', 'experiencia', 'formacao', 'contato'].map((id, i) => `<a href="${home}#${id}">${c.nav[i]}</a>`).join('')}</nav>
    <nav class="language-links" aria-label="${c.language}">${Object.entries(content).map(([key, value]) => `<a href="${prefix}${route(key, slug) || './'}" lang="${value.lang}" hreflang="${value.lang}" aria-label="${languageNames[key]}"${key === lang ? ' aria-current="page"' : ''}>${key.toUpperCase()}</a>`).join('')}</nav>
  </header></div>`;
}

function footer(lang, prefix) {
  const c = content[lang];
  return `<footer class="contact" id="contato"><div class="container"><p class="eyebrow">${c.nav[3]}</p>
    <div class="contact-top"><h2>${c.contactTitle}</h2><a class="contact-arrow" href="mailto:${resume.email}" aria-label="E-mail: ${resume.email}">↗</a></div>
    <p class="contact-intro">${c.contactIntro}</p><div class="contact-details"><div><div class="email-row"><a class="email-link" href="mailto:${resume.email}">${resume.email}</a><button class="copy-email" type="button" hidden>${c.copy}</button></div><p class="copy-status" role="status" aria-live="polite"></p></div>
    <div class="contact-links">${external(resume.links[2][1], 'LinkedIn', c)}${external(resume.links[1][1], 'GitHub', c)}<a href="${prefix}output/pdf/davi-manieri-resume-en.pdf" download>${c.hero[5]} ↓</a><a href="${prefix}en/resume/" lang="en">Résumé · HTML (EN)</a></div></div>
    <div class="footer-bottom"><span class="brand" aria-hidden="true">dm.</span><p>© <span id="year">2026</span> Davi Manieri</p><a class="back-top" href="#inicio">${c.top} ↑</a></div>
  </div></footer></body></html>`;
}

function art(id, c, number) {
  const p = c.projects.find(item => item.id === id);
  const visual = id === 'clareza'
    ? '<svg class="finance-art" viewBox="0 0 300 240" fill="none"><circle cx="98" cy="100" r="62" stroke="#5677ae" stroke-width="22"/><path d="M98 38a62 62 0 0 1 62 62" stroke="#dce8ff" stroke-width="22"/><path d="M160 100a62 62 0 0 1-62 62" stroke="#a8c1e8" stroke-width="22"/><path d="M32 211h236" stroke="#a8c1e8"/><rect x="183" y="137" width="28" height="60" rx="5" fill="#5677ae"/><rect x="225" y="96" width="28" height="101" rx="5" fill="#a8c1e8"/><path d="m183 104 28-29 17 9 32-45m-22 0h22v22" stroke="#dce8ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '<div class="book-art"><div class="book-back"></div><div class="book-cover"><span class="book-spark">✳</span><span>lectio<br><i>divina.</i></span><span class="book-rule"></span></div></div>';
  return `<div class="project-visual visual-${id}" aria-hidden="true"><span class="visual-index">0${number} / ${p.category}</span>${visual}<span class="visual-caption">${p.caption}</span></div>`;
}

function homePage(lang) {
  const c = content[lang];
  const prefix = lang === 'pt' ? '' : '../';
  return `${head(lang, prefix, route(lang), c.title, c.description)}<body>${header(lang, prefix)}
  <main id="conteudo" tabindex="-1"><section class="hero" aria-labelledby="nome"><div class="hero-main container">
    <div class="hero-copy"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>Software Engineer</p><h1 id="nome">Davi Manieri<span class="name-dot">.</span></h1>
    <p class="hero-statement">${c.hero[0]}<br><span class="serif-word">${c.hero[1]}</span></p><p class="hero-summary">${c.hero[2]}</p>
    <div class="hero-actions"><a class="button-link" href="#projetos">${c.hero[4]} <span aria-hidden="true">↗</span></a><a class="resume-link" href="${prefix}output/pdf/davi-manieri-resume-en.pdf" download>${c.hero[5]} <span aria-hidden="true">↓</span><small>${c.hero[6]}</small></a></div></div>
    <div class="portrait-composition"><img class="portrait" src="${prefix}img/davi-portrait-960.webp" srcset="${prefix}img/davi-portrait-480.webp 480w, ${prefix}img/davi-portrait-960.webp 960w" sizes="(max-width: 800px) 80vw, 45vw" alt="${c.hero[7]}" width="960" height="960" fetchpriority="high"></div>
    </div><div class="hero-bottom container"><span>${c.hero[3]}</span>${external(resume.links[2][1], 'LinkedIn', c)}</div></section>
  <section class="section container" id="projetos" aria-labelledby="projetos-titulo"><div class="section-heading"><div><p class="eyebrow">01 / ${c.nav[0]}</p><h2 id="projetos-titulo">${c.projectsTitle}</h2></div><p class="section-aside">${c.projectsIntro}</p></div>
    <div class="project-list">${c.projects.map((p, i) => `<article class="project">${art(p.id, c, i + 1)}<div class="project-body"><p class="project-kind">${c.personal}</p><h3>${p.name}</h3><p class="project-description">${p.description}</p><p class="project-evidence">${p.evidence}</p><ul class="tags">${p.tags.map(tag => `<li>${tag}</li>`).join('')}</ul><div class="project-links"><a href="${prefix}${route(lang, p.id)}">${c.details}<span class="sr-only"> — ${p.name}</span> →</a>${external(repositories[p.id], c.code, c)}${p.id === 'clareza' ? external('https://dvmanieri44.github.io/clareza_controle_financeiro/', c.app, c) : ''}</div></div></article>`).join('')}</div>
  </section>
  <section class="experience section container" id="experiencia" aria-labelledby="experiencia-titulo"><div class="experience-layout"><div class="section-heading"><div><p class="eyebrow">02 / ${c.nav[1]}</p><h2 id="experiencia-titulo">${c.experienceTitle}</h2></div></div><div class="experience-list">
    <article class="experience-item"><div class="experience-meta"><p class="experience-company">Tecnomotor Eletrônica</p><p class="experience-period">${c.current}</p></div><h3>${c.role}</h3><p class="experience-description">${c.experienceIntro}</p><ul class="experience-highlights">${c.contributions.map(item => `<li>${item}</li>`).join('')}</ul></article>
    <article class="experience-item"><div class="experience-meta"><p class="experience-company">Tecnomotor Distribuidora</p><p class="experience-period">2024 — 2025</p></div><h3>${c.automationRole}</h3><p class="experience-description">${c.automation}</p></article>
    <article class="ai-block"><h3>${c.aiTitle}</h3><p class="eyebrow">${c.production}</p><p>${c.ai}</p><details><summary>${c.studies}</summary><p>${c.research}</p><p>${c.process}</p></details></article>
  </div></div><dl class="skills-strip">${c.skills.map(([name, value]) => `<div><dt>${name}</dt><dd>${value}</dd></div>`).join('')}</dl></section>
  <section class="more-projects container" aria-labelledby="outros-titulo"><h2 id="outros-titulo">${c.others}</h2><div class="compact-projects"><article><p class="project-kind">${c.erpType}</p><h3>PremieRpet Operations ERP</h3><p>${c.erp}</p><a href="${prefix}${route(lang, 'erp')}">${c.details} →</a></article><article><p class="project-kind">${c.launcherType}</p><h3>Dopamine Free Launcher</h3><p>${c.launcher}</p>${external(repositories.launcher, c.code, c)}</article></div></section>
  <section class="education section" id="formacao" aria-labelledby="formacao-titulo"><div class="container education-layout"><div class="section-heading"><div><p class="eyebrow">03 / ${c.nav[2]}</p><h2 id="formacao-titulo">${c.educationTitle}</h2></div></div><div class="education-list">${c.education.map(([degree, school, status]) => `<article class="education-item"><div><h3>${degree}</h3><p class="institution">${school}</p><p class="education-status">${status}</p></div></article>`).join('')}</div></div></section>
  </main>${footer(lang, prefix)}`;
}

function casePage(lang, slug) {
  const c = content[lang]; const study = c.cases[slug]; const prefix = lang === 'pt' ? '../../' : '../../../';
  return `${head(lang, prefix, route(lang, slug), `${names[slug]} — Davi Manieri`, study.lead, slug)}<body class="case-page">${header(lang, prefix, slug)}<main id="conteudo" class="case-main container" tabindex="-1">
    <a class="text-link" href="${prefix}${route(lang)}#projetos">← ${c.back}</a><p class="eyebrow">${slug === 'erp' ? c.erpType : c.personal}</p><h1>${names[slug]}</h1><p class="case-lead">${study.lead}</p>
    <div class="case-content"><section><h2>${c.context}</h2><p>${study.context}</p></section><section><h2>${c.contribution}</h2><p>${study.contribution}</p></section><section><h2>${c.decisions}</h2><ol class="decision-list">${study.decisions.map(([title, text]) => `<li><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol></section><section><h2>${c.validation}</h2><p>${study.validation}</p><p>${study.limits}</p></section><section><h2>${c.sources}</h2><ul class="source-links">${study.links.map(([label, path]) => `<li>${external(`${repositories[slug]}/${path.includes('.') ? 'blob' : 'tree'}/main/${path}`, label, c)}</li>`).join('')}</ul></section></div>
  </main>${footer(lang, prefix)}`;
}

function resumePage() {
  const c = content.en; const prefix = '../../';
  return `${head('en', prefix, 'en/resume/', `${resume.name} — Résumé`, resume.summary).replace(/\s*<link rel="alternate"[^>]+>/g, '')}<body class="case-page resume-page"><main id="conteudo" class="case-main container"><a class="text-link" href="../">← Portfolio</a> <a class="text-link" href="../../output/pdf/davi-manieri-resume-en.pdf" download>Download PDF ↓</a><h1>${resume.name}</h1><p class="case-lead">${resume.title}</p><p>${resume.location}</p><p><a href="mailto:${resume.email}">${resume.email}</a> · ${resume.links.map(([label, href]) => external(href, label, c)).join(' · ')}</p><div class="case-content"><section><h2>Profile</h2><p>${resume.summary}</p></section><section><h2>Experience</h2>${resume.experience.map(job => `<article><h3>${job.company} · ${job.dates}</h3><p>${job.role}</p><ul>${job.bullets.map(b => `<li>${b}</li>`).join('')}</ul></article>`).join('')}</section><section><h2>Backend & applied AI</h2><p>${resume.ai}</p></section><section><h2>Selected projects</h2>${resume.projects.map(([name, description, url]) => `<article><h3>${external(url, name, c)}</h3><p>${description}</p></article>`).join('')}</section><section><h2>Skills</h2><p>${resume.skills}</p></section><section><h2>Education & languages</h2>${resume.education.map(item => `<p>${item}</p>`).join('')}</section></div></main></body></html>`;
}

export async function generatePages() {
  const pages = new Map();
  for (const lang of Object.keys(content)) {
    pages.set(`${route(lang)}index.html`, homePage(lang));
    for (const slug of Object.keys(names)) pages.set(`${route(lang, slug)}index.html`, casePage(lang, slug));
  }
  pages.set('en/resume/index.html', resumePage());
  for (const [path, html] of pages) {
    await mkdir(dirname(resolve(root, path)), { recursive: true });
    await writeFile(resolve(root, path), html + '\n', 'utf8');
  }
  const urls = [...pages.keys()].map(path => siteUrl + path.replace(/index\.html$/, ''));
  await writeFile(resolve(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}</urlset>\n`);
  await mkdir(resolve(root, 'tmp'), { recursive: true });
  await writeFile(resolve(root, 'tmp/resume-content.json'), JSON.stringify(resume));
  console.log(`Geradas ${pages.size} páginas estáticas em PT/EN/ES e sitemap.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generatePages();
