import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';
import Map, {
  MapContainer,
  MapSource,
  MapLayer,
  MapBounds,
  MapImage,
  MapTooltip,
} from '@togglecorp/re-map';
import turfBbox from '@turf/bbox';

import MapTooltipContent from '#components/MapTooltipContent';
import TextOutput from '#components/TextOutput';
import useReduxState from '#hooks/useReduxState';
import {
  COLOR_WHITE,
  COLOR_BLACK,
  defaultMapStyle,
  defaultMapOptions,
  CIRCLE_RADIUS_EXTRA_LARGE,
} from '#utils/map';

import useBooleanState from '#hooks/useBooleanState';

import earthquakeIcon from '../../icons/earthquake.png';
import cycloneIcon from '../../icons/cyclone.png';
import stormSurgeIcon from '../../icons/storm-surge.png';
import floodIcon from '../../icons/flood.png';
import {
  ImminentHazardTypes,
  HazardData,
} from '../common';

import styles from './styles.module.scss';

const hazardTypeToIconMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in ImminentHazardTypes]: string;
} = {
  EQ: earthquakeIcon,
  TC: cycloneIcon,
  CY: cycloneIcon,
  SS: stormSurgeIcon,
  FL: floodIcon,
};

const tooltipOptions: mapboxgl.PopupOptions = {
  closeButton: false,
  offset: 10,
};
const redPointCirclePaint: mapboxgl.CirclePaint = {
  'circle-color': COLOR_WHITE,
  'circle-radius': CIRCLE_RADIUS_EXTRA_LARGE,
  'circle-opacity': 1,
  'circle-stroke-color': COLOR_BLACK,
  'circle-stroke-width': 1,
  'circle-stroke-opacity': 0.06,
};

const hiddenLayout: mapboxgl.LineLayout = {
  visibility: 'none',
};

const arrowPaint: mapboxgl.SymbolPaint = {
  'icon-color': COLOR_BLACK,
  'icon-opacity': 0.5,
};

export interface EarthquakeListItem {
  id: number;
  event_id: string;
  event_title: string;
  event_place: string;
  event_date: string;
  updated_at: string;
  latitude: number;
  longitude: number;
  depth: number;
  magnitude: number;
  magnitude_type: string;
  country: string;
}

const arrowImageOptions = {
    sdf: true,
};

const sourceOptions: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};

interface GeoJsonProps {
  type: ImminentHazardTypes;
  title: string;
  buildingsExposed: number | null;
  peopleExposed: number | null;
  peopleDisplaced: number | null;
}

interface ClickedPoint {
  feature: GeoJSON.Feature<GeoJSON.Point, GeoJsonProps>;
  lngLat: mapboxgl.LngLatLike;
}

interface PointDetailsProps {
  features: GeoJsonProps
}

function PointDetails(props: PointDetailsProps) {
  const { features } = props;

  return (
    <>
      <TextOutput
        label="Buildings Exposed"
        value={features.buildingsExposed}
        valueType="number"
        valueProps={{
          normal: true,
          precision: 'auto',
        }}
      />
      <TextOutput
        label="People Exposed"
        value={features.peopleExposed}
        valueType="number"
        valueProps={{
          normal: true,
          precision: 'auto',
        }}
      />
      <TextOutput
        label="Estimated Displacement"
        value={features.peopleDisplaced}
        valueType="number"
        valueProps={{
          normal: true,
          precision: 'auto',
        }}
      />
    </>
  );
}

interface MapPointProps {
  hazardKey: ImminentHazardTypes;
  geoJson: GeoJSON.FeatureCollection<GeoJSON.Point, GeoJsonProps>;
  onPointClick?: (
    feature: mapboxgl.MapboxGeoJSONFeature,
    lngLat: mapboxgl.LngLat,
  ) => boolean;
  onMouseEnter?: (
    feature: mapboxgl.MapboxGeoJSONFeature,
    lngLat: mapboxgl.LngLat,
  ) => void;
  onMouseLeave?: (map: mapboxgl.Map) => void;
}

function MapPoint(props: MapPointProps) {
  const {
    hazardKey,
    geoJson,
    onPointClick,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const [iconLoaded, setIconLoaded] = useBooleanState(false);

  return (
    <>
      <MapImage
        name={`${hazardKey}-icon`}
        url={hazardTypeToIconMap[hazardKey]}
        imageOptions={arrowImageOptions}
        onLoad={setIconLoaded}
      />
      <MapSource
        sourceKey={`${hazardKey}-points`}
        sourceOptions={sourceOptions}
        geoJson={geoJson}
      >
        <MapLayer
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onPointClick}
          layerKey={`${hazardKey}-points-circle`}
          layerOptions={{
            type: 'circle',
            paint: redPointCirclePaint,
          }}
        />
        <MapLayer
          layerKey={`${hazardKey}-icon`}
          layerOptions={{
            type: 'symbol',
            paint: arrowPaint,
            layout: iconLoaded ? {
              visibility: 'visible',
               // @ts-ignore
              'icon-image': `${hazardKey}-icon`,
              'icon-size': 0.5,
              'icon-allow-overlap': true,
            }: hiddenLayout,
          }}
        />
      </MapSource>
    </>
  );
}

interface Props {
  className?: string;
  countryId: number;
  hazardList?: HazardData[];
}
function RiskImminentMap(props: Props) {
  const {
    className,
    countryId,
    hazardList,
  } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);
  const countryBounds = React.useMemo(
    () => turfBbox(country?.bbox ?? []),
    [country],
  );

  const [
    earthquakeGeoJson,
    cycloneGeoJson,
    stormSurgeGeoJson,
    floodGeoJson,
  ] = React.useMemo(() => {
    if (!hazardList?.length) {
      return [];
    }

    const getFeatureCollection: (fk: ImminentHazardTypes) => GeoJSON.FeatureCollection<GeoJSON.Point, GeoJsonProps> = (featureKey) => ({
      type: 'FeatureCollection' as const,
      features: hazardList
        .filter((hazard) => hazard.hazardType === featureKey)
        .map((hazard) => ({
          id: hazard.id,
          type: 'Feature' as const,
          properties: {
            type: hazard.hazardType,
            title: hazard.hazardTitle,
            buildingsExposed: hazard.buildingsExposed,
            peopleDisplaced: hazard.peopleDisplaced,
            peopleExposed: hazard.peopleExposed,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [hazard.longitude, hazard.latitude],
          },
      })),
    });

    return [
      getFeatureCollection('EQ'),
      getFeatureCollection('TC'),
      getFeatureCollection('SS'),
      getFeatureCollection('FL'),
    ] as const;
  }, [hazardList]);

  const [
    clickedPointProperties,
    setClickedPointProperties,
  ] = React.useState<ClickedPoint| undefined>();
  const [activeLayerId, setActiveLayerId] = React.useState<number | undefined>();

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

  const handleMouseEnter = React.useCallback(
    (feature: mapboxgl.MapboxGeoJSONFeature) => {
      if (isDefined(feature.id)) {
        setActiveLayerId(feature.id as number);
      } else {
        setActiveLayerId(undefined);
      }
    },
    [],
  );

  const handleMouseLeave = React.useCallback(() => {
    setActiveLayerId(undefined);
  }, []);

  const handlePointClose = React.useCallback(
    () => {
      setClickedPointProperties(undefined);
    },
    [setClickedPointProperties],
  );


  return (
    <Map
      mapStyle={defaultMapStyle}
      mapOptions={defaultMapOptions}
      navControlShown
      navControlPosition="top-right"
    >
      <MapContainer className={_cs(styles.mapContainer, className)} />
      {hazardList?.map((hazard) => {
        if (!hazard.mapboxLayerId || !hazard.fileType) {
          return null;
        }

        if (hazard.fileType === 'raster') {
          return (
            <MapSource
              key={hazard.id}
              sourceKey={`raster-${hazard.id}`}
              sourceOptions={{
                type: 'raster',
                // TODO use token from env
                tiles: [`https://api.mapbox.com/v4/${hazard.mapboxLayerId}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG9nZ2xlY29ycCIsImEiOiJjazk5ZXMza2YxZmQ1M2dvNWxneTEycnQwIn0.K3u-ns63rFzM7CzrnOBm2w`],
                tileSize: 256,
              }}
            >
              <MapLayer
                layerKey='raster-layer'
                layerOptions={{
                  type: 'raster',
                  paint: {
                    'raster-opacity': 0.5,
                  },
                  layout: {
                    visibility: activeLayerId === hazard.id ? 'visible' : 'none',
                  }
                }}
              />
            </MapSource>
          );
        }

        /*
        if (hazard.file_type === 'vector') {
          // TODO
          return null;
        }
         */

        return null;
      })}
      {earthquakeGeoJson && (
        <MapPoint
          hazardKey="EQ"
          geoJson={earthquakeGeoJson}
          onPointClick={handlePointClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      {cycloneGeoJson && (
        <MapPoint
          hazardKey="TC"
          geoJson={cycloneGeoJson}
          onPointClick={handlePointClick}
        />
      )}
      {floodGeoJson && (
        <MapPoint
          hazardKey="FL"
          geoJson={floodGeoJson}
          onPointClick={handlePointClick}
        />
      )}
      {stormSurgeGeoJson && (
        <MapPoint
          hazardKey="SS"
          geoJson={stormSurgeGeoJson}
          onPointClick={handlePointClick}
        />
      )}
      <MapBounds
        // @ts-ignore
        bounds={countryBounds}
      />
      {clickedPointProperties?.lngLat && (
        <MapTooltip
          coordinates={clickedPointProperties.lngLat}
          tooltipOptions={tooltipOptions}
          onHide={handlePointClose}
        >
          <MapTooltipContent
            title={clickedPointProperties?.feature?.properties?.title}
            onCloseButtonClick={handlePointClose}
            className={styles.mapTooltip}
            contentClassName={styles.tooltipContent}
          >
            <PointDetails
              features={clickedPointProperties?.feature?.properties}
            />
          </MapTooltipContent>
        </MapTooltip>
      )}
    </Map>
  );
}

export default RiskImminentMap;
