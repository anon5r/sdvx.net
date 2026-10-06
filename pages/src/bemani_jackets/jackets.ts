export const BASE_URL = 'https://p.eagate.573.jp/game/bemani/fansite/p';

/** 1 回の表示で並べるジャケット画像の枚数 */
export const JACKET_COUNT = 30;

/** ジャケット画像の最大表示サイズ (px) */
export const MAX_IMAGE_SIZE = 200;

/** この幅 (px) 未満の画面では画像サイズを縮小する */
const NARROW_VIEWPORT_WIDTH = 1024;
const NARROW_VIEWPORT_DIVISOR = 2.6;

export const ARCADE_LIST: Readonly<Record<string, string>> = {
  iidx: 'BEATMANIA IIDX',
  sv: 'SOUND VOLTEX',
  ksv: 'SOUND VOLTEX (コナステ)',
  jb: 'jubeat',
  nst: 'ノスタルジア',
  po: "pop'n music",
  gd: 'GITADORA',
  dan: 'DANCERUSH STARDOM',
  ddr: 'DanceDance Revolution',
  de: 'Dance Evolution',
  bs: 'BEAT STREAM',
  msc: 'MÚSECA',
  rb: 'REFLEC BEAT',
  ban01: 'バンめし♪ ふるさとグランプリ ROUND1 ～春の陣～',
  ban02: 'バンめし♪ ふるさとグランプリ ROUND2 ～夏の陣～',
  ban03: 'バンめし♪ ふるさとグランプリ ROUND3 ～秋の陣～',
  bjm2020: 'いちかのBEMANI超じゃんけん大会2020',
};

export interface DateOption {
  key: string;
  label: string;
}

type Season = 'w' | 'sp' | 'su' | 'a';

// w:[1,2,12], sp:[3,4,5], su:[6,7,8], a:[9,10,11]
const SEASON_BY_MONTH: readonly Season[] = ['w', 'w', 'sp', 'sp', 'sp', 'su', 'su', 'su', 'a', 'a', 'a', 'w'];
const SEASON_LABELS: Readonly<Record<Season, string>> = {
  w: 'Winter',
  sp: 'Spring',
  su: 'Summer',
  a: 'Autumn',
};

/** 季節単位で公開されるのは 2021 年 1 月以降 */
const SEASONAL_FROM_YM = 202101;
/** 月単位で公開されているのは 2014 年 11 月以降 */
const MONTHLY_FROM_YM = 201411;
const MONTHLY_LAST_YEAR = 2020;

/** その季節の最終月を過ぎるまでは一覧に含めない (公開が追いついていないため) */
function isSeasonIncomplete(month: number, season: Season): boolean {
  switch (season) {
    case 'w':
      return month <= 1 || month === 12;
    case 'sp':
      return month <= 4;
    case 'su':
      return month <= 7;
    case 'a':
      return month <= 10;
  }
}

export function zerofill(value: number, length: number): string {
  return String(value).padStart(length, '0');
}

/** 指定日時時点で選択できる年月 (季節) の一覧を新しい順に返す */
export function listDates(now: Date = new Date()): DateOption[] {
  const options: DateOption[] = [];
  const currentYM = now.getFullYear() * 100 + (now.getMonth() + 1);

  let previousKey = '';
  for (let y = now.getFullYear(); y > MONTHLY_LAST_YEAR; y--) {
    for (let m = 12; m >= 1; m--) {
      const ym = y * 100 + m;
      if (ym < SEASONAL_FROM_YM) break;
      if (ym > currentYM) continue;
      const season = SEASON_BY_MONTH[m - 1];
      const key = `${y}${season}`;
      if (key === previousKey) continue;
      if (isSeasonIncomplete(m, season)) continue;
      options.push({ key, label: `${y} ${SEASON_LABELS[season]}` });
      previousKey = key;
    }
  }

  for (let y = MONTHLY_LAST_YEAR; y >= 2014; y--) {
    for (let m = 12; m >= 1; m--) {
      const ym = y * 100 + m;
      if (ym < MONTHLY_FROM_YM) break;
      if (ym > currentYM) continue;
      options.push({ key: String(ym), label: `${y}年${zerofill(m, 2)}月` });
    }
  }

  return options;
}

export function jacketUrl(ym: string, game: string, index: number): string {
  return `${BASE_URL}/images/music/${ym}_jk/${ym}_${game}_${zerofill(index, 2)}.jpg`;
}

export function calcImageSize(viewportWidth: number): number {
  if (viewportWidth >= NARROW_VIEWPORT_WIDTH) return MAX_IMAGE_SIZE;
  return Math.min(Math.floor(viewportWidth / NARROW_VIEWPORT_DIVISOR), MAX_IMAGE_SIZE);
}
