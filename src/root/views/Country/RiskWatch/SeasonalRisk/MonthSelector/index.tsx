import React from 'react';
import { _cs } from '@togglecorp/fujs';

import RawButton from '#components/RawButton';
import { getFullMonthNameList } from '#utils/common';
import languageContext from '#root/languageContext';

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

  const {
    strings,
  } = React.useContext(languageContext);

  const monthNameList = React.useMemo(() => (
    getFullMonthNameList(strings).map(m => m.substr(0, 3))
  ), [strings]);

  const handleClick = React.useCallback((month) => {
    if (onChange) {
      const numSelection = Object.values(value).filter(Boolean).length;
      const newValue = { ...value };

      if (value[month]) {
        if (numSelection > 1) {
          for (let i = 0; i < 12; i = i + 1) {
            newValue[i] = false;
          }

          newValue[month] = true;
        } else {
          newValue[month] = !value[month];
        }
      } else {
        if (numSelection === 0) {
          newValue[month] = true;
        } else if (numSelection === 1) {
          const prevMonth = Object.values(value).findIndex(Boolean);
          const startIndex = Math.min(prevMonth, month);
          const endIndex = Math.max(prevMonth, month);


          for (let i = 0; i < 12; i = i + 1) {
            if (i >= startIndex && i <= endIndex) {
              newValue[i] = true;
            } else {
              newValue[i] = false;
            }
          }
        } else {
          for (let i = 0; i < 12; i = i + 1) {
            newValue[i] = false;
          }

          newValue[month] = true;
        }
      }

      onChange(newValue, name);
    }
  }, [value, onChange, name]);

  return (
    <div className={_cs(styles.monthSelector, className)}>
      <div className={styles.track} />
      {monthNameList.map((m, i) => (
        <>
          <RawButton
            name={i}
            className={_cs(
              styles.tickItem,
              value[i] && styles.active,
            )}
            onClick={handleClick}
            key={m}
          >
            <div className={styles.tick} />
            <div className={styles.monthName}>
              {m}
            </div>
          </RawButton>
          {i < (monthNameList.length - 1) && (
            <div
              className={_cs(
                styles.track,
                i < 11 && value[i] && value[i + 1] && styles.activeTrack,
              )}
            />
          )}
        </>
      ))}
      <div className={styles.track} />
    </div>
  );
}

export default MonthSelector;
