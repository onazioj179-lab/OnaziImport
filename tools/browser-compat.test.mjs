import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const script = await readFile(new URL('../site.js', import.meta.url), 'utf8');
function initialise(matchMedia) {
  const documentElement = { dataset: {}, scrollHeight: 1000, style: { setProperty() {} } };
  const document = {
    documentElement,
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  const window = { innerHeight: 800, scrollY: 0, addEventListener() {}, matchMedia };
  vm.runInNewContext(script, { document, window, console });
  return documentElement;
}

test('initialises without media-query support', () => {
  assert.equal(initialise(undefined).dataset.motion, 'playing');
});

test('supports older Safari media-query listeners', () => {
  let changed;
  const root = initialise(() => ({ matches: false, addListener(listener) { changed = listener; } }));
  assert.equal(root.dataset.motion, 'playing');
  changed({ matches: true });
  assert.equal(root.dataset.motion, 'paused');
});

test('honours reduced motion with current browser listeners', () => {
  let changed;
  const root = initialise(() => ({ matches: true, addEventListener(event, listener) { assert.equal(event, 'change'); changed = listener; } }));
  assert.equal(root.dataset.motion, 'paused');
  changed({ matches: false });
  assert.equal(root.dataset.motion, 'playing');
});
