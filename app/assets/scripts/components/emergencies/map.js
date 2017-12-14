'use strict';
import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';

import { source } from '../../utils/get-new-map';
import { environment } from '../../config';
import {
  FormRadioGroup
} from '../form-elements/';
import MapComponent from '../map';
import { commaSeparatedNumber as n } from '../../utils/format';

export default class EmergenciesMap extends React.Component {
  constructor (props) {
    super(props);
    const scaleBy = 'totalEmergencies';
    this.state = {
      scaleBy,
      layers: [],
      filters: []
    };
    this.configureMap = this.configureMap.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  componentWillReceiveProps ({lastMonth}) {
    if (!this.props.lastMonth.fetched && lastMonth.fetched && !lastMonth.error) {
      this.setState({
        layers: this.getLayers(lastMonth.data.geoJSON, this.state.scaleBy)
      });
    }
  }

  configureMap (theMap) {
    theMap.on('click', 'emergencies', e => {
      this.showPopover(theMap, e.features[0]);
    });
    theMap.on('mousemove', 'emergencies', e => {
      theMap.getCanvas().style.cursor = 'pointer';
    });
    theMap.on('mouseleave', 'emergencies', e => {
      theMap.getCanvas().style.cursor = '';
    });
  }

  onFieldChange (e) {
    const scaleBy = e.target.value;
    this.setState({
      layers: this.getLayers(this.props.lastMonth.data.geoJSON, scaleBy),
      scaleBy
    });
  }

  getLayers (geoJSON, scaleBy) {
    const ccolor = {
      property: 'responseStatus',
      type: 'categorical',
      stops: [
        ['total', '#F39C12'],
        ['none', '#C22A26'],
        ['mixed', '#C689B9']
      ]
    };

    const maxScaleValue = Math.max.apply(Math, geoJSON.features.map(o => o.properties[scaleBy]));
    const cradius = {
      property: scaleBy,
      stops: [
        [0, 3],
        [maxScaleValue, 10]
      ]
    };

    const layers = [];
    layers.push({
      id: 'emergencies',
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
      numAffected={feature.properties.numAffected}
      totalEmergencies={feature.properties.totalEmergencies}
      withResponse={feature.properties.withResponse}
      withoutResponse={feature.properties.withoutResponse}
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
      error,
      data
    } = this.props.lastMonth;

    if (!fetched) return null;

    return (
      <div className='stats-map'>
        <div className='inner'>
          {!error ? (
            <div className='map-container'>
              <h2 className='visually-hidden'>Emergencies by Country</h2>
              <MapComponent className='map-vis__holder'
                configureMap={this.configureMap}
                layers={this.state.layers}
                filters={this.state.filters}
                geoJSON={data.geoJSON}>
                <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
                  <form className='form'>
                    <FormRadioGroup
                      label='Scale points by'
                      name='map-scale'
                      classWrapper='map-scale-options'
                      options={[
                        {
                          label: 'Number of Emergencies',
                          value: 'totalEmergencies'
                        },
                        {
                          label: 'Number of People Affected',
                          value: 'numAffected'
                        }
                      ]}
                      inline={false}
                      selectedOption={this.state.scaleBy}
                      onChange={this.onFieldChange} />
                  </form>
                </figcaption>
                <div className='key'>
                  <label className='form__label'>key</label>
                  <dl className='legend__dl legend__dl--colors'>
                    <dt className='color color--red'>red</dt>
                    <dd>No International Response</dd>
                    <dt className='color color--yellow'>yellow</dt>
                    <dd>Full International Response</dd>
                    <dt className='color color--purple'>purple</dt>
                    <dd>Mixed Level of Response</dd>
                  </dl>
                </div>
              </MapComponent>
            </div>
          ) : (
            <p>Oh no! An error ocurred getting the data.</p>
          )}
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  EmergenciesMap.propTypes = {
    lastMonth: T.object
  };
}

class MapPopover extends React.Component {
  render () {
    const {
      title,
      numAffected,
      totalEmergencies,
      withResponse,
      withoutResponse
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
            <p>{n(numAffected)} People Affected</p>
            <p>{n(totalEmergencies)} {totalEmergencies === 1 ? 'Emergency' : 'Emergencies'}</p>
            <dl className='popover__details'>
              <dd>{n(withResponse)}</dd>
              <dt>With response</dt>
              <dd>{n(withoutResponse)}</dd>
              <dt>Without Response</dt>
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
    numAffected: T.number,
    totalEmergencies: T.number,
    withResponse: T.number,
    withoutResponse: T.number
  };
}
