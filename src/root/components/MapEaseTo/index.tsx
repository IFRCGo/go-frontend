import { useContext, useEffect, useRef } from 'react';
import { MapChildContext } from '@togglecorp/re-map';
import {
  BoundingBox,
  viewport as Viewport,
} from '@mapbox/geo-viewport';

interface Props {
  bounds: BoundingBox;
  padding:  mapboxgl.PaddingOptions;
  duration: number;
}

const MapEaseTo = (props: Props) => {
  const { map } = useContext(MapChildContext);
  const {
    duration: durationFromProps,
    bounds,
    padding,
  } = props;

  const durationRef = useRef(durationFromProps);

  useEffect(
    () => {
      durationRef.current = durationFromProps;
    },
    [durationFromProps],
  );

  // Handle change in bounds
  useEffect(
    () => {
      if (!map || !bounds) {
        return;
      }
      // const duration = durationRef.current;

      const newViewPort = Viewport(
        // [ 96.48752327535203,
        //   -54.79574454956139,
        //   215.4206231266757,
        //   22.436774161267408],
        bounds,
        [640, 480],
        1,
        8,
      );
      map.setPadding(padding);

      console.log("test test test", newViewPort);

      map.jumpTo({
        center: newViewPort.center,
        zoom: newViewPort.zoom,
      });

    },[map, bounds, padding]);

  return null;
};

export default MapEaseTo;

