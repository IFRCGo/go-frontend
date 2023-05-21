import { useContext, useEffect, useRef } from 'react';
import { MapChildContext } from '@togglecorp/re-map';
import mapboxgl, { LngLatLike } from 'mapbox-gl';

interface Props {
  center: LngLatLike;
  zoom: number;
  padding: mapboxgl.PaddingOptions;
  duration: number;
}

const MapEaseTo = (props: Props) => {
  const { map } = useContext(MapChildContext);
  const {
    center,
    zoom,
    padding,
    duration: durationFromProps,
  } = props;

  const durationRef = useRef(durationFromProps);

  useEffect(
    () => {
      durationRef.current = durationFromProps;
    },
    [durationFromProps],
  );

  useEffect(
    () => {
      if (!map || !center) {
        return;
      }

      const duration = durationRef.current;

      map.setPadding(padding);
      map.easeTo({
        center: center,
        zoom: zoom,
        duration,
      });
    },[map, center, zoom, padding]);

  return null;
};

export default MapEaseTo;

