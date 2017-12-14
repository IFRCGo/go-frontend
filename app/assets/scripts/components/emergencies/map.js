'use strict';
import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';

import { source } from '../../utils/get-new-map';
import { environment, mbtoken } from '../../config';
import {
  FormRadioGroup
} from '../form-elements/';
import MapComponent from '../map';

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
        ['total', '#C22A26'],
        ['none', '#F39C12'],
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

  render () {
    const {
      fetched,
      receivedAt,
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
