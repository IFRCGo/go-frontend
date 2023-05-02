import Button, {Props as ButtonProps} from '#components/Button';
import React from 'react';
import {
  IoChevronDown,
  IoChevronForward,
} from 'react-icons/io5';
// import Button, { ButtonProps } from '../Button';

export interface ExpandButtonProps<K extends number | string | undefined> {
  className?: string;
  rowId: K;
  onClick: ButtonProps<K>['onClick'];
  // onClick?: (name: K, e: React.MouseEvent<HTMLButtonElement>) => void;
  expanded?: boolean;
}

function ExpandButton<K extends number | string | undefined>(props : ExpandButtonProps<K>) {
  const {
    className,
    rowId,
    onClick,
    expanded = false,
  } = props;

  return (
    <Button
      className={className}
      name={rowId}
      onClick={onClick}
      variant="transparent"
    >
      {expanded ? (
        <IoChevronDown title="Expand row" />
      ) : (
          <IoChevronForward title="Collapse row" />
        )}
    </Button>
  );
}

export default ExpandButton;
