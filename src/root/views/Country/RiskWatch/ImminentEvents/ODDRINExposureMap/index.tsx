import React from 'react';
import {
  _cs,
  listToMap,
} from '@togglecorp/fujs';
import Map, {
  MapContainer,
  MapSource,
  MapLayer,
  MapBounds,
  MapTooltip,
} from '@togglecorp/re-map';
import turfBbox from '@turf/bbox';

import MapTooltipContent from '#components/MapTooltipContent';
import TextOutput from '#components/TextOutput';
import useReduxState from '#hooks/useReduxState';
import {
  defaultMapStyle,
  defaultMapOptions,
  defaultTooltipOptions,
} from '#utils/map';

import MapPoint from '../MapPoint';

import {
  ODDRINExposure,
  ImminentHazardTypes,
  PointGeoJsonProps,
} from '../common';

import styles from './styles.module.scss';

function getFeatureCollection(
  data: ODDRINExposure[],
  featureKey: ImminentHazardTypes
): GeoJSON.FeatureCollection<GeoJSON.Point, PointGeoJsonProps> {
  return {
    type: 'FeatureCollection' as const,
    features: data
      .filter((hazard) => hazard.hazard_type === featureKey)
      .map((hazard) => ({
        id: hazard.id,
        type: 'Feature' as const,
        properties: {
          hazardId: hazard.id,
          type: hazard.hazard_type,
          title: hazard.hazard_title,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [
            hazard.longitude,
            hazard.latitude,
          ],
        },
      })),
  };
}

const hazardKeys: ImminentHazardTypes[] = [
  'EQ',
  'TC',
  'SS',
  'FL',
];

interface PointDetailsProps {
  hazardDetails: ODDRINExposure;
}

function PointDetails(props: PointDetailsProps) {
  const {
    hazardDetails: {
      people_displaced,
      people_exposed,
      buildings_exposed,
    },
  } = props;

  return (
    <>
      <TextOutput
        label="People Exposed / Likely Affected"
        value={people_exposed}
        valueType="number"
        valueProps={{
          normal: true,
          precision: 'auto',
        }}
      />
      <TextOutput
        label="Estimated Buildings Exposed"
        value={buildings_exposed}
        valueType="number"
        valueProps={{
          normal: true,
          precision: 'auto',
        }}
      />
      <TextOutput
        label="Estimated number of people displaced"
        value={people_displaced}
        valueType="number"
        valueProps={{
          normal: true,
          precision: 'auto',
        }}
      />
    </>
  );
}

interface Props {
  data: ODDRINExposure[];
  className?: string;
  countryId: number;
  activeEventId: number | undefined;
  onActiveEventChange: (eventId: number | undefined) => void;
}

function ODDRINExposureMap(props: Props) {
  const {
    data,
    className,
    countryId,
    activeEventId,
    onActiveEventChange,
  } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);
  const countryBounds = React.useMemo(
    () => turfBbox(country?.bbox ?? []),
    [country],
  );

  const [activeHazard, setActiveHazard] = React.useState<{
    hazardDetails: ODDRINExposure,
    lngLat: mapboxgl.LngLat,
    id: number,
  } | undefined>();

  const [hoveredHazardId, setHoveredHazardId] = React.useState<number | undefined>();

  const points = React.useMemo(
    () => (
      listToMap(
        hazardKeys,
        d => d,
        d => getFeatureCollection(data, d)
      )
    ),
    [data],
  );

  const handlePointMouseEnter = React.useCallback((
    feature: mapboxgl.MapboxGeoJSONFeature,
    lngLat: mapboxgl.LngLat,
  ) => {
    setHoveredHazardId(feature.id as number);
  }, []);

  const handlePointMouseLeave = React.useCallback(() => {
    setHoveredHazardId(undefined);
  }, []);

  const handlePointMouseClick = React.useCallback((
    feature: mapboxgl.MapboxGeoJSONFeature,
    lngLat: mapboxgl.LngLat,
  ) => {
    const hazardDetails = data.find(d => d.id === feature.id);
    if (hazardDetails) {
      setActiveHazard({
        hazardDetails,
        lngLat,
        id: feature.id as number
      });
    } else {
      setActiveHazard(undefined);
    }

    if (onActiveEventChange) {
      onActiveEventChange(feature.id as number | undefined);
    }

    return false;
  }, [data, onActiveEventChange]);

  const handlePointClose = React.useCallback(() => {
    setActiveHazard(undefined);
  }, []);

  return (
    <Map
      mapStyle={defaultMapStyle}
      mapOptions={defaultMapOptions}
      navControlShown
      navControlPosition="top-right"
    >
      <MapContainer className={_cs(styles.mapContainer, className)} />
      {hazardKeys.map(d => (
        points[d] ? (
          <MapPoint
            key={d}
            hazardKey={d}
            onMouseEnter={handlePointMouseEnter}
            onMouseLeave={handlePointMouseLeave}
            onPointClick={handlePointMouseClick}
            activeHazardId={activeHazard?.id ?? activeEventId}
            geoJson={points[d]}
          />
        ) : null
      ))}
      {activeHazard && (
        <MapTooltip
          coordinates={activeHazard.lngLat}
          onHide={handlePointClose}
          tooltipOptions={defaultTooltipOptions}
        >
          <MapTooltipContent
            title={activeHazard.hazardDetails.hazard_title}
            onCloseButtonClick={handlePointClose}
            contentClassName={styles.tooltipContent}
          >
            <PointDetails
              hazardDetails={activeHazard.hazardDetails}
            />
          </MapTooltipContent>
        </MapTooltip>
      )}
      <MapBounds
        // @ts-ignore
        bounds={countryBounds}
      />
    </Map>
  );
}

export default ODDRINExposureMap;
