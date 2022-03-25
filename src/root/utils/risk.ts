import {
  COLOR_BLACK,
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

export const pointImageOptions = {
    sdf: true,
};

export const geoJsonSourceOptions: mapboxgl.GeoJSONSourceRaw = {
    type: 'geojson',
};

export const pointCirclePaint: mapboxgl.CirclePaint = {
  'circle-color': COLOR_WHITE,
  'circle-radius': CIRCLE_RADIUS_SUPER_LARGE,
  'circle-opacity': 0.8,
  'circle-stroke-color': [
    'case',
    ['boolean', ['feature-state', 'hovered'], false],
    COLOR_RED,
    COLOR_BLACK,
  ],
  'circle-stroke-width': 1,
  'circle-stroke-opacity': 0.5,
};

export const iconPaint: mapboxgl.SymbolPaint = {
  'icon-opacity': 0.8,
};

export const hiddenLayout: mapboxgl.LineLayout = {
  visibility: 'none',
};
