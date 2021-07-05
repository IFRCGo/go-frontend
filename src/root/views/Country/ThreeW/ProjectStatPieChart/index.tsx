import React from 'react';
import {
  _cs,
} from '@togglecorp/fujs';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
} from 'recharts';

import { LabelValue } from '../common';
import styles from './styles.module.scss';

const colors = ['#f5333f', '#f7969c', '#f9e5e6'];

interface Props {
  data: LabelValue[] ,
  title: React.ReactNode
  className?: string;
}

function ProjectStatPieChart(props: Props) {
  const {
    title,
    data,
    className,
  } = props;

  return (
    <div className={_cs(styles.projectStatPieChart, className)}>
      <div className={styles.title}>
        { title }
      </div>
      <ResponsiveContainer width='100%' height={108}>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            nameKey='label'
            legendType='circle'
            startAngle={450}
            endAngle={90}
          >
            { data.map((entry, i) => {
              return (
                <Cell
                  key={entry.label}
                  fill={colors[i%colors.length]}
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
  );
}

export default ProjectStatPieChart;
