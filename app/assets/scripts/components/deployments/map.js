'use strict';
import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';

import { source } from '../../utils/get-new-map';
import { environment } from '../../config';
import MapComponent from '../map';
import { commaSeparatedNumber as n } from '../../utils/format';

const circleMax = 10;

export default class DeploymentsMap extends React.Component {
  constructor (props) {
    super(props);
    const { fetched, error } = props.eruOwners;
    this.state = {
      layers: !fetched || error ? [] : this.getLayers(props.eruOwners.data.geoJSON),
      filters: []
    };
    this.configureMap = this.configureMap.bind(this);
  }

  componentWillReceiveProps ({eruOwners}) {
    if (!this.props.eruOwners.fetched && eruOwners.fetched && !eruOwners.error) {
      this.setState({
        layers: this.getLayers(eruOwners.data.geoJSON)
      });
    }
  }

  configureMap (theMap) {
    theMap.on('click', 'deployments', e => {
      this.showPopover(theMap, e.features[0]);
    });
    theMap.on('mousemove', 'deployments', e => {
      theMap.getCanvas().style.cursor = 'pointer';
    });
    theMap.on('mouseleave', 'deployments', e => {
      theMap.getCanvas().style.cursor = '';
    });
  }

  getLayers (geoJSON) {
    const ccolor = {
      property: 'type',
      type: 'categorical',
      stops: [
        ['fact', '#C22A26'],
        ['eru', '#F39C12']
      ]
    };

    const maxScaleValue = Math.max.apply(Math, geoJSON.features.map(o => o.properties.total));
    const cradius = {
      property: 'total',
      stops: [
        [0, 3],
        [maxScaleValue, circleMax]
      ]
    };

    const layers = [];
    layers.push({
      id: 'deployments',
      type: 'circle',
      source,
      paint: {
        'circle-color': ccolor,
        'circle-radius': cradius
      }
    });

    return layers;
  }

  onPopoverCloseClick () {
    if (this.popover) {
      this.popover.remove();
    }
  }

  showPopover (theMap, feature) {
    let popoverContent = document.createElement('div');

    render(<MapPopover
      title={feature.properties.name}
      totalDeployed={feature.properties.total}
      units={feature.properties.units}
      onCloseClick={this.onPopoverCloseClick.bind(this)} />, popoverContent);

    // Populate the popup and set its coordinates
    // based on the feature found.
    if (this.popover != null) {
      this.popover.remove();
    }

    this.popover = new mapboxgl.Popup({closeButton: false})
      .setLngLat(feature.geometry.coordinates)
      .setDOMContent(popoverContent.children[0])
      .addTo(theMap);
  }

  render () {
    const {
      fetched,
      data
    } = this.props.eruOwners;

    if (!fetched) return null;

    const maxScaleValue = Math.max.apply(Math, data.geoJSON.features.map(o => o.properties.total));

    return (
      <div className='stats-map emergencies-map'>
        <div className='inner'>
          <div className='map-container'>
            <h2 className='visually-hidden'>Deployments by Country</h2>
            <MapComponent className='map-vis__holder'
              configureMap={this.configureMap}
              layers={this.state.layers}
              filters={this.state.filters}
              geoJSON={data.geoJSON}>

              <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
                <div className='key'>
                  <label className='form__label'>Key</label>
                  <dl className='legend__dl legend__dl--colors'>
                    <dt className='color color--yellow'>yellow</dt>
                    <dd>Deployed ERU</dd>
                  </dl>
                </div>

                <div className='scale'>
                  <dl>
                    <dt style={{'width': circleMax + 'px', 'height': circleMax + 'px'}}>{circleMax}</dt>
                    <dd>{maxScaleValue} ERU(s)</dd>
                  </dl>
                </div>
              </figcaption>

            </MapComponent>
          </div>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  DeploymentsMap.propTypes = {
    eruOwners: T.object
  };
}

class MapPopover extends React.Component {
  render () {
    const {
      title,
      units,
      totalDeployed
    } = this.props;
    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <div className='popover__headline'>
              <a className='link--primary'>{title}</a>
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li><button type='button' className='actions__menu-item poa-xmark' title='Close popover' onClick={this.props.onCloseClick}><span>Dismiss</span></button></li>
              </ul>
            </div>
          </header>
          <div className='popover__body'>
            <p className='popover__stat'>{n(totalDeployed)} ERUs deployed</p>
            {units.split('|').map(unit => (
              <p className='popover__stat' key={unit}>{unit}</p>
            ))}
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
    units: T.string,
    totalDeployed: T.number
  };
}
