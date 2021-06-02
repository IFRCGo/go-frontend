import React, {
  useCallback,
  useMemo,
} from 'react';
import { listToGroupList } from '@togglecorp/fujs';

import { genericMemo } from '#utils/common';

type OptionKey = string | number | boolean;

const emptyList: unknown[] = [];

export interface GroupCommonProps {
    className?: string;
    children: React.ReactNode;
}

interface BaseProps<D, P, K extends OptionKey> {
    data: D[] | undefined;
    keySelector(datum: D, index: number): K;
    renderer: (props: P) => JSX.Element;
    rendererClassName?: string;
    rendererParams: (key: K, datum: D, index: number, data: D[]) => P;
}

interface GroupOptions<D, GP, GK extends OptionKey> {
    groupComparator?: (a: GK, b: GK) => number;
    groupKeySelector(datum: D): GK;

    groupRenderer: (props: GP) => JSX.Element;
    groupRendererClassName?: string;
    groupRendererParams: (key: GK, index: number, data: D[]) => Omit<GP, 'children' | 'className'>;
    grouped: true;
}

interface NoGroupOptions {
    grouped?: false;
}

// eslint-disable-next-line max-len
export type Props<D, P, K extends OptionKey, GP, GK extends OptionKey> = (
    BaseProps<D, P, K> & (GroupOptions<D, GP, GK> | NoGroupOptions)
);

// eslint-disable-next-line max-len
export type GroupedListProps<D, P, K extends OptionKey, GP, GK extends OptionKey> = (
    BaseProps<D, P, K> & GroupOptions<D, GP, GK>
);

function hasGroup<D, P, K extends OptionKey, GP, GK extends OptionKey>(
    props: Props<D, P, K, GP, GK>,
): props is (BaseProps<D, P, K> & GroupOptions<D, GP, GK>) {
    return !!(props as BaseProps<D, P, K> & GroupOptions<D, GP, GK>).grouped;
}

function GroupedList<D, P, K extends OptionKey, GP extends GroupCommonProps, GK extends OptionKey>(
    props: GroupedListProps<D, P, K, GP, GK>,
) {
    const {
        groupKeySelector,
        groupComparator,
        renderer: Renderer,
        groupRenderer: GroupRenderer,
        groupRendererClassName,
        groupRendererParams,
        data: dataFromProps,
        keySelector,
        rendererParams,
        rendererClassName,
    } = props;

    const data = dataFromProps ?? (emptyList as D[]);

    const renderListItem = useCallback((datum: D, i: number) => {
        const key = keySelector(datum, i);
        const extraProps = rendererParams(key, datum, i, data);

        return (
            <Renderer
                key={String(key)}
                className={rendererClassName}
                {...extraProps}
            />
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Renderer, data, keySelector, rendererClassName, rendererParams]);

    const renderGroup = (
        groupKey: GK,
        index: number,
        groupData: D[],
        children: React.ReactNode,
    ) => {
        const extraProps = groupRendererParams(groupKey, index, groupData);

        const finalProps = {
            ...extraProps,
            className: groupRendererClassName,
            children,
        };

        return (
            <GroupRenderer
                key={String(groupKey)}
                // FIXME: currently typescript is not smart enough to join Omit
                {...finalProps as GP}
            />
        );
    };

    const typeSafeGroupKeySelector: (d: D) => string | number = React.useCallback((d) => {
      const key = groupKeySelector(d);

      if (typeof key === 'number') {
        return key;
      }

      return String(key);
    }, [groupKeySelector]);

    const groups = useMemo(
        () => listToGroupList(data, typeSafeGroupKeySelector),
        [data, typeSafeGroupKeySelector],
    );

    const sortedGroupKeys = useMemo(
        () => {
            const keys = Object.keys(groups) as GK[];
            return keys.sort(groupComparator);
        },
        [groups, groupComparator],
    );

    const children: React.ReactNode[] = sortedGroupKeys.map((groupKey, i) => (
        renderGroup(
            groupKey,
            i,
            groups[String(groupKey)],
            groups[String(groupKey)].map(renderListItem),
        )
    ));

    return (
        <>
            {children}
        </>
    );
}

function List<D, P, K extends OptionKey, GP extends GroupCommonProps, GK extends OptionKey>(
    props: Props<D, P, K, GP, GK>,
) {
    const {
        data: dataFromProps,
        keySelector,
        renderer: Renderer,
        rendererClassName,
        rendererParams,
    } = props;

    const data = dataFromProps ?? (emptyList as D[]);

    const renderListItem = useCallback((datum: D, i: number) => {
        const key = keySelector(datum, i);
        const extraProps = rendererParams(key, datum, i, data);

        return (
            <Renderer
                key={String(key)}
                className={rendererClassName}
                {...extraProps}
            />
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keySelector, Renderer, rendererClassName, rendererParams, data]);

    if (!hasGroup(props)) {
        return (
            <>
                {data.map(renderListItem)}
            </>
        );
    }

    return (
        <GroupedList
            {...props}
        />
    );
}

export default genericMemo(List);
