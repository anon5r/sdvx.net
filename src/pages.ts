/**
 * React ページ (pages/ 配下の Vite ビルド成果物) として配信するコンテンツの一覧。
 *
 * 新しいページを追加するときは、
 *   1. pages/<name>.html (エントリ HTML) と pages/src/<name>/ (React コード) を作成
 *   2. この配列に <name> を追加
 * の 2 点だけで、ビルド対象と Worker のルーティングの両方に反映される。
 * (pages/ 側のエントリは vite.config.ts が pages/*.html から自動検出する。
 *  この配列との整合性は test/pages.test.ts で検証している)
 *
 * 各ページは `/<name>`、`/<name>/`、`/<name>.html` で配信される。
 */
export const PAGE_NAMES = ['bemani_jackets'] as const;

export type PageName = (typeof PAGE_NAMES)[number];

/** Worker から静的アセットとして配信するパス (リダイレクタより優先される) */
export const STATIC_PATHS: ReadonlySet<string> = new Set([
  ...PAGE_NAMES.flatMap((name) => [`/${name}`, `/${name}/`, `/${name}.html`]),
  '/robots.txt',
]);

/** ビルド成果物 (ハッシュ付き JS/CSS、アイコン等) の配置先プレフィックス */
export const STATIC_PREFIXES: readonly string[] = ['/assets/'];

export function isStaticAssetPath(pathname: string): boolean {
  return STATIC_PATHS.has(pathname) || STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
