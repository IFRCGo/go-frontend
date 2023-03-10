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
import { LngLat } from 'mapbox-gl';
import {
  defaultMapOptions,
  defaultMapStyle,
  COLOR_BLACK,
  COLOR_WHITE,
  defaultTooltipOptions,
  ADAM_COlOR_ORANGE,
  ADAM_COlOR_GREEN,
  ADAM_COlOR_RED,
  ADAM_COlOR_CONES,
} from '#utils/map';
import {
  geoJsonSourceOptions,
  hazardKeys,
  hiddenLayout,
  iconPaint,
  pointCirclePaint,
} from '#utils/risk';
import {
  point as turfPoint,
  bbox as turfBbox,
  buffer as turfBuffer,
} from '@turf/turf';
import GoMapDisclaimer from '#components/GoMapDisclaimer';
import { ADAMEvent, ImminentHazardTypes } from '#types/risk';
import { BBOXType } from '#utils/map';
import MapEaseTo from '#components/MapEaseTo';

import Sidebar from './Sidebar';
import PointDetails from './PointDetails';
import HazardMapImage from '../PDCEventMap/HazardMapImage';
import MapFooter from './MapFooter';

import styles from './styles.module.scss';

const alertLevelFillColorPaint = [
  'match',
  ['get', 'alert_level'],
  'Orange',
  ADAM_COlOR_ORANGE,
  'Green',
  ADAM_COlOR_GREEN,
  'Red',
  ADAM_COlOR_RED,
  'Cones',
  ADAM_COlOR_CONES,
  COLOR_BLACK,
];

const mapPadding = {
  left: 0,
  top: 0,
  right: 360,
  bottom: 50,
};

const MAP_BOUNDS_ANIMATION_DURATION = 1800;

interface Props {
  defaultBounds: BBOXType;
  hazardList: ADAMEvent[];
  className?: string;
  activeEventUuid: string | undefined;
  onActiveEventChange: (eventUuid: string | undefined) => void;
  sidebarHeading?: React.ReactNode;
}

function ADAMEventMap(props: Props) {
  const {
    hazardList: hazardListFromProps,
    defaultBounds,
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
    //Note: Remove after handle null event_details in server
    const hazardWithEventDetailsOnly = hazardListFromProps.filter(h => isDefined(h.event_details));

    const supportedHazards = listToMap(hazardKeys, h => h, d => true);
    return hazardWithEventDetailsOnly.filter(h => supportedHazards[h.hazard_type]);

  }, [hazardListFromProps]);

  const activeEvent = hazardList?.find(d => d.event_id === activeEventUuid);

  const activeEventPopUpDetails = React.useMemo(() => {
    if (isNotDefined(activeEventUuid)) {
      return undefined;
    }

    const hazardDetails = hazardList.find(d => d.event_id === activeEventUuid);

    if (isNotDefined(hazardDetails)) {
      return undefined;
    }

    const lngLat = new LngLat(
      hazardDetails.event_details.longitude,
      hazardDetails.event_details.latitude,
    );
    const activeEventExposure = hazardDetails.event_details;

    return {
      activeEventExposure,
      hazardDetails,
      lngLat,
      uuid: activeEventUuid,
    };
  }, [activeEventUuid, hazardList]);

  const boundsBoxPoints = React.useMemo(
    () => {
      if (isNotDefined(activeEvent)
        || isNotDefined(activeEventPopUpDetails)
      ) {
        return defaultBounds;
      }

      const point = turfPoint([
        activeEvent.event_details.longitude,
        activeEvent.event_details.latitude,
      ]);

      // const pointBuffer = turfBuffer(point, 500, { units: 'kilometers' });
      const stormPoints = activeEventPopUpDetails.hazardDetails.storm_position_geojson ?? [];

      const geojson = {
        type: 'FeatureCollection',
        features: [
          point,
          ...(stormPoints.features ?? []),
          stormPoints ? ({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: stormPoints,
            },
          }) : undefined,
        ].filter(isDefined),
      };

      return turfBbox(geojson) as BBOXType;
    },
    [
      defaultBounds,
      activeEvent,
      activeEventPopUpDetails,
    ],
  );

  const hazardPointGeoJson = React.useMemo(() => {
    if (isNotDefined(hazardList)) {
      return undefined;
    }

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

  const trackDate = React.useCallback((date) => new Date(date)?.toLocaleDateString(),[]);

  const stormPosition = React.useMemo(
    () => {
      if (isNotDefined(activeEventPopUpDetails)) {
        return {
          type: 'FeatureCollection' as const,
          features: [],
        };
      }


      const stormPoints = activeEventPopUpDetails?.hazardDetails.storm_position_geojson;

      if (isNotDefined(stormPoints)) {
        return {
          type: 'FeatureCollection' as const,
          features: [],
        };
      }

      return {
        ...stormPoints,
        features: stormPoints.features.map((feature) => ({
          ...feature,
          properties: {
            ...feature.properties,
            type: feature.geometry.type,
            track_date: trackDate(feature?.properties?.track_date),
          },
        })),
      };
    },
    [activeEventPopUpDetails, trackDate]);

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
    }, [activeEventUuid, onActiveEventChange]);

  const handlePointClose = React.useCallback(() => {
    if (onActiveEventChange) {
      onActiveEventChange(undefined);
    }
  }, [onActiveEventChange]);

  const footprintLayerOptions = React.useMemo(() => ({
    type: 'fill',
    paint: {
      'fill-color': alertLevelFillColorPaint,
      'fill-opacity': 0.8,
    },
    filter: ['==', ['get', 'type'], 'MultiPolygon'],
  }), []);

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

      {stormPosition && (
        <MapSource
          sourceKey='type'
          sourceOptions={geoJsonSourceOptions}
          geoJson={stormPosition}
        >
          <MapLayer
            layerKey="cyclone-tracks-points-circle"
            layerOptions={{
              type: 'circle',
              paint: {
                'circle-color': alertLevelFillColorPaint,
                'circle-radius': 6,
                'circle-opacity': 0.8,
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
                  ...alertLevelFillColorPaint,
                ],
                'circle-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'active'], false],
                  0.8,
                  ['boolean', ['feature-state', 'hovered'], false],
                  0.6,
                  0.5,
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

      <MapEaseTo
        bounds={boundsBoxPoints}
        padding={mapPadding}
        duration={MAP_BOUNDS_ANIMATION_DURATION}
      />
    </Map>
  );
}

export default ADAMEventMap;
