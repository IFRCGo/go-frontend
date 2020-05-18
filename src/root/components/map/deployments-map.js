import React from 'react';
import * as path from 'path';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';
import chroma from 'chroma-js';
import _cloneDeep from 'lodash.clonedeep';

import { getCountryIsoFromVt } from '#utils/utils';
import { source } from '#utils/get-new-map';
import { environment } from '#config';
import { getCountryIsoFromVt } from '../../utils/utils';
import { source } from '../../utils/get-new-map';
import MapComponent from './common/map-component';
// Commented when temporarily disabled the FormSelect filter, see ¤ below
// import {
//   FormSelect
// } from '../form-elements';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import { resolveToString } from '#utils/lang';

const countryChromaScale = chroma.scale(['#F0C9E8', '#861A70']);

export default class DeploymentsMap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      layers: props.data.features.length ? this.getLayers(props.data.features) : [],
      filters: this.getFilters('all'),
      loaded: false,
      mapFilter: {
        deployment: 'all'
      }
    };
    this.theMap = null;
    this.configureMap = this.configureMap.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        layers: this.getLayers(nextProps.data.features)
      });
      this.setCountryStyle(nextProps.data.features);
    }
  }

  onMapFilterChange (field, e) {
    let mapFilter = _cloneDeep(this.state.mapFilter);
    mapFilter[field] = e.target.value;
    const filters = this.getFilters(e.target.value);
    this.setState({ mapFilter, filters });
    this.onPopoverCloseClick();
  }

  setCountryStyle (features) {
    // Color the countries layer using the source data.
    if (this.theMap && this.state.loaded) {
      const maxScaleValue = Math.max(...features.map(o => isNaN(o.properties.eru) ? 0 : o.properties.eru));
      countryChromaScale.domain([0, maxScaleValue]);

      const countryWithEru = features
        .filter(feat => feat.properties.eru > 0);

      if (countryWithEru.length) {
        // Data driven case statement:
        // 'case',
        //  // PT
        //  ['==', ['to-string', ['get', 'ISO2']], 'PT'],
        //  'red',
        //  // Default
        //  'hsl(213, 38%, 28%)'
        let countryWithEruColor = countryWithEru.reduce((acc, feat) => {
          const iso = feat.properties.iso.toUpperCase();
          // France and Norway don't have ISO2 codes in tileset
          if (iso === 'FR' || iso === 'NO') {
            const nameLong = iso === 'FR' ? 'France' : 'Norway';
            acc.push(['==', ['to-string', ['get', 'NAME_LONG']], nameLong]);
          } else {
            acc.push(['==', ['to-string', ['get', 'ISO2']], feat.properties.iso.toUpperCase()]);
          }
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
      const iso = getCountryIsoFromVt(e.features[0]);
      return iso ? this.props.data.features.find(f => f.properties.iso === iso) : null;
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
      this.setCountryStyle(this.props.data.features);
    });
  }

  getFilters (value) {
    if (value === 'all') {
      return [{
        layer: 'deployments',
        filter: [
          'any',
          ['>', 'fact', 0],
          ['>', 'rdrt', 0],
          ['>', 'heop', 0]
        ]
      }];
    } else if (value === 'eru') {
      return [
        {layer: 'deployments', filter: ['has', 'nope']}
      ];
    }

    // Only show layers where field value is above 0.
    return [
      {layer: 'deployments', filter: ['>', value, 0]}
    ];
  }

  getLayers (features) {
    const layers = [];
    const sumProps = ['+', ['get', 'fact'], ['get', 'rdrt'], ['get', 'heop']];
    const maxValue = Math.max(...features.map(({properties: { fact, rdrt, heop }}) => fact + rdrt + heop));

    layers.push({
      id: 'deployments',
      type: 'circle',
      source,
      paint: {
        'circle-color': '#5890FF',
        'circle-radius': [
          'interpolate',
          ['exponential', 1],
          sumProps,
          0, 3,
          maxValue, 10
        ]
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
        label: 'RDRT',
        value: feature.properties.rdrt
      },
      {
        label: 'HEOPs',
        value: feature.properties.heop
      },
      {
        label: 'ERU',
        value: feature.properties.eru
      }
    ];

    const { strings } = this.context;

    render(<MapPopover
             title={resolveToString(strings.mapPopoverTitle, { name: feature.properties.name })}
             countryId={feature.properties.id}
             deployments={deployments}
             onCloseClick={this.onPopoverCloseClick.bind(this)}
           />, popoverContent);

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
      features
    } = this.props.data;

    if (!features.length) return null;
    const maxScaleValue = Math.max(...features.map(o => o.properties.eru));
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
        label: 'RDRT',
        value: 'rdrt'
      },
      {
        label: 'HEOPs',
        value: 'heop'
      },
      {
        label: 'ERUs',
        value: 'eru'
      }
    ];
    const activeFilter = filterTypes.find(d => d.value === this.state.mapFilter.deployment).label;

    const { strings } = this.context;
    return (
      <div className='stats-map deployments-map'>
        <div className='inner'>
          <div className='map-container'>
            <h2 className='visually-hidden'>
              <Translate stringId='deploymentsMapHeading'/>
            </h2>
            <MapComponent className='map-vis__holder'
              configureMap={this.configureMap}
              noExport={true}
              downloadButton={true}
              downloadedHeaderTitle={strings.deploymentsMapDownloadTitle}
              layers={this.state.layers}
              filters={this.state.filters}
              geoJSON={this.props.data}>

              <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
                <div className='deployments-key'>
                  <div>
                    <label className='form__label'>
                      <Translate stringId='deploymentsMapKey'/>
                    </label>
                    <dl className='legend__dl legend__dl--colors'>
                      <dt className='color color--blue'>blue</dt>
                      {activeFilter === 'All' ? (
                        <dd>
                          <Translate stringId='deploymentsMapDeployedTitle'/>
                        </dd>
                      ) : (
                        <dd>
                          <Translate
                            stringId='deploymentsMapDeployed'
                            params={{
                              activeFilter: activeFilter,
                            }}
                          />
                        </dd>
                      )}
                    </dl>
                  </div>
                  <div className='legend__block'>
                    <h3 className='legend__title'>
                      <Translate stringId='deploymentsMapLegendTitle'/>
                    </h3>
                    <dl className='legend__grandient'>
                      <dt style={{background: 'linear-gradient(to right, #F0C9E8, #861A70)'}}>
                        <Translate stringId='deploymentsMapScaleGradient'/>
                      </dt>
                      <dd>
                        <span>0</span>
                        <span>to</span>
                        <span>{maxScaleValue}</span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </figcaption>

              { /* Search for ¤ | <figcaption className='map-vis__legend map-vis__legend--top-left legend'>
                <FormSelect
                  label='Filter Deployments'
                  name='deployments'
                  id='deployments'
                  options={filterTypes}
                  value={this.state.mapFilter.deployment}
                  onChange={this.onMapFilterChange.bind(this, 'deployment')} >

                </FormSelect>
              </figcaption> */ }

              {/* <DownloadButton data={canvas} /> */}

            </MapComponent>
          </div>
        </div>
      </div>
    );
  }
}

DeploymentsMap.contextType = LanguageContext;
if (environment !== 'production') {
  DeploymentsMap.propTypes = {
    data: T.object
  };
}

const logoPath = '/assets/graphics/content';
const logoSrc = {
  fact: 'fact.jpg',
  eru: 'eru.jpg',
  heops: 'heops.jpg',
  rdrt: 'rdrt.jpg'
};

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
                <li><button type='button' className='actions__menu-item poa-xmark' title='Close popover' onClick={this.props.onCloseClick}>
                      <span>
                        <Translate stringid='mapPopOverDismiss'/>
                      </span>
                    </button>
                </li>
              </ul>
            </div>
          </header>
          <div className='popover__body'>
            <ul>
              {deployments.map(dep => (
                <li key={dep.label}>
                  <img src={path.join(logoPath, logoSrc[dep.label.toLowerCase()])} />{dep.value} {dep.label}</li>
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
