import React from 'react';
import Map,
{
  MapContainer,
  MapLayer,
  MapSource,
  MapState,
  MapTooltip,
} from '@togglecorp/re-map';
import {
  isDefined,
  isNotDefined,
  listToMap,
  noOp,
  _cs,
} from '@togglecorp/fujs';
import mapboxgl, { LngLat } from 'mapbox-gl';
import { BoundingBox, viewport } from '@mapbox/geo-viewport';

import {
  defaultMapOptions,
  defaultMapStyle,
  COLOR_BLACK,
  COLOR_WHITE,
  defaultTooltipOptions,
} from '#utils/map';
import {
  COLOR_STORM,
  COLOR_DROUGHT,
  COLOR_EARTHQUAKE,
  COLOR_FLOOD,
  geoJsonSourceOptions,
  hazardKeys,
  hiddenLayout,
  iconPaint,
  pointCirclePaint,
} from '#utils/risk';
import { bbox as turfBbox } from '@turf/turf';
import GoMapDisclaimer from '#components/GoMapDisclaimer';
import { ADAMEvent, ImminentHazardTypes } from '#types/risk';
import MapEaseTo from '#components/MapEaseTo';
import fixGeoJsonZeroLine from '#utils/mapGeo';

import Sidebar from './Sidebar';
import PointDetails from './PointDetails';
import HazardMapImage from '../PDCEventMap/HazardMapImage';
import MapFooter from './MapFooter';

import styles from './styles.module.scss';

const trackDate = (date: string) => new Date(date)?.toLocaleDateString();

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
  COLOR_BLACK,
];

const footprintLayerOptions = {
  type: 'fill',
  paint: {
    'fill-color': hazardTypeFillColorPaint,
    // 'fill-opacity': 0.8,
  },
  filter: ['==', ['get', 'type'], 'MultiPolygon'],
};

const mapPadding = {
  left: 0,
  top: 0,
  right: 320,
  bottom: 50,
};

const MAP_BOUNDS_ANIMATION_DURATION = 1800;

interface Props {
  hazardList: ADAMEvent[];
  className?: string;
  activeEventUuid: string | undefined;
  onActiveEventChange: (eventUuid: string | undefined) => void;
  sidebarHeading?: React.ReactNode;
}

function ADAMEventMap(props: Props) {
  const {
    hazardList: hazardListFromProps,
    className,
    activeEventUuid,
    onActiveEventChange,
    sidebarHeading,
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
  });

  const hazardList = React.useMemo(() => {
    const supportedHazards = listToMap(
      hazardKeys,
      h => h,
      () => true,
    );

    // NOTE: Remove after handle null event_details in server
    return hazardListFromProps.filter(
      h => isDefined(h.event_details) && supportedHazards[h.hazard_type],
    );
  }, [hazardListFromProps]);

  const activeEvent = React.useMemo(
    () => hazardList?.find(
      d => d.event_id === activeEventUuid,
    ),
    [activeEventUuid, hazardList],
  );

  const activeEventPopUpDetails = React.useMemo(() => {
    if (isNotDefined(activeEvent)) {
      return undefined;
    }

    const lngLat = new LngLat(
      activeEvent.event_details.longitude,
      activeEvent.event_details.latitude,
    );
    const activeEventExposure = activeEvent.event_details;

    return {
      activeEventExposure,
      hazardDetails: activeEvent,
      lngLat,
      uuid: activeEvent.event_id,
    };
  }, [activeEvent]);

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
              hazard.event_details.longitude,
              hazard.event_details.latitude,
            ],
          },
          properties: {
            hazardId: hazard.id,
            hazardUuid: hazard.event_id,
            hazardType: hazard.hazard_type,
            alert_level: hazard.event_details.alert_level,
          },
        };
      }),
    };
  }, [hazardList]);

  const stormPositionGeoJson = React.useMemo(
    () => {
      if (isNotDefined(activeEvent)) {
        return {
          type: 'FeatureCollection' as const,
          features:[],
        };
      }

      const stormPoints = activeEvent.storm_position_geojson;

      if (isNotDefined(stormPoints)) {
        return {
          type: 'FeatureCollection' as const,
          features:[],
        };
      }
      return {
        ...stormPoints,
        features: stormPoints.features.map((feature) => ({
          ...feature,
          properties: {
            ...feature.properties,
            type: feature.geometry.type,
            track_date: trackDate(feature.properties.track_date),
          },
        })),
      };
    },
    [activeEvent],
  );

  const boundsBoxPoints = React.useMemo(
    () => {
      if (stormPositionGeoJson.features.length > 1) {
        const bounds = turfBbox(stormPositionGeoJson) as BoundingBox;
        const viewPort = viewport(bounds, [600, 400]);
        return viewPort;
      }

      if (activeEvent) {
        return {
          center: [
            activeEvent.event_details.longitude,
            activeEvent.event_details.latitude,
          ] as [number, number],
          zoom: 5,
        };
      }

      if(isNotDefined(activeEvent)  && hazardPointGeoJson.features.length > 1) {
        const newGeoFix = fixGeoJsonZeroLine(hazardPointGeoJson);
        const bounds = turfBbox(newGeoFix) as BoundingBox;
        const viewPort = viewport(bounds, [600, 400], 1, 2.5);

        return viewPort;
      }
    },
    [
      stormPositionGeoJson,
      hazardPointGeoJson,
      activeEvent,
    ],
  );

  const allIconsLoaded = React.useMemo(() => (
    Object.values(hazardIconLoadedStatusMap).every(d => d)
  ), [hazardIconLoadedStatusMap]);

  const handleIconLoad = React.useCallback((hazardKey: ImminentHazardTypes) => {
    setHazardIconLoadedStatusMap(prevMap => ({ ...prevMap, [hazardKey]: true }));
  }, []);

  const pointActiveState = React.useMemo(() => {
    return hazardList.map((h) => ({
      id: h.id,
      value: h.event_id === activeEventUuid,
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
        <MapFooter />
      </div>
      {hazardKeys.map(d => (
        <HazardMapImage
          key={d}
          hazardKey={d}
          onLoad={handleIconLoad}
        />
      ))}
      {stormPositionGeoJson && (
        <MapSource
          sourceKey='type'
          sourceOptions={geoJsonSourceOptions}
          geoJson={stormPositionGeoJson}
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
              filter: ['==', ['get', 'type'], 'MultiLineString'],
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
              filter: ['==', ['get', 'type'], 'MultiLineString'],
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
            exposureDetails={activeEventPopUpDetails.activeEventExposure}
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

export default ADAMEventMap;

