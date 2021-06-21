export const defaultMapStyle = 'mapbox://styles/go-ifrc/cki7aznup3hqz19rxliv3naf4';

export const defaultMapOptions = {
  logoPosition: 'bottom-left' as const,
  zoom: 1.5,
  minZoom: 0,
  maxZoom: 8,
  scrollZoom: false,
  pitchWithRotate: false,
  dragRotate: false,
  renderWorldCopies: true,
  attributionControl: true,
  preserveDrawingBuffer: true,
  // interactive: false,
};

export const COLOR_RED = '#f5333f';
export const COLOR_YELLOW = '#ff9e00';
export const COLOR_BLUE = '#4c5d9b';
export const COLOR_ORANGE = '#ff6b00';

export function getPointCirclePaint(color: string): mapboxgl.CirclePaint {
  return {
    'circle-color': color,
    'circle-radius': 5,
    'circle-opacity': 1,
    'circle-pitch-alignment': 'map',
  };
}

export function getPointCircleHaloPaint(
  color: string,
  scaleProp: string,
  maxScaleValue: number,
): mapboxgl.CirclePaint  {
  return {
    ...getPointCirclePaint(color),
    'circle-opacity': 0.4,
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      3, [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', scaleProp]],
        0,
        0,
        1,
        10,
        maxScaleValue,
        15
      ],
      8, [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', scaleProp]],
        0,
        0,
        1,
        20,
        maxScaleValue,
        40,
      ],
    ],
  };
}
