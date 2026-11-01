import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
const pages = ['index.html', 'privacy.html', 'cookies.html', 'terms.html', '404.html'];
const files = new Map(await Promise.all(pages.map(async page => [page, await readFile(path.join(root, page), 'utf8')])));
for (const [page, html] of files) {
  // Copyright and trademark punctuation are ordinary text, not UI emoji.
  assert.doesNotMatch(html.replace(/[©®™]/g, ''), /\p{Extended_Pictographic}|[\u2190-\u21ff\ufe0f\u200d]/u, `${page}: emoji or decorative text arrow`);
  assert.doesNotMatch(html, /(?:https?:\/\/)(?:localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.)/i, `${page}: local-network URL in public page`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${page}: duplicate IDs`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page}: expected one primary heading`);
  assert.match(html, /<main\b[^>]*id="main"/, `${page}: missing main landmark`);
  assert.doesNotMatch(html, /<script[^>]+src="https?:|<link[^>]+href="https:\/\/fonts\./, `${page}: unexpected third-party resource`);
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|tel:|data:)/.test(link)) continue;
    const [resource, fragment] = link.split('#');
    const target = resource.split('?')[0];
    const targetFile = target ? target.replace(/^\/OnaziImport\//, '') || 'index.html' : page;
    await access(path.join(root, targetFile));
    if (fragment) {
      const targetHtml = files.get(targetFile) || await readFile(path.join(root, targetFile), 'utf8');
      assert.ok(targetHtml.includes(`id="${fragment}"`), `${page}: broken fragment ${link}`);
    }
  }
}
const css = await readFile(path.join(root, 'styles.css'), 'utf8');
const browserScript = await readFile(path.join(root, 'site.js'), 'utf8');
assert.doesNotMatch(browserScript + css, /(?:https?:\/\/)(?:localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.)/i, 'Local-network URL in public assets');
for (const [, asset] of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
  await access(path.join(root, asset));
}
for (const font of ['archivo-latin', 'inter-latin']) {
  const bytes = await readFile(path.join(root, `assets/fonts/${font}.woff2`));
  assert.equal(bytes.toString('ascii', 0, 4), 'wOF2', `Invalid font: ${font}`);
}
console.log(`Checked ${pages.length} pages: local links, fragments, unique IDs, landmarks, local fonts and assets.`);
