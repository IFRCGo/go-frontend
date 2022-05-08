import React from 'react';
import { _cs } from '@togglecorp/fujs';

import RawButton from '#components/RawButton';
import { getFullMonthNameList } from '#utils/common';
import languageContext from '#root/languageContext';
import Checkmark from '#components/Checkbox/Checkmark';

import styles from './styles.module.scss';

interface Props<T> {
  className?: string;
  value: Record<number, boolean>;
  name: T,
  onChange: (newValue: Record<number, boolean>, name: T) => void;
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

  const handleClick = React.useCallback((month) => {
    if (onChange) {
      const newValue = { ...value };
      newValue[month] = !value[month];
      onChange(newValue, name);
    }
  }, [value, onChange, name]);

  return (
    <div className={_cs(styles.monthSelector, className)}>
      {monthNameList.map((m, i) => (
        <RawButton
          name={i}
          className={_cs(
            styles.tickItem,
            value[i] && styles.active,
          )}
          onClick={handleClick}
          key={m}
        >
          <Checkmark value={value[i]} />
          <div className={styles.monthName}>
            {m}
          </div>
        </RawButton>
      ))}
    </div>
  );
}

export default MonthSelector;
