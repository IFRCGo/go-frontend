'use strict';
import mapboxgl from 'mapbox-gl';
import { mbtoken } from '../config';

export const mapStyle = {
  'version': 8,
  'sources': {
    'ifrc': {
      'type': 'vector',
      'tiles': ['https://dsgofilestorage.blob.core.windows.net/tiles/{z}/{x}/{y}.pbf']
    }
  },
  'layers': [
    {
      'id': 'background',
      'type': 'background',
      'paint': {
        'background-color': 'hsl(218, 38%, 22%)'
      }
    },
    {
      'id': 'country',
      'type': 'fill',
      'source': 'ifrc',
      'source-layer': 'country',
      'filter': [
        '!in',
        'ADMIN',
        'Antarctica'
      ],
      'layout': {
        'visibility': 'visible'
      },
      'paint': {
        'fill-color': 'hsl(213, 38%, 28%)',
        'fill-opacity': 1,
        'fill-outline-color': 'hsla(209, 16%, 50%, 0.68)'
      }
    },
    {
      'id': 'population',
      'type': 'circle',
      'source': 'ifrc',
      'source-layer': 'population',
      'layout': {
        'visibility': 'visible'
      },
      'paint': {
        'circle-radius': 2,
        'circle-color': 'hsl(210, 77%, 11%)'
      }
    }
  ]
};

export default function newMap (container) {
  mapboxgl.accessToken = mbtoken;
  const map = new mapboxgl.Map({
    container: container,
    style: mapStyle,
    zoom: 1,
    maxZoom: 3.5,
    scrollZoom: false,
    center: [6, 15],
    pitchWithRotate: false,
    dragRotate: false,
    renderWorldCopies: false,
    maxBounds: [
      [-220, -70],
      [220, 70]
    ],
    attributionControl: false
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
