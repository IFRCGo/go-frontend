import { memo } from 'react';

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

  return list.reduce((acc, item) => (
    acc + (+valueSelector(item))
  ), 0);
}

export function max<L, V extends string | number>(list: L[], valueSelector: (item: L) => V) {
  if (!list || !Array.isArray(list)) {
    return undefined;
  }

  return list.reduce((acc, item) => (
    Math.max(acc, +valueSelector(item))
  ), 0);
}

export function transformObjectItems<K extends string, T, R>(obj: Record<K, T>, itemSelector: (item: T) => R) {
  const keys = Object.keys(obj) as K[];

  return keys.reduce((acc, val) => ({
    ...acc,
    [val]: itemSelector(obj[val]),
  }), {} as Record<K, R>);
}

export function denormalizeList<A, B, C>(
  list: A[],
  secondaryListSelector: (li: A) => B[],
  transformFn: (li: A, sli: B) => C,
): C[] {
  const newList = list.map((li) => {
    const sl = secondaryListSelector(li);

    return sl.map(sli => transformFn(li, sli));
  }).flat();

  return newList;
}

export function compareLabel<O extends { label: string }>(a: O, b: O) {
  return a.label.localeCompare(b.label);
}

export const genericMemo: (<T>(c: T) => T) = memo;
