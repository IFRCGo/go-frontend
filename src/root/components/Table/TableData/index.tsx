import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props extends Omit<React.HTMLProps<HTMLTableCellElement>, 'ref'> {
}

function TableData(props: Props) {
  const {
    className,
    children,
    ...otherProps
  } = props;

  return (
    <td
      className={_cs(className, styles.td)}
      {...otherProps}
    >
      {children}
    </td>
  );
}

export default TableData;
