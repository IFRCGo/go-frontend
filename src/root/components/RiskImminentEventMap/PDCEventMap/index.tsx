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
  onActiveEventChange: (eventUuid: string | undefined) => void;
  sidebarHeading?: React.ReactNode;
}

function PDCExposureMap(props: Props) {
  const {
    hazardList: hazardListFromProps,
    defaultBounds,
    className,
    activeEventUuid,
    onActiveEventChange,
    sidebarHeading,
  } = props;


  const hazardList = React.useMemo(() => {
    const supportedHazards = listToMap(hazardKeys, h => h, d => true);
    return hazardListFromProps.filter(h => supportedHazards[h.hazard_type]);
  }, [hazardListFromProps]);

  const pointActiveState = React.useMemo(() => {
    return hazardList.map((h) => ({
      id: h.pdc,
      value: h.pdc_details.uuid === activeEventUuid,
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
          id: hazard.pdc,
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [
              hazard.pdc_details.longitude,
              hazard.pdc_details.latitude,
            ],
          },
          properties: {
            hazardId: hazard.id,
            hazardUuid: hazard.pdc_details.uuid,
            hazardType: hazard.hazard_type,
            hazardSeverity: hazard.pdc_details.severity,
          },
        };
      }),
    };

  }, [hazardList]);

  const footprintGeoJson = React.useMemo(() => {
    const dataWithFootprint = hazardList.filter((d) => d.pdc_details.footprint_geojson);

    const featureListForFootprint = dataWithFootprint
      .map((d) => ({
        ...d.pdc_details.footprint_geojson as NonNullable<typeof d.pdc_details.footprint_geojson>,
        properties: {
          hazardUuid: d.pdc_details.uuid,
          hazardSeverity: d.pdc_details.severity,
        },
      }));

    return {
      type: 'FeatureCollection' as const,
      features: featureListForFootprint,
    };
  }, [hazardList]);

  const activeHazard = React.useMemo(() => {
    if (isNotDefined(activeEventUuid)) {
      return undefined;
    }

    const hazardDetails = hazardList.find(d => d.pdc_details.uuid === activeEventUuid);

    if (!hazardDetails) {
      return undefined;
    }

    const lngLat = new LngLat(hazardDetails.pdc_details.longitude, hazardDetails.pdc_details.latitude);

    return {
      hazardDetails,
      lngLat,
      uuid: activeEventUuid,
    };
  }, [activeEventUuid, hazardList]);

  const bounds = React.useMemo(
    () => {
      const ah = hazardList.find(d => d.pdc_details.uuid === activeHazard?.uuid);
      if (!ah) {
        return defaultBounds;
      }

      const stormPoints = ah.pdc_details.storm_position_geojson;
      const point = turfPoint([
        ah.pdc_details.longitude,
        ah.pdc_details.latitude,
      ]);
      const pointBuffer = turfBuffer(point, 50, { units: 'kilometers' });

      const geojson = {
        type: 'FeatureCollection',
        features: [
          pointBuffer,
          ah.pdc_details.footprint_geojson,
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
    [defaultBounds, hazardList, activeHazard],
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
    if (!hazardList) {
      return [];
    }

    const featuresForTrack = hazardList.filter(
      (d) => isDefined(d.pdc_details.storm_position_geojson),
    ).map(
      (d) => (
        (d.pdc_details.storm_position_geojson as NonNullable<typeof d.pdc_details.storm_position_geojson>).map(
          (sp) => ({
            ...sp,
            properties: {
              ...sp.properties,
              hazardId: d.id,
              hazardUuid: d.pdc_details.uuid,
            },
          }),
        )
      ),
    ).flat(1);

    const featuresForLinestring = hazardList.filter(
      (d) => isDefined(d.pdc_details.storm_position_geojson),
    ).map(
      (d) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'LineString' as const,
          coordinates: (d.pdc_details.storm_position_geojson as NonNullable<typeof d.pdc_details.storm_position_geojson>).map(
            (sp) => sp.geometry.coordinates,
          ),
        },
        properties: {
          hazardId: d.id,
          hazardUuid: d.pdc_details.uuid,
        },
      }),
    );

    if (featuresForTrack.length === 0) {
      return [];
    }

    const trackPointsGeoJson = {
      type: 'FeatureCollection' as const,
      features: featuresForTrack,
    };

    const trackLinestringGeoJson = {
      type: 'FeatureCollection' as const,
      features: featuresForLinestring,
    };

    return [
      trackPointsGeoJson,
      trackLinestringGeoJson,
    ];
  }, [hazardList]);


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
    filter: ['==', ['get', 'hazardUuid'], activeHazard?.uuid ?? ''],
  }), [activeHazard]);

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
              filter: ['==', ['get', 'hazardUuid'], activeHazard?.uuid ?? ''],
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
              filter: ['==', ['get', 'hazardUuid'], activeHazard?.uuid ?? ''],
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
              filter: ['==', ['get', 'hazardUuid'], activeHazard?.uuid ?? ''],
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
              filter: ['==', ['get', 'hazardUuid'], activeHazard?.uuid ?? ''],
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
      {activeHazard
        && activeHazard.hazardDetails.population_exposure
        && activeHazard.hazardDetails.capital_exposure
        && (
          <MapTooltip
            coordinates={activeHazard.lngLat}
            onHide={handlePointClose}
            tooltipOptions={defaultTooltipOptions}
          >
            <PointDetails
              onCloseButtonClick={handlePointClose}
              hazardDetails={activeHazard.hazardDetails}
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

export default PDCExposureMap;
