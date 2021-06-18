import React from 'react';
import {
  Cell,
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import Card from '#components/Card';
import { sum } from '#utils/common';

import styles from './styles.module.scss';

interface PieChartData {
  key: number,
  name: string,
  value: number,
}

const PIE_COLORS = ['#f64752', '#fa999f', '#f87079'];

interface PieChartProps {
  data: PieChartData[],
  heading: string,
  className?: string;
}

function ThreeWPieChart(props: PieChartProps) {
  const {
    data = [],
    className,
  } = props;

  const total = sum(data, d => d.value) ?? 0;

  return (
    <Card
      className={className}
      title={props.heading}
    >
      <ResponsiveContainer
        className={styles.chartContainer}
      >
        <PieChart
          margin={{
            right: 50,
            bottom: 30,
            left: 30,
            top: 30,
          }}
        >
          <Pie
            data={data}
            dataKey="value"
            labelLine={false}
          >
            { data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
              />
            ))}
            <LabelList
              className={styles.pieLabel}
              position="outside"
              formatter={(v: number) => `${((100 * (v / total))).toFixed(1)}%`}
            />
          </Pie>
          <Legend
            iconType="circle"
            iconSize={10}
            verticalAlign="middle"
            align="right"
            layout="vertical"
            wrapperStyle={{
              right: 10,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

function CustomYAxisTick (props: {
  y: number;
  payload: unknown;
}) {
  const { y, payload } = props;
  const { value } = payload as { value: number };

  return (
    <g transform={`translate(${0},${y})`}>
      <text
        x={0}
        y={0}
        textAnchor="start"
        className={styles.tick}
      >
        {value}
      </text>
    </g>
  );
}

interface BarChartData {
  key: number | string;
  name: string;
  value: number;
}

interface BarChartProps {
  data: BarChartData[],
  heading: string,
  className?: string;
}

function ThreeWBarChart(props: BarChartProps) {
  const {
    data,
    className,
  } = props;

  const chartData = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return data
    .sort((a, b) => b.value - a.value)
    .splice(0, 5); // Only show top 5
  }, [data]);

  return (
    <Card
      title={props.heading}
      className={className}
    >
      <ResponsiveContainer className={styles.chartContainer}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            bottom: 10,
            left: 10,
          }}
          barSize={10}
          barCategoryGap={2}
        >
          <XAxis type="number" hide={true} />
          <YAxis
            interval={0}
            dataKey="name"
            type="category"
            scale="band"
            axisLine={false}
            width={160}
            tick={CustomYAxisTick}
          />
          <Tooltip />
          <Bar
            radius={5}
            dataKey="value"
            fill="#f5333f"
          >
            <LabelList
              className={styles.barLabel}
              dataKey="value"
              position="right"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export { ThreeWPieChart, ThreeWBarChart };
