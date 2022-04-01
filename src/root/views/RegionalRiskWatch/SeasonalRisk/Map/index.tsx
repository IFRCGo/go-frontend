import React from 'react';
import {
  _cs,
  isDefined,
  addSeparator,
  listToGroupList,
  listToMap,
} from '@togglecorp/fujs';
import {
  IoCaretUp,
  IoCaretDown,
} from 'react-icons/io5';
import Map, {
  MapContainer,
  MapBounds,
  MapChildContext,
} from '@togglecorp/re-map';
import { fixBounds } from '#utils/map';
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
import Pager from '#components/Pager';
import Container from '#components/Container';
import Button from '#components/Button';
import SelectInput from '#components/SelectInput';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import {
  StringValueOption,
  HazardTypes,
} from '#types';

import {
  Writable,
  RiskData,
  riskMetricOptions,
} from '../common';
import RiskTable from '../RiskTable';
import MonthSelector from './MonthSelector';
import styles from './styles.module.scss';

type RiskMetricType = (typeof riskMetricOptions)[number]['value'];

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
    label: `${addSeparator(DISPLACEMENT_LOW+1)} to ${addSeparator(DISPLACEMENT_MEDIUM)}`
  },
  {
    color: COLOR_ORANGE,
    label: `${addSeparator(DISPLACEMENT_MEDIUM+1)} to ${addSeparator(DISPLACEMENT_HIGH)}`
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
    label: `${addSeparator(EXPOSURE_LOW+1)} to ${addSeparator(EXPOSURE_MEDIUM)}`,
  },
  {
    color: COLOR_ORANGE,
    label: `${addSeparator(EXPOSURE_MEDIUM+1)} to ${addSeparator(EXPOSURE_HIGH)}`,
  },
  {
    color: COLOR_RED,
    label: `More than ${addSeparator(EXPOSURE_HIGH)}`,
  },
];

const informLegendData = [
  {
    color: COLOR_YELLOW,
    label: `${INFORM_RISK_LOW} to ${INFORM_RISK_MEDIUM-0.1}`,
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
  riskData: Record<string, RiskData>[];
  selectedHazard: HazardTypes;
  selectedMonth: number;
  selectedRiskMetric: (typeof riskMetricOptions)[number]['value'];
}

function Choropleth(props: ChoroplethProps) {
  const {
    riskData: hazardGroupedRiskData,
    selectedHazard,
    selectedMonth,
    selectedRiskMetric,
  } = props;

  const mc = React.useContext(MapChildContext);

  if (!mc) {
    return null;
  }

  const map = mc.map;

  if (!map || !map.isStyleLoaded()) {
    return null;
  }

  const colorProperty = [
      'match',
      ['get', 'iso3'],
  ];

  hazardGroupedRiskData.forEach((rd) => {
    const countries = Object.keys(rd);
    countries.forEach((co) => {
      const riskData = rd[co];
      if (riskData?.hazardType !== selectedHazard) {
        return;
      }

      const iso3 = co?.toUpperCase();

      if (!iso3) {
        return;
      }

      if (selectedRiskMetric === 'displacement') {
        const displacement = riskData?.displacement?.monthly?.[selectedMonth];
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

        colorProperty.push(iso3);
        colorProperty.push(color);
      }

      if (selectedRiskMetric === 'exposure') {
        const exposure = riskData?.exposure?.monthly?.[selectedMonth];
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

        colorProperty.push(iso3);
        colorProperty.push(color);
      }

      if (selectedRiskMetric === 'informRiskScore') {
        const riskScore = riskData?.informRiskScore?.monthly?.[selectedMonth];
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

        colorProperty.push(iso3);
        colorProperty.push(color);
      }
    });
  });

  colorProperty.push(COLOR_LIGHT_GREY);

  if (colorProperty.length >= 4) {
    map.setPaintProperty(
      'admin-0',
      'fill-color',
      colorProperty,
    );
  }

  return null;
}

const COUNTRY_PER_PAGE = 5;

interface Props {
  className?: string;
  regionId?: number;
  hazardOptions: StringValueOption[];
  riskData: Record<string, RiskData>[];
  selectedMonth: number;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
}

function SeasonalRiskMap(props: Props) {
  const {
    className,
    regionId,
    hazardOptions,
    riskData,
    selectedMonth,
    setSelectedMonth,
  } = props;

  const [activeIso, setActiveIso] = React.useState<string>();
  const [activePage, setActivePage] = React.useState<number>(1);
  const allRegions = useReduxState('allRegions');
  const allCountries = useReduxState('allCountries');
  const region = React.useMemo(() => (
    allRegions?.data.results.find(d => d.id === regionId)
  ), [allRegions, regionId]);
  const regionBounds = React.useMemo(
    () => fixBounds(turfBbox(region?.bbox ?? [])),
    [region?.bbox],
  );

  const countryIsoToNameMap = React.useMemo(
    () => listToMap(allCountries.data.results, d => d.iso3 ?? '', d => d.name),
    [allCountries],
  );

  const [hazardType, setHazardType] = useInputState<HazardTypes>('FL');
  const [riskMetric, setRiskMetric] = useInputState<RiskMetricType>('displacement');

  const countryGroupedRiskData = React.useMemo(() => (
    listToGroupList(
      riskData.reduce((acc, list) => ([
        ...acc,
        ...(Object.values(list)),
      ]), [] as RiskData[]),
      d => d.countryIso3,
      d => d,
    )
  ), [riskData]);

  const countryList = Object.keys(countryGroupedRiskData);
  const visibleCountryList = React.useMemo(() => {
    const start = (activePage - 1) * COUNTRY_PER_PAGE;
    return countryList.slice(start, start + COUNTRY_PER_PAGE);
  }, [countryList, activePage]);

  const handleCountryClick = React.useCallback((iso: string) => {
    setActiveIso((prevIso) => {
      if (prevIso === iso) {
        return undefined;
      }

      return iso;
    });
  }, []);

  return (
    <>
      <Container
        className={_cs(styles.seasonalRiskMap, className)}
        heading="Risk map"
        descriptionClassName={styles.filterSection}
        description={(
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
        )}
        contentClassName={styles.mapSection}
      >
        <div className={styles.mapContainer}>
          <Map
            mapStyle={defaultMapStyle}
            mapOptions={defaultMapOptions}
            navControlShown
            navControlPosition="top-right"
          >
            {region && riskData && (
              <Choropleth
                riskData={riskData}
                selectedHazard={hazardType}
                selectedRiskMetric={riskMetric}
                selectedMonth={selectedMonth}
              />
            )}
            <MapContainer className={styles.map} />
            <MapBounds
              // @ts-ignore
              bounds={regionBounds}
            />
          </Map>
          <MapLegend
            selectedRiskMetric={riskMetric}
          />
          <MonthSelector
            name={undefined}
            value={selectedMonth}
            onChange={setSelectedMonth}
            className={styles.monthSelector}
          />
        </div>
      </Container>
      <Container
        className={styles.countryList}
        footerActions={(
          <Pager
            itemsCount={countryList.length}
            maxItemsPerPage={COUNTRY_PER_PAGE}
            activePage={activePage}
            onActivePageChange={setActivePage}
          />
        )}
        contentClassName={styles.riskTableList}
      >
        {visibleCountryList.map((c) => (
          <div
            key={c}
            className={styles.riskTableItem}
          >
            <Button
              variant="transparent"
              name={c}
              onClick={handleCountryClick}
              className={styles.countryName}
              actions={activeIso === c ? (
                <IoCaretUp className={styles.icon} />
              ) : (
                <IoCaretDown className={styles.icon} />
              )}
            >
              {countryIsoToNameMap[c.toUpperCase()]}
            </Button>
            {activeIso === c && (
              <RiskTable
                key={c}
                selectedMonth={selectedMonth}
                riskData={countryGroupedRiskData[c]}
              />
            )}
          </div>
        ))}
      </Container>
    </>
  );
}

export default SeasonalRiskMap;
