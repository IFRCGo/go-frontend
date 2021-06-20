import React from 'react';
import {
  populateFormat,
  breakFormat,
  _cs,
} from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  value?: string | number;
  format?: string;
}

function DateOutput(props: Props) {
  const {
    value,
    format = 'yyyy-MM-dd',
    className,
  } = props;

  const formattedValueList = React.useMemo(() => {
    if (!value) return [];
    const date = new Date(value);
    return populateFormat(breakFormat(format), date);
  }, [format, value]);

  const formattedDate = formattedValueList.find((d) => d.type === 'date');

  return (
    <div className={_cs(styles.dateOutput, className)}>
      {formattedDate?.value}
    </div>
  );
}

export default DateOutput;
