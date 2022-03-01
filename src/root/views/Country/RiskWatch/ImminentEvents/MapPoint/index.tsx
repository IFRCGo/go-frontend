import React from 'react';
import Map, {
  MapSource,
  MapLayer,
  MapImage,
} from '@togglecorp/re-map';

import useBooleanState from '#hooks/useBooleanState';

import {
  ImminentHazardTypes,
  PointGeoJsonProps,
  hazardTypeToIconMap,
  hiddenLayout,
  pointImageOptions,
  geoJsonSourceOptions,
  pointCirclePaint,
  iconPaint,
} from '../common';

export interface Props {
  hazardKey: ImminentHazardTypes;
  geoJson: GeoJSON.FeatureCollection<GeoJSON.Point, PointGeoJsonProps>;
  onPointClick?: (
    feature: mapboxgl.MapboxGeoJSONFeature,
    lngLat: mapboxgl.LngLat,
  ) => boolean;
  onMouseEnter?: (
    feature: mapboxgl.MapboxGeoJSONFeature,
    lngLat: mapboxgl.LngLat,
  ) => void;
  onMouseLeave?: (map: mapboxgl.Map) => void;
  activeHazardId: number | undefined;
}

function MapPoint(props: Props) {
  const {
    hazardKey,
    geoJson,
    onPointClick,
    onMouseEnter,
    onMouseLeave,
    activeHazardId,
  } = props;

  const [iconLoaded, setIconLoaded] = useBooleanState(false);
  const circlePaint: mapboxgl.CirclePaint = React.useMemo(() => ({
    ...pointCirclePaint,
    'circle-stroke-color': [
      'case',
      [
        '==',
        ['get', 'hazardId'],
        activeHazardId ?? '',
      ],
      '#f5333f',
      '#a0a0a0',
    ],
  }), [activeHazardId]);

  return (
    <>
      <MapImage
        name={`${hazardKey}-icon`}
        url={hazardTypeToIconMap[hazardKey]}
        imageOptions={pointImageOptions}
        onLoad={setIconLoaded}
      />
      <MapSource
        sourceKey={`${hazardKey}-points`}
        sourceOptions={geoJsonSourceOptions}
        geoJson={geoJson}
      >
        <MapLayer
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onPointClick}
          layerKey={`${hazardKey}-points-circle`}
          layerOptions={{
            type: 'circle',
            paint: circlePaint,
          }}
        />
        <MapLayer
          layerKey={`${hazardKey}-icon`}
          layerOptions={{
            type: 'symbol',
            paint: iconPaint,
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

export default MapPoint;
