import React from 'react';
import Map,
{
    MapBounds,
    MapContainer,
    MapLayer,
    MapSource,
    MapState,
} from '@togglecorp/re-map';
import {
    isDefined,
    isNotDefined,
    listToMap,
    _cs,
} from '@togglecorp/fujs';
import {
    defaultMapOptions,
    defaultMapStyle,
    COLOR_RED,
    COLOR_YELLOW,
    COLOR_BLUE,
    COLOR_BLACK,
    fixBounds,
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
import { ADAMEvent, ImminentHazardTypes } from '#types/risk';
import { BBOXType } from '#utils/map';
import { LngLat } from 'mapbox-gl';

import Sidebar from './Sidebar';
import HazardMapImage from '../PDCEventMap/HazardMapImage';

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

    console.log('active event id', activeEventUuid);
    const hazardList = React.useMemo(() => {
        const supportedHazards = listToMap(hazardKeys, h => h, d => true);
        return hazardListFromProps.filter(h => supportedHazards[h.hazard_type]);

    }, [hazardListFromProps]);

    const activeHazard = React.useMemo(() => {
        if (isNotDefined(activeEventUuid)) {
            return undefined;
        }

        const hazardDetails = hazardList.find(d => d.event_details.event_id === activeEventUuid);

        if (!hazardDetails) {
            return undefined;
        }

        const lngLat = new LngLat(
            hazardDetails.event_details.longitude,
            hazardDetails.event_details.latitude,
        );

        return {
            hazardDetails,
            lngLat,
            uuid: activeEventUuid,
        };
    }, [activeEventUuid, hazardList]);

    const bounds = React.useMemo(
        () => {
            const ah = hazardList.find(d => d.event_id === activeHazard?.uuid);

            if (!ah) {
                return defaultBounds;
            }

            const stormPoints = ah.geojson;
            const point = turfPoint([
                ah.event_details.longitude,
                ah.event_details.latitude,
            ]);
            const pointBuffer = turfBuffer(point, 50, { units: 'kilometers' });

            const geojson = {
                type: 'FeatureCollection',
                features: [
                    pointBuffer,
                    ah.geojson,
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

    const pointActiveState = React.useMemo(() => {
        return hazardList.map((h) => ({
            id: h.id,
            value: h.event_id === activeEventUuid,
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
                            hazard.event_details.longitude,
                            hazard.event_details.latitude,
                        ],
                    },
                    properties: {
                        hazardId: hazard.id,
                        hazardUuid: hazard.event_id,
                        hazardType: hazard.hazard_type,
                        hazardSeverity: '',
                    },
                };
            }),
        };

    }, [hazardList]);

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
                </div>
            </div>
            {hazardKeys.map(d => (
                <HazardMapImage
                    key={d}
                    hazardKey={d}
                    onLoad={handleIconLoad}
                />
            ))}
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
            <MapBounds
                bounds={bounds}
                padding={mapPadding}
                duration={MAP_BOUNDS_ANIMATION_DURATION}
            />
        </Map>
    );
}

export default ADAMEventMap;
