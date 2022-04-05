import React from 'react';
import {
  _cs,
  isDefined,
  addSeparator,
} from '@togglecorp/fujs';
import { RiDownloadLine } from 'react-icons/ri';
import Map, {
  MapContainer,
  MapBounds,
  MapChildContext,
} from '@togglecorp/re-map';
import turfBbox from '@turf/bbox';

import {
  COLOR_RED,
  COLOR_LIGHT_GREY,
  COLOR_BLUE,
  COLOR_ORANGE,
  COLOR_YELLOW,
  defaultMapStyle,
  defaultMapOptions,
} from '#utils/map';
import Container from '#components/Container';
import Button from '#components/Button';
import SelectInput from '#components/SelectInput';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import {
  Country,
  StringValueOption,
  HazardTypes,
} from '#types';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';

import {
  Writable,
  RiskData,
  riskMetricOptions,
} from '../common';
import MonthSelector from './MonthSelector';
import styles from './styles.module.scss';

type RiskMetricType = (typeof riskMetricOptions)[number]['value'];
interface THReport {
  id: number;
  country: number;
  country_details: {
    id: number;
    name: string;
    iso3: string;
    iso: string;
  }
  hazard_level: 'low' | 'medium' | 'high';
  hazard_level_display: string;
  hazard_type: HazardTypes;
  hazard_type_display: string;
  information: string;
}

const hazardLevelToStyleMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in THReport['hazard_level']]: string;
} = {
  low: styles.low,
  medium: styles.medium,
  high: styles.high,
};


const DISPLACEMENT_LOW = 100;
const DISPLACEMENT_MEDIUM = 1000;
const DISPLACEMENT_HIGH = 10000;

const EXPOSURE_LOW = 100;
const EXPOSURE_MEDIUM = 1000;
const EXPOSURE_HIGH = 10000;

const INFORM_RISK_LOW = 2;
const INFORM_RISK_MEDIUM = 3.5;
const INFORM_RISK_HIGH = 5;

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem(props: LegendItemProps) {
  const {
    color,
    label,
  } = props;

  return (
    <div className={styles.legendItem}>
      <div
        className={styles.symbol}
        style={{ backgroundColor: color }}
      />
      <div className={styles.label}>
        { label }
      </div>
    </div>
  );
}

const displacementLegendData = [
  {
    color: COLOR_BLUE,
    label: `Less than ${addSeparator(DISPLACEMENT_LOW)}`
  },
  {
    color: COLOR_YELLOW,
    label: `${addSeparator(DISPLACEMENT_LOW)} to ${addSeparator(DISPLACEMENT_MEDIUM)}`
  },
  {
    color: COLOR_ORANGE,
    label: `${addSeparator(DISPLACEMENT_MEDIUM)} to ${addSeparator(DISPLACEMENT_HIGH)}`
  },
  {
    color: COLOR_RED,
    label: `More than ${addSeparator(DISPLACEMENT_HIGH)}`
  },
];

const exposureLegendData = [
  {
    color: COLOR_BLUE,
    label: `Less than ${addSeparator(EXPOSURE_LOW)}`,
  },
  {
    color: COLOR_YELLOW,
    label: `${addSeparator(EXPOSURE_LOW)} to ${addSeparator(EXPOSURE_MEDIUM)}`,
  },
  {
    color: COLOR_ORANGE,
    label: `${addSeparator(EXPOSURE_MEDIUM)} to ${addSeparator(EXPOSURE_HIGH)}`,
  },
  {
    color: COLOR_RED,
    label: `More than ${addSeparator(EXPOSURE_HIGH)}`,
  },
];

const informLegendData = [
  {
    color: COLOR_YELLOW,
    label: `${INFORM_RISK_LOW} to ${INFORM_RISK_MEDIUM}`,
  },
  {
    color: COLOR_ORANGE,
    label: `${INFORM_RISK_MEDIUM} to ${INFORM_RISK_HIGH}`,
  },
  {
    color: COLOR_RED,
    label: `More than ${INFORM_RISK_HIGH}`,
  },
];


interface MapLegendProps {
  selectedRiskMetric: (typeof riskMetricOptions)[number]['value'];
}

function MapLegend(props: MapLegendProps) {
  const { selectedRiskMetric } = props;
  const legendData = React.useMemo(() => {
    if (selectedRiskMetric === 'displacement') {
      return displacementLegendData;
    }

    if (selectedRiskMetric === 'exposure') {
      return exposureLegendData;
    }

    if (selectedRiskMetric === 'informRiskScore') {
      return informLegendData;
    }

    return [];
  }, [selectedRiskMetric]);

  return (
    <div className={styles.mapLegend}>
      {legendData.map((d) => (
        <LegendItem
          key={d.label}
          color={d.color}
          label={d.label}
        />
      ))}
    </div>
  );
}

interface ChoroplethProps {
  country: Country;
  riskData: RiskData[];
  selectedHazard: HazardTypes;
  selectedMonth: number;
  selectedRiskMetric: (typeof riskMetricOptions)[number]['value'];
}

function Choropleth(props: ChoroplethProps) {
  const {
    country,
    riskData,
    selectedHazard,
    selectedMonth,
    selectedRiskMetric,
  } = props;

  const mc = React.useContext(MapChildContext);

  if (selectedRiskMetric === 'displacement') {
    const riskForSelectedHazard = riskData?.find(r => r.hazardType === selectedHazard);
    if (!riskForSelectedHazard) {
      if (mc?.map && mc.map.isStyleLoaded()) {
        mc.map.setPaintProperty(
          'admin-0',
          'fill-color',
          COLOR_LIGHT_GREY,
        );
      }

      return null;
    }

    const displacement = riskForSelectedHazard?.displacement?.monthly?.[selectedMonth];
    let color = COLOR_LIGHT_GREY;

    if (isDefined(displacement)) {
      if (displacement > 0) {
        color = COLOR_BLUE;
      }

      if (displacement > DISPLACEMENT_LOW) {
        color = COLOR_YELLOW;
      }

      if (displacement > DISPLACEMENT_MEDIUM) {
        color = COLOR_ORANGE;
      }

      if (displacement > DISPLACEMENT_HIGH) {
        color = COLOR_RED;
      }
    }

    if (mc?.map && mc.map.isStyleLoaded()) {
      const colorProperty = [
        'match',
        ['get', 'iso3'],
        country.iso3,
        color,
        COLOR_LIGHT_GREY,
      ];

      mc.map.setPaintProperty(
        'admin-0',
        'fill-color',
        colorProperty,
      );
    }
  }

  if (selectedRiskMetric === 'exposure') {
    const riskForSelectedHazard = riskData?.find(r => r.hazardType === selectedHazard);
    if (!riskForSelectedHazard) {
      if (mc?.map && mc.map.isStyleLoaded()) {
        mc.map.setPaintProperty(
          'admin-0',
          'fill-color',
          COLOR_LIGHT_GREY,
        );
      }

      return null;
    }

    const exposure = riskForSelectedHazard?.exposure?.monthly?.[selectedMonth];
    let color = COLOR_LIGHT_GREY;

    if (isDefined(exposure)) {
      if (exposure > 0) {
        color = COLOR_BLUE;
      }

      if (exposure > EXPOSURE_LOW) {
        color = COLOR_YELLOW;
      }

      if (exposure > EXPOSURE_MEDIUM) {
        color = COLOR_ORANGE;
      }

      if (exposure > EXPOSURE_HIGH) {
        color = COLOR_RED;
      }
    }

    if (mc?.map && mc.map.isStyleLoaded()) {
      const colorProperty = [
        'match',
        ['get', 'iso3'],
        country.iso3,
        color,
        COLOR_LIGHT_GREY,
      ];

      mc.map.setPaintProperty(
        'admin-0',
        'fill-color',
        colorProperty,
      );
    }
  }

  if (selectedRiskMetric === 'informRiskScore') {
    const riskForSelectedHazard = riskData?.find(r => r.hazardType === selectedHazard);
    const riskScore = riskForSelectedHazard?.informRiskScore?.monthly?.[selectedMonth];
    let color = COLOR_LIGHT_GREY;
    if (isDefined(riskScore)) {
      if (riskScore >= INFORM_RISK_LOW) {
        color = COLOR_YELLOW;
      }

      if (riskScore >= INFORM_RISK_MEDIUM) {
        color = COLOR_ORANGE;
      }

      if (riskScore >= INFORM_RISK_HIGH) {
        color = COLOR_RED;
      }
    }

    if (mc?.map && mc.map.isStyleLoaded()) {
      const colorProperty = [
        'match',
        ['get', 'iso3'],
        country.iso3,
        color,
        COLOR_LIGHT_GREY,
      ];

      mc.map.setPaintProperty(
        'admin-0',
        'fill-color',
        colorProperty,
      );
    }
  }

  return null;
}

interface Props {
  className?: string;
  countryId?: number;
  hazardOptions: StringValueOption[];
  riskData: RiskData[];
  selectedMonth: number;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
}

function SeasonalRiskMap(props: Props) {
  const {
    className,
    countryId,
    hazardOptions,
    riskData,
    selectedMonth,
    setSelectedMonth,
  } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);
  const countryBounds = turfBbox(country?.bbox ?? []);

  const [hazardType, setHazardType] = useInputState<HazardTypes>('FL');
  const [riskMetric, setRiskMetric] = useInputState<RiskMetricType>('displacement');

  const { response: thReport } = useRequest<ListResponse<THReport>>({
    skip: !country?.iso3,
    url: 'https://CHANGE-ME-WHEN-USED/api/v1/hazard_info/',
    query: { iso3: country?.iso3?.toLowerCase() },
  });

  return (
    <>
      <Container
        className={_cs(styles.seasonalRiskMap, className)}
        heading="Risk map"
        descriptionClassName={styles.filterSection}
        description={(
          <>
            <div className={styles.filters}>
              <SelectInput
                className={styles.filterInput}
                value={hazardType}
                onChange={setHazardType}
                name="hazardType"
                options={hazardOptions}
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
        contentClassName={styles.mapSection}
        sub
      >
        <div className={styles.mapContainer}>
          <Map
            mapStyle={defaultMapStyle}
            mapOptions={defaultMapOptions}
            navControlShown
            navControlPosition="top-right"
          >
            {country && riskData && (
              <Choropleth
                country={country}
                riskData={riskData}
                selectedHazard={hazardType}
                selectedRiskMetric={riskMetric}
                selectedMonth={selectedMonth}
              />
            )}
            <MapContainer className={styles.map} />
            <MapBounds
              // @ts-ignore
              bounds={countryBounds}
            />
          </Map>
          <MapLegend
            selectedRiskMetric={riskMetric}
          />
        </div>
        <Container
          className={styles.report}
          sub
          heading={country?.name}
        >
          {thReport?.results.map((thr) => (
            <div
              key={thr.id}
              className={styles.hazardDetails}
            >
              <div className={styles.heading}>
                <div className={styles.hazard}>
                  {thr.hazard_type_display}
                </div>
                <div className={_cs(styles.level, hazardLevelToStyleMap[thr.hazard_level])}>
                  {thr.hazard_level_display}
                </div>
              </div>
              {hazardType === thr.hazard_type && (
                <div className={styles.information}>
                  {thr.information}
                </div>
              )}
            </div>
          ))}
        </Container>
        <MonthSelector
          name={undefined}
          value={selectedMonth}
          onChange={setSelectedMonth}
          className={styles.monthSelector}
        />
      </Container>
    </>
  );
}

export default SeasonalRiskMap;
