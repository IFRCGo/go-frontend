import React, { useCallback, useState } from 'react';
import {
  _cs,
  listToMap,
  isDefined,
  isNotDefined,
} from '@togglecorp/fujs';
import Map, {
  MapImage,
  MapContainer,
  MapSource,
  MapLayer,
  MapTooltip
} from '@togglecorp/re-map';

import BlockLoading from '#components/block-loading';
import GoMapDisclaimer from '#components/GoMapDisclaimer';
import MapTooltipContent from '#components/MapTooltipContent';
import useReduxState from '#hooks/useReduxState';
import LanguageContext from '#root/languageContext';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import { aggregateList } from '#utils/common';
import {
  defaultMapStyle,
  defaultMapOptions,
  getPointCirclePaint,
  COLOR_RED,
  COLOR_BLUE,
  COLOR_BLACK,
  getPointCircleHaloPaint,
} from '#utils/map';
import { Project } from '#types';

import image from './arrow.png';

import styles from './styles.module.scss';

const pointCirclePaint = getPointCirclePaint(COLOR_RED);
const reportingPointCirclePaint = getPointCirclePaint(COLOR_BLUE);

const tooltipOptions: mapboxgl.PopupOptions = {
  closeButton: false,
  offset: 8,
};
const sourceOption: mapboxgl.GeoJSONSourceRaw = {
  type: 'geojson',
};

const arrowImageOptions = {
  sdf: true,
};

const linePaint: mapboxgl.LinePaint = {
  'line-color': COLOR_BLACK,
  'line-opacity': 0.4,
  'line-width': 1,
};
const lineLayout: mapboxgl.LineLayout = {
  visibility: 'visible',
  'line-join': 'round',
  'line-cap': 'round',
};
const hiddenLayout: mapboxgl.LineLayout = {
  visibility: 'none',
};

const arrowPaint: mapboxgl.SymbolPaint = {
  'icon-color': COLOR_BLACK,
  'icon-opacity': 0.6,
};
const arrowLayout: mapboxgl.SymbolLayout = {
  visibility: 'visible',
  'icon-image': 'equilateral-arrow-icon',
  'icon-size': 0.4,
  'symbol-placement': 'line-center',
  'icon-rotate': 90,
  'icon-rotation-alignment': 'map',
  'icon-ignore-placement': true,
  // 'icon-allow-overlap': true,
};

interface GeoJsonProps {
  countryId: number;
  total: number;
}

interface ReportingGeoJsonProps {
  countryId: number;
}

interface ClickedPoint {
  feature: GeoJSON.Feature<GeoJSON.Point, GeoJsonProps>;
  lngLat: mapboxgl.LngLatLike;
}

type NsProjectStatsGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, GeoJsonProps>;

type ReportingNsProjectStatsGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, ReportingGeoJsonProps>;

type LineGeoJson = GeoJSON.FeatureCollection<GeoJSON.LineString, {}>;

interface TooltipProps {
  countryId: number;
  onHide: () => void;
  lngLat: mapboxgl.LngLatLike;
}

const emptyProjectList: Project[] = [];

function Tooltip(props: TooltipProps) {
  const {
    countryId,
    lngLat,
    onHide,
  } = props;

  const allCountries = useReduxState('allCountries');
  const countries = allCountries?.data?.results ?? [];
  const country = countries.find(d => d.id === countryId);

  const {
    pending,
    response,
  } = useRequest<ListResponse<Project>>({
    skip: isNotDefined(country?.iso),
    url: 'api/v2/project/',
    query: {
      limit: 500,
      country: country?.iso,
    },
  });

  const projectList = response?.results || emptyProjectList;

  return (
    <MapTooltip
      coordinates={lngLat}
      tooltipOptions={tooltipOptions}
      onHide={onHide}
    >
      {pending ? (
        <BlockLoading className={styles.loading} />
      ) : (
        <MapTooltipContent
          title={projectList[0]?.project_country_detail.name}
          href={`/countries/${projectList[0]?.project_country}/#3w`}
          onCloseButtonClick={onHide}
          className={styles.mapTooltip}
        >
          {projectList.map((project) => (
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
      )}
    </MapTooltip>
  );
}

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className={styles.legendItem}>
      <div
        style={{ backgroundColor: color }}
        className={styles.color}
      />
      <div className={styles.label}>
        {label}
      </div>
    </div>
  );
}

interface Props {
  className?: string;
  projectList: Project[];
}

function ThreeWMap(props: Props) {
  const {
    className,
    projectList,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const [
    clickedPointProperties,
    setClickedPointProperties,
  ] = React.useState<ClickedPoint| undefined>();

  const allCountries = useReduxState('allCountries');
  const countries = allCountries?.data?.results;

  const [iconReady, setIconReady] = useState(false);

  const handleIconLoad = useCallback(
    () => {
      setIconReady(true);
    },
    [],
  );

  const geo: NsProjectStatsGeoJson = React.useMemo(
    () => {
      interface Value {
        countryId: number;
        total: number;
      }
      const nsProjects = aggregateList(
        projectList,
        (item) => item.project_country,
        (oldValue: Value | undefined, newValue) => ({
          countryId: newValue.project_country,
          total: (oldValue?.total ?? 0) + 1,
        }),
      );
      const nsProjectsMap = listToMap(
        nsProjects,
        item => item.countryId,
        item => item,
      );
      return {
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
      };
    },
    [countries, projectList],
  );

  const reportingNsGeo: ReportingNsProjectStatsGeoJson  = React.useMemo(
    () => {
      interface ReportingValue {
        countryId: number;
        total: number;
      }
      const reportingNsProjects = aggregateList(
        projectList,
        (item) => item.reporting_ns,
        (oldValue: ReportingValue | undefined, newValue) => ({
          countryId: newValue.reporting_ns,
          total: (oldValue?.total ?? 0) + 1,
        }),
      );
      const reportingNsProjectsMap = listToMap(
        reportingNsProjects,
        item => item.countryId,
        item => item,
      );
      return {
        type: 'FeatureCollection' as const,
        features: countries.map((country) => {
          const nsProject = reportingNsProjectsMap[country.id];
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
      };
    },
    [countries, projectList],
  );

  const lines: LineGeoJson = React.useMemo(
    () => {
      interface Relation {
        projectCountry: number,
          reportingNs: number,
      }
      const relations = aggregateList(
        projectList,
        (item) => `${item.project_country}-${item.reporting_ns}`,
        (_: Relation | undefined, item) => ({
          projectCountry: item.project_country,
          reportingNs: item.reporting_ns,
        }),
      );
      const countriesMap = listToMap(
        countries,
        item => item.id,
        item => item,
      );

      const geo = {
        type: 'FeatureCollection' as const,
        features: relations.map(({ projectCountry, reportingNs }) => ({
          id: undefined,
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: [
              countriesMap[reportingNs]?.centroid?.coordinates ?? [0, 0],
              countriesMap[projectCountry]?.centroid?.coordinates ?? [0, 0],
            ],
          },
          properties: {},
        })),
      };
      return geo;
    },
    [countries, projectList],
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
    () => getPointCircleHaloPaint(COLOR_RED, 'total', maxScaleValue),
    [maxScaleValue],
  );
  const reportingPointHaloCirclePaint: mapboxgl.CirclePaint = React.useMemo(
    () => getPointCircleHaloPaint(COLOR_BLUE, 'total', maxScaleValue),
    [maxScaleValue],
  );

  return (
    <Map
      mapStyle={defaultMapStyle}
      mapOptions={defaultMapOptions}
      navControlShown
      navControlPosition="top-right"
      debug={false}
    >
      <div className={_cs(styles.map, className)}>
        <div className={styles.mapContainerWrapper}>
          <MapContainer className={styles.mapContainer} />
          <GoMapDisclaimer className={styles.mapDisclaimer}/>
        </div>
        <div className={styles.legend}>
          <LegendItem
            color={COLOR_BLUE}
            label={strings.threeWNSMapReportingNS}
          />
          <LegendItem
            color={COLOR_RED}
            label={strings.threeWNSMapReceivingCountry}
          />
        </div>
      </div>
      <MapImage
        name="equilateral-arrow-icon"
        url={image}
        imageOptions={arrowImageOptions}
        onLoad={handleIconLoad}
      />
      <MapSource
        sourceKey="lines"
        sourceOptions={sourceOption}
        geoJson={lines}
      >
        <MapLayer
          layerKey="line"
          layerOptions={{
            type: 'line',
            layout: lineLayout,
            paint: linePaint,
          }}
        />
        <MapLayer
          layerKey="arrows-icon"
          layerOptions={{
            type: 'symbol',
            paint: arrowPaint,
            layout: iconReady ? arrowLayout : hiddenLayout,
          }}
        />
      </MapSource>
      <MapSource
        sourceKey="receiving-points"
        sourceOptions={sourceOption}
        geoJson={geo}
      >
        <MapLayer
          layerKey="receiving-points-circle"
          onClick={handlePointClick}
          layerOptions={{
            type: 'circle',
            paint: pointCirclePaint,
          }}
        />
        <MapLayer
          layerKey="receiving-points-halo-circle"
          onClick={handlePointClick}
          layerOptions={{
            type: 'circle',
            paint: pointHaloCirclePaint,
          }}
        />
      </MapSource>
      <MapSource
        sourceKey="reporting-points"
        sourceOptions={sourceOption}
        geoJson={reportingNsGeo}
      >
        <MapLayer
          layerKey="reporting-points-circle"
          onClick={handlePointClick}
          layerOptions={{
            type: 'circle',
            paint: reportingPointCirclePaint,
          }}
        />
        <MapLayer
          layerKey="reporting-points-halo-circle"
          onClick={handlePointClick}
          layerOptions={{
            type: 'circle',
            paint: reportingPointHaloCirclePaint,
          }}
        />
      </MapSource>
      {clickedPointProperties?.lngLat && clickedPointProperties?.feature?.id && (
        <Tooltip
          countryId={+clickedPointProperties.feature.id}
          onHide={handlePointClose}
          lngLat={clickedPointProperties.lngLat}
        />
      )}
    </Map>
  );
}

export default ThreeWMap;
