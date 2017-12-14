'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import newMap, { source } from '../../utils/get-new-map';
import { get } from '../../utils/utils';
import { environment } from '../../config';

export default class MapComponent extends React.Component {
  setupData () {
    if (!this.theMap.getSource(source)) {
      this.theMap.addSource(source, {
        type: 'geojson',
        data: this.props.geoJSON
      });
    }
    get(this.props, 'layers', []).forEach(layer => this.theMap.addLayer(layer));
    get(this.props, 'filters', []).forEach(filter => this.theMap.setFilter(filter.layer, filter.filter));
  }

  componentDidMount () {
    const { setupListeners } = this.props;
    this.mapLoaded = false;
    this.popover = null;

    this.theMap = newMap(this.refs.map);

    this.theMap.on('style.load', () => {
      this.mapLoaded = true;
      this.setupData();
    });

    if (typeof setupListeners === 'function') {
      setupListeners(this.theMap);
    }
  }

  componentWillUnmount () {
    if (this.theMap) {
      this.theMap.remove();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.mapLoaded) return;
    if (this.props.filters !== nextProps.filters || this.props.layers !== nextProps.layers) {
      get(nextProps, 'layers', []).forEach(layer => {
        const existingLayer = this.theMap.getLayer(layer.id);
        if (existingLayer) {
          this.theMap.removeLayer(layer.id);
        }
        this.theMap.addLayer(layer);
      });
      get(nextProps, 'filters', []).forEach(filter => this.theMap.setFilter(filter.layer, filter.filter));
    }

    if (this.props.geoJSON !== nextProps.geoJSON) {
      this.theMap.getSource(source).setData(nextProps.geoJSON);
    }
  }

  render () {
    const className = c(this.props.className);
    const children = this.props.children || null;
    return (
      <figure className='map-vis'>
        <div className={className} ref='map'/>
        {children}
      </figure>
    );
  }
}

if (environment !== 'production') {
  MapComponent.propTypes = {
    geoJSON: T.object,
    layers: T.array,
    filters: T.array,
    setupListeners: T.func,
    children: T.node,
    className: T.string
  };
}
