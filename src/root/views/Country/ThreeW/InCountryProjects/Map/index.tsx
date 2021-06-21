import React from 'react';
import {
  _cs,
  listToGroupList,
  isDefined,
} from '@togglecorp/fujs';
import Map, {
  MapContainer,
  MapSource,
  MapLayer,
  MapBounds,
} from '@togglecorp/re-map';
import turfBbox from '@turf/bbox';

import useReduxState from '#hooks/useReduxState';
import {
  COLOR_RED,
  defaultMapStyle,
  defaultMapOptions,
  getPointCirclePaint,
  getPointCircleHaloPaint,
} from '#utils/map';
import { denormalizeList } from '#utils/common';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import {
  Project,
  District,
} from '#types';

import styles from './styles.module.scss';

const pointCirclePaint = getPointCirclePaint(COLOR_RED);

const sourceOption: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};

interface GeoJsonProps {
  districtId: number;
  numProjects: number;
}

type ProjectGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, GeoJsonProps>;

const emptyDistrictList: District[] = [];

interface Props {
  className?: string;
  countryId?: number;
  projectList: Project[];
}

function ThreeWMap(props: Props) {
  const {
    className,
    projectList,
    countryId,
  } = props;

  const allCountries = useReduxState('allCountries');
  const countryBounds = React.useMemo(() => (
    turfBbox(allCountries?.data.results.find(
      d => d.id === countryId)?.bbox ?? []
    )
  ), [allCountries, countryId]);

  const {
    response: districtListResponse,
  } = useRequest<ListResponse<District>>({
    skip: !countryId,
    url: 'api/v2/district/',
    query: {
      country: countryId,
      limit: 200,
    },
  });

  const districtDenormalizedProjectList = React.useMemo(
    () => denormalizeList(
      projectList ?? [],
      (p) => p.project_districts_detail,
      (p, d) => ({
        ...p,
        project_district: d,
      }),
    ),
    [projectList]
  );

  const districtGroupedProject = listToGroupList(
    districtDenormalizedProjectList,
    d => d.project_district.id,
  );

  const districtList = districtListResponse?.results ?? emptyDistrictList;

  const geo: ProjectGeoJson = React.useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: districtList.map((district) => {
        const projects = districtGroupedProject[district.id];
        if (!projects) {
          return undefined;
        }

        return {
          id: district.id,
          type: 'Feature' as const,
          properties: {
            districtId: district.id,
            numProjects: projects.length,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: district.centroid?.coordinates ?? [0, 0],
          },
        };
      }).filter(isDefined),
    }),
    [districtList, districtGroupedProject],
  );

  const maxScaleValue = Math.min(projectList.length ?? 0, 2);
  const pointHaloCirclePaint: mapboxgl.CirclePaint = React.useMemo(
    () => getPointCircleHaloPaint(COLOR_RED, 'numProjects', maxScaleValue),
    [maxScaleValue],
  );

  return (
    <Map
      mapStyle={defaultMapStyle}
      mapOptions={defaultMapOptions}
      navControlShown
      navControlPosition="top-right"
    >
      <MapContainer className={_cs(styles.mapContainer, className)} />
      <MapSource
          sourceKey="points"
          sourceOptions={sourceOption}
          geoJson={geo}
      >
        <MapLayer
          layerKey="points-halo-circle"
          // onClick={handlePointClick}
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
      <MapBounds
        bounds={countryBounds}
      />
    </Map>
  );

}

export default ThreeWMap;
