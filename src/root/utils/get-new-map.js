'use strict';
import mapboxgl from 'mapbox-gl';
import { mbtoken } from '../config';

export const source = 'SOURCE';
export default function newMap (container, mapStyle = 'mapbox://styles/go-ifrc/cjy5ugr3y11nj1cpjmrqd48u2') {
  mapboxgl.accessToken = mbtoken;
  const map = new mapboxgl.Map({
    container: container,
    style: mapStyle,
    zoom: 1.5,
    minZoom: 1,
    maxZoom: 8,
    scrollZoom: false,
    pitchWithRotate: false,
    dragRotate: false,
    renderWorldCopies: false,
    attributionControl: false,
    preserveDrawingBuffer: true
  });
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  // Disable map rotation using right click + drag.
  map.dragRotate.disable();

  // Disable map rotation using touch rotation gesture.
  map.touchZoomRotate.disableRotation();

  // Remove compass.
  var child = document.querySelector('.mapboxgl-ctrl .mapboxgl-ctrl-compass');
  child.parentNode.removeChild(child);

  /*
  map.on('styledata', (e) => {
    console.warn('styledata', e);
  });
  */

  return map;
}
