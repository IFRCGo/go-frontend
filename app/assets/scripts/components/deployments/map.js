'use strict';
import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';
import chroma from 'chroma-js';
import _cloneDeep from 'lodash.clonedeep';

import { source } from '../../utils/get-new-map';
import { environment } from '../../config';
import MapComponent from '../map';
import {
  FormSelect
} from '../form-elements/';

const countryChromaScale = chroma.scale(['#8A96A7', '#E8EAEE']);

export default class DeploymentsMap extends React.Component {
  constructor (props) {
    super(props);
    const { fetchedCount, error } = props.data;
    this.state = {
      layers: !fetchedCount || error ? [] : this.getLayers(props.data.data),
      filters: [],
      loaded: false,
      mapFilter: {
        deployment: 'all'
      }
    };
    this.theMap = null;
    this.configureMap = this.configureMap.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data.fetchedCount !== nextProps.data.fetchedCount && !nextProps.data.error) {
      this.setState({
        layers: this.getLayers(nextProps.data.data)
      });
      this.setCountryStyle(nextProps.data);
    }
  }

  onMapFilterChange (field, e) {
    let mapFilter = _cloneDeep(this.state.mapFilter);
    mapFilter[field] = e.target.value;
    const filters = this.getFilters(e.target.value);
    this.setState({ mapFilter, filters });
    this.onPopoverCloseClick();
  }

  setCountryStyle (data) {
    // Color the countries layer using the source data.
    if (this.theMap && this.state.loaded) {
      const maxScaleValue = Math.max(...data.data.features.map(o => o.properties.eru));
      countryChromaScale.domain([0, maxScaleValue]);

      const countryWithEru = data.data.features
        .filter(feat => feat.properties.eru > 0);

      if (countryWithEru.length) {
        // Data driven case statement:
        // 'case',
        //  // PT
        //  ['==', ['to-string', ['get', 'ISO_A2']], 'PT'],
        //  'red',
        //  // Default
        //  'hsl(213, 38%, 28%)'
        let countryWithEruColor = countryWithEru.reduce((acc, feat) => {
          acc.push(['==', ['to-string', ['get', 'ISO_A2']], feat.properties.countryIso.toUpperCase()]);
          acc.push(countryChromaScale(feat.properties.eru).hex());
          return acc;
        }, ['case']);

        countryWithEruColor.push('hsl(213, 38%, 28%)');
        this.theMap.setPaintProperty('country', 'fill-color', countryWithEruColor);
      }
    }
  }

  configureMap (theMap) {
    this.theMap = theMap;

    const getCountryFeat = (e) => {
      const feats = theMap.queryRenderedFeatures(e.point, {layers: ['country']});
      if (feats) {
        const iso = feats[0].properties.ISO_A2.toLowerCase();
        return this.props.data.data.features.find(f => f.properties.countryIso === iso);
      }
      return null;
    };

    theMap.on('click', 'deployments', e => {
      this.showPopover(theMap, e.features[0]);
    });

    theMap.on('mousemove', 'deployments', e => {
      theMap.getCanvas().style.cursor = 'pointer';
    });
    theMap.on('mouseleave', 'deployments', e => {
      theMap.getCanvas().style.cursor = '';
    });

    theMap.on('click', 'country', e => {
      const feat = getCountryFeat(e);
      if (feat) {
        this.showPopover(theMap, feat);
      }
    });

    theMap.on('mousemove', 'country', e => {
      if (getCountryFeat(e)) {
        theMap.getCanvas().style.cursor = 'pointer';
      }
    });
    theMap.on('mouseleave', 'country', e => {
      theMap.getCanvas().style.cursor = '';
    });

    theMap.on('style.load', e => {
      this.setState({loaded: true});
      this.setCountryStyle(this.props.data);
    });
  }

  getFilters (value) {
    if (value === 'all') {
      return [];
    }

    // Only show layers where field value is above 0.
    return [
      {layer: 'deployments', filter: ['>', value, 0]}
    ];
  }

  getLayers (geoJSON) {
    const layers = [];
    layers.push({
      id: 'deployments',
      type: 'circle',
      source,
      paint: {
        'circle-color': '#5890FF',
        'circle-radius': 8
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

    let deployments = [
      {
        label: 'FACT',
        value: feature.properties.fact
      },
      {
        label: 'RDIT',
        value: feature.properties.rdit
      },
      {
        label: 'HeOps',
        value: feature.properties.heop
      },
      {
        label: 'ERU',
        value: feature.properties.eru
      }
    ];

    render(<MapPopover
      title={`Deployments for ${feature.properties.countryName}`}
      countryId={feature.properties.countryId}
      deployments={deployments}
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
      fetchedCount,
      data
    } = this.props.data;

    if (!fetchedCount) return null;

    const maxScaleValue = Math.max(...data.features.map(o => o.properties.eru));

    const filterTypes = [
      {
        label: 'All',
        value: 'all'
      },
      {
        label: 'FACT',
        value: 'fact'
      },
      {
        label: 'RDIT',
        value: 'rdit'
      },
      {
        label: 'HeOps',
        value: 'heop'
      }
    ];

    return (
      <div className='stats-map deployments-map'>
        <div className='inner'>
          <div className='map-container'>
            <h2 className='visually-hidden'>Deployments by Country</h2>
            <MapComponent className='map-vis__holder'
              configureMap={this.configureMap}
              layers={this.state.layers}
              filters={this.state.filters}
              geoJSON={data}>

              <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
                <div className='key'>
                  <label className='form__label'>Key</label>
                  <dl className='legend__dl legend__dl--colors'>
                    <dt className='color color--blue'>blue</dt>
                    <dd>Deployed Operations (FACT, RDIT, HeOps)</dd>
                  </dl>
                </div>

                <div className='legend__block'>
                  <h3 className='legend__title'>ERU Units</h3>
                  <dl className='legend__grandient'>
                    <dt style={{background: 'linear-gradient(to right, #8A96A7, #E8EAEE)'}}>Scale Gradient</dt>
                    <dd>
                      <span>0</span>
                      <span>to</span>
                      <span>{maxScaleValue}</span>
                    </dd>
                  </dl>
                </div>
              </figcaption>

              <figcaption className='map-vis__legend map-vis__legend--top-left legend'>
                <FormSelect
                  label='Filter Deployments'
                  name='deployments'
                  id='deployments'
                  options={filterTypes}
                  value={this.state.mapFilter.deployment}
                  onChange={this.onMapFilterChange.bind(this, 'deployment')} >

                </FormSelect>
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
    data: T.object
  };
}

class MapPopover extends React.Component {
  render () {
    const {
      title,
      countryId,
      deployments
    } = this.props;
    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <div className='popover__headline'>
              <a className='link--primary' href={`/countries/${countryId}`}>{title}</a>
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li><button type='button' className='actions__menu-item poa-xmark' title='Close popover' onClick={this.props.onCloseClick}><span>Dismiss</span></button></li>
              </ul>
            </div>
          </header>
          <div className='popover__body'>
            <ul>
              {deployments.map(dep => (
                <li key={dep.label}>{dep.value} {dep.label}</li>
              ))}
            </ul>
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
    countryId: T.number,
    deployments: T.array
  };
}
