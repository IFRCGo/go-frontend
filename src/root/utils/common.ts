import { memo } from 'react';
import {
  isDefined,
  isFalsy,
  isFalsyString,
  caseInsensitiveSubmatch,
  compareStringSearch,
} from '@togglecorp/fujs';

import { Strings } from '#types';

export const getHashFromBrowser = () => window.location.hash.substr(1);
export const setHashToBrowser = (hash: string | undefined) => {
    if (hash) {
        window.location.replace(`#${hash}`);
    } else {
        window.location.hash = '';
    }
};

export function sumSafe(list: (number | undefined | null)[]): number {
  if (!list || list.length === 0) {
    return 0;
  }

  const safeList = list.filter(num => isDefined(num)) as number[];
  return safeList.reduce((acc, item) => (
    acc + (+item)
  ), 0);
}

export function sum<L, V extends string | number>(list: L[], valueSelector: (item: L) => V) {
  if (!list || !Array.isArray(list)) {
    return 0;
  }

  const values = list
    .map(valueSelector)
    .filter(isDefined);

  return values.reduce((acc, item) => (
    acc + (+item)
  ), 0);
}

export function max<L, V extends string | number>(list: L[], valueSelector: (item: L) => V) {
  if (!list || !Array.isArray(list)) {
    return undefined;
  }

  const values = list
    .map(valueSelector)
    .filter(isDefined);

  // FIXME: the zero value may be problematic when there are negative numbers
  return values.reduce((acc, item) => (
    Math.max(acc, +item)
  ), 0);
}

export function avg<L, V extends string | number>(list: L[], valueSelector: (item: L) => V) {
  if (!list || !Array.isArray(list)) {
    return undefined;
  }

  if (list.length === 0) {
    return 0;
  }

  const total = sum(list, valueSelector);

  if (!isDefined(total)) {
    return 0;
  }

  return total / list.length;
}

export function aggregateList<T, R>(
  item: T[],
  keySelector: (item: T) => string | number,
  aggregator: (val: R | undefined, value: T) => R,
): R[] {
  const mapping = item.reduce(
    (acc, value) => {
      const key = keySelector(value);
      return {
        ...acc,
        [key]: aggregator(acc[key], value),
      };
    },
    {} as { [key: string]: R },
  );
  return Object.values(mapping);
}

export function transformObjectItems<K extends string, T, R>(
  obj: Record<K, T>,
  itemSelector: (item: T) => R,
) {
  const keys = Object.keys(obj) as K[];

  return keys.reduce((acc, val) => ({
    ...acc,
    [val]: itemSelector(obj[val]),
  }), {} as Record<K, R>);
}

export function denormalizeList<ListItem, SecondaryListItem, ReturnType>(
  list: ListItem[],
  secondaryListSelector: (li: ListItem) => SecondaryListItem[],
  transformFn: (li: ListItem, sli: SecondaryListItem) => ReturnType,
): ReturnType[] {
  const newList = list.map((li) => {
    const sl = secondaryListSelector(li);

    return sl.map(sli => transformFn(li, sli));
  }).flat();

  return newList;
}

export function compareLabel<O extends { label: string }>(a: O, b: O) {
  return a.label.localeCompare(b.label);
}

export function isObject(foo: unknown): foo is object {
  return typeof foo === 'object' && foo !== null && !Array.isArray(foo);
}

export function ymdToDateString(year: number, month: number, day: number) {
    const ys = String(year).padStart(4, '0');
    const ms = String(month + 1).padStart(2, '0');
    const ds = String(day).padStart(2, '0');

    return `${ys}-${ms}-${ds}`;
}

export const genericMemo: (<T>(c: T) => T) = memo;

export function rankedSearchOnList<T>(
  list: T[],
  searchString: string | undefined,
  labelSelector: (item: T) => string,
) {
  if (isFalsyString(searchString)) {
    return list;
  }

  return list
  .filter((option) => caseInsensitiveSubmatch(labelSelector(option), searchString))
  .sort((a, b) => compareStringSearch(
    labelSelector(a),
    labelSelector(b),
    searchString,
  ));
}

export function getFullMonthNameList(strings: Strings) {
  return [
    strings.monthNameJanuary,
    strings.monthNameFebruary,
    strings.monthNameMarch,
    strings.monthNameApril,
    strings.monthNameMay,
    strings.monthNameJune,
    strings.monthNameJuly,
    strings.monthNameAugust,
    strings.monthNameSeptember,
    strings.monthNameOctober,
    strings.monthNameNovember,
    strings.monthNameDecember,
  ] as const;
}

export function avgSafe(list: (number|undefined|null)[]) {
  const listSafe = (list ?? []).filter((i) => isDefined(i) && !Number.isNaN(i)) as number[];
  return avg(listSafe, d => d);
}

export function isValidNumber(value: unknown): value is number  {
  if (isFalsy(value)) {
    return false;
  }

  if (Number.isNaN(+(value as number))) {
    return false;
  }

  if (value === null) {
    return false;
  }

  return true;
}

export function downloadFromUrl(url: string, downloadFileName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = downloadFileName;
  link.target = '_blank';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function isIfrcUser(user: {
  email: string;
  is_ifrc_admin: boolean;
} | undefined) {
  if (!user) {
    return false;
  }

  const {
    email,
    is_ifrc_admin,
  } = user;

  if (is_ifrc_admin) {
    return true;
  }

  if (!email) {
    return false;
  }

  const parts = email.split('@');
  if (parts.length < 2) {
    return false;
  }

  const lastPart = parts[parts.length - 1];
  if (!lastPart) {
    return false;
  }

  if (lastPart.toLowerCase() === 'ifrc.org') {
    return true;
  }

  return false;
}

export type SetValueArg<T> = T | ((value: T) => T);
