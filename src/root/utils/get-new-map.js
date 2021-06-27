import mapboxgl from 'mapbox-gl';

export const source = 'SOURCE';
export default function newMap (container, mapStyle = 'mapbox://styles/go-ifrc/cki7aznup3hqz19rxliv3naf4', mapOptions = {}) {
  const map = new mapboxgl.Map({
    container: container,
    style: mapStyle,
    zoom: 1.5,
    minZoom: 1,
    maxZoom: 8,
    scrollZoom: false,
    pitchWithRotate: false,
    dragRotate: false,
    renderWorldCopies: true,
    attributionControl: true,
    preserveDrawingBuffer: true,
    ...mapOptions,
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
