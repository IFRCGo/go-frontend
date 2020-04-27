import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import mapboxgl from 'mapbox-gl';

import store from '../../utils/store';
import newMap from '../../utils/get-new-map';
import { getRegionBoundingBox } from '../../utils/region-bounding-box';
import { getCentroidByCountryId } from '../../utils/country-centroids';

import ActivityDetails from './activity-details';

const emptyList = [];

function getGeojsonFromMovementActivities (movementActivities = emptyList) {
  const geojson = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: movementActivities.map(d => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: getCentroidByCountryId(d.id),
        },
        properties: {
          ...d,
        }
      })),
    }
  };

  return geojson;
}

function Map (props) {
  const {
    regionId,
    data,
  } = props;

  const ref = React.useRef();
  const [map, setMap] = React.useState();
  const [mapLoaded, setMapLoaded] = React.useState(false);

  React.useEffect(() => {
    const { current: mapContainer } = ref;
    setMap(newMap(mapContainer));
  }, [setMap]);

  React.useEffect(() => {
    if (!map) {
      return;
    }

    map.on('load', () => {
      const bbox = getRegionBoundingBox(regionId);
      map.fitBounds(bbox);
      setMapLoaded(true);
    });
  }, [map, setMapLoaded]);

  React.useEffect(() => {
    if (!map || !mapLoaded) {
      return;
    }

    const geojson = getGeojsonFromMovementActivities(data);

    try {
      if (map.getLayer('movement-activity-circles')) {
        map.removeLayer('movement-activity-circles');
      }
      map.removeSource('movement-activity-markers');
    } catch (err) {
    }

    map.addSource('movement-activity-markers', geojson);
    map.addLayer({
      id: 'movement-activity-circles',
      source: 'movement-activity-markers',
      type: 'circle',
      paint: {
        'circle-radius': 7,
        'circle-color': '#f5333f',
        'circle-opacity': 0.7,
      },
    });

    map.on('click', 'movement-activity-circles', (e) => {
      const properties = e.features[0].properties;
      const popoverContent = document.createElement('div');

      render(
        (
          <Provider store={store}>
            <ActivityDetails data={properties} />
          </Provider>
        ),
        popoverContent,
      );

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setDOMContent(popoverContent.children[0])
        .addTo(map);
    });
  }, [map, regionId, data, mapLoaded]);

  return (
    <div className='regional-threew-map-wrapper'>
      <div className='regional-threew-map' ref={ref} />
    </div>
  );
}

export default Map;
