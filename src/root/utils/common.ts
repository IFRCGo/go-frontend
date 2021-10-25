import { memo } from 'react';
import { isDefined } from '@togglecorp/fujs';

export const getHashFromBrowser = () => window.location.hash.substr(1);
export const setHashToBrowser = (hash: string | undefined) => {
    if (hash) {
        window.location.replace(`#${hash}`);
    } else {
        window.location.hash = '';
    }
};

export function sum<L, V extends string | number>(list: L[], valueSelector: (item: L) => V) {
  if (!list || !Array.isArray(list)) {
    return undefined;
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

