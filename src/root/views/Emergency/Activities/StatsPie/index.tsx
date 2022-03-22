import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
} from 'recharts';
import { sumSafe } from '#utils/common';

import styles from './styles.module.scss';

// FIXME: use from common
const colors = [
  '#011e41',
  '#39486c',
  '#6b789b',
  '#a0abcc',
];

interface Props {
  data: { title: string, count: number }[],
  title: React.ReactNode
  className?: string;
}

function ProjectStatPieChart(props: Props) {
  const {
    title,
    data,
    className,
  } = props;

  const renderData = React.useMemo(() => {
    const sorted = [...data].sort((a, b) => b.count - a.count);
    const MAX_ITEMS = 4;

    if (sorted.length <= MAX_ITEMS) {
      return sorted;
    }

    const remains = sorted.splice(MAX_ITEMS - 1, sorted.length - (MAX_ITEMS - 1));
    const otherCount = sumSafe(remains.map(d => d.count));
    if (isDefined(otherCount) && otherCount > 0) {
      sorted.push({
        title: 'Others',
        count: otherCount,
      });
    }

    return sorted;
  }, [data]);

  return (
    <div className={_cs(styles.projectStatPieChart, className)}>
      <div className={styles.title}>
        { title }
      </div>
      <ResponsiveContainer width='100%' height={120}>
        <PieChart>
          <Pie
            data={renderData}
            dataKey="count"
            nameKey="title"
            legendType="circle"
            startAngle={450}
            endAngle={90}
            cx={40}
          >
            { data.map((entry, i) => {
              return (
                <Cell
                  key={entry.title}
                  fill={colors[i%colors.length]}
                />
              );
            })}
          </Pie>
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Legend
            layout="vertical"
            width={120}
            align="right"
            verticalAlign="middle"
            iconSize={8}
            margin={{top: 0,right:0, bottom: 0, left: 0}}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProjectStatPieChart;
