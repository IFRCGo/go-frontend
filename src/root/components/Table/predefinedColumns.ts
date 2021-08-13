import {
  compareString,
  compareNumber,
} from '@togglecorp/fujs';

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
  title: string,
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
  const item: Column<D, K, CellProps<string>, HeaderCellProps> & {
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
    cellRendererParams: (_: K, datum: D): CellProps<string> => ({
      value: accessor(datum),
    }),
    valueSelector: accessor,
    valueComparator: (foo: D, bar: D) => compareString(accessor(foo), accessor(bar)),
  };
  return item;
}

export function createNumberColumn<D, K>(
  id: string,
  title: string,
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
  title: string,
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
    cellRenderer: DateOutput,
    cellRendererParams: (_: K, datum: D): DateOutputProps => ({
      // Note: override null with undefined
      value: accessor(datum) ?? undefined,
      ...rendererProps,
    }),
    valueSelector: accessor,
  };

  return item;
}

export function createActionColumn<D, K>(
  id: string,
  rendererParams: (_: K, datum: D) => TableActionsProps,
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
    cellRenderer: TableActions,
    cellRendererParams: rendererParams,
  };

  return item;
}
