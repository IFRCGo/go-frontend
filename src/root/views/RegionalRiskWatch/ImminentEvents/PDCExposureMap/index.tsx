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
  PDCExposure,
  ImminentHazardTypes,
  PointGeoJsonProps,
} from '../common';

import styles from './styles.module.scss';

function getFeatureCollection(
  data: PDCExposure[],
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
          title: hazard.pdc_details.hazard_name,
          householdsExposed: hazard.population_exposure.households.value,
          peopleExposed: hazard.population_exposure.total.value,
          hospitalsExposed: hazard.capital_exposure.hospital.value,
          schoolsExposed: hazard.capital_exposure.school.value,
          buildingsExposed: hazard.capital_exposure.total.value,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [
            hazard.pdc_details.longitude,
            hazard.pdc_details.latitude,
          ],
        },
      })),
  };
}

interface FootprintProps {
  hazardId: number;
}

function getHazardFootprint(
  data: PDCExposure[],
  featureKey: ImminentHazardTypes
): GeoJSON.FeatureCollection<GeoJSON.Polygon, FootprintProps> {
  return {
    type: 'FeatureCollection' as const,
    features: data
      .filter((hazard) => hazard.hazard_type === featureKey && !!hazard.pdc_details.features)
      .map((hazard) => ({
        id: hazard.id,
        ...hazard.pdc_details.features,
        properties: {
          hazardId: hazard.id,
        },
      })),
  };
}

function EstimatedOutput({
  value,
  attribute,
}: {
  value: number;
  attribute: string;
}) {
  return (
    <TextOutput
      className={styles.estimatedOutput}
      valueContainerClassName={styles.value}
      labelContainerClassName={styles.label}
      descriptionContainerClassName={styles.description}
      label="Est."
      description={attribute}
      hideLabelColon
      value={value}
      valueType="number"
      valueProps={{
        normal: true,
        precision: 'auto',
      }}
    />
  );
}

interface PointDetailsProps {
  hazardDetails: PDCExposure;
}

function PointDetails(props: PointDetailsProps) {
  const {
    hazardDetails: {
      population_exposure,
      capital_exposure,
    },
  } = props;

  return (
    <>
      <EstimatedOutput
        attribute="People Exposed / Likely Affected"
        value={population_exposure.total.value}
      />
      <hr />
      <EstimatedOutput
        attribute="Households Exposed"
        value={population_exposure.households.value}
      />
      <EstimatedOutput
        attribute="People in vulnerable groups exposed to the hazard"
        value={population_exposure.vulnerable.value}
      />
      <EstimatedOutput
        attribute="Building Damage"
        value={capital_exposure.total.value}
      />
      <EstimatedOutput
        attribute="Schools Exposed"
        value={capital_exposure.school.value}
      />
      <EstimatedOutput
        attribute="Hospitals Exposed"
        value={capital_exposure.hospital.value}
      />
    </>
  );
}

const sourceOptions: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};

interface MapPolygonProps {
  hazardKey: ImminentHazardTypes;
  geoJson: GeoJSON.FeatureCollection<GeoJSON.Polygon, {}>;
  hoveredHazardId: number | undefined;
  activeHazardId: number | undefined;
}

function MapPolygon(props: MapPolygonProps) {
  const {
    hazardKey,
    geoJson,
    hoveredHazardId,
    activeHazardId,
  } = props;

  const layerOptions = React.useMemo(() => ({
    type: 'fill',
    paint: {
      'fill-color': '#f5333f',
      'fill-opacity': 0.5,
    },
    filter: ['==', ['get', 'hazardId'], activeHazardId ?? hoveredHazardId ?? ''],
  }), [activeHazardId, hoveredHazardId]);

  return (
    <MapSource
      sourceKey={`${hazardKey}-footprints`}
      sourceOptions={sourceOptions}
      geoJson={geoJson}
    >
      <MapLayer
        layerKey={`${hazardKey}-fill`}
        layerOptions={layerOptions}
      />
    </MapSource>
  );
}

const hazardKeys: ImminentHazardTypes[] = [
  'EQ',
  'CY',
  'TC',
  'SS',
  'FL',
  'DR',
];

const mapPadding = {
  left: 20,
  top: 20,
  right: 100,
  bottom: 20,
};

interface Props {
  data: PDCExposure[];
  className?: string;
  regionId: number;
  activeEventId: number | undefined;
  onActiveEventChange: (eventId: number | undefined) => void;
}

function PDCExposureMap(props: Props) {
  const {
    data,
    className,
    regionId,
    activeEventId,
    onActiveEventChange,
  } = props;

  const allRegions = useReduxState('allRegions');
  const region = React.useMemo(() => (
    allRegions?.data.results.find(d => d.id === regionId)
  ), [allRegions, regionId]);
  const regionBounds = React.useMemo(
    () => turfBbox(region?.bbox ?? []),
    [region],
  );

  const [activeHazard, setActiveHazard] = React.useState<{
    hazardDetails: PDCExposure,
    lngLat: mapboxgl.LngLat,
    id: number,
  } | undefined>();

  const [hoveredHazardId, setHoveredHazardId] = React.useState<number | undefined>();

  const [
    points,
    footprints,
  ] = React.useMemo(
    () => ([
      listToMap(
        hazardKeys,
        d => d,
        d => getFeatureCollection(data, d)
      ),
      listToMap(
        hazardKeys,
        d => d,
        d => getHazardFootprint(data, d)
      ),
    ]),
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

      if (onActiveEventChange) {
        onActiveEventChange(feature.id as number | undefined);
      }

    } else {
      setActiveHazard(undefined);
      if (onActiveEventChange) {
        onActiveEventChange(undefined);
      }
    }

    return false;
  }, [data, onActiveEventChange]);

  const handlePointClose = React.useCallback(() => {
    setActiveHazard(undefined);
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
      <MapContainer className={_cs(styles.mapContainer, className)} />
      {hazardKeys.map(d => (
        footprints[d] ? (
          <MapPolygon
            key={d}
            hazardKey={d}
            geoJson={footprints[d]}
            hoveredHazardId={hoveredHazardId}
            activeHazardId={activeHazard?.id ?? activeEventId}
          />
        ) : null
      ))}
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
            title={activeHazard.hazardDetails.pdc_details.hazard_name}
            onCloseButtonClick={handlePointClose}
            contentClassName={styles.tooltipContent}
          >
            <PointDetails hazardDetails={activeHazard.hazardDetails} />
          </MapTooltipContent>
        </MapTooltip>
      )}
      <MapBounds
        // @ts-ignore
        bounds={regionBounds}
        padding={mapPadding}
      />
    </Map>
  );
}

export default PDCExposureMap;
