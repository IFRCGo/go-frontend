import React from 'react';
import {
  _cs,
  isDefined,
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
  Writeable,
  RiskData,
  riskMetricOptions,
} from '../common';
import MonthSelector from './MonthSelector';
import styles from './styles.module.scss';

type RiskMetricType = (typeof riskMetricOptions)[number]['value'];

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

  const c = React.useContext(MapChildContext);
  if (selectedRiskMetric === 'displacement') {
    const riskForSelectedHazard = riskData.find(r => r.hazardType === selectedHazard);
    if (!riskForSelectedHazard) {
      if (c?.map && c.map.isStyleLoaded()) {
        c.map.setPaintProperty(
          'icrc_admin0',
          'fill-color',
          COLOR_LIGHT_GREY,
        );
      }

      return null;
    }

    const displacement = riskForSelectedHazard.displacement.monthly[selectedMonth];
    let color = COLOR_LIGHT_GREY;

    if (isDefined(displacement)) {
      if (displacement > 0) {
        color = COLOR_BLUE;
      }

      if (displacement > 100) {
        color = COLOR_YELLOW;
      }

      if (displacement > 1000) {
        color = COLOR_ORANGE;
      }

      if (displacement > 10000) {
        color = COLOR_RED;
      }
    }

    if (c?.map && c.map.isStyleLoaded()) {
      const opacityProperty = [
        'match',
        ['get', 'ISO3'],
        country.iso3,
        color,
        COLOR_LIGHT_GREY,
      ];

      c.map.setPaintProperty(
        'icrc_admin0',
        'fill-color',
        opacityProperty,
      );
    }
  }

  if (selectedRiskMetric === 'informRiskScore') {
    const riskForSelectedHazard = riskData.find(r => r.hazardType === selectedHazard);
    const riskScore = riskForSelectedHazard?.informRiskScore;
    let color = COLOR_LIGHT_GREY;
    if (isDefined(riskScore)) {
      if (riskScore >= 2) {
        color = COLOR_YELLOW;
      }

      if (riskScore >= 3.5) {
        color = COLOR_ORANGE;
      }

      if (riskScore >= 5) {
        color = COLOR_RED;
      }
    }

    if (c?.map && c.map.isStyleLoaded()) {
      const opacityProperty = [
        'match',
        ['get', 'ISO3'],
        country.iso3,
        color,
        COLOR_LIGHT_GREY,
      ];

      c.map.setPaintProperty(
        'icrc_admin0',
        'fill-color',
        opacityProperty,
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
}

function SeasonalRiskMap(props: Props) {
  const {
    className,
    countryId,
    hazardOptions,
    riskData,
  } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);
  const countryBounds = turfBbox(country?.bbox ?? []);

  const [hazardType, setHazardType] = useInputState<HazardTypes>('flood');
  const [riskMetric, setRiskMetric] = useInputState<RiskMetricType>('displacement');
  const [selectedMonth, setSelectedMonth] = useInputState(0);

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
                options={riskMetricOptions as Writeable<typeof riskMetricOptions>}
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
        contentClassName={styles.mapSection}
        sub
      >
        <div className={styles.leftSection}>
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
          {riskMetric === 'displacement' && (
            <MonthSelector
              name={undefined}
              value={selectedMonth}
              onChange={setSelectedMonth}
              className={styles.monthSelector}
            />
          )}
        </div>
      </Container>
    </>
  );
}

export default SeasonalRiskMap;
