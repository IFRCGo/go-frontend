import React from 'react';
import _cs from 'classnames';

import { padStart as p } from '@togglecorp/fujs';

const FormattedDate = ({
  value,
  className,
}) => {
  let dateString = '-';

  if (value) {
    const date = new Date(value);

    if (date && !(isNaN(date.getTime()))) {
      const mm = p(date.getMonth() + 1, 2);
      const dd = p(date.getDate(), 2);
      const yyyy = date.getFullYear();
      dateString = `${yyyy}-${mm}-${dd}`;
    }
  }

  return (
    <div className={_cs('tc-formatted-date', className)}>
      { dateString }
    </div>
  );
};

export default FormattedDate;
