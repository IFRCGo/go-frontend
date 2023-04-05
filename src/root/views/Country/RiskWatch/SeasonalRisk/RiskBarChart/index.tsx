import React from 'react';
import {
  isDefined,
  unique,
  listToMap,
  listToGroupList,
  mapToMap,
} from '@togglecorp/fujs';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  Tooltip,
  ComposedChart,
  Line,
} from 'recharts';
import { scalePow } from 'd3-scale';
import { IoBarChart } from 'react-icons/io5';

import Checkbox from '#components/Checkbox';
import SelectInput from '#components/SelectInput';
import languageContext from '#root/languageContext';
import useInputState from '#hooks/useInputState';

import {
  getFullMonthNameList,
  avgSafe,
} from '#utils/common';
import {
  COLOR_FLOOD,
  COLOR_CYCLONE,
  COLOR_DROUGHT,
  COLOR_FOOD_INSECURITY,
} from '#utils/risk';
import {
  HazardTypes,
  StringValueOption,
} from '#types';

import cycloneIcon from '#utils/risk-icons/cyclone.svg';
import droughtIcon from '#utils/risk-icons/drought.svg';
import floodIcon from '#utils/risk-icons/flood.svg';
import foodInsecurityIcon from '#utils/risk-icons/food-insecurity.svg';

import {
  RiskData,
  IPCData,
  riskMetricOptions,
  Writable,
  riskMetricMap,
  formatNumber,
  chartMargin,
} from '../common';
import ChartLegendItem from '../ChartLegendItem';
import styles from './styles.module.scss';

function FILegendItem({
  label,
  color,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className={styles.fiLegendItem}>
      <div
        style={{ backgroundColor: color }}
        className={styles.circle}
      />
      <div className={styles.label}>
        {label}
      </div>
    </div>
  );
}


type RiskMetricType = (typeof riskMetricOptions)[number]['value'];
const estimationPriorityMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in IPCData['estimation_type']]: number
} = {
  current: 0,
  first_projection: 1,
  second_projection: 2,
};

interface DetailedChartProps {
  ipcData: IPCData[],
  showHistoricalValues: boolean;
}

function DetailedChart(props: DetailedChartProps) {
  const {
    ipcData,
    showHistoricalValues,
  } = props;

  const { strings } = React.useContext(languageContext);

  const monthNameList = React.useMemo(() => (
    (getFullMonthNameList(strings)).map(m => m.substr(0, 3))
  ), [strings]);

  const chartData = React.useMemo(() => {
    const sortedData = [...ipcData].sort(
      (a, b) => (a.year - b.year)
        || (a.month - b.month)
        || ((new Date(b.analysis_date ?? 0).getTime()) - (new Date(a.analysis_date ?? 0).getTime()))
        || ((estimationPriorityMap[a.estimation_type] ?? 0) - (estimationPriorityMap[b.estimation_type] ?? 0))
    );

    const latestAnalysisDate = [...ipcData].sort(
      (a, b) => (new Date(b.analysis_date ?? 0)).getTime() - (new Date(a.analysis_date ?? 0)).getTime(),
    )[0].analysis_date;

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
    const groupedData = mapToMap(
      listToGroupList(sortedData, d => d.month),
      d => d,
      // Since we've sorted data in order of priority
      // We should only take first occuring year
      (data) => unique(data, d => d.year),
    );

    return months.map((m) => {
      const historicData = (groupedData[m] ?? []).filter(d => d.estimation_type === 'current');
      const prediction = (groupedData[m] ?? []).filter(d => d.analysis_date === latestAnalysisDate && d.estimation_type !== 'current');
      const yearDisaggregatedHistoricData = listToMap(
        historicData.map(d => ({ [d.year]: d.total_displacement })),
        d => Object.keys(d)[0],
        d => Object.values(d)[0],
      );

      const yearDisaggregatedPrediction = listToMap(
        prediction.map(d => ({ [`prediction-${d.year}`]: d.total_displacement })),
        d => Object.keys(d)[0],
        d => Object.values(d)[0],
      );

      return {
        month: m,
        average: avgSafe(historicData.map(d => d.total_displacement)),
        ...yearDisaggregatedHistoricData,
        ...yearDisaggregatedPrediction,
      };
    });
  }, [ipcData]);

  const [activeLine, setActiveLine] = React.useState<string | undefined>();

  const getLine = (
    dataKey: string,
    stroke: string,
    label = dataKey,
    inactiveStroke = '#ecf0f5',
    strokeWidth = 2,
  ) => (
    <Line
        type="monotone"
        dataKey={dataKey}
        stroke={(isDefined(activeLine) && activeLine !== dataKey) ? inactiveStroke : stroke}
        strokeWidth={strokeWidth}
        name={label}
        onMouseOver={() => { setActiveLine(dataKey); }}
        onMouseOut={() => { setActiveLine(undefined); }}
        dot={{
          r: strokeWidth + 2,
          onMouseOver: () => { setActiveLine(dataKey); },
          onMouseOut: () => { setActiveLine(undefined); },
        }}
    />
  );

  return (
    <ResponsiveContainer>
      <ComposedChart
        data={chartData}
        margin={chartMargin}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="month"
          tickCount={12}
          domain={['dataMin', 'dataMax']}
          tickFormatter={(m: number) => monthNameList[m - 1]}
          padding={{
            left: 10,
            right: 10,
          }}
        />
        <YAxis
          tickFormatter={formatNumber}
          label={{
            value: 'Number of people in IPC 3 or above',
            angle: -90,
            position: 'insideLeft',
            className: styles.label,
          }}
        />
        <Bar
          dataKey="average"
          name="Average-Bar"
          fill={COLOR_FOOD_INSECURITY}
          opacity={showHistoricalValues ? 0.3 : 0.8}
          barSize={14}
        />
        {showHistoricalValues && (
          <>
            {getLine('2017', '#a2a5b4')}
            {getLine('2018', '#82879c')}
            {getLine('2019', '#646b84')}
            {getLine('2020', '#464f6d')}
            {getLine('2021', '#273657')}
            {getLine('2022', '#101637')}
          </>
        )}

        {getLine('average', '#011e41', 'Average', undefined, 4)}

        {getLine('prediction-2017', '#f04355', 'Prediction (2017)', '#ffdfe7')}
        {getLine('prediction-2018', '#f04355', 'Prediction (2018)', '#ffdfe7')}
        {getLine('prediction-2019', '#f04355', 'Prediction (2019)', '#ffdfe7')}
        {getLine('prediction-2020', '#f04355', 'Prediction (2020)', '#ffdfe7')}
        {getLine('prediction-2021', '#f04355', 'Prediction (2021)', '#ffdfe7')}
        {getLine('prediction-2022', '#f04355', 'Prediction (2022)', '#ffdfe7')}
        {getLine('prediction-2023', '#f04355', 'Prediction (2023)', '#ffdfe7')}

        <Tooltip
          cursorStyle={{ pointerEvents: 'none' }}
          cursor={false}
          filterNull
          isAnimationActive={false}
          formatter={(value: string | number, label: string) => {
            if (label === 'Average-Bar') {
              return [null, null];
            }

            return [formatNumber(+value), label];
          }}
          labelFormatter={(m) => monthNameList[+m - 1]}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}


interface Props {
  riskData: RiskData[];
  hazardOptions: StringValueOption[];
  ipcData: IPCData[];
}

function RiskBarChart(props: Props) {
  const {
    riskData,
    hazardOptions,
    ipcData,
  } = props;

  const { strings } = React.useContext(languageContext);
  const [hazardType, setHazardType] = useInputState<HazardTypes | undefined>(undefined);
  const [riskMetric, setRiskMetric] = useInputState<RiskMetricType>('exposure');
  const [showHistoricalValues, setShowHistoricalValues] = useInputState(false);
  const hazardIdToNameMap = React.useMemo(() => (
    listToMap(hazardOptions, d => d.value, d => d.label)
  ), [hazardOptions]);

  React.useEffect(() => {
    if (hazardType === 'FI') {
      setRiskMetric('exposure');
    }
  }, [hazardType, setRiskMetric]);

  const monthNameList = React.useMemo(() => (
    (getFullMonthNameList(strings)).map(m => m.substr(0, 3))
  ), [strings]);

  const chartData = React.useMemo(() => {
    let maxDisplacement = 0;
    let tempChartData: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in HazardTypes | 'month']?: number | string | null;
    }[] = monthNameList.map((m) => ({
      month: m as string,
    }));

    riskData.forEach((risk) => {
      if (isDefined(hazardType) && risk.hazardType !== hazardType) {
        return;
      }

      const selectedMetric = risk[riskMetric];

      if (selectedMetric?.monthly) {
        selectedMetric.monthly.forEach((value, i) => {
          const chartDataItem = tempChartData[i];
          chartDataItem[risk.hazardType] = value ?? 0;

          if (isDefined(value) && value > maxDisplacement) {
            maxDisplacement = value;
          }
        });
      }
    });

    return tempChartData;
  }, [monthNameList, riskData, hazardType, riskMetric]);

  const [
    hasDr,
    hasTc,
    hasFi,
    hasFl,
  ] = React.useMemo(() => [
    chartData.some((c) => !!c.DR),
    chartData.some((c) => !!c.TC),
    chartData.some((c) => !!c.FI),
    chartData.some((c) => !!c.FL),
  ], [chartData]);

  const scaleCbrt = React.useMemo(
    () => scalePow().exponent(1 / 3).nice(),
    [],
  );

  const isEmpty = !chartData.some(c => {
    const keys = Object.keys(c) as (keyof typeof c)[];
    if (keys.length <= 1) {
      return false;
    }

    return keys.some(k => k !== 'month' && !!c[k]);
  });

  return (
    <div className={styles.riskChart}>
      <div className={styles.filters}>
        <SelectInput
          className={styles.filterInput}
          value={hazardType}
          onChange={setHazardType}
          name="hazardType"
          options={hazardOptions}
          isClearable
          placeholder="All hazards"
        />
        {hazardType !== 'FI' && (
          <SelectInput
            className={styles.filterInput}
            value={riskMetric}
            onChange={setRiskMetric}
            name="riskMetric"
            options={riskMetricOptions as Writable<typeof riskMetricOptions>}
          />
        )}
        {hazardType === 'FI' && (
          <Checkbox
            name="showHistoricalValues"
            value={showHistoricalValues}
            onChange={setShowHistoricalValues}
            label="Show historical values"
          />
        )}
      </div>
      <div className={styles.chartContainer}>
        {hazardType === 'FI' ? (
          <DetailedChart
            showHistoricalValues={showHistoricalValues}
            ipcData={ipcData}
          />
        ) : (
          isEmpty ? (
            <div className={styles.emptyMessage}>
              <IoBarChart className={styles.icon} />
              <div className={styles.text}>
                Not enough data in the selected criteria to show the chart
              </div>
            </div>
          ) : (
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={chartMargin}
                barGap={1}
                barCategoryGap={10}
                barSize={14}
              >
                <Tooltip
                  cursor={{ fill: '#f0f0f0' }}
                  isAnimationActive={false}
                  formatter={(value: string | number, label: string) => {
                    return [formatNumber(+value), hazardIdToNameMap[label]];
                  }}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                />
                <YAxis
                  scale={riskMetric === 'informRiskScore' ? 'linear' : scaleCbrt}
                  type="number"
                  label={{
                    value: riskMetricMap[riskMetric],
                    angle: -90,
                    position: 'insideLeft',
                  }}
                  tickFormatter={formatNumber}
                />
                {hasFl && <Bar dataKey="FL" fill={COLOR_FLOOD} />}
                {hasTc && <Bar dataKey="TC" fill={COLOR_CYCLONE} />}
                {hasDr && <Bar dataKey="DR" fill={COLOR_DROUGHT} />}
                {hasFi && <Bar dataKey="FI" fill={COLOR_FOOD_INSECURITY} />}
              </BarChart>
            </ResponsiveContainer>
          )
        )}
      </div>
      <div className={styles.legend}>
        <div className={styles.heading}>
          Legend
        </div>
        <div className={styles.content}>
          <div className={styles.hazardLegendItems}>
            <ChartLegendItem
              color={COLOR_FLOOD}
              icon={floodIcon}
              label="Floods"
              isActive={!hazardType || hazardType === 'FL'}
            />
            <ChartLegendItem
              color={COLOR_CYCLONE}
              icon={cycloneIcon}
              label="Cyclone"
              isActive={!hazardType || hazardType === 'TC'}
            />
            <ChartLegendItem
              color={COLOR_DROUGHT}
              icon={droughtIcon}
              label="Drought"
              isActive={!hazardType || hazardType === 'DR'}
            />
            <ChartLegendItem
              color={COLOR_FOOD_INSECURITY}
              icon={foodInsecurityIcon}
              label="Food Insecurity"
              isActive={!hazardType || hazardType === 'FI'}
            />
          </div>
          {hazardType === 'FI' && (
            <>
              <div className={styles.separator} />
              <div className={styles.fiLegendItems}>
                <FILegendItem color="#011e41" label="Average" />
                <FILegendItem color="#f04355" label="Prediction" />
                {showHistoricalValues && (
                  <>
                    <FILegendItem color="#a2a5b4" label="2017" />
                    <FILegendItem color="#82879c" label="2018" />
                    <FILegendItem color="#646b84" label="2019" />
                    <FILegendItem color="#464f6d" label="2020" />
                    <FILegendItem color="#273657" label="2021" />
                    <FILegendItem color="#101637" label="2022" />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default RiskBarChart;
