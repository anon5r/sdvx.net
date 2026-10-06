import { describe, it, expect } from 'vitest';
import { calcImageSize, jacketUrl, listDates, zerofill } from '../pages/src/bemani_jackets/jackets';

describe('zerofill', () => {
  it('pads numbers with zero', () => {
    expect(zerofill(3, 2)).toBe('03');
    expect(zerofill(12, 2)).toBe('12');
  });
});

describe('jacketUrl', () => {
  it('builds jacket image URL', () => {
    expect(jacketUrl('2021sp', 'sv', 4)).toBe(
      'https://p.eagate.573.jp/game/bemani/fansite/p/images/music/2021sp_jk/2021sp_sv_04.jpg',
    );
  });
});

describe('calcImageSize', () => {
  it('uses max size on wide viewports', () => {
    expect(calcImageSize(1280)).toBe(200);
  });

  it('shrinks on narrow viewports', () => {
    expect(calcImageSize(375)).toBe(144);
    expect(calcImageSize(1000)).toBe(200);
  });
});

describe('listDates', () => {
  it('lists seasons first, then months down to 2014/11', () => {
    const dates = listDates(new Date('2022-06-15T00:00:00'));
    const keys = dates.map((d) => d.key);
    expect(keys.slice(0, 7)).toEqual(['2022sp', '2022w', '2021a', '2021su', '2021sp', '2021w', '202012']);
    expect(keys[keys.length - 1]).toBe('201411');
    expect(dates[0]).toEqual({ key: '2022sp', label: '2022 Spring' });
    expect(dates.find((d) => d.key === '202012')?.label).toBe('2020年12月');
  });

  it('does not list future periods', () => {
    const keys = listDates(new Date('2021-03-01T00:00:00')).map((d) => d.key);
    expect(keys[0]).toBe('2021w');
    expect(keys).not.toContain('2021sp');
  });

  it('has no duplicate keys', () => {
    const keys = listDates(new Date('2026-10-06T00:00:00')).map((d) => d.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
