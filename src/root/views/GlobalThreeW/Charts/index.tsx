import React from 'react';
import { Cell, Bar, Pie, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts';

import styles from './styles.module.scss';

interface ChartData {
  key: number,
  name: string,
  value: number,
}

interface Data {
  data: any[],
  heading: string,
}

function GoPieChart(props: Data) {
  const [data, setData] = React.useState<ChartData[]>([]);

  React.useEffect(() => {
    if (props.data) {
      const dataArr = props.data.map((datum: any) => {
        return { key: datum["programme_type"], name: datum["programme_type_display"], value: datum["count"] };
      });
      setData(dataArr);
    }
  }, [props]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <>
      <h2>{props.heading}</h2>
      <PieChart width={400} height={400}>
        <Pie data={data} dataKey="value" cx={200} cy={200} outerRadius={90} fill="#82ca9d" label>
          {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Legend verticalAlign="top" height={36} />
      </PieChart>
    </>
  );
}

function GoBarChart(props: Data) {

  const [data, setData] = React.useState<ChartData[]>([]);

  React.useEffect(() => {
    if (props.data && props.data.length > 0) {
      const keys = Object.keys(props.data[0]);
      const dataArr = props.data.map((datum: any) => {
        return { key: datum[keys[0]], name: datum[keys[1]], value: datum["count"] };
      });
      setData(dataArr);
    }
  }, [props]);

  return (
    <>
      <h2>{props.heading}</h2>
      <ComposedChart
        layout="vertical"
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
        barCategoryGap={2}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" hide={true} />
        <YAxis dataKey="name" type="category" scale="band" />
        <Tooltip />
        <Bar barSize={20}
          dataKey="value"
          fontSize={12}
          fill={"#0088FE"}
        />
      </ComposedChart>
    </>
  );
}

export { GoPieChart, GoBarChart };
