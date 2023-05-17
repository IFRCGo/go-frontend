import React from 'react';
import {
  isDefined,
  unique,
  listToMap,
} from '@togglecorp/fujs';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import Container from '#components/Container';
import TextOutput from '#components/TextOutput';
import DateOutput from '#components/DateOutput';
import SelectInput from '#components/SelectInput';
import Translate from '#components/Translate';
import languageContext from '#root/languageContext';
import useInputState from '#hooks/useInputState';
import useReduxState from '#hooks/useReduxState';

import {
  getFullMonthNameList,
  sum,
} from '#utils/common';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import {
  COLOR_FLOOD,
  COLOR_CYCLONE,
  COLOR_DROUGHT,
  COLOR_FOOD_INSECURITY,
} from '#utils/risk';
import {
  formatNumber,
  chartMargin,
} from '../common';

import cycloneIcon from '#utils/risk-icons/cyclone.svg';
import droughtIcon from '#utils/risk-icons/drought.svg';
import floodIcon from '#utils/risk-icons/flood.svg';
import foodInsecurityIcon from '#utils/risk-icons/food-insecurity.svg';

import ChartLegendItem from '../ChartLegendItem';
import styles from './styles.module.scss';

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

const historicalIconMap: Record<string, string> = {
  Cyclone: cycloneIcon,
  Drought: droughtIcon,
  Flood: floodIcon,
  'Food Insecurity': foodInsecurityIcon,
  'Flash Flood': floodIcon,
};

const historicalHazardTypeToIconMap: {
  [key: string]: string;
} = {
  Cyclone: COLOR_CYCLONE,
  Drought: COLOR_DROUGHT,
  Flood: COLOR_FLOOD,
  'Food Insecurity': COLOR_FOOD_INSECURITY,
  'Flash Flood': COLOR_FLOOD,
};

const SCATTER_ICON_SIZE = 26;
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
  if (!dtype) {
    return null;
  }

  const iconSrc = historicalIconMap[dtype];
  if (!iconSrc) {
    return null;
  }

  return (
    <foreignObject
      width={SCATTER_ICON_SIZE}
      height={SCATTER_ICON_SIZE}
      x={cx - (SCATTER_ICON_SIZE / 2)}
      y={cy - (SCATTER_ICON_SIZE / 2)}
    >
      <div
        style={{
          backgroundColor: historicalHazardTypeToIconMap[dtype],
          borderRadius: '50%',
          width: `${SCATTER_ICON_SIZE}px`,
          height: `${SCATTER_ICON_SIZE}px`,
          padding: '5px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src={iconSrc}
          style={{
            objectFit: 'contain',
            objectPosition: 'center center',
            width: '100%',
            height: '100%',
          }}
        />
      </div>
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

function HistoricalDataChart(props: ImpactChartProps) {
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
    skip: !country?.iso3,
    url: 'api/v2/go-historical/',
    query: { iso3: country?.iso3 },
  });

  const hazardOptions = React.useMemo(() => (
    unique(
      response?.results?.filter(d => d.dtype?.name && !!historicalIconMap[d.dtype?.name])
        .map((d) => ({
          label: d.dtype?.name,
          value: d.dtype?.id,
        })) ?? [],
        d => d.value,
    )
  ), [response]);

  const chartData = React.useMemo(() => {
    const monthOrderMap = listToMap(
      monthNameList,
      d => d,
      (_, __, i) => i,
    );

    const data = [
      ...(response?.results.filter(d => d.dtype && (!hazardType || d.dtype.id === hazardType)).map((d) => {
        const date = new Date(d.disaster_start_date);

        return {
          dtype: d.dtype.name,
          details: d,
          affected: d.num_affected ?? sum(d.appeals, d => d.num_beneficiaries) ?? 0,
          date,
          month: dateToFractionalMonth(date),
        };
      }) ?? []),
    ].sort((a, b) => (+monthOrderMap[a.month]) - (+monthOrderMap[b.month]));

    return data;
  }, [response, monthNameList, hazardType]);

  if (!chartData || chartData.length === 0) {
    return null;
  }


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
      className={styles.historicalDataChart}
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
              cursor={false}
              isAnimationActive={false}
              content={(data) => {
                if (!data.active) {
                  return null;
                }

                const details = data.payload?.[0].payload.details as HistoricalData | undefined;
                if (!details) {
                  return null;
                }

                const affected = details.num_affected ?? sum(details.appeals, d => d.num_beneficiaries);
                const requested = sum(details.appeals, d => (+d.amount_requested));
                const funded = sum(details.appeals, d => +(d.amount_funded));
                const coverage = requested === 0 ? undefined : 100 * funded / requested;

                return (
                  <Container
                    sub
                    className={styles.eventDetails}
                    heading={details.name}
                    description={(
                      <DateOutput
                        format="MMM yyyy"
                        value={details.disaster_start_date}
                      />
                    )}
                    descriptionClassName={styles.description}
                    contentClassName={styles.eventDetailContent}
                  >
                    <TextOutput
                      description="People Affected"
                      value={affected}
                      valueType="number"
                      strongValue
                    />
                    <TextOutput
                      description="Funding (CHF)"
                      value={funded}
                      valueType="number"
                      strongValue
                    />
                    {isDefined(coverage) && (
                      <TextOutput
                        description="Funding Coverage"
                        value={`${Math.ceil(coverage)}%`}
                        strongValue
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
              ticks={[0,1,2,3,4,5,6,7,8,9,10,11]}
              tickFormatter={(m: number) => monthNameList[Math.floor(m)]}
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
              width={SCATTER_ICON_SIZE}
              height={SCATTER_ICON_SIZE}
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
      <div className={styles.impactLegend}>
        <div className={styles.heading}>
          Legend
        </div>
        <div className={styles.separator} />
        <ChartLegendItem
          color={COLOR_FLOOD}
          icon={floodIcon}
          label="Floods"
          isActive
        />
        <ChartLegendItem
          color={COLOR_CYCLONE}
          icon={cycloneIcon}
          label="Cyclone"
          isActive
        />
        <ChartLegendItem
          color={COLOR_DROUGHT}
          icon={droughtIcon}
          label="Drought"
          isActive
        />
        <ChartLegendItem
          color={COLOR_FOOD_INSECURITY}
          icon={foodInsecurityIcon}
          label="Food Insecurity"
          isActive
        />
      </div>
    </Container>
  );
}

export default HistoricalDataChart;
