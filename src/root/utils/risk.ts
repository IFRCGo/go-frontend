import {
  COLOR_RED,
  COLOR_WHITE,
  CIRCLE_RADIUS_SUPER_LARGE,
} from '#utils/map';
import {ImminentHazardTypes } from '#types';

import earthquakeIcon from './risk-icons/earthquake.png';
import cycloneIcon from './risk-icons/cyclone.png';
import stormSurgeIcon from './risk-icons/storm-surge.png';
import floodIcon from './risk-icons/flood.png';
import droughtIcon from './risk-icons/drought.png';

export const COLOR_CYCLONE = '#a4bede';
export const COLOR_FLOOD = '#5a80b0';
export const COLOR_DROUGHT = '#dca592';
export const COLOR_FOOD_INSECURITY = '#c8ccb7';
export const COLOR_EARTHQUAKE = '#b09db2';
export const COLOR_STORM = '#97b8c2';


export const hazardTypeToIconMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in ImminentHazardTypes]: string;
} = {
  EQ: earthquakeIcon,
  TC: cycloneIcon,
  CY: cycloneIcon,
  SS: stormSurgeIcon,
  FL: floodIcon,
  DR: droughtIcon,
};

export const hazardKeys: ImminentHazardTypes[] = [
  'EQ',
  'CY',
  'TC',
  'SS',
  'FL',
  'DR',
];

export const hazardKeyToColorMap: Record<ImminentHazardTypes, string> = {
  EQ: COLOR_EARTHQUAKE,
  CY: COLOR_CYCLONE,
  TC: COLOR_CYCLONE,
  SS: COLOR_STORM,
  FL: COLOR_FLOOD,
  DR: COLOR_DROUGHT,
};


export const pointImageOptions = {
    sdf: true,
};

export const geoJsonSourceOptions: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};

export const pointCirclePaint: mapboxgl.CirclePaint = {
  'circle-color': [
    'case',
    ['boolean', ['feature-state', 'active'], false],
    COLOR_RED,
    ['boolean', ['feature-state', 'hovered'], false],
    COLOR_RED,
    [
      'match',
      ['get', 'hazardType'],
      ...(hazardKeys.map(hk => [hk, `${hazardKeyToColorMap[hk]}`]).flat(1)),
      COLOR_WHITE,
    ],
  ],
  'circle-radius': CIRCLE_RADIUS_SUPER_LARGE,
  'circle-opacity': 0.8,
  'circle-stroke-color': [
    'case',
    ['boolean', ['feature-state', 'hovered'], false],
    COLOR_RED,
    COLOR_WHITE,
  ],
  'circle-stroke-width': 1,
  'circle-stroke-opacity': 0.5,
};

export const iconPaint: mapboxgl.SymbolPaint = {
  'icon-color': COLOR_WHITE,
  'icon-opacity': 0.8,
};

export const hiddenLayout: mapboxgl.LineLayout = {
  visibility: 'none',
};
