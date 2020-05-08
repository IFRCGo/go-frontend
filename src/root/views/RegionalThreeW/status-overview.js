import React from 'react';
import _cs from 'classnames';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
} from 'recharts';

import FormattedNumber from '../../components/formatted-number';

const colors = {
  'Completed': '#f5333f',
  'Ongoing': '#f7969c',
  'Planned': '#f9e5e6',
};

function StatusOverview (p) {
  const {
    data,
    total,
    className,
  } = p;

  return (
    <div className={_cs('status-activity', className)}>
      <h4 className='tc-heading'>
        Total activities by status
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
            <PieChart>
              <Pie
                data={data}
                dataKey='value'
                nameKey='label'
                legendType='circle'
                startAngle={90}
                endAngle={450}
              >
                { data.map((entry, index) => {
                  return (
                    <Cell
                      key={entry.label}
                      fill={colors[entry.label]}
                    />
                  );
                })}
              </Pie>
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Legend
                align='right'
                iconSize={8}
                layout='vertical'
                verticalAlign='middle'
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default StatusOverview;
