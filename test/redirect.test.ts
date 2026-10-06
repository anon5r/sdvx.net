import { describe, it, expect } from 'vitest';
import { getRedirectUrl, numberToRoman, romanToNumber } from '../src/redirect';
import worker from '../src/index';

describe('numberToRoman & romanToNumber', () => {
  it('converts numbers to roman numerals correctly', () => {
    expect(numberToRoman(1)).toBe('I');
    expect(numberToRoman(2)).toBe('II');
    expect(numberToRoman(3)).toBe('III');
    expect(numberToRoman(4)).toBe('IV');
    expect(numberToRoman(5)).toBe('V');
    expect(numberToRoman(6)).toBe('VI');
    expect(numberToRoman(7)).toBe('VII');
    expect(numberToRoman(0)).toBe('nulla');
  });

  it('converts roman numerals to numbers correctly', () => {
    expect(romanToNumber('I')).toBe(1);
    expect(romanToNumber('II')).toBe(2);
    expect(romanToNumber('III')).toBe(3);
    expect(romanToNumber('IV')).toBe(4);
    expect(romanToNumber('V')).toBe(5);
    expect(romanToNumber('VI')).toBe(6);
    expect(romanToNumber('VII')).toBe(7);
  });
});

describe('getRedirectUrl', () => {
  describe('Static Redirects', () => {
    it('redirects /apps/ps to App Store', () => {
      expect(getRedirectUrl('/apps/ps')).toBe('https://itunes.apple.com/jp/app/sdvxpsiv/id1287152421?mt=8');
    });

    it('redirects /eacsdvx to Konami official eacsdvx page', () => {
      expect(getRedirectUrl('/eacsdvx')).toBe('https://p.eagate.573.jp/game/eacsdvx/vi/index.html');
    });

    it('redirects /cs to Konami official eacsdvx page', () => {
      expect(getRedirectUrl('/cs')).toBe('https://p.eagate.573.jp/game/eacsdvx/vi/index.html');
    });

    it('redirects /vaddict to vaddict site', () => {
      expect(getRedirectUrl('/vaddict')).toBe('https://vaddict.b35.jp');
    });
  });

  describe('Root and /index', () => {
    it('redirects to latest version after Dec 24, 2025', () => {
      const future = Date.parse('2026-01-01');
      expect(getRedirectUrl('/', future)).toBe('https://p.eagate.573.jp/game/sdvx/vii/');
      expect(getRedirectUrl('/index', future)).toBe('https://p.eagate.573.jp/game/sdvx/vii/');
    });

    it('redirects to recent version before Dec 24, 2025', () => {
      const past = Date.parse('2025-01-01');
      expect(getRedirectUrl('/', past)).toBe('https://p.eagate.573.jp/game/sdvx/vi/');
      expect(getRedirectUrl('/index', past)).toBe('https://p.eagate.573.jp/game/sdvx/vi/');
    });
  });

  describe('Version numbers', () => {
    it('redirects /1 to booth', () => {
      expect(getRedirectUrl('/1')).toBe('https://p.eagate.573.jp/game/sdvx/sv/');
    });

    it('redirects /2 to ii', () => {
      expect(getRedirectUrl('/2')).toBe('https://p.eagate.573.jp/game/sdvx/ii/');
    });

    it('redirects /3 to iii', () => {
      expect(getRedirectUrl('/3')).toBe('https://p.eagate.573.jp/game/sdvx/iii/');
    });

    it('redirects /4 to iv', () => {
      expect(getRedirectUrl('/4')).toBe('https://p.eagate.573.jp/game/sdvx/iv/');
    });

    it('redirects /5 to v', () => {
      expect(getRedirectUrl('/5')).toBe('https://p.eagate.573.jp/game/sdvx/v/');
    });

    it('redirects /6 to vi', () => {
      expect(getRedirectUrl('/6')).toBe('https://p.eagate.573.jp/game/sdvx/vi/');
    });

    it('redirects /7 to vii', () => {
      expect(getRedirectUrl('/7')).toBe('https://p.eagate.573.jp/game/sdvx/vii/');
    });

    it('adds /p for versions < 6 with subpaths', () => {
      expect(getRedirectUrl('/1/playdata')).toBe('https://p.eagate.573.jp/game/sdvx/sv/p/playdata');
      expect(getRedirectUrl('/5/playdata/profile')).toBe('https://p.eagate.573.jp/game/sdvx/v/p/playdata/profile');
    });

    it('does not add /p for versions >= 6 with subpaths', () => {
      expect(getRedirectUrl('/6/playdata/customize')).toBe('https://p.eagate.573.jp/game/sdvx/vi/playdata/customize');
      expect(getRedirectUrl('/7/playdata/profile')).toBe('https://p.eagate.573.jp/game/sdvx/vii/playdata/profile');
    });
  });

  describe('Short codes', () => {
    it('redirects /booth and /sv to sv', () => {
      expect(getRedirectUrl('/booth')).toBe('https://p.eagate.573.jp/game/sdvx/sv/');
      expect(getRedirectUrl('/sv')).toBe('https://p.eagate.573.jp/game/sdvx/sv/');
    });

    it('redirects /gw to iii', () => {
      expect(getRedirectUrl('/gw')).toBe('https://p.eagate.573.jp/game/sdvx/iii/');
      expect(getRedirectUrl('/gw/music')).toBe('https://p.eagate.573.jp/game/sdvx/iii/p/music');
    });

    it('redirects /hh to iv', () => {
      expect(getRedirectUrl('/hh')).toBe('https://p.eagate.573.jp/game/sdvx/iv/');
    });

    it('redirects /vw to v', () => {
      expect(getRedirectUrl('/vw')).toBe('https://p.eagate.573.jp/game/sdvx/v/');
    });

    it('redirects /eg to vi', () => {
      expect(getRedirectUrl('/eg')).toBe('https://p.eagate.573.jp/game/sdvx/vi/');
    });

    it('redirects /nabla and /n to vii', () => {
      expect(getRedirectUrl('/nabla')).toBe('https://p.eagate.573.jp/game/sdvx/vii/');
      expect(getRedirectUrl('/n')).toBe('https://p.eagate.573.jp/game/sdvx/vii/');
    });
  });

  describe('Floor redirects', () => {
    it('redirects /floor to FLOOR url', () => {
      expect(getRedirectUrl('/floor')).toBe('https://p.eagate.573.jp/game/sdvx/sv/p/floor/');
      expect(getRedirectUrl('/floor/entry')).toBe('https://p.eagate.573.jp/game/sdvx/sv/p/floor/entry');
    });
  });

  describe('Roman numeral paths', () => {
    it('redirects /i to sv', () => {
      expect(getRedirectUrl('/i')).toBe('https://p.eagate.573.jp/game/sdvx/sv/');
    });

    it('redirects /ii, /iii, /iv, /v, /vi, /vii', () => {
      expect(getRedirectUrl('/ii')).toBe('https://p.eagate.573.jp/game/sdvx/ii/');
      expect(getRedirectUrl('/iii')).toBe('https://p.eagate.573.jp/game/sdvx/iii/');
      expect(getRedirectUrl('/iv')).toBe('https://p.eagate.573.jp/game/sdvx/iv/');
      expect(getRedirectUrl('/v')).toBe('https://p.eagate.573.jp/game/sdvx/v/');
      expect(getRedirectUrl('/vi')).toBe('https://p.eagate.573.jp/game/sdvx/vi/');
      expect(getRedirectUrl('/vii')).toBe('https://p.eagate.573.jp/game/sdvx/vii/');
    });

    it('adds /p for roman numerals < 6 with subpaths', () => {
      expect(getRedirectUrl('/iii/ranking')).toBe('https://p.eagate.573.jp/game/sdvx/iii/p/ranking');
    });

    it('does not add /p for roman numerals >= 6 with subpaths', () => {
      expect(getRedirectUrl('/vi/ranking')).toBe('https://p.eagate.573.jp/game/sdvx/vi/ranking/');
    });
  });

  describe('Fallback paths', () => {
    it('redirects generic paths to LATEST_URL + path', () => {
      expect(getRedirectUrl('/playdata/profile')).toBe('https://p.eagate.573.jp/game/sdvx/vii/playdata/profile');
    });
  });
});

describe('Worker fetch handler', () => {
  it('returns 302 redirect for root', async () => {
    const req = new Request('https://sdvx.net/');
    const res = await worker.fetch(req, {});
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('https://p.eagate.573.jp/game/sdvx/vii/');
  });

  it('delegates to env.ASSETS for static asset requests', async () => {
    let assetFetched = false;
    const mockAssets: Fetcher = {
      fetch: async (req: Request | string) => {
        assetFetched = true;
        return new Response('<html>Bemani Jackets</html>', { status: 200 });
      },
    } as any;

    const req = new Request('https://sdvx.net/bemani_jackets.html');
    const res = await worker.fetch(req, { ASSETS: mockAssets });
    expect(assetFetched).toBe(true);
    expect(res.status).toBe(200);
  });

  it.each(['/bemani_jackets', '/bemani_jackets/', '/bemani_jackets.html', '/assets/bemani_jackets-abc.js', '/robots.txt'])(
    'serves %s from env.ASSETS',
    async (path) => {
      const fetched: string[] = [];
      const mockAssets = {
        fetch: async (req: Request) => {
          fetched.push(new URL(req.url).pathname);
          return new Response('ok', { status: 200 });
        },
      } as unknown as Fetcher;

      const res = await worker.fetch(new Request(`https://sdvx.net${path}`), { ASSETS: mockAssets });
      expect(fetched).toEqual([path]);
      expect(res.status).toBe(200);
    },
  );
});
