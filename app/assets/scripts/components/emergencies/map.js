'use strict';
import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';

import { environment, mbtoken } from '../../config';
import {
  FormRadioGroup
} from '../form-elements/';

export default class EmergenciesMap extends React.Component {
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
              <h2 className='visually-hidden'>Map</h2>
              <div/>
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
