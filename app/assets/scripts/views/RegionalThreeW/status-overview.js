import React from 'react';
import _cs from 'classnames';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import FormattedNumber from '../../components/formatted-number';

function StatusOverview (p) {
  const {
    data,
    total,
    className,
  } = p;

  return (
    <div className={_cs('sector-activity', className)}>
      <h4 className='tc-heading'>
        Projects by sector of activity
      </h4>
      <div className='tc-content'>
        <div className='total-activity'>
          <FormattedNumber
            className='tc-value'
            value={total}
            normalize
            fixedTo={1}
          />
          <div className='tc-label'>
            Total activities
          </div>
        </div>
        <div className='tc-chart-container'>
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis
                dataKey='label'
                type='category'
                height={16}
              />
              <YAxis
                dataKey='value'
                type='number'
                allowDecimals={false}
                width={26}
              />
              <Bar
                fill='#c1cdd1'
                dataKey='value'
              />
              <Tooltip cursor={{ fill: 'transparent' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default StatusOverview;
