import React from 'react';
import { listToGroupList } from '@togglecorp/fujs';
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
      className={_cs(className, 'country-seasonal-calendar')}
      heading={<Translate stringId='seasonalCalendarTitle'/>}
      contentClassName='tc-content'
    >
      <div className='calendar-chart'>
        { sectorKeys.map(sectorKey => {
          let prevRight = 0;

          return (
            <div
              key={sectorKey}
              className='calendar-chart-row'
            >
              <div className='calendar-chart-sector-cell'>
                { sectorKey }
              </div>
              <div className='calendar-chart-title-list-cell'>
                <div className='calendar-chart-title-list'>
                  { sectorMap[sectorKey].map(d => {
                    const absMargin = 100 * d.dateStart / 12;
                    const currentMargin = absMargin - prevRight;
                    const currentWidth = 100 * (d.dateEnd - d.dateStart) / 12;
                    prevRight = absMargin + currentWidth;

                    return (
                      <div
                        key={d.id}
                        className='calendar-chart-title'
                        style={{
                          marginLeft: `${currentMargin}%`,
                          width: `${currentWidth}%`,
                        }}
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
        <div className='calendar-chart-row'>
          <div className='calendar-chart-sector-cell' />
          <div className='calendar-chart-title-list-cell'>
            <div className='calendar-chart-month-title-list'>
              { monthList.map(monthName => (
                <div
                  key={monthName}
                  className='calendar-chart-month-title'
                >
                  { monthName }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default SeasonalCalendar;
