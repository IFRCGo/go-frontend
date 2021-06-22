import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { BaseHeader } from './types';

import styles from './styles.module.scss';

export type TableVariant = (
  'regular'
  | 'small'
  | 'large'
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tableVariantToStyleMap: { [key in TableVariant]: string; } = {
  regular: styles.regular,
  small: styles.small,
  large: styles.large,
};

export interface Column<D, K, C, H> {
  id: string;
  title: string;

  headerCellRenderer: React.ComponentType<H>;
  headerCellRendererParams: Omit<H, keyof BaseHeader>;
  headerCellRendererClassName?: string;
  headerContainerClassName?: string;

  cellRenderer: React.ComponentType<C>;
  cellRendererParams: (key: K, datum: D, index: number) => Omit<C, 'className' | 'name'>;
  cellRendererClassName?: string;
  cellContainerClassName?: string;

  cellAsHeader?: boolean;
}

type VerifyColumn<T, D, K> = unknown extends (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Column<D, K, any, any>
    ? never
    : unknown
)
  ? never
  : unknown

  export interface RowOptions<D, K> {
    rowKey: K,
    row: React.ReactElement;
    cells: React.ReactElement[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: Column<D, K, any, any>[];
    datum: D,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface Props<D, K extends string | number, C extends Column<D, K, any, any>> {
    className?: string;
    caption?: React.ReactNode;
    keySelector: (data: D, index: number) => K;
    columns: C[] & VerifyColumn<C, D, K>;
    data: D[] | undefined | null;
    captionClassName?: string;
    headerRowClassName?: string;
    headerCellClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
    variant?: TableVariant;
    rowModifier?: (rowOptions: RowOptions<D, K>) => React.ReactElement;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function Table<D, K extends string | number, C extends Column<D, K, any, any>>(
    props: Props<D, K, C>,
  ) {
    const {
      data,
      keySelector,
      columns,
      caption,

      className,
      captionClassName,
      headerRowClassName,
      headerCellClassName,
      rowClassName,
      cellClassName,
      variant = 'regular',
      rowModifier,
    } = props;

    return (
      <table
        className={_cs(
          styles.table,
          tableVariantToStyleMap[variant],
          className,
        )}
      >
        {caption && (
          <caption
            className={captionClassName}
          >
            {caption}
          </caption>
        )}
        <thead>
          <tr className={_cs(styles.headerRow, headerRowClassName)}>
            {columns.map((column, index) => {
              const {
                id,
                title,
                headerCellRenderer: Renderer,
                headerCellRendererClassName,
                cellAsHeader,
                headerCellRendererParams,
                headerContainerClassName,
              } = column;

              const children = (
                <Renderer
                  {...headerCellRendererParams}
                  name={id}
                  title={title}
                  index={index}
                  className={_cs(headerCellRendererClassName, styles.headerComponent)}
                />
              );
              return (
                <th
                  key={id}
                  scope="col"
                  className={_cs(
                    styles.headerCell,
                    cellAsHeader && styles.stickLeft,
                    headerCellClassName,
                    headerContainerClassName,
                  )}
                >
                  {children}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data?.map((datum, index) => {
            const key = keySelector(datum, index);
            const cells = columns.map((column) => {
              const {
                id,
                cellRenderer: Renderer,
                cellRendererClassName,
                cellRendererParams,
                cellAsHeader,
                cellContainerClassName,
              } = column;

              const otherProps = cellRendererParams(key, datum, index);

              const children = (
                <Renderer
                  {...otherProps}
                  className={_cs(cellRendererClassName, styles.cellComponent)}
                  name={id}
                />
              );

              if (cellAsHeader) {
                return (
                  <th
                    key={id}
                    className={_cs(
                      styles.rowHeaderCell,
                      cellClassName,
                      cellContainerClassName,
                    )}
                    scope="row"
                  >
                    {children}
                  </th>
                );
              }
              return (
                <td
                  key={id}
                  className={_cs(
                    styles.cell,
                    cellClassName,
                    cellContainerClassName,
                  )}
                >
                  {children}
                </td>
              );
            });

            const row = (
              <tr
                key={key}
                className={_cs(styles.row, rowClassName)}
              >
                { cells }
              </tr>
            );

            let modifiedRow: React.ReactNode = row;

            if (rowModifier) {
              modifiedRow = rowModifier({
                rowKey: key,
                row,
                cells,
                columns,
                datum,
              });
            }

            return modifiedRow;
          })}
        </tbody>
      </table>
    );
  }

  export default Table;
