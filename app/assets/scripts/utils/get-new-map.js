'use strict';
import mapboxgl from 'mapbox-gl';
import { mbtoken } from '../config';

export const source = 'SOURCE';
export const countryLabelId = 'country-label';
const DISTRICT_MINZOOM = 4;

export const mapStyle = {
  version: 8,
  glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
  sources: {
    ifrc: {
      type: 'vector',
      url: 'mapbox://go-ifrc.go-tiles-v2'
    },
    streets: {
      type: 'vector',
      url: 'mapbox://mapbox.mapbox-streets-v7'
    }
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': 'hsl(218, 38%, 22%)'
      }
    },
    {
      id: 'country',
      type: 'fill',
      source: 'ifrc',
      'source-layer': 'country',
      paint: {
        'fill-color': 'hsl(213, 38%, 28%)',
        'fill-opacity': 1
      }
    },
    {
      id: 'district',
      type: 'fill',
      source: 'ifrc',
      'source-layer': 'adm1',
      paint: {
        'fill-color': 'rgba(0, 0, 0, 0)'
      },
      minzoom: DISTRICT_MINZOOM
    },
    {
      id: 'country-boundary',
      type: 'line',
      source: 'ifrc',
      'source-layer': 'country',
      layout: {
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'hsla(209, 16%, 50%, 0.8)',
        'line-width': 0.7
      }
    },
    {
      id: 'district-boundary',
      type: 'line',
      source: 'ifrc',
      'source-layer': 'adm1',
      layout: {
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'hsla(209, 16%, 50%, 0.4)',
        'line-width': 0.4
      },
      minzoom: DISTRICT_MINZOOM
    },
    {
      id: countryLabelId,
      type: 'symbol',
      source: 'streets',
      'source-layer': 'country_label',
      maxzoom: 12,
      layout: {
        'text-field': '{name_en}',
        'text-font': [
          'Open Sans Regular',
          'Arial Unicode MS Regular'
        ],
        'text-max-width': 10,
        'text-size': {
          'stops': [
            [
              3,
              11
            ],
            [
              8,
              20
            ]
          ]
        }
      },
      paint: {
        'text-color': '#EEE',
        'text-halo-color': 'rgba(0,0,0,0.75)',
        'text-halo-width': 0.25,
        'text-halo-blur': 0
      },
      filter: [
        '==',
        '$type',
        'Point'
      ]
    }
  ]
};

export default function newMap (container) {
  mapboxgl.accessToken = mbtoken;
  const map = new mapboxgl.Map({
    container: container,
    style: mapStyle,
    zoom: 1,
    maxZoom: 12,
    scrollZoom: false,
    pitchWithRotate: false,
    dragRotate: false,
    renderWorldCopies: false,
    maxBounds: [
      [-180, -90],
      [180, 90]
    ],
    attributionControl: false,
    preserveDrawingBuffer: true
  });
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  // Disable map rotation using right click + drag.
  map.dragRotate.disable();

  // Disable map rotation using touch rotation gesture.
  map.touchZoomRotate.disableRotation();

  // Remove compass.
  document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass').remove();

  return map;
}
