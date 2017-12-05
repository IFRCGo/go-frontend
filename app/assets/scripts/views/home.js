'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';

import App from './app';
import Fold from '../components/fold';

import { environment, mbtoken } from '../config';

export default class Home extends React.Component {
  render () {
    return (
      <App className='page--homepage'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>IFRC Disaster Response and Prepardness</h1>
                <p className='inpage__introduction'>In the beginning the Universe was created. This has made a lot of people very upset and been widely regarded as a bad move.</p>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <section className='fold--stats'>
              <h1 className='visually-hidden'>Statistics</h1>
              <div className='stats-overall'>
                <div className='inner'>
                  <h1 className='visually-hidden'>Overall stats</h1>
                  <ul className='sumstats'>
                    <li className='sumstats__item'>
                      <span className='sumstats__value'>38</span>
                      <span className='sumstats__key'>Active DREF Operations</span>
                    </li>
                    <li className='sumstats__item'>
                      <span className='sumstats__value'>38</span>
                      <span className='sumstats__key'>Active Emergency Appeals</span>
                    </li>
                    <li className='sumstats__item'>
                      <span className='sumstats__value'>69%</span>
                      <span className='sumstats__key'>Emergency Appeals Funded</span>
                    </li>
                    <li className='sumstats__item'>
                      <span className='sumstats__value'>623.8M</span>
                      <span className='sumstats__key'>Budget for DREFs and Appeals</span>
                    </li>
                    <li className='sumstats__item'>
                      <span className='sumstats__value'>19.2M</span>
                      <span className='sumstats__key'>Targeted Population</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='stats-map'>
                <div className='inner'>
                  <div className='emergencies'>
                    <h2>Emergencies by Type</h2>
                    <dl className='dl--horizontal'>
                      <dt>Hurricane</dt>
                      <dd><Progress value={100} max={100}><span>100</span></Progress></dd>
                      <dt>Flood</dt>
                      <dd><Progress value={80} max={100}><span>80</span></Progress></dd>
                      <dt>Earthquake</dt>
                      <dd><Progress value={60} max={100}><span>60</span></Progress></dd>
                      <dt>Famine</dt>
                      <dd><Progress value={60} max={100}><span>60</span></Progress></dd>
                      <dt>Drought</dt>
                      <dd><Progress value={40} max={100}><span>40</span></Progress></dd>
                    </dl>
                  </div>
                  <div className='map-container'>
                    <h2 className='visually-hidden'>Map</h2>
                    <MapErrorBoundary><Map /></MapErrorBoundary>
                  </div>
                </div>
              </div>
              <div className='stats-chart'>
                <div className='inner'>
                  Charts here
                </div>
              </div>
            </section>
            <div className='inner'>
              <Fold title='Latest Alerts'>
                Alert!
              </Fold>
            </div>
          </div>
        </section>
      </App>
    );
  }
}

const Progress = ({max, value, children}) => {
  return (
    <div className='progress-bar'>
      <div className='progress-bar__value' style={{width: `${value / max * 100}%`}}>{children}</div>
    </div>
  );
};

if (environment !== 'production') {
  Progress.propTypes = {
    max: T.number,
    value: T.number,
    children: T.object
  };
}

class MapErrorBoundary extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true });
    console.log('Map error', error, info);
  }

  render () {
    if (this.state.hasError) {
      return (
        <div className='map-error'>
          <p>An error ocurred with the map</p>
        </div>
      );
    }
    return this.props.children;
  }
}

if (environment !== 'production') {
  MapErrorBoundary.propTypes = {
    children: T.object
  };
}

// ///////////////
// ///////////////
// ///////////////
// ///////////////

class Map extends React.Component {
  componentDidMount () {
    this.setupMap();
  }

  componentWillUnmount () {
    if (this.theMap) {
      this.theMap.remove();
    }
  }

  setupMap () {
    mapboxgl.accessToken = mbtoken;

    const mapStyle = {
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

    this.theMap = new mapboxgl.Map({
      container: this.refs.map,
      style: mapStyle,
      attributionControl: false
    });
  }

  render () {
    return (
      <figure className='vis__media'>
        <div className='vis__map' ref='map'/>
      </figure>
    );
  }
}
