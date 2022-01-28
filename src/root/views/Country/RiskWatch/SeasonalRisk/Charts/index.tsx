import React from 'react';
import {
  addSeparator,
  formattedNormalize,
  Lang,
  isDefined,
  unique,
  listToMap,
  listToGroupList,
  mapToMap,
} from '@togglecorp/fujs';
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

import Container from '#components/Container';
import TextOutput from '#components/TextOutput';
import DateOutput from '#components/DateOutput';
import NumberOutput from '#components/NumberOutput';
import SelectInput from '#components/SelectInput';
import Translate from '#components/Translate';
import languageContext from '#root/languageContext';
import useInputState from '#hooks/useInputState';
import useReduxState from '#hooks/useReduxState';

import {
  getFullMonthNameList,
  avgSafe,
  sum,
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

const chartMargin = {
  top: 20,
  right: 10,
  left: 20,
  bottom: 0,
};


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

  if (fraction) {
    return String(number.toFixed(precision));
  }

  return addSeparator(number) ?? '';
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
  label?: string;
}

function DetailedChart(props: DetailedChartProps) {
  const {
    ipcData,
    label,
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

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
    const groupedData = mapToMap(
      listToGroupList(sortedData, d => d.month),
      d => d,
      // Since we've sorted data in order of priority
      // We should only take first occuring year
      (data) => unique(data, d => d.year),
    );
    // const currentYear = new Date().getFullYear();
    const currentYear = 2021; // NOTE: this will make 2022 data a prediction

    return months.map((m) => {
      const historicData = (groupedData[m] ?? []).filter(d => d.year <= currentYear);
      const prediction = (groupedData[m] ?? []).filter(d => d.year === (currentYear + 1))[0]?.total_displacement;
      const disaggregationByYear = listToMap(
        historicData.map(d => ({ [d.year]: d.total_displacement })),
        d => Object.keys(d)[0],
        d => Object.values(d)[0],
      );

      return {
        month: m,
        average: avgSafe(historicData.map(d => d.total_displacement)),
        prediction,
        ...disaggregationByYear,
      };
    });
  }, [ipcData]);

  return (
    <ResponsiveContainer>
      <LineChart
        data={chartData}
        margin={chartMargin}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="month"
          tickCount={12}
          domain={['dataMin', 'dataMax']}
          tickFormatter={(m: number) => monthNameList[m-1]}
        />
        <YAxis
          tickFormatter={formatNumber}
          label={{
            value: label,
            angle: -90,
            position: 'insideLeft',
          }}
        />
        <Line type="monotone" dataKey="2017" stroke="#a2a5b4" strokeWidth={1} />
        <Line type="monotone" dataKey="2018" stroke="#82879c" strokeWidth={1} />
        <Line type="monotone" dataKey="2019" stroke="#646b84" strokeWidth={1} />
        <Line type="monotone" dataKey="2020" stroke="#464f6d" strokeWidth={1} />
        <Line type="monotone" dataKey="2021" stroke="#273657" strokeWidth={1} />
        <Line type="monotone" dataKey="average" stroke="#011e41" strokeWidth={3} name="Average" />
        <Line type="monotone" dataKey="prediction" stroke="#f04355" strokeWidth={2} name="Prediction" />
        <Tooltip
          isAnimationActive={false}
          formatter={(value: string | number, label: string) => {
            return [formatNumber(+value), label];
          }}
          labelFormatter={(m) => monthNameList[+m-1]}
        />
      </LineChart>
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
  const [riskMetric, setRiskMetric] = useInputState<RiskMetricType>('displacement');
  const hazardIdToNameMap = React.useMemo(() => (
    listToMap(hazardOptions, d => d.value, d => d.label)
  ), [hazardOptions]);

  React.useEffect(() => {
    if (hazardType === 'FI') {
      setRiskMetric('displacement');
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
              disabled={hazardType === 'FI'}
            />
          </div>
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
            label={riskMetricMap[riskMetric]}
            ipcData={ipcData}
          />
        ) : (
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={chartMargin}
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
              <Tooltip
                isAnimationActive={false}
                formatter={(value: string | number, label: string) => {
                  return [formatNumber(+value), hazardIdToNameMap[label]];
                }}
                // labelFormatter={(m) => monthNameList[+m-1]}
              />
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

const ICONSIZE = 20;
interface IconShapeProps {
  dtype: string;
  cx: number;
  cy: number;
}
function IconShape(props: IconShapeProps) {
  const {
    dtype,
    cx,
    cy
  } = props;
  const iconMap: Record<string, string> = {
    Cyclone: cycloneIcon,
    Drought: droughtIcon,
    Flood: floodIcon,
    'Food Insecurity': foodInsecurityIcon,
    'Flash Flood': floodIcon,
  };

  if (!dtype) {
    return null;
  }

  const iconSrc = iconMap[dtype];
  if (!iconSrc) {
    return null;
  }

  return (
    <foreignObject
      width={ICONSIZE}
      height={ICONSIZE}
      x={cx - (ICONSIZE / 2)}
      y={cy - (ICONSIZE / 2)}
    >
      <img
        src={iconSrc}
        style={{
          objectFit: 'contain',
          objectPosition: 'center center',
          width: `${ICONSIZE}px`,
          height: `${ICONSIZE}px`,
        }}
        />
    </foreignObject>
  );
}

function dateToFractionalMonth(date: Date) {
  const m = date.getMonth();
  const d = date.getDate();

  date.setMonth(m + 1);
  date.setDate(0);

  const totalDays = date.getDate();

  const fm = m + d / totalDays;
  return fm;
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
      ...(response?.results.filter(
        (d) => d.countries.findIndex(
          c => c.iso3.toLowerCase() === country?.iso3?.toLowerCase()
        ) !== -1
      ).map((d) => {
        const date = new Date(d.disaster_start_date);

        return {
          dtype: d.dtype.name,
          details: d,
          affected: d.num_affected,
          date,
          month: dateToFractionalMonth(date),
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
          <SelectInput
            className={styles.filterInput}
            value={hazardType}
            onChange={setHazardType}
            name="hazardType"
            options={hazardOptions}
            isClearable
            placeholder="All hazards"
          />
      )}
      sub
      className={styles.pastEventAndHistoricalImpact}
      contentClassName={styles.content}
    >
      <div className={styles.chartContainer}>
        <ResponsiveContainer>
          <ScatterChart
            data={chartData}
            margin={chartMargin}
          >
            <CartesianGrid />
            <Tooltip
              isAnimationActive={false}
              content={(data) => {
                if (!data.active) {
                  return null;
                }

                const details = data.payload?.[0].payload.details as HistoricalData | undefined;
                if (!details) {
                  return null;
                }

                const requested = sum(details.appeals.map(d => d.amount_requested), d => d);
                const funded = sum(details.appeals.map(d => d.amount_funded), d => d);
                const coverage = requested === 0 ? undefined : 100 * funded / requested;

                return (
                  <Container
                    sub
                    className={styles.eventDetails}
                    heading={details.name}
                    description={<DateOutput value={details.disaster_start_date} />}
                    descriptionClassName={styles.description}
                    contentClassName={styles.eventDetailContent}
                  >
                    <TextOutput
                      label="People Affected"
                      value={details.num_affected}
                      valueType="number"
                    />
                    <TextOutput
                      label="Funding (CHF)"
                      value={funded}
                      valueType="number"
                    />
                    {isDefined(coverage) && (
                      <TextOutput
                        label="Funding Coverage"
                        value={`${Math.ceil(coverage)}%`}
                      />
                    )}
                  </Container>
                );
              }}
            />
            <XAxis
              type="number"
              dataKey="month"
              domain={[0, 11]}
              interval={0}
              tickCount={12}
              tickFormatter={(m: number) => monthNameList[m]}
              padding={{
                left: 10,
                right: 10,
              }}
            />
            <YAxis
              dataKey="affected"
              label={{
                value: 'People exposed / affected',
                angle: -90,
                position: 'insideLeft',
              }}
              padding={{
                bottom: 10,
                top: 10,
              }}
              tickFormatter={formatNumber}
            />
            <Scatter
              isAnimationActive={false}
              width={20}
              height={20}
              dataKey="affected"
              shape={(arg) => (
                <IconShape
                  dtype={arg?.payload?.dtype}
                  cx={arg.cx}
                  cy={arg.cy}
                />
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