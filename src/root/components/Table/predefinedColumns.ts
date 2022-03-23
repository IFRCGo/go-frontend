import {
  compareString,
  compareNumber,
} from '@togglecorp/fujs';
import {
  Link,
  LinkProps,
} from 'react-router-dom';

import HeaderCell, { HeaderCellProps } from './HeaderCell';
import Cell, { CellProps } from './Cell';
import NumberOutput, {
  Props as NumberOutputProps
} from '#components/NumberOutput';
import DateOutput, {
  Props as DateOutputProps
} from '#components/DateOutput';
import TableActions, {
  Props as TableActionsProps
} from '#components/TableActions';

import { Column } from './index';
import { SortDirection, FilterType } from './types';

export function createStringColumn<D, K>(
  id: string,
  title: React.ReactNode,
  accessor: (item: D) => string | undefined | null,
  options?: {
    cellAsHeader?: boolean,
    sortable?: boolean,
    defaultSortDirection?: SortDirection,
    filterType?: FilterType,
    orderable?: boolean;
    hideable?: boolean;
  },
) {
  const item: Column<D, K, CellProps<React.ReactNode>, HeaderCellProps> & {
    valueSelector: (item: D) => string | undefined | null,
    valueComparator: (foo: D, bar: D) => number,
  } = {
    id,
    title,
    cellAsHeader: options?.cellAsHeader,
    headerCellRenderer: HeaderCell,
    headerCellRendererParams: {
      sortable: options?.sortable,
      filterType: options?.filterType,
      orderable: options?.orderable,
      hideable: options?.hideable,
    },
    cellRenderer: Cell,
    cellRendererParams: (_: K, datum: D): CellProps<React.ReactNode> => ({
      value: accessor(datum),
    }),
    valueSelector: accessor,
    valueComparator: (foo: D, bar: D) => compareString(accessor(foo), accessor(bar)),
  };
  return item;
}

export function createNumberColumn<D, K>(
  id: string,
  title: React.ReactNode,
  accessor: (item: D) => number | undefined | null,
  options?: {
    cellAsHeader?: boolean,
    sortable?: boolean,
    defaultSortDirection?: SortDirection,
    filterType?: FilterType,
    orderable?: boolean;
    hideable?: boolean;
  },
  rendererProps?: NumberOutputProps,
) {
  const item: Column<D, K, NumberOutputProps, HeaderCellProps> & {
    valueSelector: (item: D) => number | undefined | null,
    valueComparator: (foo: D, bar: D) => number,
  } = {
    id,
    title,
    cellAsHeader: options?.cellAsHeader,
    headerCellRenderer: HeaderCell,
    headerCellRendererParams: {
      sortable: options?.sortable,
      filterType: options?.filterType,
      orderable: options?.orderable,
      hideable: options?.hideable,
    },
    cellRenderer: NumberOutput,
    cellRendererParams: (_: K, datum: D): NumberOutputProps => ({
      // Note: override null with undefined
      value: accessor(datum) ?? undefined,
      ...rendererProps,
    }),
    valueSelector: accessor,
    valueComparator: (foo: D, bar: D) => compareNumber(accessor(foo), accessor(bar)),
  };

  return item;
}

export function createDateColumn<D, K>(
  id: string,
  title: React.ReactNode,
  accessor: (item: D) => string | undefined | null,
  options?: {
    cellAsHeader?: boolean,
    sortable?: boolean,
    defaultSortDirection?: SortDirection,
    filterType?: FilterType,
    orderable?: boolean;
    hideable?: boolean;
  },
  rendererProps?: DateOutputProps,
) {
  const item: Column<D, K, DateOutputProps, HeaderCellProps> & {
    valueSelector: (item: D) => string | undefined | null,
    valueComparator: (foo: D, bar: D) => number,
  } = {
    id,
    title,
    cellAsHeader: options?.cellAsHeader,
    headerCellRenderer: HeaderCell,
    headerCellRendererParams: {
      sortable: options?.sortable,
      filterType: options?.filterType,
      orderable: options?.orderable,
      hideable: options?.hideable,
    },
    cellRenderer: DateOutput,
    cellRendererParams: (_: K, datum: D): DateOutputProps => ({
      // Note: override null with undefined
      value: accessor(datum) ?? undefined,
      ...rendererProps,
    }),
    valueSelector: accessor,
    valueComparator: (foo: D, bar: D) => compareString(accessor(foo), accessor(bar)),
  };

  return item;
}

export function createLinkColumn<D, K>(
  id: string,
  title: React.ReactNode,
  accessor: (item: D) => React.ReactNode,
  rendererParams: (item: D) => LinkProps,
) {
  const item: Column<D, K, LinkProps, HeaderCellProps> & {
    valueSelector: (item: D) => string | undefined | null,
    valueComparator: (foo: D, bar: D) => number,
  } = {
    id,
    title,
    headerCellRenderer: HeaderCell,
    headerCellRendererParams: {
      sortable: false,
      orderable: false,
      hideable: false,
    },
    cellRenderer: Link,
    cellRendererParams: (_: K, datum: D): LinkProps => ({
      children: accessor(datum),
      ...rendererParams(datum),
    }),
    valueSelector: () => '',
    valueComparator: () => 0,
  };

  return item;
}

export function createActionColumn<D, K>(
  id: string,
  rendererParams: (_: K, datum: D) => TableActionsProps,
  options?: {
    cellRendererClassName?: string;
    headerContainerClassName?: string;
  },
) {
  const item: Column<D, K, TableActionsProps, HeaderCellProps> = {
    id,
    title: '',
    headerCellRenderer: HeaderCell,
    headerCellRendererParams: {
      sortable: false,
      orderable: false,
      hideable: false,
    },
    headerContainerClassName: options?.headerContainerClassName,
    cellRenderer: TableActions,
    cellRendererParams: rendererParams,
    cellRendererClassName: options?.cellRendererClassName,
  };

  return item;
}
