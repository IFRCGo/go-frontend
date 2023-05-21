import {
    compareString,
    compareNumber,
    compareDate,
    compareBoolean,
    _cs,
} from '@togglecorp/fujs';

import DateOutput from '#components/DateOutput';
import type { Props as DateOutputProps } from '#components/DateOutput';
import NumberOutput from '#components/NumberOutput';
import type { Props as NumberOutputProps } from '#components/NumberOutput';
import BooleanOutput from '#components/BooleanOutput';
import type { Props as BooleanOutputProps } from '#components/BooleanOutput';

import HeaderCell from '../HeaderCell';
import type { HeaderCellProps } from '../HeaderCell';
import Cell from '../Cell';
import type { CellProps } from '../Cell';

import type { Column } from '../index';
import type { SortDirection } from '../types';

import ExpandButton from './ExpandButton';
import type { ExpandButtonProps } from './ExpandButton';

import styles from './styles.module.css';

type Options<D, K, CompProps, HeaderProps> = {
    sortable?: boolean,
    defaultSortDirection?: SortDirection,

    columnClassName?: string;
    headerCellRendererClassName?: string;
    headerContainerClassName?: string;
    cellRendererClassName?: string;
    cellContainerClassName?: string;
    columnWidth?: Column<D, K, CompProps, HeaderProps>['columnWidth'];
    columnStretch?: Column<D, K, CompProps, HeaderProps>['columnStretch'];
    columnStyle?: Column<D, K, CompProps, HeaderProps>['columnStyle'];
}

export function createBooleanColumn<D, K>(
    id: string,
    title: string,
    accessor: (item: D) => boolean | undefined | null,
    options?: Options<D, K, BooleanOutputProps, HeaderCellProps>,
) {
    const item: Column<D, K, BooleanOutputProps, HeaderCellProps> & {
        valueSelector: (item: D) => boolean | undefined | null,
        valueComparator: (foo: D, bar: D) => number,
    } = {
        id,
        title,
        columnClassName: options?.columnClassName,
        headerCellRenderer: HeaderCell,
        headerCellRendererClassName: options?.headerCellRendererClassName,
        headerContainerClassName: options?.headerContainerClassName,
        headerCellRendererParams: {
            sortable: options?.sortable,
        },
        cellRendererClassName: options?.cellRendererClassName,
        cellContainerClassName: options?.cellContainerClassName,
        cellRenderer: BooleanOutput,
        cellRendererParams: (_: K, datum: D): BooleanOutputProps => ({
            value: accessor(datum),
        }),
        valueSelector: accessor,
        valueComparator: (foo: D, bar: D) => compareBoolean(accessor(foo), accessor(bar)),
        columnWidth: options?.columnWidth,
        columnStretch: options?.columnStretch,
        columnStyle: options?.columnStyle,
    };
    return item;
}

export function createStringColumn<D, K>(
    id: string,
    title: string,
    accessor: (item: D) => string | undefined | null,
    options?: Options<D, K, CellProps<string>, HeaderCellProps>,
) {
    const item: Column<D, K, CellProps<string>, HeaderCellProps> & {
        valueSelector: (item: D) => string | undefined | null,
        valueComparator: (foo: D, bar: D) => number,
    } = {
        id,
        title,
        columnClassName: options?.columnClassName,
        headerCellRenderer: HeaderCell,
        headerCellRendererClassName: options?.headerCellRendererClassName,
        headerContainerClassName: options?.headerContainerClassName,
        headerCellRendererParams: {
            sortable: options?.sortable,
        },
        cellRendererClassName: options?.cellRendererClassName,
        cellContainerClassName: options?.cellContainerClassName,
        cellRenderer: Cell,
        cellRendererParams: (_: K, datum: D): CellProps<string> => ({
            value: accessor(datum),
        }),
        valueSelector: accessor,
        valueComparator: (foo: D, bar: D) => compareString(accessor(foo), accessor(bar)),
        columnWidth: options?.columnWidth,
        columnStretch: options?.columnStretch,
        columnStyle: options?.columnStyle,
    };
    return item;
}

export function createNumberColumn<D, K>(
    id: string,
    title: string,
    accessor: (item: D) => number | undefined | null,
    options?: Options<D, K, NumberOutputProps, HeaderCellProps>,
) {
    const item: Column<D, K, NumberOutputProps, HeaderCellProps> & {
        valueSelector: (item: D) => number | undefined | null,
        valueComparator: (foo: D, bar: D) => number,
    } = {
        id,
        title,
        columnClassName: options?.columnClassName,
        headerCellRenderer: HeaderCell,
        headerCellRendererClassName: _cs(
            styles.numberCellHeader,
            options?.headerCellRendererClassName,
        ),
        headerContainerClassName: options?.headerContainerClassName,
        headerCellRendererParams: {
            sortable: options?.sortable,
            titleClassName: styles.title,
            titleContainerClassName: styles.titleContainer,
        },
        cellRendererClassName: _cs(
            styles.numberCell,
            options?.cellRendererClassName,
        ),
        cellContainerClassName: options?.cellContainerClassName,
        cellRenderer: NumberOutput,
        cellRendererParams: (_: K, datum: D): NumberOutputProps => ({
            value: accessor(datum),
        }),
        valueSelector: accessor,
        valueComparator: (foo: D, bar: D) => compareNumber(accessor(foo), accessor(bar)),
        columnWidth: options?.columnWidth,
        columnStretch: options?.columnStretch,
        columnStyle: options?.columnStyle,
    };
    return item;
}

export function createDateColumn<D, K>(
    id: string,
    title: string,
    accessor: (item: D) => string | undefined | null,
    options?: Options<D, K, DateOutputProps, HeaderCellProps>,
) {
    const item: Column<D, K, DateOutputProps, HeaderCellProps> & {
        valueSelector: (item: D) => string | undefined | null,
        valueComparator: (foo: D, bar: D) => number,
    } = {
        id,
        title,
        columnClassName: options?.columnClassName,
        headerCellRenderer: HeaderCell,
        headerCellRendererClassName: options?.headerCellRendererClassName,
        headerContainerClassName: options?.headerContainerClassName,
        headerCellRendererParams: {
            sortable: options?.sortable,
        },
        cellRendererClassName: options?.cellRendererClassName,
        cellContainerClassName: options?.cellContainerClassName,
        cellRenderer: DateOutput,
        cellRendererParams: (_: K, datum: D): DateOutputProps => ({
            value: accessor(datum),
        }),
        valueSelector: accessor,
        valueComparator: (foo: D, bar: D) => compareDate(accessor(foo), accessor(bar)),
        columnWidth: options?.columnWidth,
        columnStretch: options?.columnStretch,
        columnStyle: options?.columnStyle,
    };
    return item;
}

export function createExpandColumn<D, K extends number | string | undefined>(
    id: string,
    title: string,
    onClick: (rowId: K) => void,
    expandedRowId: K | undefined,
    options?: Options<D, K, ExpandButtonProps<K>, HeaderCellProps>,
) {
    const item: Column<D, K, ExpandButtonProps<K>, HeaderCellProps> = {
        id,
        title,
        columnClassName: options?.columnClassName,
        headerCellRenderer: HeaderCell,
        headerCellRendererClassName: options?.headerCellRendererClassName,
        headerContainerClassName: options?.headerContainerClassName,
        headerCellRendererParams: {
            sortable: false,
        },
        cellRendererClassName: options?.cellRendererClassName,
        cellContainerClassName: options?.cellContainerClassName,
        cellRenderer: ExpandButton,
        cellRendererParams: (rowId: K) => ({
            rowId,
            onClick,
            expanded: rowId === expandedRowId,
        }),
        columnWidth: options?.columnWidth,
        columnStretch: options?.columnStretch,
        columnStyle: options?.columnStyle,
    };
    return item;
}
