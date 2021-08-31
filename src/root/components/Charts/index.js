import React from 'react';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { DateTime } from 'luxon';
import Translate from '#components/Translate';


export const TimeLineChart = ({ data }) => {
  const zone = 'utc';
  const tickFormatter = (date) => DateTime.fromISO(date, {zone}).toFormat('MMM');
  const contentFormatter = (payload) => {
    if (!payload.payload[0]) { return null; }

    const item = payload.payload[0].payload;
    return (
      <article className='chart-tooltip'>
        <div className='chart-tooltip__contents'>
          <dl>
            <dd>
              <Translate stringId='emergenciesDashDate' />
            </dd>
            <dt>{DateTime.fromISO(item.timespan, {zone}).toFormat('MMMM yyyy')}</dt>
            <dd>
              <Translate stringId='emergenciesDashTotal' />
            </dd>
            <dt>{item.count}</dt>
          </dl>
        </div>
      </article>
    );
  };

  return (
    <div className='chart__container charts__container__rtl spacing-t'>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis tickFormatter={tickFormatter} dataKey='timespan' axisLine={false} padding={{ left: 16, right: 16 }} />
          <YAxis axisLine={false} tickLine={false} width={32} padding={{ bottom: 16 }} />
          <Line type="monotone" dataKey="count" stroke="#f5333f" />
          <Tooltip content={contentFormatter}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
