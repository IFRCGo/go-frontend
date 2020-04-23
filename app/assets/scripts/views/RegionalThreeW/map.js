import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';

import newMap from '../../utils/get-new-map';
import { getRegionBoundingBox } from '../../utils/region-bounding-box';
import { getCentroidByCountryId } from '../../utils/country-centroids';

function Map (props) {
  const {
    regionId,
    data,
  } = props;

  const ref = React.useRef();
  React.useEffect(() => {
    const { current: mapContainer } = ref;
    const map = newMap(mapContainer);

    map.on('load', () => {
      const bbox = getRegionBoundingBox(regionId);
      map.fitBounds(bbox);

      const geojson = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: data.map(d => ({
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
        console.warn(properties);
        const popoverContent = document.createElement('div');
        render(
          (
            <div>
              <div>
                { properties.name }
              </div>
              <div>
                <div>
                  Projects
                </div>
                <div>
                  { properties.projects_count }
                </div>
              </div>
            </div>
          ),
          popoverContent,
        );

        new mapboxgl.Popup({ closeButton: false })
          .setLngLat(e.lngLat)
          .setDOMContent(popoverContent.children[0])
          .addTo(map);
      });
    });
  }, [regionId, data]);

  return (
    <div className='regional-threew-map-wrapper'>
      <div className='regional-threew-map' ref={ref} />
    </div>
  );
}

export default Map;
