import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { IoEllipsisVertical } from 'react-icons/io5';

import DropdownMenu from '#components/dropdown-menu';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  children?: React.ReactNode;
  extraActions?: React.ReactNode;
}

function TableActions(props: Props) {
  const {
    className,
    children,
    extraActions,
  } = props;

  return (
    <div className={_cs(styles.tableActions, className)}>
      { children }
      {extraActions && (
        <DropdownMenu
          label={<IoEllipsisVertical />}
        >
          {extraActions}
        </DropdownMenu>
      )}
    </div>
  );
}

export default TableActions;
