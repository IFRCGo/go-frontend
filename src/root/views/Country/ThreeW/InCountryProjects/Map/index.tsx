import React from 'react';
import {
  _cs,
  listToGroupList,
  isDefined,
  unique,
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
  COLOR_BLUE,
  COLOR_ORANGE,
  defaultMapStyle,
  defaultMapOptions,
  getPointCirclePaint,
  getPointCircleHaloPaint,
  pointColorMap,
  OPERATION_TYPE_EMERGENCY,
  OPERATION_TYPE_MULTI,
  OPERATION_TYPE_PROGRAMME,
} from '#utils/map';
import { denormalizeList } from '#utils/common';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import {
  Project,
  District,
  DistrictMini,
} from '#types';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';

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

interface GeoJsonProps {
  districtId: number;
  numProjects: number;
}

interface ClickedPoint {
  feature: GeoJSON.Feature<GeoJSON.Point, GeoJsonProps>;
  lngLat: mapboxgl.LngLatLike;
}

type ProjectGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, GeoJsonProps>;
function getOperationType(projectList: Project[]) {
  const operationTypeList = unique(
    projectList
      .filter(d => isDefined(d.operation_type))
      .map(d => ({
        id: d.operation_type,
        title: d.operation_type_display,
      })),
    d => d.id,
  ) ?? [];

  if (operationTypeList.length === 1) {
    return operationTypeList[0];
  }

  return {
    id: OPERATION_TYPE_MULTI,
    title: 'Multiple types',
  };
}

function getGeoJson(
  districtList: District[],
  districtDenormalizedProjectList: (Project & {
    project_district_detail: DistrictMini;
  })[],
  requiredOperationTypeId: number,
): ProjectGeoJson {
  return {
    type: 'FeatureCollection' as const,
    features: districtList.map((district) => {
      const projects = districtDenormalizedProjectList
        .filter(d => d.project_district_detail.id === district.id);

      if (projects.length === 0) {
        return undefined;
      }

      const operationType = getOperationType(projects);

      if (operationType.id !== requiredOperationTypeId) {
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
  };
}

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

  const [
    districtDenormalizedProjectList,
    legendItems,
  ] = React.useMemo(() => ([
    denormalizeList(
      projectList ?? [],
      (p) => p.project_districts_detail,
      (p, d) => ({
        ...p,
        project_district_detail: d,
      }),
    ),
    unique(
      projectList
        .filter(d => isDefined(d.operation_type))
        .map(d => ({
          id: d.operation_type,
          title: d.operation_type_display,
        })),
      d => d.id,
    ),
  ]), [projectList]);

  const districtGroupedProjects = listToGroupList(
    districtDenormalizedProjectList,
    d => d.project_district_detail.id,
  );

  const districtList = districtListResponse?.results ?? emptyDistrictList;

  const [
    clickedPointProperties,
    setClickedPointProperties,
  ] = React.useState<ClickedPoint| undefined>();

  const [
    programmesGeo,
    emergencyGeo,
    multiTypeGeo,
  ] = React.useMemo(
    () => ([
      getGeoJson(districtList, districtDenormalizedProjectList, OPERATION_TYPE_PROGRAMME),
      getGeoJson(districtList, districtDenormalizedProjectList, OPERATION_TYPE_EMERGENCY),
      getGeoJson(districtList, districtDenormalizedProjectList, OPERATION_TYPE_MULTI),
    ]),
    [districtList, districtDenormalizedProjectList],
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
  const [
    redPointHaloCirclePaint,
    bluePointHaloCirclePaint,
    orangePointHaloCirclePaint,
  ] = React.useMemo(
     () => ([
       getPointCircleHaloPaint(COLOR_RED, 'numProjects', maxScaleValue),
       getPointCircleHaloPaint(COLOR_BLUE, 'numProjects', maxScaleValue),
       getPointCircleHaloPaint(COLOR_ORANGE, 'numProjects', maxScaleValue),
     ]),
    [maxScaleValue],
  );

  return (
    <Map
      mapStyle={defaultMapStyle}
      mapOptions={defaultMapOptions}
      navControlShown
      navControlPosition="top-right"
    >
      <div className={_cs(styles.map, className)}>
        <MapContainer className={styles.mapContainer} />
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
      <MapBounds bounds={countryBounds} />
      {clickedPointProperties?.lngLat && selectedDistrictProjectDetail && (
        <MapTooltip
          coordinates={clickedPointProperties.lngLat}
          tooltipOptions={tooltipOptions}
          onHide={handlePointClose}
        >
          <MapTooltipContent
            title={selectedDistrictProjectDetail[0].project_district_detail.name}
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
