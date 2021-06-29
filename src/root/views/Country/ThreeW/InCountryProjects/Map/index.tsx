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
  MapTooltip
} from '@togglecorp/re-map';
import turfBbox from '@turf/bbox';

import TextOutput from '#components/TextOutput';
import MapTooltipContent from '#components/MapTooltipContent';
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
import LanguageContext from '#root/languageContext';

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
  districtId: number;
  numProjects: number;
}

interface ClickedPoint {
  feature: GeoJSON.Feature<GeoJSON.Point, GeoJsonProps>;
  lngLat: mapboxgl.LngLatLike;
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

  const { strings } = React.useContext(LanguageContext);
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

  const districtGroupedProjects = listToGroupList(
    districtDenormalizedProjectList,
    d => d.project_district.id,
  );

  const districtList = districtListResponse?.results ?? emptyDistrictList;

  const [
    clickedPointProperties,
    setClickedPointProperties,
  ] = React.useState<ClickedPoint| undefined>();

  const geo: ProjectGeoJson = React.useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: districtList.map((district) => {
        const projects = districtGroupedProjects[district.id];
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
    [districtList, districtGroupedProjects],
  );

  const selectedDistrictProjectDetail = React.useMemo(
    () => {
      if (!clickedPointProperties?.feature?.id) {
        return undefined;
      }

      const selectedDistrictProjectList = districtGroupedProjects[clickedPointProperties.feature.id];

      if (!selectedDistrictProjectList) {
        return undefined;
      }

      return selectedDistrictProjectList;
    },
    [clickedPointProperties, districtGroupedProjects],
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

  const maxScaleValue = projectList?.length ?? 0;
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
      <MapBounds bounds={countryBounds} />
      {clickedPointProperties?.lngLat && selectedDistrictProjectDetail && (
        <MapTooltip
          coordinates={clickedPointProperties.lngLat}
          tooltipOptions={tooltipOptions}
          onHide={handlePointClose}
        >
          <MapTooltipContent
            title={selectedDistrictProjectDetail[0].project_district.name}
            onCloseButtonClick={handlePointClose}
            className={styles.mapTooltip}
          >
            {selectedDistrictProjectDetail.map((project) => (
              <div
                className={styles.projectDetailItem}
                key={project.id}
              >
                <TextOutput
                  label={project.reporting_ns_detail.name}
                  value={project.name}
                  strongValue
                />
                <TextOutput
                  label={strings.threeWMapLastUpdate}
                  value={project.modified_at}
                  valueType="date"
                />
                <TextOutput
                  label={strings.threeWMapStatus}
                  value={project.status_display}
                />
                <TextOutput
                  label={strings.threeWMapProgrammeType}
                  value={project.programme_type_display}
                />
                <TextOutput
                  label={strings.threeWMapBudget}
                  value={project.budget_amount}
                  valueType="number"
                />
              </div>
            ))}
          </MapTooltipContent>
        </MapTooltip>
      )}
    </Map>
  );
}

export default ThreeWMap;
