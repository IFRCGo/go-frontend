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

  const shiftPressedRef = React.useRef<boolean>(false);
  const { strings } = React.useContext(languageContext);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.which === 16) {
        shiftPressedRef.current = true;
      }
    };

    const handleKeyUp = () => {
        shiftPressedRef.current = false;
    };

    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const monthNameList = React.useMemo(() => (
    getFullMonthNameList(strings).map(m => m.substr(0, 3))
  ), [strings]);

  const handleClick = React.useCallback((month) => {
    if (onChange) {
      const numSelection = Object.values(value).filter(Boolean).length;
      const newValue = { ...value };

      // Yearly Avg Selected
      if (month === 12) {
        for (let i = 0; i <= 12; i = i + 1) {
          newValue[i] = false;
        }

        newValue[month] = true;
      } else if (!shiftPressedRef.current || newValue[12]) {
        // Shift not pressed, only selecting single value
        for (let i = 0; i <= 12; i = i + 1) {
          newValue[i] = false;
        }

        newValue[month] = true;
      } else if (value[month]) {
        if (numSelection > 1) {
          for (let i = 0; i <= 12; i = i + 1) {
            newValue[i] = false;
          }

          newValue[month] = true;
        } else {
          // At least one selection is required
          newValue[month] = true;
        }
      } else {
        if (numSelection === 0) {
          newValue[month] = true;
        } else if (numSelection === 1) {
          const prevMonth = Object.values(value).findIndex(Boolean);
          const startIndex = Math.min(prevMonth, month);
          const endIndex = Math.max(prevMonth, month);

          for (let i = 0; i <= 12; i = i + 1) {
            if (i >= startIndex && i <= endIndex) {
              newValue[i] = true;
            } else {
              newValue[i] = false;
            }
          }
        } else {
          for (let i = 0; i <= 12; i = i + 1) {
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
      <div className={styles.monthList}>
        <div className={styles.track} />
        {monthNameList.map((m, i) => (
          <React.Fragment key={m}>
            <RawButton
              name={i}
              className={_cs(
                styles.tickItem,
                value[i] && styles.active,
              )}
              onClick={handleClick}
            >
              <div className={styles.monthName}>
                {m}
              </div>
              <div className={styles.tick} />
            </RawButton>
            {i < (monthNameList.length - 1) && (
              <div
                className={_cs(
                  styles.track,
                  i < 11 && value[i] && value[i + 1] && styles.activeTrack,
                )}
              />
            )}
          </React.Fragment>
        ))}
        <div className={styles.track} />
      </div>
      <div className={styles.yearlyAverage}>
        <RawButton
          name={12}
          className={_cs(
            styles.tickItem,
            value[12] && styles.active,
          )}
          onClick={handleClick}
        >
          <div className={styles.monthName}>
            Yearly Avg
          </div>
          <div className={styles.tick} />
        </RawButton>
      </div>
    </div>
  );
}

export default MonthSelector;
