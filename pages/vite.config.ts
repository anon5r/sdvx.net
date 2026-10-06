import { readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = import.meta.dirname;

// pages/<name>.html を 1 ページ (エントリ) として自動検出する。
// ルート (index) は Worker 側のリダイレクタが処理するため、index.html はエントリに含めない。
// 新しいページを追加するときは src/pages.ts の PAGE_NAMES にも <name> を追加すること。
const input = Object.fromEntries(
  readdirSync(root)
    .filter((file) => file.endsWith('.html') && file !== 'index.html')
    .map((file) => [basename(file, '.html'), resolve(root, file)]),
);

// Cloudflare Workers の assets (wrangler.jsonc の assets.directory) として配信される静的ファイルを出力する。
export default defineConfig({
  root,
  plugins: [react()],
  build: {
    outDir: resolve(root, 'dist'),
    emptyOutDir: true,
    rollupOptions: { input },
  },
});
