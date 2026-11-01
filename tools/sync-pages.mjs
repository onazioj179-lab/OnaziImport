import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const css = (await readFile(new URL('styles.css', root), 'utf8')).replace(/\r\n/g, '\n').trim();
const js = (await readFile(new URL('site.js', root), 'utf8')).replace(/\r\n/g, '\n').trim();
assert.doesNotMatch(css, /<\/style/i);
assert.doesNotMatch(js, /<\/script/i);
for (const page of ['index.html', 'privacy.html', 'cookies.html', 'terms.html', '404.html']) {
  const url = new URL(page, root);
  let html = (await readFile(url, 'utf8')).replace(/\r\n/g, '\n');
  html = html.replace(/<link\b[^>]*rel="preload"[^>]*>\n?/g, '')
    .replace(/<link\b[^>]*rel="stylesheet"[^>]*>\n?/g, '')
    .replace(/<script\b[^>]*src="site\.js[^>]*>[\s\S]*?<\/script>\n?/g, '')
    .replace(/<style id="site-styles">[\s\S]*?<\/style>\n?/g, '')
    .replace(/<script id="site-enhancements">[\s\S]*?<\/script>\n?/g, '');
  const pageCss = page === '404.html' ? css.replaceAll("url('assets/", "url('/OnaziImport/assets/") : css;
  html = html.replace('</head>', `<style id="site-styles">\n${pageCss}\n</style>\n</head>`);
  if (page !== '404.html') html = html.replace('</body>', `<script id="site-enhancements">\n${js}\n</script>\n</body>`);
  await writeFile(url, html);
}
console.log('Synced inline CSS and optional enhancements into five static HTML pages.');
