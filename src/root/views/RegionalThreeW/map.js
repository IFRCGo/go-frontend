import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter, Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';

import store from '#utils/store';
import newMap from '#utils/get-new-map';

import ActivityDetails from './activity-details';
import Translate from '#components/Translate';
import { getCountryMeta } from '../../utils/get-country-meta';
import turfBbox from '@turf/bbox';

const emptyList = [];

function getGeojsonFromMovementActivities (movementActivities = emptyList, countries) {
  const geojson = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: movementActivities.map(d => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: getCountryMeta(d.id, countries).centroid.coordinates || [0, 0],
        },
        properties: {
          ...d,
        }
      })),
    }
  };

  return geojson;
}

function ProgressBar (p) {
  const {
    value,
    max,
  } = p;
  const width = 100 * value / max;

  return (
    <div className='three-w-region-progress-bar'>
      <div
        className='three-w-region-progress-bar-progress'
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

const MAX_SCALE_STOPS = 6;

function Scale (p) {
  const { max } = p;
  const numbers = [];

  const diff = max / MAX_SCALE_STOPS;

  for (let i = 0; i <= max; i += diff) {
    numbers.push(i);
  }

  return (
    <div className='three-w-region-scale'>
      { numbers.map(n => <div key={n}>{n}</div>) }
    </div>
  );
}

function Map (props) {
  const {
    regionId,
    data,
    countries,
    regions,
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
      const bbox = turfBbox(regions[regionId][0].bbox);
      map.fitBounds(bbox);
      setMapLoaded(true);
    });
  }, [map, setMapLoaded, regionId, regions]);

  React.useEffect(() => {
    if (!map || !mapLoaded) {
      return;
    }

    const geojson = getGeojsonFromMovementActivities(data, countries);

    try {
      if (map.getLayer('movement-activity-circles')) {
        map.removeLayer('movement-activity-circles');
      }
      map.removeSource('movement-activity-markers');
    } catch (err) {
      // pass
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
            <BrowserRouter>
              <ActivityDetails data={properties} />
            </BrowserRouter>
          </Provider>
        ),
        popoverContent,
      );

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setDOMContent(popoverContent.children[0])
        .addTo(map);
    });
  }, [map, regionId, data, mapLoaded, countries]);

  const [supportingNSList, maxProjects] = React.useMemo(() => {
    const maxProjects = Math.max(...data.map(d => d.projects_count));
    const numBuckets = Math.ceil(maxProjects / MAX_SCALE_STOPS);
    const max = numBuckets * MAX_SCALE_STOPS;

    return [
      data.map(d => ({
        id: d.id,
        name: d.name,
        value: d.projects_count,
      })),
      max,
    ];
  }, [data]);

  return (
    <div className='regional-threew-map-wrapper'>
      <div className='regional-threew-map' ref={ref} />
      <div className='supporting-ns-list'>
        <Scale
          max={maxProjects}
        />
        <div className='supporting-ns-container'>
          { supportingNSList.map(d => (
            <div className='supporting-ns' key={d.name}>
              <div className='tc-label'>
                <div className='tc-name'>
                  <Link to={`/countries/${d.id}#3w`}>
                    { d.name }
                  </Link>
                </div>
                <div className='tc-value'>
                  <Translate stringId='supportingNSListProjects' params={{ noOfProjects: d.value }}/>
                </div>
              </div>
              <ProgressBar
                value={d.value}
                max={maxProjects}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Map);
