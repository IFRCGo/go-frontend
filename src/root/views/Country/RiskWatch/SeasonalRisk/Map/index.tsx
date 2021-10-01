import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { RiDownloadLine } from 'react-icons/ri';
import Map, {
  MapContainer,
  MapBounds,
  MapChildContext,
} from '@togglecorp/re-map';
import turfBbox from '@turf/bbox';

import { useRequest } from '#utils/restRequest';
import {
  COLOR_RED,
  COLOR_LIGHT_GREY,
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
import { Country } from '#types';

import {
  hazardTypeOptions,
  HazardValueType,
  Writeable,
} from '../common';
import styles from './styles.module.scss';



const riskMetricOptions = [
  { label: 'ThinkHazard', value: 'thinkhazard' },
  { label: 'Inform Risk Score', value: 'inform' },
  { label: 'People Exposed', value: 'exposure' },
  { label: 'People at Risk of Displacement', value: 'displacement' },
] as const;


interface HazardListResponse {
  count: number;
  results: [{
    id: number;
    country_details: {
      country: string;
      country_code: string;
      iso3: string;
    };
    hazard_informations_details: {
      hazard_level_display: string;
      hazard_type_display: string;
      hazard_level: 'HIG' | 'MED' | 'LOW' | 'no-data';
      hazard_type: 'EQ' | 'FL' | 'VA' | 'WF' | 'EH' | 'DG' | 'CY' | 'TS' | 'LS' | 'CF' | 'UF';
    }[];
    country: number;
    hazard_informations: number[];
  }];
}
type HazardLevel = HazardListResponse['results'][number]['hazard_informations_details'][number]['hazard_level'];

const hazardLevelToStyleMap: {
  [key in HazardLevel]: string;
} = {
  HIG: styles.highRisk,
  MED: styles.mediumRisk,
  LOW: styles.lowRisk,
  'no-data': '',
};

const hazardLevelToColorMap: {
  [key in HazardLevel]: string;
} = {
  HIG: COLOR_RED,
  MED: COLOR_ORANGE,
  LOW: COLOR_YELLOW,
  'no-data': COLOR_LIGHT_GREY,
};

type RiskMetricType = (typeof riskMetricOptions)[number]['value'];

interface ChoroplethProps {
  country: Country;
  hazardResponse: HazardListResponse;
  selectedHazard: HazardValueType;
}

function Choropleth(props: ChoroplethProps) {
  const {
    country,
    hazardResponse,
    selectedHazard,
  } = props;

  const c = React.useContext(MapChildContext);

  const hazard = hazardResponse?.results?.[0]?.hazard_informations_details?.find(hi => hi.hazard_type === selectedHazard);

  if (c?.map && c.map.isStyleLoaded()) {
    if (hazard) {
      const opacityProperty = [
        'match',
        ['get', 'ISO3'],
        country.iso3,
        hazardLevelToColorMap[hazard.hazard_level] ?? COLOR_LIGHT_GREY,
        COLOR_LIGHT_GREY,
      ];

      c.map.setPaintProperty(
        'icrc_admin0',
        'fill-color',
        opacityProperty,
      );
    } else {
      c.map.setPaintProperty(
        'icrc_admin0',
        'fill-color',
        COLOR_LIGHT_GREY,
      );
    }
  }
  return null;
}

interface Props {
  className?: string;
  countryId?: number;
}

function SeasonalRiskMap(props: Props) {
  const {
    className,
    countryId,
  } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);
  const countryBounds = turfBbox(country?.bbox ?? []);

  const [hazardType, setHazardType] = useInputState<HazardValueType>('CY');
  const [riskMetric, setRiskMetric] = useInputState<RiskMetricType>('thinkhazard');

  const { response } = useRequest<HazardListResponse>({
    skip: !country,
    url: 'https://risk-module-api.togglecorp.com/api/v1/think-hazard/',
    query: { country_iso3: country?.iso3 },
  });

  return (
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
              options={hazardTypeOptions as Writeable<typeof hazardTypeOptions>}
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
      <Map
        mapStyle={defaultMapStyle}
        mapOptions={defaultMapOptions}
        navControlShown
        navControlPosition="top-right"
      >
        {country && response && (
          <Choropleth
            country={country}
            hazardResponse={response}
            selectedHazard={hazardType}
          />
        )}
        <MapContainer className={styles.map} />
        <MapBounds
          // @ts-ignore
          bounds={countryBounds}
        />
      </Map>
      <Container
        className={styles.sideBar}
        contentClassName={styles.eventList}
        heading={country?.name}
        sub
      >
        {response?.results?.[0].hazard_informations_details?.filter(
          (hazardDetails) => hazardDetails.hazard_type === 'CY' || hazardDetails.hazard_type === 'FL' || hazardDetails.hazard_type === 'DG',
        ).map((hazardDetails) => (
          <div className={_cs(styles.eventDetail, hazardLevelToStyleMap[hazardDetails.hazard_level])}>
            <div className={styles.hazardType}>
              {hazardDetails.hazard_type_display}
            </div>
            <div className={styles.riskLevel}>
              {hazardDetails.hazard_level_display}
            </div>
          </div>
        ))}
      </Container>
    </Container>
  );
}

export default SeasonalRiskMap;
