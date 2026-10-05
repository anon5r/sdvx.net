export const BASEURL = 'https://p.eagate.573.jp/game/sdvx';
export const FLOOR_URL = BASEURL + '/sv/p/floor/';
export const LATEST_URL = BASEURL + '/vii';
export const RECENT_URL = BASEURL + '/vi';

export const lastMajorRelease = 'Dec. 24, 2025';

export const STATIC_REDIRECTS: Record<string, string> = {
  '/apps/ps': 'https://itunes.apple.com/jp/app/sdvxpsiv/id1287152421?mt=8',
  '/eacsdvx': 'https://p.eagate.573.jp/game/eacsdvx/vi/index.html',
  '/cs': 'https://p.eagate.573.jp/game/eacsdvx/vi/index.html',
  '/vaddict': 'https://vaddict.b35.jp',
};

export interface ShortCodeInfo {
  version: number;
  path: string;
}

export const SHORT_CODES: Record<string, ShortCodeInfo> = {
  'sv': {
    version: 1,
    path: 'sv',
  },
  'booth': {
    version: 1,
    path: 'sv',
  },
  'gw': {
    version: 3,
    path: 'iii',
  },
  'hh': {
    version: 4,
    path: 'iv',
  },
  'vw': {
    version: 5,
    path: 'v',
  },
  'eg': {
    version: 6,
    path: 'vi',
  },
  'nabla': {
    version: 7,
    path: 'vii',
  },
  'n': {
    version: 7,
    path: 'vii',
  },
};

const romanMap: Record<string, number> = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1,
};

export function numberToRoman(num: number | string): string {
  let n = typeof num === 'string' ? parseInt(num, 10) : num;
  if (n === 0 || isNaN(n)) return 'nulla';
  let result = '';

  for (const roman of Object.keys(romanMap)) {
    const value = romanMap[roman];
    const matches = Math.floor(n / value);
    result += roman.repeat(matches);
    n = n % value;
  }

  return result;
}

export function romanToNumber(roman: string): number {
  let result = 0;
  let last = 0;
  for (let i = roman.length - 1; i >= 0; i--) {
    const num = romanMap[roman[i]] || 0;
    result += num * (num < last ? -1 : 1);
    last = num;
  }
  return result;
}

export function getRedirectUrl(pathname: string, now: number = Date.now()): string {
  const normalizedPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (STATIC_REDIRECTS[normalizedPath]) {
    return STATIC_REDIRECTS[normalizedPath];
  }

  let redirectURL: string;
  let version: number | undefined;

  let pathWithoutSlash = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  if (pathWithoutSlash.includes('/')) {
    pathWithoutSlash = pathWithoutSlash.slice(0, pathWithoutSlash.indexOf('/'));
  }

  if (pathname === '' || pathname === '/' || pathname === '/index') {
    if (now >= Date.parse(lastMajorRelease)) {
      redirectURL = LATEST_URL;
    } else {
      redirectURL = RECENT_URL;
    }
  } else if (/^\d+/.test(pathWithoutSlash)) {
    version = parseInt(pathWithoutSlash, 10);
    let romanNum = numberToRoman(version).toLowerCase();
    if (romanNum === 'i') {
      romanNum = 'sv';
    }
    let addPath = '';
    if (pathname.length > pathWithoutSlash.length + 1) {
      addPath = '/' + pathname.slice(pathWithoutSlash.length + 2);
    }
    redirectURL = BASEURL + '/' + romanNum;
    if (addPath.length > 0 && addPath !== '/') {
      if (version < 6) redirectURL += '/p';
      redirectURL += addPath;
    }
  } else if (SHORT_CODES[pathWithoutSlash.toLowerCase()]) {
    const map = SHORT_CODES[pathWithoutSlash.toLowerCase()];
    let addPath = '';
    if (pathname.length > pathWithoutSlash.length + 1) {
      addPath = '/' + pathname.slice(pathWithoutSlash.length + 2);
    }
    redirectURL = BASEURL + '/' + map.path;
    if (addPath.length > 0 && addPath !== '/') {
      if (map.version < 6) redirectURL += '/p';
      redirectURL += addPath;
    }
  } else if (/^floor/i.test(pathWithoutSlash)) {
    const addPath = pathname.length > 6 ? pathname.slice(6).replace(/^\//, '') : '';
    redirectURL = FLOOR_URL + addPath;
  } else if (/^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i.test(pathWithoutSlash)) {
    const r = pathWithoutSlash.match(/^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/i);
    let path = r![0].toLowerCase();
    version = romanToNumber(path.toUpperCase());
    if (path === 'i') {
      path = 'sv';
    }
    let addPath = '';
    if (pathname.length > r![0].length + 1) {
      addPath = '/' + pathname.slice(r![0].length + 2);
    }
    redirectURL = BASEURL + '/' + path;
    if (addPath.length > 0 && addPath !== '/') {
      if (version < 6) redirectURL += '/p';
      redirectURL += addPath;
    }
  } else {
    redirectURL = LATEST_URL + pathname;
  }

  if (!/\w+\/p/.test(redirectURL) && !redirectURL.endsWith('/')) {
    redirectURL += '/';
  }

  return redirectURL;
}
