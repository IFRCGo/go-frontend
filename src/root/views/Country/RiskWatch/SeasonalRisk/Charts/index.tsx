import React from 'react';
import styles from './styles.module.scss';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from 'recharts';
import Fold from '#components/fold';
import Translate from '#components/Translate';
import { FilterValue, MonthFilters } from '../Filter';
import ExportProjectsButton from '#components/ExportProjectsButton';
import RawButton from '#components/RawButton';

const data01 = [
  { name: 'Jan', cyclone: 200, flood: 2000, landslide: 300 },
  { name: 'Feb', cyclone: 100, flood: 2600, landslide: 400 },
  { name: 'March', cyclone: 300, flood: 4000, landslide: 500 },
  { name: 'April', cyclone: 250, flood: 2800, landslide: 400 },
  { name: 'May', cyclone: 400, flood: 5000, landslide: 200 },
  { name: 'June', cyclone: 280, flood: 2000, landslide: 500 },
  { name: 'July', cyclone: 280, flood: 2000, landslide: 400 },
  { name: 'Aug', cyclone: 280, flood: 2000, landslide: 100 },
  { name: 'Sep', cyclone: 280, flood: 2000, landslide: 600 },
  { name: 'Oct', cyclone: 280, flood: 2000, landslide: 100 },
  { name: 'Nov', cyclone: 280, flood: 2000, landslide: 300 },
  { name: 'Dec', cyclone: 280, flood: 2000, landslide: 200 },
];

const data03 = [
  {
    name: "Jan",
    uv: 75,
    pv: 75,
    amt: 75
  },
  {
    name: "Feb",
    uv: 75,
    pv: 75,
    amt: 0
  },
  {
    name: "March",
    uv: 0.5,
    pv: 75,
    amt: 100
  },
  {
    name: "April",
    uv: 0.5,
    pv: 0.5,
    amt: 20
  },
  {
    name: "May",
    uv: 80,
    pv: 0.5,
    amt: 0
  },
  {
    name: "June",
    uv: 80,
    pv: 0.5,
    amt: 30
  },
  {
    name: "July",
    uv: 0,
    pv: 0.5,
    amt: 0
  },
  {
    name: "Aug",
    uv: 50,
    pv: 51,
    amt: 0
  },
  {
    name: "Sep",
    uv: 0,
    pv: 0,
    amt: 20
  },
  {
    name: "Oct",
    uv: 51,
    pv: 0,
    amt: 100
  },
  {
    name: "Nov",
    uv: 0,
    pv: 22,
    amt: 100
  },
  {
    name: "Dec",
    uv: 0,
    pv: 25,
    amt: 0
  }
];

function ImpactChart() {
  const [filters, setFilters] = React.useState<FilterValue>({
    reporting_ns: [],
    programme_type: [],
    primary_sector: [],
    secondary_sectors: [],
  });
  return (
    <Fold
      foldWrapperClass='fold--main'
      foldTitleClass='fold__title--inline margin-reset'
      title={
        <Translate stringId='riskModulePastAndHistoricEvent' />
      }
      showHeader={true}
    >
      <div className={styles.riskButton}>
        <div className={styles.filterButton}>
          <MonthFilters
            disabled={false}
            value={filters}
            onChange={setFilters} />
          <RawButton
            name='clear'
            onClick={() => {
              setFilters({
                reporting_ns: [],
                programme_type: [],
                primary_sector: [],
                secondary_sectors: [],
              });
            }}
          >
            Clear Filters
        </RawButton>
        </div>
        <ExportProjectsButton
          fileNameSuffix="All Past Event Impact Table"
        />
      </div>
      <ResponsiveContainer className={styles.chartContainer}>
        <ComposedChart
          width={400}
          height={1000}
          data={data01}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="category" minTickGap={30} dataKey="name" name="months" />
          <YAxis type="number" range={[100, 500]} name="peopleExposed" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="cyclone" fill="#8884d8" shape="star" />
          <Scatter name="flood" fill="#82ca9d" shape="triangle" />
          <Scatter name="landside" fill="#8884d8" shape="circle" />
          <Legend layout="horizontal" verticalAlign="top" align="center" />
        </ComposedChart>
      </ResponsiveContainer>
    </Fold>
  );
}

function RiskBarChart() {
  const [filters, setFilters] = React.useState<FilterValue>({
    reporting_ns: [],
    programme_type: [],
    primary_sector: [],
    secondary_sectors: [],
  });
  return (
    <Fold
      foldWrapperClass='fold--main'
      foldTitleClass='fold__title--inline margin-reset'
      title={
        <Translate stringId='riskModulePastAndHistoricEvent' />
      }
      showHeader={true}
    >
      <div className={styles.riskButton}>
        <div className={styles.filterButton}>
          <MonthFilters
            disabled={false}
            value={filters}
            onChange={setFilters} />
          <RawButton
            name='clear'
            onClick={() => {
              setFilters({
                reporting_ns: [],
                programme_type: [],
                primary_sector: [],
                secondary_sectors: [],
              });
            }}
          >
            Clear Filters
        </RawButton>
        </div>
        <ExportProjectsButton
          fileNameSuffix="All Past Event And Historic Impact Table"
        />
      </div>
      <ResponsiveContainer className={styles.chartContainer}>
        <AreaChart
          width={500}
          height={400}
          data={data03}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="step" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          <Area
            type="step"
            dataKey="pv"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
          <Area
            type="step"
            dataKey="amt"
            stroke="#ffc658"
            fill="#ffc658"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Fold>
  );
}

export { RiskBarChart, ImpactChart };
