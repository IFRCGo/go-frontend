import React from 'react';
import { _cs } from '@togglecorp/fujs';

import RawButton from '#components/RawButton';
import { getFullMonthNameList } from '#utils/common';
import languageContext from '#root/languageContext';

import styles from './styles.module.scss';

interface Props<T> {
  className?: string;
  value: number;
  name: T,
  onChange: (newValue: number, name: T) => void;
}

function MonthSelector<T>(props: Props<T>) {
  const {
    className,
    name,
    onChange,
    value,
  } = props;
  const { strings } = React.useContext(languageContext);

  const monthNameList = React.useMemo(() => (
    getFullMonthNameList(strings).map(m => m.substr(0, 3))
  ), [strings]);

  const handleClick = React.useCallback((newValue) => {
    if (onChange) {
      onChange(newValue, name);
    }
  }, [onChange, name]);

  return (
    <div className={_cs(styles.monthSelector, className)}>
      {monthNameList.map((m, i) => (
        <RawButton
          name={i}
          className={_cs(
            styles.tickItem,
            value === i && styles.active,
          )}
          onClick={handleClick}
          key={m}
        >
          <div className={styles.monthName}>
            {m}
          </div>
          <div className={styles.tick} />
        </RawButton>
      ))}
    </div>
  );
}

export default MonthSelector;
