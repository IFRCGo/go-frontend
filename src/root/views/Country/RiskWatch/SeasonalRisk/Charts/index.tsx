import React from 'react';
import {
  addSeparator,
  formattedNormalize,
  Lang,
  isNotDefined,
  isDefined,
} from '@togglecorp/fujs';
import { RiDownloadLine } from 'react-icons/ri';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { scalePow } from 'd3-scale';

import Button from '#components/Button';
import Container from '#components/Container';
import NumberOutput from '#components/NumberOutput';
import SelectInput from '#components/SelectInput';
import Translate from '#components/Translate';
import languageContext from '#root/languageContext';
import useInputState from '#hooks/useInputState';

import { getFullMonthNameList } from '#utils/utils';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import { HazardTypes } from '#types';

import cycloneIcon from '../cyclone.svg';
import droughtIcon from '../drought.svg';
import floodIcon from '../flood.svg';
import foodInsecurityIcon from '../food-insecurity.svg';

import {
  hazardTypeOptions,
  HazardValueType,
  Writeable,
  RiskData,
} from '../common';
import styles from './styles.module.scss';


function IconShape({
  type,
  x,
  y,
  value,
}: {
  type: 'cyclone' | 'drought' | 'flood' | 'foodInsecurity';
  x: number;
  y: number;
  value: number;
}) {
  if (isNotDefined(value)) {
    return null;
  }

  const iconMap = {
    cyclone: cycloneIcon,
    drought: droughtIcon,
    flood: floodIcon,
    foodInsecurity: foodInsecurityIcon,
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={20}
      height={20}
    >
      <img
        width={16}
        height={16}
        src={iconMap[type]}
      />
    </foreignObject>
  );
}

interface LegendItemProps {
  icon: string;
  label: React.ReactNode;
  value?: number;
}

function LegendItem(props: LegendItemProps) {
  const {
    icon,
    label,
    value,
  } = props;

  return (
    <div className={styles.legendItem}>
      <img className={styles.icon} src={icon} />
      <div className={styles.label}>
        {label}
      </div>
      {isDefined(value) && (
        <NumberOutput value={value} normal />
      )}
    </div>
  );
}

const peopleAffectedData = [
  { date: new Date('2021-01-15').getTime(), hazard: 'CY', cyclone: 25000000 },
  { date: new Date('2021-01-16').getTime(), hazard: 'CY', cyclone: 25000000 },
  { date: new Date('2021-01-20').getTime(), hazard: 'CY', cyclone: 35000000 },
  { date: new Date('2021-02-15').getTime(), hazard: 'CY', cyclone: 25000000 },
  { date: new Date('2021-02-05').getTime(), hazard: 'FL', flood: 5000000 },
  { date: new Date('2021-03-08').getTime(), hazard: 'FL', flood: 5000000 },
  { date: new Date('2021-04-03').getTime(), hazard: 'FL', flood: 5000000 },
  { date: new Date('2021-05-16').getTime(), hazard: 'FL', flood: 5000000 },
  { date: new Date('2021-06-21').getTime(), hazard: 'CY', cyclone: 100000000 },
  { date: new Date('2021-06-09').getTime(), hazard: 'FL', flood: 5000000 },
  { date: new Date('2021-07-14').getTime(), hazard: 'FL', flood: 5000000 },
  { date: new Date('2021-08-15').getTime(), hazard: 'DG', drought: 60000000 },
  { date: new Date('2021-09-18').getTime(), hazard: 'DG', drought: 60000000 },
  { date: new Date('2021-10-11').getTime(), hazard: 'FI', foodInsecurity: 25000000 },
  { date: new Date('2021-10-24').getTime(), hazard: 'FI', foodInsecurity: 25000000 },
];

interface Props {
  riskData: RiskData[];
}

function RiskBarChart(props: Props) {
  const { riskData } = props;
  const { strings } = React.useContext(languageContext);
  const [hazardType, setHazardType] = useInputState<HazardValueType | undefined>(undefined);

  const monthNameList = React.useMemo(() => (
    getFullMonthNameList(strings).map(m => m.substr(0, 3))
  ), [strings]);


  const [
    chartData,
    maxDisplacement,
  ] = React.useMemo(() => {
    let maxDisplacement = 0;
    let tempChartData: {
      [key in HazardTypes | 'month']?: number | string | null;
    }[] = monthNameList.map((m) => ({
      month: m as string,
    }));

    riskData.forEach((risk) => {
      if (risk.displacement?.monthly) {
        risk.displacement.monthly.forEach((displacement, i) => {
          const chartDataItem = tempChartData[i];
          chartDataItem[risk.hazardType] = displacement ?? 0;

          if (isDefined(displacement) && displacement > maxDisplacement) {
            maxDisplacement = displacement;
          }
        });
      }
    });

    return [
      tempChartData,
      maxDisplacement,
    ];
  }, [monthNameList, riskData]);

  const scaleCbrt = React.useMemo(
    () => scalePow().exponent(1/3).nice(),
    [],
  );

  return (
    <Container
      heading="Risk by Month"
      descriptionClassName={styles.containerDescription}
      description={(
        <>
          <div className={styles.filters}>
            <SelectInput
              className={styles.filterInput}
              value={hazardType}
              onChange={setHazardType}
              name="hazardType"
              options={hazardTypeOptions as Writeable<typeof hazardTypeOptions>}
              isClearable
            />
          </div>
          <Button
            icons={<RiDownloadLine />}
            variant="secondary"
            disabled
          >
            Export
          </Button>
        </>
      )}
      sub
      contentClassName={styles.content}
      className={styles.riskByMonth}
    >
      <div
        className={styles.chartContainer}
      >
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 10,
              left: 20,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
            />
            <YAxis
              scale={scaleCbrt}
              type="number"
              label={{
                value: 'People at Risk of Displacement',
                angle: -90,
                position: 'insideLeft',
              }}
              tickFormatter={(value: number) => {
                const {
                  number,
                  normalizeSuffix,
                } = formattedNormalize(value, Lang.en);

                if (normalizeSuffix) {
                  return `${number} ${normalizeSuffix}`;
                }

                return addSeparator(number) ?? '';
              }}
            />
            <Area type="step" dataKey="flood" stroke="#85d1ee" fill="#85d1ee" />
            <Area type="step" dataKey="storm" stroke="#c8ccb7" fill="#c8ccb7" />
            <Area type="step" dataKey="food_insecurity" stroke="#ffab8e" fill="#ffab8e" />
            {/*
            <Area type="step" dataKey="cyclone" stroke="#c8ccb7" fill="#c8ccb7" />
            <Area type="step" dataKey="drought" stroke="#b09db2" fill="#b09db2" />
              */}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <Container
        className={styles.legend}
        headingSize="small"
        heading="Hazard Type"
        sub
      >
        <LegendItem
          icon={cycloneIcon}
          label="Cyclone"
        />
        <LegendItem
          icon={droughtIcon}
          label="Drought"
        />
        <LegendItem
          icon={floodIcon}
          label="Floods"
        />
        <LegendItem
          icon={foodInsecurityIcon}
          label="Food Insecurity"
        />
      </Container>
    </Container>
  );
}

interface HistoricalData {
  appeals: {
    aid: string;
    amount_funded: string;
    amount_requested: string;
    end_date: string;
    id: number;
    num_beneficiaries: number;
    start_date: string;
    status: number;
    status_display: string;
  }[];
  countries: {
    iso: string;
    iso3: string;
    id: number;
  }[];
  created_at: string;
  disaster_start_date: string;
  dtype: {
    id: number;
    name: string;
    summary: string;
  }
  name: string;
  num_affected: number;
}

function ImpactChart() {
  const { strings } = React.useContext(languageContext);
  const [hazardType, setHazardType] = useInputState<HazardValueType | undefined>(undefined);
  // const [riskMetric, setRiskMetric] = useInputState<RiskMetricType>('inform');

  const filteredData = React.useMemo(() => {
    if (!hazardType) {
      return peopleAffectedData;
    }
    return peopleAffectedData.filter(d => d.hazard === hazardType);
  }, [hazardType]);

  const domain = React.useMemo(() => {
    const sortedData = [...filteredData].sort((a, b) => (
      a.date - b.date
    ));

    const start = new Date(sortedData[0].date);
    const end = new Date(sortedData[sortedData.length - 1].date);

    start.setMonth(0);
    start.setDate(1);

    end.setFullYear(end.getFullYear() + 1);
    end.setMonth(0);
    end.setDate(0);

    return [start.getTime(), end.getTime()];
  }, [filteredData]);

  const monthNameList = React.useMemo(() => (
    getFullMonthNameList(strings).map(m => m.substr(0, 3))
  ), [strings]);

  const monthTickFormatter = React.useCallback(
    (timestamp: number) => {
      const monthIndex = new Date(timestamp).getMonth();
      return monthNameList[monthIndex];
    },
    [monthNameList],
  );

  const { response } = useRequest<ListResponse<HistoricalData>>({
    url: 'api/v2/go-historical/',
    // query: { cou
  });

  const chartData = React.useMemo(() => (
    response?.results.map((d) => ({
      [d.dtype.name]: d.num_affected,
      date: new Date(d.disaster_start_date),
    }))
  ), [response]);

  console.info(chartData);

  return (
    <Container
      heading={<Translate stringId='riskModulePastAndHistoricEvent' />}
      descriptionClassName={styles.containerDescription}
      description={(
        <>
          <div className={styles.filters}>
            <SelectInput
              className={styles.filterInput}
              value={hazardType}
              onChange={setHazardType}
              name="hazardType"
              options={hazardTypeOptions as Writeable<typeof hazardTypeOptions>}
              isClearable
            />
          </div>
          <Button
            icons={<RiDownloadLine />}
            variant="secondary"
          >
            Export
          </Button>
        </>
      )}
      sub
      className={styles.pastEventAndHistoricalImpact}
      contentClassName={styles.content}
    >
      <div className={styles.chartContainer}>
        <ResponsiveContainer>
          <ScatterChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              bottom: 10,
              left: 10,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              domain={domain}
              dataKey="date"
              tickCount={12}
              interval={0}
              tickFormatter={monthTickFormatter}
            />
            <YAxis
              label={{
                value: 'People exposed / affected',
                angle: -90,
                position: 'insideLeft',
              }}
              tickFormatter={(value: number) => {
                const {
                  number,
                  normalizeSuffix,
                } = formattedNormalize(value, Lang.en);

                if (normalizeSuffix) {
                  return `${number} ${normalizeSuffix}`;
                }

                return addSeparator(number) ?? '';
              }}
            />
            <Scatter
              dataKey="cyclone"
              shape={(arg) => (
                <IconShape type="cyclone" x={arg.x} y={arg.y} value={arg.Cyclone} />
              )}
            />
            <Scatter
              dataKey="flood"
              shape={(arg) => (
                <IconShape type="flood" x={arg.x} y={arg.y} value={arg.Flood} />
              )}
            />
            <Scatter
              dataKey="drought"
              shape={(arg) => (
                <IconShape type="drought" x={arg.x} y={arg.y} value={arg.Drought} />
              )}
            />
            <Scatter
              dataKey="foodInsecurity"
              shape={(arg) => (
                <IconShape type="foodInsecurity" x={arg.x} y={arg.y} value={arg['Food Insecurity']} />
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <Container
        className={styles.legend}
        headingSize="small"
        heading="Hazard Type"
        sub
      >
        <LegendItem
          icon={cycloneIcon}
          label="Cyclone"
        />
        <LegendItem
          icon={droughtIcon}
          label="Drought"
        />
        <LegendItem
          icon={floodIcon}
          label="Floods"
        />
        <LegendItem
          icon={foodInsecurityIcon}
          label="Food Insecurity"
        />
      </Container>
    </Container>
  );
}


export { RiskBarChart, ImpactChart };
