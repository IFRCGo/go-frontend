import React from 'react';
import {
  listToGroupList,
  getColorOnBgColor,
  getHexFromString,
} from '@togglecorp/fujs';
import _cs from 'classnames';
import Translate from '#components/Translate';

import Container from './Container';
import styles from './styles.module.scss';

const daysInMonth = (year, month) => (
  new Date(year, month + 1, 0).getDate()
);

const monthList = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function SeasonalCalendar(props) {
  const {
    className,
    data,
    // appeals,
  } = props;

  // TODO: memoize
  const chartData = React.useMemo(() => data.map(d => {
    const startDate = new Date(d.date_start);
    const endDate = new Date(d.date_end);

    const daysInStartMonth = daysInMonth(startDate.getFullYear(), startDate.getMonth());
    const daysInEndMonth = daysInMonth(endDate.getFullYear(), endDate.getMonth());

    const dateStart = startDate.getMonth() + startDate.getDate() / daysInStartMonth;
    const dateEnd = endDate.getMonth() + endDate.getDate() / daysInEndMonth;

    return {
      ...d,
      dateStart,
      dateEnd,
    };
  }), [data]);

  const sectorMap = listToGroupList(chartData, c => c.sector);
  const sectorKeys = Object.keys(sectorMap);

  return (
    <Container
      className={_cs(className, styles.seasonalCalendar)}
      heading={<Translate stringId='seasonalCalendarTitle'/>}
      contentClassName={styles.content}
    >
      { sectorKeys.map(sectorKey => {
        const sectorBgColor= getHexFromString(sectorKey);
        const sectorColor = getColorOnBgColor(sectorBgColor, '#212121', '#ffffff');

        return (
          <div
            key={sectorKey}
            className={styles.row}
          >
            <div
              className={styles.sectorCell}
              title={sectorKey}
            >
              { sectorKey }
            </div>
            <div className={styles.titleListCell}>
              <div className={styles.titleList}>
                { sectorMap[sectorKey].map(d => {
                  const absMargin = 100 * d.dateStart / 12;
                  const currentWidth = 100 * (d.dateEnd - d.dateStart) / 12;

                  return (
                    <div
                      key={d.id}
                      className={styles.title}
                      style={{
                        insetInlineStart: `${absMargin}%`,
                        width: `${currentWidth}%`,
                        backgroundColor: sectorBgColor,
                        color: sectorColor,
                        borderColor: sectorColor,
                      }}
                      title={d.title}
                    >
                      {d.title}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      <div className={styles.row}>
        <div className={styles.sectorCell} />
        <div className={styles.titleListCell}>
          <div className={styles.monthTitleList}>
            { monthList.map(monthName => (
              <div
                key={monthName}
                className={styles.monthTitle}
              >
                { monthName }
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default SeasonalCalendar;
