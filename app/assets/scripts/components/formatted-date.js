import React from 'react';
import _cs from 'classnames';

import { padStart } from '@togglecorp/fujs';

const FormattedDate = ({
  value,
  className,
}) => {
  let dateString = '-';

  if (value) {
    const date = new Date(value);

    if (date && !(isNaN(date.getTime()))) {
      dateString = `${date.getFullYear()}-${padStart(date.getMonth() + 1, 2)}-${padStart(date.getDay(), 2)}`;
    }
  }

  return (
    <div className={_cs('tc-formatted-date', className)}>
      { dateString }
    </div>
  );
};

export default FormattedDate;
