import React from 'react';
import {
  _cs,
  listToMap,
  isDefined,
  unique,
} from '@togglecorp/fujs';
import Map, {
  MapContainer,
  MapSource,
  MapLayer,
  MapTooltip
} from '@togglecorp/re-map';

import Container from '#components/Container';
import MapTooltipContent from '#components/MapTooltipContent';
import TextOutput from '#components/TextOutput';
import useReduxState from '#hooks/useReduxState';
import { Country } from '#types';
import {
  defaultMapStyle,
  defaultMapOptions,
  getPointCirclePaint,
  getPointCircleHaloPaint,
  COLOR_RED,
  COLOR_BLUE,
  COLOR_ORANGE,
} from '#utils/map';
import { max } from '#utils/common';

import { ThreeWBarChart } from '../Charts';
import { NSOngoingProjectStat } from '../common';
import styles from './styles.module.scss';

// TODO:
// 1. DONE: mapboxgl.setRTLTextPlugin()
// 2. map.dragRotate.disable()
// 3. map.touchZoomRotate.disableRotation()
// 4. Hide .mapbox-ctrl .mapbox-ctrl-compass

const OPERATION_TYPE_PROGRAMME = 0;
const OPERATION_TYPE_EMERGENCY = 1;
const OPERATION_TYPE_MULTI = -1;

const pointColorMap: {
  [key: number]: string;
} = {
  [OPERATION_TYPE_EMERGENCY]: COLOR_BLUE,
  [OPERATION_TYPE_PROGRAMME]: COLOR_RED,
  [OPERATION_TYPE_MULTI]: COLOR_ORANGE,
};

const redPointCirclePaint = getPointCirclePaint(COLOR_RED);
const bluePointCirclePaint = getPointCirclePaint(COLOR_BLUE);
const orangePointCirclePaint = getPointCirclePaint(COLOR_ORANGE);
const tooltipOptions: mapboxgl.PopupOptions = {
  closeButton: false,
  offset: 8,
};
const sourceOption: mapboxgl.GeoJSONSourceRaw = {
  type: 'geojson',
};

interface ClickedPoint {
  feature: GeoJSON.Feature<GeoJSON.Point, GeojsonProps>;
  lngLat: mapboxgl.LngLatLike;
}

interface GeojsonProps {
  countryId: number;
  total: number;
}

type NSProjectStatsGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, GeojsonProps>;

function getPointType(projectStat: NSOngoingProjectStat) {
  const {
    operation_types,
    operation_types_display,
  } = projectStat;

  if (operation_types.length === 1) {
    return {
      id: operation_types[0],
      title: operation_types_display[0],
    };
  }

  return {
    id: -1,
    title: 'Multiple types',
  };
}

function getGeoJson(
  countries: Country[],
  nsProjectsMap: Record<number, {
    countryId: number;
    total: number;
    type: {
      id: number;
      title: string;
    };
  }>,
  operationType: number
): NSProjectStatsGeoJson {
  return {
    type: 'FeatureCollection' as const,
    features: countries.map((country) => {
      const nsProject = nsProjectsMap[country.id];
      if (!nsProject || nsProject.type.id !== operationType) {
        return undefined;
      }

      return {
        id: country.id,
        type: 'Feature' as const,
        properties: nsProject,
        geometry: {
          type: 'Point' as const,
          coordinates: country.centroid?.coordinates ?? [0, 0],
        },
      };
    }).filter(isDefined),
  };
}

interface Props {
  className?: string;
  projectList: NSOngoingProjectStat[];
}

function GlobalThreeWMap(props: Props) {
  const {
    className,
    projectList,
  } = props;

  const [
    clickedPointProperties,
    setClickedPointProperties,
  ] = React.useState<ClickedPoint| undefined>();

  const allCountries = useReduxState('allCountries');

  const countries = allCountries?.data?.results;

  const maxProjectCount = React.useMemo(() => (
    max(projectList, d => d.ongoing_projects)
  ), [projectList]);

  const [
    nsProjectsMap,
    legendItems,
  ] = React.useMemo(
    () => ([
      listToMap(
        projectList ?? [],
        item => item.id,
        (item) => ({
          countryId: item.id,
          total: item.ongoing_projects,
          type: getPointType(item),
        }),
      ),
      unique(projectList.map(getPointType), d => d.id),
    ]),
    [projectList],
  );

  const [
    programmesGeo,
    emergencyGeo,
    multiTypeGeo,
  ] = React.useMemo(
    () => ([
      getGeoJson(countries, nsProjectsMap, OPERATION_TYPE_PROGRAMME),
      getGeoJson(countries, nsProjectsMap, OPERATION_TYPE_EMERGENCY),
      getGeoJson(countries, nsProjectsMap, OPERATION_TYPE_MULTI),
    ]),
    [countries, nsProjectsMap],
  );

  const maxScaleValue = Math.min(maxProjectCount ?? 0, 2);

  const [
    redPointHaloCirclePaint,
    bluePointHaloCirclePaint,
    orangePointHaloCirclePaint,
  ] = React.useMemo(
     () => ([
       getPointCircleHaloPaint(COLOR_RED, 'total', maxScaleValue),
       getPointCircleHaloPaint(COLOR_BLUE, 'total', maxScaleValue),
       getPointCircleHaloPaint(COLOR_ORANGE, 'total', maxScaleValue),
     ]),
    [maxScaleValue],
  );

  const selectedNsProjectStats = React.useMemo(
    () => {
      if (!clickedPointProperties) {
        return undefined;
      }
      const item = projectList.find(
        (item) => item.id === clickedPointProperties.feature.id
      );
      if (!item) {
        return undefined;
      }
      // FIXME: we may not need maxScaleValue
      return {
        ...item,
        maxScaleValue: max(item.projects_per_sector, (item) => item.count),
      };
    },
    [clickedPointProperties, projectList],
  );

  const handlePointClick = React.useCallback(
    (feature: mapboxgl.MapboxGeoJSONFeature, lngLat: mapboxgl.LngLat) => {
      setClickedPointProperties({
        feature: feature as unknown as ClickedPoint['feature'],
        lngLat,
      });
      return true;
    },
    [setClickedPointProperties],
  );

  const handlePointClose = React.useCallback(
    () => {
      setClickedPointProperties(undefined);
    },
    [setClickedPointProperties],
  );

  const selectedProjectsPerSectorChartData = React.useMemo(
    () => selectedNsProjectStats?.projects_per_sector.map((p) => ({
      key: p.primary_sector,
      value: p.count,
      name: p.primary_sector_display,
    })) ?? [],
    [selectedNsProjectStats?.projects_per_sector]
  );

  return (
    <Map
      mapStyle={defaultMapStyle}
      mapOptions={defaultMapOptions}
      navControlShown
      navControlPosition="top-right"
      debug={false}
    >
      <MapContainer className={_cs(styles.mapContainer, className)} />
      <div className={styles.legend}>
        {legendItems?.map(d => (
          <div
            key={d.id}
            className={styles.legendItem}
          >
            <div
              className={styles.point}
              style={{
                backgroundColor: pointColorMap[d.id],
              }}
            />
            <div className={styles.label}>
              {d.title}
            </div>
          </div>
        ))}
      </div>
      <MapSource
        sourceKey="programme-points"
        sourceOptions={sourceOption}
        geoJson={programmesGeo}
      >
        <MapLayer
          layerKey="points-halo-circle"
          onClick={handlePointClick}
          layerOptions={{
            type: 'circle',
            paint: redPointHaloCirclePaint,
          }}
        />
        <MapLayer
          layerKey="points-circle"
          layerOptions={{
            type: 'circle',
            paint: redPointCirclePaint,
          }}
        />
      </MapSource>
      <MapSource
        sourceKey="emergency-points"
        sourceOptions={sourceOption}
        geoJson={emergencyGeo}
      >
        <MapLayer
          layerKey="points-halo-circle"
          onClick={handlePointClick}
          layerOptions={{
            type: 'circle',
            paint: bluePointHaloCirclePaint,
          }}
        />
        <MapLayer
          layerKey="points-circle"
          layerOptions={{
            type: 'circle',
            paint: bluePointCirclePaint,
          }}
        />
      </MapSource>
      <MapSource
        sourceKey="multi-points"
        sourceOptions={sourceOption}
        geoJson={multiTypeGeo}
      >
        <MapLayer
          layerKey="points-halo-circle"
          onClick={handlePointClick}
          layerOptions={{
            type: 'circle',
            paint: orangePointHaloCirclePaint,
          }}
        />
        <MapLayer
          layerKey="points-circle"
          layerOptions={{
            type: 'circle',
            paint: orangePointCirclePaint,
          }}
        />
      </MapSource>
      {clickedPointProperties?.lngLat && selectedNsProjectStats && (
        <MapTooltip
          coordinates={clickedPointProperties.lngLat}
          tooltipOptions={tooltipOptions}
          onHide={handlePointClose}
        >
          <MapTooltipContent
            title={selectedNsProjectStats.name}
            href={`/countries/${selectedNsProjectStats.id}/#3w`}
            onCloseButtonClick={handlePointClose}
            className={styles.mapTooltip}
          >
            <div className={styles.meta}>
              <TextOutput
                value={selectedNsProjectStats.ongoing_projects}
                description="Ongoing Projects"
                valueType="number"
                displayType="table"
                strongValue
              />
              <TextOutput
                value={selectedNsProjectStats.target_total}
                description="Targeted Population"
                valueType="number"
                displayType="table"
                strongValue
              />
            </div>
            <Container
              heading="Top Project Sectors"
              headingSize="small"
              hideHeaderBorder
              sub
            >
              <ThreeWBarChart
                className={styles.topProjectSectorsChart}
                data={selectedProjectsPerSectorChartData}
                limitHeight
                hideLabel
                hideTooltip
              />
            </Container>
          </MapTooltipContent>
        </MapTooltip>
      )}
    </Map>
  );
}

export default GlobalThreeWMap;
