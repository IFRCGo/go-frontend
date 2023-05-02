import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { RowOptions } from './index';

export type ExpansionRowChildrenProps<D, K> = (rowOptions: RowOptions<D, K>) => React.ReactNode;
export interface ExpansionOptions {
  expandedRowClassName?: string;
  expandedCellClassName?: string;
  expansionRowClassName?: string;
  expansionCellClassName?: string;
}

function useRowExpansion<D, K>(
  expandedRowKey: K | undefined,
  expansionRowChildren: ExpansionRowChildrenProps<D, K>,
  options: ExpansionOptions = {},
) : (rowOptions: RowOptions<D, K>) => React.ReactNode {
  const {
    expandedRowClassName,
    expandedCellClassName,
    expansionCellClassName,
    expansionRowClassName,
  } = options;

  const rowModifier: (
    o: RowOptions<D, K>
  ) => React.ReactNode = React.useCallback((rowOptions) => {
    const {
      rowKey,
      row,
    } = rowOptions;

    const isActive = rowKey === expandedRowKey;

    return (
      <>
        {React.cloneElement(row, {
          className: _cs(
            row.props.className,
            isActive && expandedRowClassName,
          ),
          children: row.props.children.map((cell: React.ReactElement) => (
            React.cloneElement(cell, {
              className: _cs(
                cell.props.className,
                isActive && expandedCellClassName,
              ),
            })
          )),
        })}
        {isActive && (
          <tr
            key={`${rowKey}-expanded`}
            className={expansionRowClassName}
          >
            <tr
              className={expansionCellClassName}
            >
              { expansionRowChildren(rowOptions) }
            </tr>
          </tr>
        )}
      </>
    );
  }, [
      expandedRowKey,
      expansionRowChildren,
      expandedRowClassName,
      expandedCellClassName,
      expansionRowClassName,
      expansionCellClassName,
    ]);

  return rowModifier;
}

export default useRowExpansion;
