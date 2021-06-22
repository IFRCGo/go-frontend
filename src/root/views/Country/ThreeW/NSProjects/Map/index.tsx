import React from 'react';
import {
  _cs,
  listToMap,
  listToGroupList,
  isDefined,
} from '@togglecorp/fujs';
import Map, {
  MapContainer,
  MapSource,
  MapLayer,
  MapTooltip
} from '@togglecorp/re-map';

import MapTooltipContent from '#components/MapTooltipContent';
import useReduxState from '#hooks/useReduxState';
import {
  defaultMapStyle,
  defaultMapOptions,
  getPointCirclePaint,
  COLOR_RED,
} from '#utils/map';
import { Project } from '#types';

import styles from './styles.module.scss';

const pointCirclePaint = getPointCirclePaint(COLOR_RED);
const tooltipOptions: mapboxgl.PopupOptions = {
  closeButton: false,
  offset: 8,
};
const sourceOption: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};


interface GeoJsonProps {
  countryId: number;
  total: number;
}

interface ClickedPoint {
  feature: GeoJSON.Feature<GeoJSON.Point, GeoJsonProps>;
  lngLat: mapboxgl.LngLatLike;
}

type NsProjectStatsGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, GeoJsonProps>;

interface Props {
  className?: string;
  projectList: Project[];
}

function ThreeWMap(props: Props) {
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

  const [
    countryGroupedProjects,
    countryGroupedProjectList,
  ] = React.useMemo(() => {
    const group = listToGroupList(projectList, d => d.project_country);

    return [
      group,
      Object.values(group),
    ] as const;
  }, [projectList]);

  const nsProjectsMap = React.useMemo(
    () => listToMap(
      countryGroupedProjectList ?? [],
      item => item[0].project_country,
      (item) => ({
        countryId: item[0].project_country,
        total: item.length,
      }),
    ),
    [countryGroupedProjectList],
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

  const selectedCountryProjectDetail = React.useMemo(
    () => {
      if (!clickedPointProperties || !clickedPointProperties.feature?.id) {
        return undefined;
      }

      const selectedCountryProjectList = countryGroupedProjects[clickedPointProperties.feature.id];

      if (!selectedCountryProjectList) {
        return undefined;
      }

      return selectedCountryProjectList;
    },
    [clickedPointProperties, countryGroupedProjects],
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
          layerKey="points-circle"
          onClick={handlePointClick}
          layerOptions={{
            type: 'circle',
            paint: pointCirclePaint,
          }}
        />
      </MapSource>
      {clickedPointProperties?.lngLat && selectedCountryProjectDetail && (
        <MapTooltip
          coordinates={clickedPointProperties.lngLat}
          tooltipOptions={tooltipOptions}
          onHide={handlePointClose}
        >
          <MapTooltipContent
            title={selectedCountryProjectDetail[0].project_country_detail.name}
            href={`/countries/${selectedCountryProjectDetail[0].project_country}/#3w`}
            onCloseButtonClick={handlePointClose}
            className={styles.mapTooltip}
          >
            {selectedCountryProjectDetail.map((project) => (
              <div
                className={styles.projectDetailItem}
                key={project.id}
              >
                <div className={styles.name}>
                  {project.name}
                </div>
              </div>
            ))}
          </MapTooltipContent>
        </MapTooltip>
      )}
    </Map>
  );
}

export default ThreeWMap;
