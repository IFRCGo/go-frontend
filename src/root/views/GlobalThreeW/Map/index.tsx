import React from 'react';
import {
  _cs,
  listToMap,
  isDefined,
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
import {
  defaultMapStyle,
  defaultMapOptions,
  getPointCirclePaint,
  getPointCircleHaloPaint,
  COLOR_RED,
} from '#utils/map';
import { max } from '#utils/common';

import { ThreeWBarChart } from '../Charts';
import styles from './styles.module.scss';

// TODO:
// 1. DONE: mapboxgl.setRTLTextPlugin()
// 2. map.dragRotate.disable()
// 3. map.touchZoomRotate.disableRotation()
// 4. Hide .mapbox-ctrl .mapbox-ctrl-compass

const pointCirclePaint = getPointCirclePaint(COLOR_RED);
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

type NsProjectStatsGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, GeojsonProps>;

interface NSOngoingProjectStat {
  id: number;
  iso3: string;
  ongoing_projects: number;
  target_total: number;
  society_name: string;
  name: string;
  projects_per_sector: {
    primary_sector: number;
    primary_sector_display: string;
    count: number;
  }[];
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

  const nsProjectsMap = React.useMemo(
    () => listToMap(
      projectList ?? [],
      item => item.id,
      (item) => ({
        countryId: item.id,
        total: item.ongoing_projects,
      }),
    ),
    [projectList],
  );

  const geo: NsProjectStatsGeoJson = React.useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: countries.map((country) => {
        const nsProject = nsProjectsMap[country.id];
        if (!nsProject) {
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
    }),
    [countries, nsProjectsMap],
  );

  const maxScaleValue = Math.min(maxProjectCount ?? 0, 2);

  const pointHaloCirclePaint = React.useMemo(
    () => getPointCircleHaloPaint(COLOR_RED, 'total', maxScaleValue),
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
      <MapSource
          sourceKey="points"
          sourceOptions={sourceOption}
          geoJson={geo}
      >
        <MapLayer
          layerKey="points-halo-circle"
          onClick={handlePointClick}
          layerOptions={{
            type: 'circle',
            paint: pointHaloCirclePaint,
          }}
        />
        <MapLayer
          layerKey="points-circle"
          layerOptions={{
            type: 'circle',
            paint: pointCirclePaint,
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
