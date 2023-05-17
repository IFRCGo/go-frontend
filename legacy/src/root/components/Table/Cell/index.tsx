import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';

import { genericMemo } from '#utils/common';

export interface CellProps<T>{
  className?: string;
  value: T | null | undefined;
}

function Cell<T>(props: CellProps<T>) {
  const {
    className,
    value,
  } = props;

  if (isNotDefined(value)) {
    return null;
  }

  return (
    <div className={className}>
      {value}
    </div>
  );
}

export default genericMemo(Cell);
