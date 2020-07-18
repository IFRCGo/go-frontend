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

import FormattedNumber from '#components/formatted-number';
import Translate from '#components/Translate';

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
    <div className={_cs('status-activity box__global', className)}>
      <h4 className='tc-heading margin-reset'>
        <Translate stringId='statusOverviewTotalActivityStatus'/>
      </h4>
      <div className='tc-content'>
        <div className='row flex-mid'>
          <div className='total-activity col col-3-mid'>
            <FormattedNumber
              className='tc-value'
              value={total}
              normalize
              fixedTo={1}
            />
            <div className='tc-label'>
              <Translate stringId='statusOverviewTotalActivity'/>
            </div>
          </div>
          <div className='tc-chart-container col col-9-mid'>
            <ResponsiveContainer width='100%' height={80}>
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
    </div>
  );
}

export default StatusOverview;
