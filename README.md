[sdvx.net](https://sdvx.net)

Redirector to SOUND VOLTEX official page

# Features

- Redirect to official page
  - `/` redirects to Latest of official page
  - `/1` or `/booth` redirects to [SOUND VOLTEX Booth](https://p.eagate.573.jp/game/sdvx/sv/p)
  - `/2` redirects to [SOUND VOLTEX ii -Infinite Infection-](https://p.eagate.573.jp/game/sdvx/ii/p)
  - `/3` redirects to [SOUND VOLTEX III -GRAVITY WARS-](https://p.eagate.573.jp/game/sdvx/iii/p)
  - `/4` redirects to [SOUND VOLTEX IV -Heavenly Haven-](https://p.eagate.573.jp/game/sdvx/iv/p)
  - `/5` redirects to [SOUND VOLTEX V -Vivid Wave-](https://p.eagate.573.jp/game/sdvx/v/p)
  - `/6` redirects to [SOUND VOLTEX Exceed Gear](https://p.eagate.573.jp/game/sdvx/vi/)
  - `/7` redirects to [SOUND VOLTEX Nabla](https://p.eagate.573.jp/game/sdvx/vii/)
  - `/floor` redirects to [SOUND VOLTEX FLOOR](https://p.eagate.573.jp/game/sdvx/sv/p/floor/)

`/<roman-numerals>` like `/ii`, `/iii`, `/iv`, `/v`, `/vi`, or `/vii` will also redirect to each version


## Quickly access under content

Also you can redirects to under contents each versions.
For example, if you want see your play data page of EXCEED GEAR (version 6),
when you access to `/playdata/profile`, you will redirect to you will redirect to [Player profile for NABLA](https://p.eagate.573.jp/game/sdvx/vii/playdata/profile/index.html) page.
Also, you can see customize skin, bgm for your data, request to `/6/playdata/customize`, you will redirect to [Player customize page for NABLA](https://p.eagate.573.jp/game/sdvx/vii/playdata/customize/index.html). (require login)

## Others

Redirect to related sites/pages

### Original content

- `/bemani_jackets` (`/bemani_jackets.html`) BEMANI song jacket viewer (React + Vite, `pages/`)

# Requirements

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Node.js](https://nodejs.org/) (>= 24)
- [pnpm](https://pnpm.io/) (>= 10.11.0)


# Development

| Command | Description |
| --- | --- |
| `pnpm dev:pages` | Start Vite dev server for `pages/` |
| `pnpm dev` | Build `pages/` and start `wrangler dev` (Worker + static assets) |
| `pnpm test` | Run unit tests (vitest) |
| `pnpm typecheck` | Type check Worker and pages |
| `pnpm deploy` | Build `pages/` into `pages/dist` and deploy to Cloudflare Workers |

`pages/` is a React + TypeScript (Vite) app. Its build output (`pages/dist`) is served as Workers static assets (see `wrangler.jsonc`).
`/` is handled by the Worker as a redirector, so `pages/` has no index page.

## Adding a new page

To add a React page at `/<name>` (e.g. `/foo`):

1. Create `pages/<name>.html` (copy `pages/bemani_jackets.html` and point the `<script>` at `/src/<name>/main.tsx`).
2. Create `pages/src/<name>/main.tsx` (and the components/styles it uses).
3. Add `'<name>'` to `PAGE_NAMES` in `src/pages.ts`.

Vite picks up every `pages/*.html` as an entry automatically, and the Worker serves `/<name>`, `/<name>/` and `/<name>.html` from the static assets before the redirector runs.
`test/pages.test.ts` fails if `PAGE_NAMES` and `pages/*.html` get out of sync.

# Rightments

The names of [SOUND VOLTEX](https://p.eagate.573.jp/game/sdvx/vi/) is a registered trademark of Konami Amusement Co., Ltd..
