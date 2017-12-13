'use strict';
import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';

import { environment, mbtoken } from '../config';
import {
  FormRadioGroup
} from './form-elements/';
import Progress from './progress';

export default class Homemap extends React.Component {
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
      receivedAt,
      error,
      data
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
                <MapErrorBoundary>
                  <Map
                    geoJSON={data.geoJSON}
                    receivedAt={receivedAt} />
                </MapErrorBoundary>
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

  componentDidUpdate (prevProps, prevState) {
    if (this.props.receivedAt !== prevProps.receivedAt) {
      let source = this.theMap.getSource('appeals');
      if (source) {
        source.setData(this.props.geoJSON);
      } else {
        this.setupData();
      }
    }

    if (this.state.scaleBy !== prevState.scaleBy) {
      this.theMap.setPaintProperty('appeals', 'circle-radius', this.getCircleRadiusPaintProp());
      this.onPopoverCloseClick();
    }
  }

  componentWillUnmount () {
    if (this.theMap) {
      this.theMap.remove();
    }
  }

  onFieldChange (field, e) {
    this.setState({ [field]: e.target.value });
  }

  getCircleRadiusPaintProp () {
    const scaleProp = this.state.scaleBy === 'amount' ? 'amountRequested' : 'numBeneficiaries';
    const maxScaleValue = Math.max.apply(Math, this.props.geoJSON.features.map(o => o.properties[scaleProp]));

    return {
      property: scaleProp,
      stops: [
        [0, 3],
        [maxScaleValue, 10]
      ]
    };
  }

  setupMap () {
    this.mapLoaded = false;
    this.popover = null;

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

    this.theMap.on('style.load', () => {
      this.mapLoaded = true;
      this.setupData();
    });

    this.theMap.on('click', 'appeals', e => {
      this.showPopover(e.features[0]);
    });

    this.theMap.on('mousemove', 'appeals', e => {
      this.theMap.getCanvas().style.cursor = 'pointer';
    });

    this.theMap.on('mouseleave', 'appeals', e => {
      this.theMap.getCanvas().style.cursor = '';
    });
  }

  setupData () {
    if (!this.mapLoaded) {
      return;
    }

    if (!this.theMap.getSource('appeals')) {
      this.theMap.addSource('appeals', {
        type: 'geojson',
        data: this.props.geoJSON
      });

      this.theMap.addLayer({
        'id': 'appeals',
        'type': 'circle',
        'source': 'appeals',
        'paint': {
          'circle-color': {
            property: 'atype',
            type: 'categorical',
            stops: [
              [0, '#F39C12'],
              [1, '#C22A26'],
              [2, '#CCCCCC']
            ]
          },
          'circle-radius': this.getCircleRadiusPaintProp()
        }
      });
    }
  }

  onPopoverCloseClick () {
    this.popover.remove();
  }

  showPopover (feature) {
    let popoverContent = document.createElement('div');

    render(<MapPopover
      title={feature.properties.name}
      numBeneficiaries={feature.properties.numBeneficiaries}
      amountRequested={feature.properties.amountRequested}
      amountFunded={feature.properties.amountFunded}
      onCloseClick={this.onPopoverCloseClick.bind(this)} />, popoverContent);

    // Populate the popup and set its coordinates
    // based on the feature found.
    if (this.popover != null) {
      this.popover.remove();
    }

    this.popover = new mapboxgl.Popup({closeButton: false})
      .setLngLat(feature.geometry.coordinates)
      .setDOMContent(popoverContent.children[0])
      .addTo(this.theMap);
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

if (environment !== 'production') {
  Map.propTypes = {
    geoJSON: T.object,
    receivedAt: T.number
  };
}

class MapPopover extends React.Component {
  render () {
    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <div className='popover__headline'>
              <h1 className='popover__title'>{this.props.title}</h1>
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li><button type='button' className='actions__menu-item poa-xmark' title='Close popover' onClick={this.props.onCloseClick}><span>Dismiss</span></button></li>
              </ul>
            </div>
          </header>
          <div className='popover__body'>
            <dl className='dl--horizontal'>
              <dt>People Affected</dt>
              <dd>{this.props.numBeneficiaries}</dd>
              <dt>Amount Requested</dt>
              <dd>{this.props.amountRequested}</dd>
              <dt>Amount Funded</dt>
              <dd>{this.props.amountFunded}</dd>
            </dl>
          </div>
        </div>
      </article>
    );
  }
}

if (environment !== 'production') {
  MapPopover.propTypes = {
    onCloseClick: T.func,
    title: T.string,
    numBeneficiaries: T.number,
    amountRequested: T.number,
    amountFunded: T.number
  };
}
