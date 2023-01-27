import React from 'react';
import Map,
{
    MapBounds,
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
    _cs,
} from '@togglecorp/fujs';
import { LngLat } from 'mapbox-gl';
import {
    defaultMapOptions,
    defaultMapStyle,
    COLOR_RED,
    COLOR_YELLOW,
    COLOR_BLUE,
    COLOR_BLACK,
    fixBounds,
    defaultTooltipOptions,
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

import Sidebar from './Sidebar';
import PointDetails from './PointDetails';
import HazardMapImage from '../PDCEventMap/HazardMapImage';

import styles from './styles.module.scss';
import TextOutput from '#components/TextOutput';
import InfoPopup from '#components/InfoPopup';

const severityFillColorPaint = [
    'match',
    ['get', 'hazardSeverity'],
    'Orange',
    COLOR_RED,
    'Green',
    COLOR_YELLOW,
    'Cones',
    COLOR_BLUE,
    'information',
    COLOR_BLUE,
    COLOR_BLACK,
];
const legendItems = [
    { color: COLOR_RED, label: 'Orange' },
    { color: COLOR_YELLOW, label: 'Green' },
    { color: COLOR_BLUE, label: 'Cones' },
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
        const supportedHazards = listToMap(hazardKeys, h => h, d => true);
        return hazardListFromProps.filter(h => supportedHazards[h.hazard_type]);

    }, [hazardListFromProps]);

    const activeEvent = hazardList?.find(d => d.event_id === activeEventUuid);

    const activeEventPopUpDetails = React.useMemo(() => {
        if (isNotDefined(activeEventUuid)) {
            return undefined;
        }

        const hazardDetails = hazardList.find(d => d.event_id === activeEventUuid);

        if (!hazardDetails) {
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

    const bounds = React.useMemo(
        () => {
            if (!activeEvent) {
                return defaultBounds;
            }

            const point = turfPoint([
                activeEvent.event_details.longitude,
                activeEvent.event_details.latitude,
            ]);
            const pointBuffer = turfBuffer(point, 50, { units: 'kilometers' });

            const geojson = {
                type: 'FeatureCollection',
                features: [
                    pointBuffer,
                ].filter(isDefined),
            };

            return fixBounds(turfBbox(geojson) as BBOXType);
        },
        [
            defaultBounds,
            activeEvent,
        ],
    );

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
                        hazardSeverity: hazard.event_details.alert_level,
                    },
                };
            }),
        };

    }, [hazardList]);

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
                <div className={styles.footer}>
                    <div className={styles.legend}>
                        <div className={styles.legendTitle}>
                            Alert Level:
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
            <MapBounds
                bounds={bounds}
                padding={mapPadding}
                duration={MAP_BOUNDS_ANIMATION_DURATION}
            />
        </Map>
    );
}

export default ADAMEventMap;
