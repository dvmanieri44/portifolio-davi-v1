import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { publicAssets } from './assets.mjs';

const built = process.argv.includes('--dist');
const root = new URL(built ? '../dist/client/' : '../', import.meta.url);
const port = Number(process.env.PORT || 4173);

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  let path;
  try {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    path = pathname === '/' ? 'index.html' : pathname.slice(1);
  } catch {
    response.writeHead(400).end('Requisição inválida');
    return;
  }
  const contentType = publicAssets.get(path);
  if (!contentType) {
    response.writeHead(404).end('Não encontrado');
    return;
  }

  try {
    const body = await readFile(new URL(path, root));
    response.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': body.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 500);
    response.end(built ? 'Execute npm run build antes de usar a prévia.' : 'Arquivo indisponível.');
  }
});

server.on('error', (error) => {
  console.error(`Não foi possível iniciar a prévia: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Portfólio: http://127.0.0.1:${port} (${built ? 'build' : 'desenvolvimento'})`);
});
