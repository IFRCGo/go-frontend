import React from 'react';
import { listToGroupList } from '@togglecorp/fujs';
import _cs from 'classnames';

const daysInMonth = (year, month) => (
  new Date(year, month + 1, 0).getDate()
);

class SeasonalCalendar extends React.PureComponent {
  render () {
    const {
      className,
      data,
      // appeals,
    } = this.props;

    // TODO: memoize
    const chartData = data.map(d => {
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
    });

    const sectorMap = listToGroupList(chartData, c => c.sector);
    const sectorKeys = Object.keys(sectorMap);

    const monthList = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    /*
    const scatterData = appeals.map(a => ({
      ...a,
      index: 1,
      month: monthList[(new Date(a.start_date)).getMonth()],
    }));
    */

    return (
      <div className={_cs(className, 'country-seasonal-calendar')}>
        <h3 className='tc-heading'>
          Seasonal calendar
        </h3>
        <div className='tc-content'>
          <div className='calendar-chart'>
            {/*
            <div className='calendar-chart-row'>
              <div className='calendar-chart-sector-cell'/>
              <div className='calendar-chart-title-list-cell'>
                <div className='calendar-bubble-chart'>
                  <ResponsiveContainer>
                    <ScatterChart>
                      <XAxis type='category' dataKey='month' />
                      <ZAxis type='number' dataKey='num_beneficiaries' />
                      <YAxis type='number' dataKye='index' />
                      <Scatter data={scatterData} fill="red" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            */}
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
        </div>
      </div>
    );
  }
}

export default SeasonalCalendar;
