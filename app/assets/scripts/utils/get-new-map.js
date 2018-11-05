'use strict';
import mapboxgl from 'mapbox-gl';
import { mbtoken } from '../config';

export const source = 'SOURCE';
export default function newMap (container) {
  mapboxgl.accessToken = mbtoken;
  const map = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/go-ifrc/cjkdzcum95m7l2sqgo3i7cv4q',
    zoom: 1.01,
    minZoom: 1,
    maxZoom: 6,
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

  return map;
}
