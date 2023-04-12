import React from 'react';
import Map,
{
  MapContainer,
  MapLayer,
  MapSource,
  MapState,
  MapTooltip
} from '@togglecorp/re-map';
import {
  isDefined,
  isNotDefined,
  listToMap,
  noOp,
  _cs
} from '@togglecorp/fujs';
import {
  bbox as turfBbox,
} from '@turf/turf';
import { LngLat } from 'mapbox-gl';
import { BoundingBox, viewport } from '@mapbox/geo-viewport';

import {
  BBOXType,
  defaultMapOptions,
  defaultMapStyle,
  COLOR_BLACK,
  defaultTooltipOptions,
  COLOR_WHITE,
  ADAM_COLOR_ORANGE,
  ADAM_COLOR_GREEN,
  ADAM_COLOR_RED,
  ADAM_COLOR_CONES,
} from '#utils/map';
import {
  geoJsonSourceOptions,
  pointCirclePaint,
  iconPaint,
  hiddenLayout,
  hazardKeys,
  COLOR_EARTHQUAKE,
  COLOR_FLOOD,
  COLOR_DROUGHT,
  COLOR_STORM,
  COLOR_WILDFIRE,
} from '#utils/risk';
import MapEaseTo from '#components/MapEaseTo';
import GoMapDisclaimer from '#components/GoMapDisclaimer';
import { GDACSEvent, GDACSEventExposure, ImminentHazardTypes } from '#types/risk';

import Sidebar from './Sidebar';
import HazardMapImage from '../PDCEventMap/HazardMapImage';
import PointDetails from './PointDetails';
import styles from './styles.module.scss';

const hazardTypeFillColorPaint = [
  'match',
  ['get', 'hazardType'],
  'EQ',
  COLOR_EARTHQUAKE,
  'CY',
  COLOR_STORM,
  'TC',
  COLOR_STORM,
  'SS',
  COLOR_STORM,
  'FL',
  COLOR_FLOOD,
  'DR',
  COLOR_DROUGHT,
  'WF',
  COLOR_WILDFIRE,
  COLOR_BLACK,
];

const alertLevelFillColorPaint = [
  'match',
  ['get', 'alertlevel'],
  'Orange',
  ADAM_COLOR_ORANGE,
  'Green',
  ADAM_COLOR_GREEN,
  'Red',
  ADAM_COLOR_RED,
  'Cones',
  ADAM_COLOR_CONES,
  COLOR_BLACK,
];

const footprintLayerOptions = {
  type: 'fill',
  paint: {
    'fill-color': alertLevelFillColorPaint,
    'fill-opacity': 0.5,
  },
};

const mapPadding = {
  left: 0,
  top: 0,
  right: 320,
  bottom: 50,
};

const MAP_BOUNDS_ANIMATION_DURATION = 1800;

interface Props {
  defaultBounds: BBOXType;
  hazardList: GDACSEvent[];
  className?: string;
  activeEventUuid: number | undefined;
  activeEventExposure?: GDACSEventExposure;
  activeEventExposurePending?: boolean;
  onActiveEventChange: (eventUuid: number | undefined) => void;
  sidebarHeading?: React.ReactNode;
}

function GDACSEventMap(props: Props) {
  const {
    hazardList: hazardListFromProps,
    className,
    activeEventUuid,
    onActiveEventChange,
    sidebarHeading,
    activeEventExposure,
  } = props;

  const [
  hazardIconLoadedStatusMap,
  setHazardIconLoadedStatusMap,
] = React.useState<Record<ImminentHazardTypes, boolean>>({
    EQ: false,
    FL: false,
    CY: false,
    TC: false,
    SS: false,
    DR: false,
    WF: false,
  });

  const hazardList = React.useMemo(() => {
    const supportedHazards = listToMap(hazardKeys, h => h, () => true);
    return hazardListFromProps.filter(h => supportedHazards[h.hazard_type]);
  }, [hazardListFromProps]);

  const activeEvent = hazardList?.find(d => d.hazard_id === activeEventUuid);

  const activeEventPopUpDetails = React.useMemo(() => {
    if (isNotDefined(activeEvent)) {
      return undefined;
    }

    const lngLat = new LngLat(
      activeEvent.longitude,
      activeEvent.latitude,
    );

    return {
      activeEventExposure,
      hazardDetails: activeEvent,
      lngLat,
      uuid: activeEvent.hazard_id,
    };
  }, [
      activeEvent,
      activeEventExposure
    ]);

  const allIconsLoaded = React.useMemo(() => (
    Object.values(hazardIconLoadedStatusMap).every(d => d)
  ), [hazardIconLoadedStatusMap]);

  const handleIconLoad = React.useCallback((hazardKey: ImminentHazardTypes) => {
    setHazardIconLoadedStatusMap(prevMap => ({ ...prevMap, [hazardKey]: true }));
  }, []);

  const hazardPointGeoJson = React.useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: hazardList.map((hazard) => {
        return {
          id: hazard.id,
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [
              hazard.longitude,
              hazard.latitude,
            ],
          },
          properties: {
            hazardId: hazard.id,
            hazardUuid: hazard.hazard_id,
            hazardType: hazard.hazard_type,
          },
        };
      }),
    };
  }, [hazardList]);

  const footprintPositionGeoJson = React.useMemo(
    () => {
      if (isNotDefined(activeEventExposure)) {
        return {
          type: 'FeatureCollection' as const,
          features: [],
        };
      }

      const footprintPositions = activeEventExposure?.footprint_geojson;

      if (isNotDefined(footprintPositions)) {
        return {
          type: 'FeatureCollection' as const,
          features: [],
        };
      }
      return {
        ...footprintPositions,
        features: footprintPositions.features.map((feature) => ({
          ...feature,
          properties: {
            ...feature.properties,
            type: feature.geometry.type,
          },
        })),
        };
    },
    [activeEventExposure],
  );
  const boundsBoxPoints = React.useMemo(
    () => {
      if (footprintPositionGeoJson.features.length > 1) {
        const bounds = turfBbox(footprintPositionGeoJson) as BoundingBox;
        const viewPort = viewport(bounds, [600, 400]);
        return viewPort;
      }

      if (activeEvent) {
        return {
          center: [
            activeEvent.longitude,
            activeEvent.latitude,
          ] as [number, number],
          zoom: 5,
        };
      }

      if (isNotDefined(activeEvent) && hazardPointGeoJson.features.length > 1) {
        const bounds = turfBbox(hazardPointGeoJson) as BoundingBox;
        const viewPort = viewport(bounds, [600, 400], 1, 2.5);

        return viewPort;
      }
    },
    [
      footprintPositionGeoJson,
      hazardPointGeoJson,
      activeEvent,
    ],
  );

  const pointActiveState = React.useMemo(() => {
    return hazardList.map((h) => ({
      id: h.id,
      value: h.hazard_id === activeEventUuid,
    }));
  }, [activeEventUuid, hazardList]);

  const handlePointMouseClick = React.useCallback((
    feature: mapboxgl.MapboxGeoJSONFeature,
  ) => {
      const uuid = feature?.properties?.hazardUuid;
      if (isDefined(uuid) && activeEventUuid !== uuid) {
        onActiveEventChange(uuid);
      } else {
        onActiveEventChange(undefined);
      }
      return false;
    },
    [activeEventUuid, onActiveEventChange],
  );

  const handlePointClose = React.useCallback(() => {
    if (onActiveEventChange) {
      onActiveEventChange(undefined);
    }
  }, [onActiveEventChange]);

  return (
    <Map
      mapStyle={defaultMapStyle}
      mapOptions={defaultMapOptions}
      navControlShown
      navControlPosition="top-left"
    >
      <div className={_cs(styles.mapContainer, className)}>
        <div className={styles.wrapperForSidebar}>
          <MapContainer className={styles.map} />
          <Sidebar
            heading={sidebarHeading}
            className={styles.sidebar}
            hazardList={hazardList}
            onActiveEventChange={onActiveEventChange}
            activeEventUuid={activeEventUuid}
          />
          <GoMapDisclaimer className={styles.mapDisclaimer} />
        </div>
      </div>
      {hazardKeys.map(d => (
        <HazardMapImage
          key={d}
          hazardKey={d}
          onLoad={handleIconLoad}
        />
      ))}
      {footprintPositionGeoJson && (
        <MapSource
          sourceKey='type'
          sourceOptions={geoJsonSourceOptions}
          geoJson={footprintPositionGeoJson}
        >
          <MapLayer
            layerKey="cyclone-tracks-points-circle"
            layerOptions={{
              type: 'circle',
              paint: {
                'circle-color': hazardTypeFillColorPaint,
                'circle-radius': 6,
                // 'circle-opacity': 0.8,
              },
              filter: ['==', ['get', 'type'], 'Point'],
            }}
          />
          <MapLayer
            layerKey="cyclone-tracks-points-label"
            layerOptions={{
              type: 'symbol',
              paint: {
                'text-color': COLOR_BLACK,
                'text-halo-color': COLOR_WHITE,
                'text-halo-width': 2,
                'text-halo-blur': 1,
              },
              layout: {
                // FIXME: check the actual problem here
                // @ts-ignore
                'text-size': 12,
                'text-field': ['get', 'track_date'],
                'text-anchor': 'left',
                'text-offset': [1, 0],
                'symbol-z-order': 'source',
                'text-max-width': 20,
              },
              filter: ['==', ['get', 'type'], 'Point'],
            }}
          />
          <MapLayer
            layerKey="hazard-footprint-polygon"
            layerOptions={footprintLayerOptions}
          />
          {/* Note: show flow icons */}
          <MapLayer
            layerKey="cyclone-tracks-arrow"
            layerOptions={{
              type: 'symbol',
              paint: {
                'icon-color': COLOR_BLACK,
                'icon-opacity': 0.5,
              },
              layout: {
                // @ts-ignore,
                'icon-allow-overlap': true,
                'symbol-placement': 'line',
                'icon-image': 'triangle-11',
                'icon-size': 0.8,
                'icon-rotate': 90,
              },
              filter: ['==', ['get', 'type'], 'LineString'],
            }}
          />
          {/* Note: for boundry line */}
          <MapLayer
            layerKey="cyclone-tracks-linestring-line"
            layerOptions={{
              type: 'line',
              paint: {
                'line-color': '#000000',
                'line-opacity': 0.5,
                'line-width': 1,
              },
            }}
          />
        </MapSource>
      )}
      {hazardPointGeoJson && (
        <MapSource
          sourceKey="hazard-points"
          sourceOptions={geoJsonSourceOptions}
          geoJson={hazardPointGeoJson}
        >
          <MapLayer
            onMouseEnter={noOp}
            onClick={handlePointMouseClick}
            layerKey="hazard-points-circle"
            layerOptions={{
              type: 'circle',
              paint: {
                ...pointCirclePaint,
                'circle-color': [
                  ...hazardTypeFillColorPaint,
                ],
                'circle-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'active'], false],
                  1,
                  ['boolean', ['feature-state', 'hovered'], false],
                  0.6,
                  1,
                ],
              },
            }}
          />
          <MapLayer
            layerKey="hazard-points-icon"
            layerOptions={{
              type: 'symbol',
              paint: iconPaint,
              layout: allIconsLoaded ? {
                visibility: 'visible',
                // @ts-ignore
                'icon-image': [
                  'match',
                  ['get', 'hazardType'],
                  ...(hazardKeys.map(hk => [hk, `${hk}-icon`]).flat(1)),
                  '',
                ],
                'icon-size': 0.7,
                'icon-allow-overlap': true,
              } : hiddenLayout,
            }}
          />
          <MapState
            attributeKey="active"
            attributes={pointActiveState}
          />
        </MapSource>
      )}
      {activeEventPopUpDetails && activeEventPopUpDetails.hazardDetails && (
        <MapTooltip
          coordinates={activeEventPopUpDetails.lngLat}
          onHide={handlePointClose}
          tooltipOptions={defaultTooltipOptions}
        >
          <PointDetails
            onCloseButtonClick={handlePointClose}
            hazardDetails={activeEventPopUpDetails.hazardDetails}
          />
        </MapTooltip>
      )}
      {boundsBoxPoints &&
        <MapEaseTo
          padding={mapPadding}
          center={boundsBoxPoints.center}
          zoom={boundsBoxPoints.zoom}
          duration={MAP_BOUNDS_ANIMATION_DURATION}
        />
      }
    </Map>
  );
}

export default GDACSEventMap;

