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
import { FilterValue, Filters } from '../Filter';
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
import Fold from '#components/fold';
import Translate from '#components/Translate';
import { RiskTable } from '../Table';

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
}

function RiskMap(props: Props) {
  const {
    className,
  } = props;

  const [filters, setFilters] = React.useState<FilterValue>({
    reporting_ns: [],
    programme_type: [],
    primary_sector: [],
    secondary_sectors: [],
  });

  return (
    <Fold
      foldWrapperClass='fold--main'
      foldTitleClass='fold__title--inline margin-reset'
      title={
        <Translate stringId='riskModuleRiskMap' />
      }
      showHeader={true}
    >
      <Filters
        disabled={false}
        value={filters}
        onChange={setFilters} />
      <Map
        mapStyle={defaultMapStyle}
        mapOptions={defaultMapOptions}
        navControlShown
        navControlPosition="top-right"
      >
        <div className={_cs(styles.map, className)}>
          <MapContainer className={styles.mapContainer} />
          <div className={styles.legend}>
            <div
              className={styles.legendItem}
            >
              <div
                className={styles.point}
                style={{
                }}
              />
              <div className={styles.label}>
              </div>
            </div>
          </div>
        </div>
        <MapSource
          sourceKey="programme-points"
          sourceOptions={sourceOption}
        >
          <MapLayer
            layerKey="points-halo-circle"
            layerOptions={{
              type: 'circle',
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
        >
          <MapLayer
            layerKey="points-halo-circle"
            layerOptions={{
              type: 'circle',
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
        >
          <MapLayer
            layerKey="points-halo-circle"
            layerOptions={{
              type: 'circle',
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
      </Map>
      <RiskTable />
    </Fold>
  );
}

export default RiskMap;
