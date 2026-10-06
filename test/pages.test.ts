import { readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { PAGE_NAMES, STATIC_PATHS, isStaticAssetPath } from '../src/pages';

const pagesDir = resolve(import.meta.dirname, '../pages');

describe('PAGE_NAMES registry', () => {
  it('matches pages/*.html entries (excluding index.html)', () => {
    const entries = readdirSync(pagesDir)
      .filter((file) => file.endsWith('.html') && file !== 'index.html')
      .map((file) => file.replace(/\.html$/, ''))
      .sort();
    expect([...PAGE_NAMES].sort()).toEqual(entries);
  });

  it.each(PAGE_NAMES)('%s has a source directory under pages/src', (name) => {
    expect(existsSync(resolve(pagesDir, 'src', name))).toBe(true);
  });
});

describe('isStaticAssetPath', () => {
  it.each(PAGE_NAMES)('serves %s with and without extension/trailing slash', (name) => {
    expect(STATIC_PATHS.has(`/${name}`)).toBe(true);
    expect(STATIC_PATHS.has(`/${name}/`)).toBe(true);
    expect(STATIC_PATHS.has(`/${name}.html`)).toBe(true);
  });

  it('serves build assets and robots.txt', () => {
    expect(isStaticAssetPath('/assets/foo-abc.js')).toBe(true);
    expect(isStaticAssetPath('/robots.txt')).toBe(true);
  });

  it('does not capture redirector paths', () => {
    expect(isStaticAssetPath('/')).toBe(false);
    expect(isStaticAssetPath('/6/playdata')).toBe(false);
    expect(isStaticAssetPath('/unknown_page')).toBe(false);
  });
});
