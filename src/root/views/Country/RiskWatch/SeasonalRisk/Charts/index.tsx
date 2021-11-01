import React from 'react';
import {
  addSeparator,
  formattedNormalize,
  Lang,
  isNotDefined,
  isDefined,
  unique,
  listToMap,
  listToGroupList,
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
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import { scalePow } from 'd3-scale';

import Button from '#components/Button';
import Container from '#components/Container';
import NumberOutput from '#components/NumberOutput';
import SelectInput from '#components/SelectInput';
import Translate from '#components/Translate';
import languageContext from '#root/languageContext';
import useInputState from '#hooks/useInputState';
import useReduxState from '#hooks/useReduxState';

import {
  getFullMonthNameList,
  avg,
} from '#utils/common';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import {
  HazardTypes,
  StringValueOption,
} from '#types';

import cycloneIcon from '../../icons/cyclone.svg';
import droughtIcon from '../../icons/drought.svg';
import floodIcon from '../../icons/flood.svg';
import foodInsecurityIcon from '../../icons/food-insecurity.svg';

import {
  RiskData,
  IPCData,
  riskMetricOptions,
  Writable,
  riskMetricMap,
} from '../common';
import styles from './styles.module.scss';

function formatNumber (value: number) {
  const {
    number,
    normalizeSuffix,
  } = formattedNormalize(value, Lang.en);

  const integer = Math.floor(number);
  const fraction = number - integer;

  let precision = 2;
  const absoluteValue = Math.abs(number);
  if (absoluteValue < 1) {
    precision = Math.ceil(-Math.log10(absoluteValue)) + 1;
  }

  if (integer > 100) {
    // 140.1234M -> 140 M
    precision = 0;
  } else {
    // 96.0334M -> 96.03 M
    if (fraction > 0.01) {
      precision = 2;
    } else {
      precision = 0;
    }
  }

  if (normalizeSuffix) {
    return `${number.toFixed(precision)} ${normalizeSuffix}`;
  }

  return addSeparator(number) ?? '';
}

function IconShape({
  type,
  x,
  y,
  h,
  value,
}: {
  type: 'cyclone' | 'drought' | 'flood' | 'foodInsecurity';
  x: number;
  y: number;
  h: number;
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
      y={Math.max(0, Math.min(y, h-20))}
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

function avgSafe(list: (number|undefined|null)[]) {
  const listSafe = list.filter((i) => isDefined(i) && !Number.isNaN(i)) as number[];
  return avg(listSafe, d => d);
}


interface DetailedChartProps {
  ipcData: IPCData[],
}

function DetailedChart(props: DetailedChartProps) {
  const { ipcData } = props;
  const { strings } = React.useContext(languageContext);

  const monthNameList = React.useMemo(() => (
    (getFullMonthNameList(strings)).map(m => m.substr(0, 3))
  ), [strings]);

  const chartData = React.useMemo(() => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
    const groupedData = listToGroupList(ipcData, d => d.month);
    const currentYear = new Date().getFullYear();

    return months.map((m) => {
      const historicData = (groupedData[m] ?? []).filter(d => d.year <= currentYear);
      const prediction = (groupedData[m] ?? []).filter(d => d.year === (currentYear + 1))[0]?.total_displacement;
      const disByYear = listToMap(
        historicData.map(d => ({ [d.year]: d.total_displacement })),
        d => Object.keys(d)[0],
        d => Object.values(d)[0],
      );

      return {
        month: m,
        average: avgSafe(historicData.map(d => d.total_displacement)),
        prediction,
        ...disByYear,
      };
    });
  }, [ipcData]);

  return (
    <ResponsiveContainer>
      <LineChart
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
          type="number"
          dataKey="month"
          tickCount={12}
          domain={['dataMin', 'dataMax']}
          tickFormatter={(m: number) => monthNameList[m-1]}
        />
        <YAxis tickFormatter={formatNumber} />
        <Line type="monotone" dataKey="2017" stroke="#a2a5b4" strokeWidth={1} />
        <Line type="monotone" dataKey="2018" stroke="#82879c" strokeWidth={1} />
        <Line type="monotone" dataKey="2019" stroke="#646b84" strokeWidth={1} />
        <Line type="monotone" dataKey="2020" stroke="#464f6d" strokeWidth={1} />
        <Line type="monotone" dataKey="2021" stroke="#273657" strokeWidth={1} />
        <Line type="monotone" dataKey="average" stroke="#011e41" strokeWidth={3} name="Average" />
        <Line type="monotone" dataKey="prediction" stroke="#f04355" strokeWidth={2} name="Prediction" />
        <Tooltip
          formatter={(value: string | number, label: string) => {
            return [formatNumber(+value), label];
          }}
          labelFormatter={(m) => monthNameList[+m-1]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

type RiskMetricType = (typeof riskMetricOptions)[number]['value'];

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
  const [riskMetric, setRiskMetric] = useInputState<RiskMetricType>('displacement');

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
              options={hazardOptions}
              isClearable
            />
            <SelectInput
              className={styles.filterInput}
              value={riskMetric}
              onChange={setRiskMetric}
              name="riskMetric"
              options={riskMetricOptions as Writable<typeof riskMetricOptions>}
            />
          </div>
          <Button
            name={undefined}
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
        {hazardType === 'FI' ? (
          <DetailedChart
            ipcData={ipcData}
          />
        ) : (
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
                  value: riskMetricMap[riskMetric],
                  angle: -90,
                  position: 'insideLeft',
                }}
                tickFormatter={formatNumber}
              />
              <Area type="step" dataKey="FI" stroke="#ffab8e" fill="#ffab8e" />
              <Area type="step" dataKey="DR" stroke="#b09db2" fill="#b09db2" />
              <Area type="step" dataKey="CY" stroke="#c8ccb7" fill="#c8ccb7" />
              <Area type="step" dataKey="FL" stroke="#85d1ee" fill="#85d1ee" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <Container
        className={styles.legend}
        headingSize="small"
        heading={hazardType === 'FI' ? 'Legend' : 'Hazard Type'}
        sub
      >
        {hazardType === 'FI' ? (
          <>
            <FILegendItem color="#a2a5b4" label="2017" />
            <FILegendItem color="#82879c" label="2018" />
            <FILegendItem color="#646b84" label="2019" />
            <FILegendItem color="#464f6d" label="2020" />
            <FILegendItem color="#273657" label="2021" />
            <FILegendItem color="#011e41" label="Average" />
            <FILegendItem color="#f04355" label="Prediction" />
          </>
        ) : (
          <>
            <LegendItem
              icon={floodIcon}
              label="Floods"
            />
            <LegendItem
              icon={cycloneIcon}
              label="Cyclone"
            />
            <LegendItem
              icon={droughtIcon}
              label="Drought"
            />
            <LegendItem
              icon={foodInsecurityIcon}
              label="Food Insecurity"
            />
          </>
        )}
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

interface ImpactChartProps {
  countryId: number;
}

function ImpactChart(props: ImpactChartProps) {
  const { strings } = React.useContext(languageContext);
  const [hazardType, setHazardType] = useInputState<number | undefined>(undefined);

  const { countryId } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);

  const monthNameList = React.useMemo(() => (
    getFullMonthNameList(strings).map(m => m.substr(0, 3))
  ), [strings]);

  const { response } = useRequest<ListResponse<HistoricalData>>({
    url: 'api/v2/go-historical/',
    query: { iso3: country?.iso3 },
  });

  const [
    chartData,
    hazardOptions,
  ] = React.useMemo(() => {
    const options = unique(
      response?.results.filter(
        (d) => d.countries.findIndex(
          c => c.iso3.toLowerCase() === country?.iso3?.toLowerCase()
        ) !== -1
      ).map((d) => ({
        label: d.dtype.name,
        value: d.dtype.id,
      })) ?? [],
      d => d.value,
    );

    const monthOrderMap = listToMap(
      monthNameList,
      d => d,
      (_, __, i) => i,
    );

    const data = [
      ...monthNameList.map((m) => ({
        month: m,
      })),
      ...(response?.results.filter(
        (d) => d.countries.findIndex(
          c => c.iso3.toLowerCase() === country?.iso3?.toLowerCase()
        ) !== -1
      ).map((d) => {
        const date = new Date(d.disaster_start_date);

        return {
          [d.dtype.name]: d.num_affected,
          date,
          month: monthNameList[date.getMonth()],
        };
      }) ?? []),
    ].sort((a, b) => (+monthOrderMap[a.month]) - (+monthOrderMap[b.month]));

    return [
      data,
      options,
    ];
  }, [response, monthNameList, country]);

  return (
    <Container
      heading={(
        <Translate stringId='riskModulePastAndHistoricEvent' />
      )}
      descriptionClassName={styles.containerDescription}
      description={(
        <>
          <div className={styles.filters}>
            <SelectInput
              disabled
              className={styles.filterInput}
              value={hazardType}
              onChange={setHazardType}
              name="hazardType"
              options={hazardOptions}
              isClearable
            />
          </div>
          <Button
            name={undefined}
            icons={<RiDownloadLine />}
            variant="secondary"
            disabled
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
            <Tooltip
              isAnimationActive={false}
            />
            <XAxis
              type="category"
              dataKey="month"
              allowDuplicatedCategory={false}
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
              isAnimationActive={false}
              dataKey="Cyclone"
              shape={(arg) => (
                <IconShape type="cyclone" h={arg.yAxis.height} x={arg.x} y={arg.y} value={arg.Cyclone} />
              )}
            />
            <Scatter
              isAnimationActive={false}
              dataKey="Flood"
              shape={(arg) => (
                <IconShape type="flood" h={arg.yAxis.height} x={arg.x} y={arg.y} value={arg.Flood} />
              )}
            />
            <Scatter
              isAnimationActive={false}
              dataKey="Drought"
              shape={(arg) => (
                <IconShape type="drought" h={arg.yAxis.height} x={arg.x} y={arg.y} value={arg.Drought} />
              )}
            />
            <Scatter
              isAnimationActive={false}
              dataKey="Food Insecurity"
              shape={(arg) => (
                <IconShape type="foodInsecurity" h={arg.yAxis.height} x={arg.x} y={arg.y} value={arg['Food Insecurity']} />
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
