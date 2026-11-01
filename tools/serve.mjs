import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.xml': 'application/xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(requestUrl.pathname);
    // Support both a local root and the production GitHub Pages project path.
    const relative = pathname.replace(/^\/OnaziImport(?=\/|$)/, '').replace(/^\/+/, '') || 'index.html';
    const file = path.resolve(root, relative);
    const inside = path.relative(root, file);
    if (inside.startsWith('..') || path.isAbsolute(inside) || relative.split(/[\\/]/).some(part => part.startsWith('.')) || !/^(index\.html|privacy\.html|cookies\.html|terms\.html|404\.html|styles\.css|site\.js|sitemap\.xml|og-image\.png|assets\/fonts\/[\w.-]+)$/.test(relative)) {
      response.writeHead(404).end('Not found');
      return;
    }
    let data = await readFile(file);
    // Local QA only: exercise the actual HTML with optional JavaScript absent.
    if (path.extname(file) === '.html' && requestUrl.searchParams.has('nojs')) {
      data = data.toString('utf8').replace(/<script id="site-enhancements">[\s\S]*?<\/script>/g, '');
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(data);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}/OnaziImport/`));
