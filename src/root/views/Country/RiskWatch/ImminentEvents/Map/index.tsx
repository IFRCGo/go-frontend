import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Map, {
  MapContainer,
  MapSource,
  MapLayer,
  MapBounds,
  MapImage,
} from '@togglecorp/re-map';
import turfBbox from '@turf/bbox';

import useReduxState from '#hooks/useReduxState';
import {
  COLOR_WHITE,
  COLOR_BLACK,
  defaultMapStyle,
  defaultMapOptions,
  CIRCLE_RADIUS_EXTRA_LARGE,
} from '#utils/map';

import useBooleanState from '#hooks/useBooleanState';

import earthquakeIcon from './earthquake.png';
import styles from './styles.module.scss';

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
const arrowLayout: mapboxgl.SymbolLayout = {
  visibility: 'visible',
  'icon-image': 'earthquake-icon',
  'icon-size': 0.5,
  'icon-allow-overlap': true,
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


interface Props {
  className?: string;
  countryId: number;
  earthquakeList?: EarthquakeListItem[];
}

function RiskImminentMap(props: Props) {
  const {
    className,
    countryId,
    earthquakeList,
  } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);
  const countryBounds = turfBbox(country?.bbox ?? []);
  const geoJson = React.useMemo(() => {
    if (!earthquakeList?.length) {
      return undefined;
    }

    return {
      type: 'FeatureCollection' as const,
      features: earthquakeList.map((eqItem) => ({
        id: eqItem.id,
        type: 'Feature' as const,
        properties: {
          magnitude: eqItem.magnitude,
          magnitude_type: eqItem.magnitude_type,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [eqItem.longitude, eqItem.latitude],
        },
      })),
    };
  }, [earthquakeList]);


  const [iconsLoaded, setIconsLoadedTrue] = useBooleanState(false);

  return (
    <Map
      mapStyle={defaultMapStyle}
      mapOptions={defaultMapOptions}
      navControlShown
      navControlPosition="top-right"
    >
      <MapImage
        name="earthquake-icon"
        url={earthquakeIcon}
        imageOptions={arrowImageOptions}
        onLoad={setIconsLoadedTrue}
      />
      <MapContainer className={_cs(styles.mapContainer, className)} />
      {geoJson && (
        <MapSource
          sourceKey="earthquake-points"
          sourceOptions={sourceOptions}
          geoJson={geoJson}
        >
          <MapLayer
            layerKey="earthquake-points-circle"
            layerOptions={{
              type: 'circle',
              paint: redPointCirclePaint,
            }}
          />
          <MapLayer
            layerKey="earthquake-icon"
            layerOptions={{
              type: 'symbol',
              paint: arrowPaint,
              layout: iconsLoaded ? arrowLayout : hiddenLayout,
            }}
          />
        </MapSource>
      )}
      <MapBounds
        // @ts-ignore
        bounds={countryBounds}
      />
    </Map>
  );
}

export default RiskImminentMap;
