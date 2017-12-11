'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';

import { environment, mbtoken } from '../../config';
import { getEmergenciesList } from '../../actions';
import {
  FormRadioGroup
} from '../form-elements/';

import { showGlobalLoading, hideGlobalLoading } from '../global-loading';

class Homemap extends React.Component {
  componentDidMount () {
  }

  componentWillReceiveProps (nextProps) {
  }

  renderEmergencies () {
    const emerg = this.props.appealsList.data.emergenciesByType;
    const max = Math.max.apply(Math, emerg.map(o => o.items.length));

    return (
      <div className='emergencies'>
        <h2>Emergencies by Type</h2>
        <dl className='dl--horizontal'>
          {emerg.map(o => (
            <React.Fragment key={o.id}>
              <dt>{o.name}</dt>
              <dd><Progress value={o.items.length} max={max}><span>100</span></Progress></dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    );
  }

  render () {
    const {
      fetched,
      error
    } = this.props.appealsList;

    if (!fetched) return null;

    return (
      <div className='stats-map'>
        <div className='inner'>
          {!error ? (
            <React.Fragment>
              {this.renderEmergencies()}
              <div className='map-container'>
                <h2 className='visually-hidden'>Map</h2>
                <MapErrorBoundary><Map /></MapErrorBoundary>
              </div>
            </React.Fragment>
          ) : (
            <p>Oh no! An error ocurred getting the data.</p>
          )}
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  Homemap.propTypes = {
    appealsList: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  appealsList: state.overallStats.appealsList
});

const dispatcher = (dispatch) => ({
});

export default connect(selector, dispatcher)(Homemap);

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
  constructor (props) {
    super(props);

    this.state = {
      scaleBy: 'amount'
    };
  }

  componentDidMount () {
    this.setupMap();
  }

  componentWillUnmount () {
    if (this.theMap) {
      this.theMap.remove();
    }
  }

  onFieldChange (field, e) {
    this.setState({ [field]: e.target.value });
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
  }

  render () {
    return (
      <figure className='map-vis'>
        <div className='map-vis__holder' ref='map'/>
        <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
          <dl className='legend__dl legend__dl--colors'>
            <dt className='color color--red'>Red</dt>
            <dd>Emergency Appeal</dd>
            <dt className='color color--yellow'>Yellow</dt>
            <dd>DREF</dd>
            <dt className='color color--grey'>Grey</dt>
            <dd>Movement Response</dd>
          </dl>
        </figcaption>
        <figcaption className='map-vis__legend map-vis__legend--top-right legend'>
          <form className='form'>
            <FormRadioGroup
              label='Scale points by'
              name='map-scale'
              classWrapper='map-scale-options'
              options={[
                {
                  label: 'Appeal/DREF amount',
                  value: 'amount'
                },
                {
                  label: 'Target People',
                  value: 'population'
                }
              ]}
              inline={false}
              selectedOption={this.state.scaleBy}
              onChange={this.onFieldChange.bind(this, 'scaleBy')} />
          </form>
        </figcaption>
      </figure>
    );
  }
}
