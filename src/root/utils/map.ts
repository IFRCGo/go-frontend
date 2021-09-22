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

export const COLOR_WHITE = '#ffffff';
export const COLOR_LIGHT_GREY = '#717171';
export const COLOR_BLACK = '#000000';
export const COLOR_RED = '#f5333f';
export const COLOR_YELLOW = '#ff9e00';
export const COLOR_BLUE = '#4c5d9b';
export const COLOR_ORANGE = '#ff6b00';

export const OPERATION_TYPE_PROGRAMME = 0;
export const OPERATION_TYPE_EMERGENCY = 1;
export const OPERATION_TYPE_MULTI = -1;

export const pointColorMap: {
  [key: number]: string;
} = {
  [OPERATION_TYPE_EMERGENCY]: COLOR_BLUE,
  [OPERATION_TYPE_PROGRAMME]: COLOR_RED,
  [OPERATION_TYPE_MULTI]: COLOR_ORANGE,
};

const DEFAULT_CIRCLE_SIZE = 'medium';
const DEFAULT_CIRCLE_OPACITY = 'full';

export function getPointCirclePaint(
  color: string,
  size: 'small' | 'medium' | 'large' | 'extraLarge' = DEFAULT_CIRCLE_SIZE,
  opacity: 'full' | 'light' = DEFAULT_CIRCLE_OPACITY,
): mapboxgl.CirclePaint {
  const sizeMap = {
    small: 3,
    medium: 5,
    large: 8,
    extraLarge: 12,
  };

  const opacityMap = {
    full: 1,
    light: 0.7,
  };

  return {
    'circle-color': color,
    'circle-radius': sizeMap[size] ?? DEFAULT_CIRCLE_SIZE,
    'circle-opacity': opacityMap[opacity] ?? DEFAULT_CIRCLE_OPACITY,
    'circle-pitch-alignment': 'map',
  };
}

export function getPointCircleHaloPaint(
  color: string,
  scaleProp: string,
  maxScaleValue: number,
): mapboxgl.CirclePaint  {

  // NOTE: setting this value as 2 because there are already stops of 0
  // and 1
  const maxScale = Math.max(maxScaleValue, 2);

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
        maxScale,
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
        maxScale,
        40,
      ],
    ],
  };
}
