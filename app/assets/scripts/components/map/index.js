'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import newMap, { source } from '../../utils/get-new-map';
import { get } from '../../utils/utils';
import { environment } from '../../config';
import exportMap from '../../utils/export-map';

export default class MapComponent extends React.Component {
  constructor (props) {
    super(props);
    this.safeSetFilter = this.safeSetFilter.bind(this);
    this.state = {
      ready: false
    };
  }

  setupData () {
    if (!this.theMap.getSource(source) && this.props.geoJSON) {
      this.theMap.addSource(source, {
        type: 'geojson',
        data: this.props.geoJSON
      });
    }
    get(this.props, 'layers', []).forEach(layer => this.theMap.addLayer(layer));
    get(this.props, 'filters', []).forEach(this.safeSetFilter);
  }

  safeSetFilter (filter) {
    if (this.theMap.getLayer(filter.layer)) {
      this.theMap.setFilter(filter.layer, filter.filter);
    }
  }

  componentDidMount () {
    const { configureMap } = this.props;
    this.mapLoaded = false;
    this.popover = null;

    this.theMap = newMap(this.refs.map);

    this.theMap.on('style.load', () => {
      this.setupData();
      this.mapLoaded = true;
      this.setState({ ready: true });
    });

    if (typeof configureMap === 'function') {
      configureMap(this.theMap);
    }
  }

  componentWillUnmount () {
    if (this.theMap) {
      this.theMap.remove();
    }
  }

  componentWillReceiveProps (nextProps) {
    // Short-circuit any map-changing actions if the map hasn't finished loading.
    if (!this.mapLoaded) return;

    if (this.props.filters !== nextProps.filters || this.props.layers !== nextProps.layers) {
      get(nextProps, 'layers', []).forEach(layer => {
        const existingLayer = this.theMap.getLayer(layer.id);
        if (existingLayer) {
          this.theMap.removeLayer(layer.id);
        }
        this.theMap.addLayer(layer);
      });
      get(nextProps, 'filters', []).forEach(this.safeSetFilter);
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
        {this.props.noExport ? null : (
          <div className='fold__actions'>
            <button className={c('button button--primary-bounded button--export', {
              disabled: !this.state.ready
            })} onClick={() => exportMap(this.theMap)}>Export Map</button>
          </div>
        )}
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
    configureMap: T.func,
    children: T.node,
    className: T.string,
    noExport: T.bool
  };
}
