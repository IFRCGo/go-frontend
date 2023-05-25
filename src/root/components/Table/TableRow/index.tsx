import React from 'react';

export interface Props extends Omit<React.HTMLProps<HTMLTableRowElement>, 'ref'> {
}

function TableRow(props: Props) {
  const {
    className,
    children,
    ...otherProps
  } = props;

  return (
    <tr
      className={className}
      {...otherProps}
    >
      {children}
    </tr>
  );
}

export default TableRow;
