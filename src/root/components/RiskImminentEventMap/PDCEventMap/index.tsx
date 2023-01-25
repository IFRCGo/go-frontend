import React from 'react';
import {
  _cs,
  isDefined,
  isNotDefined,
  listToMap,
} from '@togglecorp/fujs';
import Map, {
  MapContainer,
  MapSource,
  MapLayer,
  MapBounds,
  MapTooltip,
  MapState,
} from '@togglecorp/re-map';
import {
  point as turfPoint,
  bbox as turfBbox,
  buffer as turfBuffer,
} from '@turf/turf';
import { LngLat } from 'mapbox-gl';

import {
  defaultMapStyle,
  defaultMapOptions,
  defaultTooltipOptions,
  fixBounds,
  BBOXType,
  COLOR_WHITE,
  COLOR_BLACK,
  COLOR_RED,
  COLOR_BLUE,
  COLOR_YELLOW,
} from '#utils/map';
import {
  geoJsonSourceOptions,
  pointCirclePaint,
  iconPaint,
  hiddenLayout,
  hazardKeys,
} from '#utils/risk';

import TextOutput from '#components/TextOutput';
import InfoPopup from '#components/InfoPopup';
import GoMapDisclaimer from '#components/GoMapDisclaimer';

import HazardMapImage from './HazardMapImage';
import PointDetails from './PointDetails';
import Sidebar from './Sidebar';

import {
  PDCEvent,
  PDCEventExposure,
  ImminentHazardTypes,
} from '#types';

import styles from './styles.module.scss';

const severityFillColorPaint = [
  'match',
  ['get', 'hazardSeverity'],
  'warning',
  COLOR_RED,
  'watch',
  COLOR_YELLOW,
  'advisory',
  COLOR_BLUE,
  'information',
  COLOR_BLUE,
  COLOR_BLACK,
];

const legendItems = [
  { color: COLOR_RED, label: 'Warning' },
  { color: COLOR_YELLOW, label: 'Watch' },
  { color: COLOR_BLUE, label: 'Advisory / Information' },
  { color: COLOR_BLACK, label: 'Unknown' },
];

const mapPadding = {
  left: 50,
  top: 50,
  right: 250,
  bottom: 50,
};

const noOp = () => { };

const MAP_BOUNDS_ANIMATION_DURATION = 1800;

interface Props {
  defaultBounds: BBOXType;
  hazardList: PDCEvent[];
  className?: string;
  activeEventUuid: string | undefined;
  activeEventExposure?: PDCEventExposure;
  activeEventExposurePending?: boolean;
  onActiveEventChange: (eventUuid: string | undefined) => void;
  sidebarHeading?: React.ReactNode;
}

function PDCEventMap(props: Props) {
  const {
    hazardList: hazardListFromProps,
    defaultBounds,
    className,
    activeEventUuid,
    onActiveEventChange,
    sidebarHeading,
    activeEventExposure,
    activeEventExposurePending,
  } = props;

  const hazardList = React.useMemo(() => {
    const supportedHazards = listToMap(hazardKeys, h => h, d => true);
    return hazardListFromProps.filter(h => supportedHazards[h.hazard_type]);
  }, [hazardListFromProps]);

  const activeEvent = hazardList?.find(d => d.uuid === activeEventUuid);
  const activeEventPopupDetails = React.useMemo(() => {
    if (isNotDefined(activeEventUuid)) {
      return undefined;
    }

    const hazardDetails = hazardList.find(d => d.uuid === activeEventUuid);

    if (!hazardDetails) {
      return undefined;
    }

    const lngLat = new LngLat(hazardDetails.longitude, hazardDetails.latitude);

    return {
      hazardDetails,
      lngLat,
      uuid: activeEventUuid,
    };
  }, [activeEventUuid, hazardList]);

  const pointActiveState = React.useMemo(() => {
    return hazardList.map((h) => ({
      id: h.id,
      value: h.uuid === activeEventUuid,
    }));
  }, [activeEventUuid, hazardList]);

  const hazardPointGeoJson = React.useMemo(() => {
    if (!hazardList) {
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
              hazard.longitude,
              hazard.latitude,
            ],
          },
          properties: {
            hazardId: hazard.id,
            hazardUuid: hazard.uuid,
            hazardType: hazard.hazard_type,
            hazardSeverity: hazard.severity,
          },
        };
      }),
    };

  }, [hazardList]);

  const footprintGeoJson = React.useMemo(() => {
    if (!activeEvent || !activeEventExposure?.footprint_geojson) {
      return undefined;
    }

    return {
      type: 'FeatureCollection' as const,
      features: [{
        ...activeEventExposure.footprint_geojson,
        properties: {
          ...activeEventExposure.footprint_geojson.properties,
          hazardUuid: activeEvent.uuid,
          hazardSeverity: activeEvent.severity,
        },
      }],
    };
  }, [activeEvent, activeEventExposure?.footprint_geojson]);

  const bounds = React.useMemo(
    () => {
      if (!activeEvent || activeEventExposurePending) {
        return defaultBounds;
      }

      const point = turfPoint([
        activeEvent.longitude,
        activeEvent.latitude,
      ]);

      const stormPoints = activeEventExposure?.storm_position_geojson;

      const pointBuffer = turfBuffer(point, 50, { units: 'kilometers' });

      const geojson = {
        type: 'FeatureCollection',
        features: [
          pointBuffer,
          ...(footprintGeoJson?.features ?? []),
          stormPoints ? ({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: stormPoints.map((sp) => (
                sp.geometry.coordinates
              )),
            },
          }) : undefined,
        ].filter(isDefined),
      };

      return fixBounds(turfBbox(geojson) as BBOXType);
    },
    [
      defaultBounds,
      activeEventExposurePending,
      activeEventExposure?.storm_position_geojson,
      footprintGeoJson,
      activeEvent,
    ],
  );

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



  const [
    trackPointsGeoJson,
    trackLinestringGeoJson,
  ] = React.useMemo(() => {
    const stormPositionGeoJson = activeEventExposure?.storm_position_geojson;

    if (!activeEvent || !stormPositionGeoJson) {
      return [];
    }

    const featuresForTrack = stormPositionGeoJson.map((sp) => ({
      ...sp,
      properties: {
        ...sp.properties,
        hazardId: activeEvent.id,
        hazardUuid: activeEvent.uuid,
      }
    }));

    if (featuresForTrack.length === 0) {
      return [];
    }

    const featureForLinestring = {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: stormPositionGeoJson.map((sp) => sp.geometry.coordinates),
      },
      properties: {
        hazardId: activeEvent.id,
        hazardUuid: activeEvent.uuid,
      },
    };

    const trackPointsGeoJson = {
      type: 'FeatureCollection' as const,
      features: featuresForTrack,
    };

    const trackLinestringGeoJson = {
      type: 'FeatureCollection' as const,
      features: [featureForLinestring],
    };

    return [
      trackPointsGeoJson,
      trackLinestringGeoJson,
    ];
  }, [activeEvent, activeEventExposure?.storm_position_geojson]);

  const handleIconLoad = React.useCallback((hazardKey: ImminentHazardTypes) => {
    setHazardIconLoadedStatusMap(prevMap => ({ ...prevMap, [hazardKey]: true }));
  }, []);

  const allIconsLoaded = React.useMemo(() => (
    Object.values(hazardIconLoadedStatusMap).every(d => d)
  ), [hazardIconLoadedStatusMap]);

  const footprintLayerOptions = React.useMemo(() => ({
    type: 'fill',
    paint: {
      'fill-color': severityFillColorPaint,
      'fill-opacity': 0.3,
    },
  }), [activeEventPopupDetails]);

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
        <div className={styles.footer}>
          <div className={styles.legend}>
            <div className={styles.legendTitle}>
              Severity:
            </div>
            {legendItems.map((li) => (
              <div
                key={li.label}
                className={styles.legendItem}
              >
                <div
                  className={styles.color}
                  style={{ backgroundColor: li.color }}
                />
                <div className={styles.label}>
                  {li.label}
                </div>
              </div>
            ))}
          </div>
          <TextOutput
            className={styles.source}
            label="Source"
            value="Pacific Disaster Center"
            description={(
              <InfoPopup
                title="Source: Pacific Disaster Center"
                description={(
                  <>
                    <p>
                      These impacts are produced by the Pacific Disaster Center's All-hazards Impact Model (AIM) 3.0.
                    </p>
                    <div>
                      Click <a className={styles.pdcLink} target="_blank" href="https://www.pdc.org/wp-content/uploads/AIM-3-Fact-Sheet-Screen-1.pdf">here</a> for more information about the model and its inputs.
                    </div>
                  </>
                )}
              />
            )}
          />
        </div>
      </div>
      {hazardKeys.map(d => (
        <HazardMapImage
          key={d}
          hazardKey={d}
          onLoad={handleIconLoad}
        />
      ))}
      {footprintGeoJson && (
        <MapSource
          sourceKey="hazard-footprint"
          sourceOptions={geoJsonSourceOptions}
          geoJson={footprintGeoJson}
        >
          <MapLayer
            layerKey="hazard-footprint-polygon"
            layerOptions={footprintLayerOptions}
          />
        </MapSource>
      )}
      {trackLinestringGeoJson && (
        <MapSource
          sourceKey="cyclone-tracks-linestring"
          sourceOptions={geoJsonSourceOptions}
          geoJson={trackLinestringGeoJson}
        >
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
              filter: ['==', ['get', 'hazardUuid'], activeEventPopupDetails?.uuid ?? ''],
            }}
          />
          <MapLayer
            layerKey="cyclone-tracks-linestring-line"
            layerOptions={{
              type: 'line',
              paint: {
                'line-color': '#000000',
                'line-opacity': 0.1,
                'line-width': 1,
              },
              filter: ['==', ['get', 'hazardUuid'], activeEventPopupDetails?.uuid ?? ''],
            }}
          />
        </MapSource>
      )}
      {trackPointsGeoJson && (
        <MapSource
          sourceKey="cyclone-tracks"
          sourceOptions={geoJsonSourceOptions}
          geoJson={trackPointsGeoJson}
        >
          <MapLayer
            layerKey="cyclone-tracks-points-circle"
            layerOptions={{
              type: 'circle',
              paint: {
                'circle-color': severityFillColorPaint,
                'circle-radius': 6,
                'circle-opacity': 0.5,
              },
              filter: ['==', ['get', 'hazardUuid'], activeEventPopupDetails?.uuid ?? ''],
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
                'text-size': 10,
                'text-field': ['get', 'forecast_date_time'],
                'text-anchor': 'left',
                'text-offset': [1, 0],
              },
              filter: ['==', ['get', 'hazardUuid'], activeEventPopupDetails?.uuid ?? ''],
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
                  ...severityFillColorPaint,
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
      {activeEventPopupDetails && activeEventExposure
        && activeEventExposure.population_exposure
        && activeEventExposure.capital_exposure
        && (
          <MapTooltip
            coordinates={activeEventPopupDetails.lngLat}
            onHide={handlePointClose}
            tooltipOptions={defaultTooltipOptions}
          >
            <PointDetails
              onCloseButtonClick={handlePointClose}
              hazardDetails={activeEventPopupDetails.hazardDetails}
              exposureDetails={activeEventExposure}
            />
          </MapTooltip>
        )}
      <MapBounds
        bounds={bounds}
        padding={mapPadding}
        duration={MAP_BOUNDS_ANIMATION_DURATION}
      />
    </Map>
  );
}

export default PDCEventMap;
