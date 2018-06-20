'use strict';
import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import { withRouter } from 'react-router-dom';
import c from 'classnames';
import mapboxgl from 'mapbox-gl';
import chroma from 'chroma-js';
import calculateCentroid from '@turf/centroid';
import { DateTime } from 'luxon';

import { source } from '../utils/get-new-map';
import { commaSeparatedNumber as n } from '../utils/format';
import { environment } from '../config';
import {
  FormRadioGroup
} from './form-elements/';
import Progress from './progress';
import BlockLoading from './block-loading';
import MapComponent from './map';
import { get } from '../utils/utils';

const scale = chroma.scale(['#F0C9E8', '#861A70']);

class Homemap extends React.Component {
  constructor (props) {
    super(props);
    const scaleBy = 'amount';
    // scaleBy needs to be set for us to assign layers
    this.state = {
      scaleBy,
      markerLayers: [],
      markerFilters: [],
      hoverEmerType: null,
      selectedEmerType: null,
      mapActions: [],
      ready: false
    };
    this.configureMap = this.configureMap.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.navigateToEmergency = this.navigateToEmergency.bind(this);
    this.showDeploymentsPopover = this.showDeploymentsPopover.bind(this);
    this.generateExport = this.generateExport.bind(this);
  }

  componentDidMount () {
    const { operations, deployments } = this.props;
    // Init the map if there's data when the component loads.
    if (operations && !operations.error && operations.fetched) {
      this.initMarkerLayers(operations);
    }
    if (deployments && !deployments.error && deployments.fetched) {
      this.initFillLayers(deployments);
    }
  }

  componentWillReceiveProps ({ operations, deployments }) {
    // set initial layers and filters when geojson data is loaded
    if (operations && !this.props.operations.fetched && operations.fetched && !operations.error) {
      this.initMarkerLayers(operations);
    }
    if (deployments && !this.props.deployments.fetched && deployments.fetched && !deployments.error) {
      this.initFillLayers(deployments);
    }
  }

  initMarkerLayers (operations) {
    this.setState({
      markerLayers: this.getMarkerLayers(operations.data.geoJSON, this.state.scaleBy),
      markerFilters: this.getMarkerFilters(this.getDtypeHighlight())
    });
  }

  getDtypeHighlight () {
    return this.state.hoverEmerType || this.state.selectedEmerType || '';
  }

  initFillLayers (deployments) {
    const { data } = deployments;
    scale.domain([0, data.max]);
    // create a data-driven paint property for the district fill color
    const paint = ['case'];
    data.areas.forEach(d => {
      paint.push(['==', ['to-string', ['get', 'OBJECTID']], d.id]);
      paint.push(scale(d.deployments.length).hex());
    });
    paint.push('rgba(0, 0, 0, 0)');
    const action = () => this.theMap.setPaintProperty('district', 'fill-color', paint);
    if (this.theMap) {
      this.theMap.on('load', action);
    } else {
      this.setState({
        mapActions: this.state.mapActions.concat(action)
      });
    }
  }

  onEmergencyTypeOverOut (what, typeId) {
    const hoverEmerType = what === 'mouseover' ? typeId : null;
    this.setState({
      hoverEmerType,
      markerFilters: this.getMarkerFilters(hoverEmerType || this.state.selectedEmerType)
    });
  }

  onEmergencyTypeClick (typeId) {
    const selectedEmerType = this.state.selectedEmerType === typeId ? null : typeId;
    this.setState({
      selectedEmerType,
      markerFilters: this.getMarkerFilters(this.state.hoverEmerType || selectedEmerType)
    });
  }

  onFieldChange (e) {
    const scaleBy = e.target.value;
    this.setState({
      markerLayers: this.getMarkerLayers(this.props.operations.data.geoJSON, scaleBy),
      scaleBy
    });
    this.onPopoverCloseClick(scaleBy);
  }

  getCircleRadiusPaintProp (geoJSON, scaleBy) {
    const scaleProp = scaleBy === 'amount' ? 'amountRequested' : 'numBeneficiaries';
    const maxScaleValue = Math.max.apply(Math, geoJSON.features.map(o => o.properties[scaleProp]));
    return {
      property: scaleProp,
      stops: [
        [0, 3],
        [maxScaleValue, 10]
      ]
    };
  }

  configureMap (theMap) {
    // Event listeners.
    theMap.on('load', () => {
      this.state.mapActions.forEach(action => action());
      this.setState({ ready: true });
    });

    theMap.on('click', 'appeals', e => {
      this.showOperationsPopover(theMap, e.features[0]);
    });

    theMap.on('click', 'district', e => {
      this.showDeploymentsPopover(theMap, e.features[0]);
    });

    theMap.on('mousemove', 'appeals', e => {
      theMap.getCanvas().style.cursor = 'pointer';
    });

    theMap.on('mouseleave', 'appeals', e => {
      theMap.getCanvas().style.cursor = '';
    });

    theMap.on('mousemove', 'district', e => {
      const id = get(e, 'features.0.properties.OBJECTID').toString();
      if (id && get(this.props, 'deployments.data.areas', []).find(d => d.id === id)) {
        theMap.getCanvas().style.cursor = 'pointer';
      } else {
        theMap.getCanvas().style.cursor = '';
      }
    });

    if (Array.isArray(this.props.bbox)) {
      theMap.fitBounds(this.props.bbox);
    }

    this.theMap = theMap;
  }

  getMarkerLayers (geoJSON, scaleBy) {
    const ccolor = {
      property: 'atype',
      type: 'categorical',
      stops: [
        [0, '#F39C12'],
        [1, '#C22A26'],
        [2, '#CCCCCC']
      ]
    };
    const cradius = this.getCircleRadiusPaintProp(geoJSON, scaleBy);
    const layers = [];
    layers.push({
      'id': 'appeals',
      'type': 'circle',
      'source': source,
      'filter': ['==', 'dtype', this.getDtypeHighlight()],
      'paint': {
        'circle-color': ccolor,
        'circle-radius': cradius
      }
    });
    layers.push({
      'id': 'appeals-faded',
      'type': 'circle',
      'source': source,
      'filter': ['!=', 'dtype', this.getDtypeHighlight()],
      'paint': {
        'circle-color': ccolor,
        'circle-radius': cradius,
        'circle-opacity': 0.15
      }
    });
    return layers;
  }

  getMarkerFilters (dtype) {
    const filters = [];
    if (dtype) {
      filters.push({layer: 'appeals', filter: ['==', 'dtype', dtype]});
      filters.push({layer: 'appeals-faded', filter: ['!=', 'dtype', dtype]});
    } else {
      filters.push({layer: 'appeals', filter: ['!=', 'dtype', '']});
      filters.push({layer: 'appeals-faded', filter: ['==', 'dtype', '']});
    }
    return filters;
  }

  generateExport () {
    if (this.theMap) {
      const uri = this.theMap.getCanvas().toDataURL();
      var link = document.createElement('a');
      link.download = 'map.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  navigateToEmergency (pageId) {
    if (pageId) {
      this.props.history.push(`/emergencies/${pageId}`);
    }
  }

  onPopoverCloseClick () {
    if (this.popover) {
      this.popover.remove();
    }
  }

  showOperationsPopover (theMap, feature) {
    let popoverContent = document.createElement('div');

    render(<MapPopover
      title={feature.properties.name}
      onTitleClick={this.navigateToEmergency}
      pageId={feature.properties.pageId}
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
      .addTo(theMap);
  }

  showDeploymentsPopover (theMap, feature) {
    const id = get(feature, 'properties.OBJECTID').toString();
    const deployments = get(this.props, 'deployments.data.areas', []).find(d => d.id === id);
    if (!deployments) return;

    let popoverContent = document.createElement('div');
    const numDeployments = deployments.deployments.length;
    render(<MapPopover
      title={`${numDeployments} Partner Deployment${numDeployments === 1 ? '' : 's'}`}
      deployments={deployments.deployments}
      onCloseClick={this.onPopoverCloseClick.bind(this)} />, popoverContent);

    if (this.popover != null) {
      this.popover.remove();
    }
    this.popover = new mapboxgl.Popup({closeButton: false})
      .setLngLat(calculateCentroid(feature.geometry).geometry.coordinates)
      .setDOMContent(popoverContent.children[0])
      .addTo(theMap);
  }

  renderEmergencies () {
    const emerg = get(this.props, 'operations.data.emergenciesByType', []);
    const max = Math.max.apply(Math, emerg.map(o => o.items.length));

    return (
      <div className='emergencies chart'>
        <h1>Ongoing Operations</h1>
        <h2 className='heading--xsmall'>Operations by Type</h2>
        <ul className='emergencies__list'>
          {emerg.map(o => (
            <li
              key={o.id}
              className={c('emergencies__item', {'emergencies__item--selected': this.state.selectedEmerType === o.id})}
              onClick={this.onEmergencyTypeClick.bind(this, o.id)}
              onMouseOver={this.onEmergencyTypeOverOut.bind(this, 'mouseover', o.id)}
              onMouseOut={this.onEmergencyTypeOverOut.bind(this, 'mouseout', o.id)} >
              <span className='key'>{o.name} ({o.items.length})</span>
              <span className='value'><Progress value={o.items.length} max={max}><span>{o.items.length}</span></Progress></span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderLoading () {
    const { operations, deployments } = this.props;
    if (get(operations, 'fetching') && get(deployments, 'fetching')) {
      return <BlockLoading/>;
    }
  }

  renderError () {
    const { operations, deployments } = this.props;
    if (get(operations, 'error') || get(deployments, 'error')) {
      return <p>Data not available.</p>;
    }
  }

  renderContent () {
    const geoJSON = get(this.props.operations, 'data.geoJSON');
    const layers = this.state.markerLayers;
    const filters = this.state.markerFilters;
    if (this.props.operations.fetching) return null;
    return (
      <React.Fragment>
        {this.props.noRenderEmergencies ? null : this.renderEmergencies()}
        {this.props.noExport ? null : (
          <div className='fold__actions'>
            <button className={c('button button--primary-bounded button--export', {
              disabled: !this.state.ready
            })} onClick={this.generateExport}>Export Map</button>
          </div>
        )}
        <div className='map-container'>
          <h2 className='visually-hidden'>Map</h2>
          <MapComponent className='map-vis__holder'
            configureMap={this.configureMap}
            layers={layers}
            filters={filters}
            geoJSON={geoJSON}>
            <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
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
                  onChange={this.onFieldChange} />
              </form>
              <div className='key'>
                <label className='form__label'>Key</label>
                <dl className='legend__dl legend__dl--colors'>
                  <dt className='color color--red'>Red</dt>
                  <dd>Emergency Appeal</dd>
                  <dt className='color color--yellow'>Yellow</dt>
                  <dd>DREF</dd>
                  <dt className='color color--grey'>Grey</dt>
                  <dd>Movement Response</dd>
                </dl>
              </div>
            </figcaption>
          </MapComponent>
        </div>
      </React.Fragment>
    );
  }

  render () {
    return (
      <div className='stats-map'>
        <div className='inner'>
          {this.renderLoading()}
          {this.renderError()}
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  Homemap.propTypes = {
    operations: T.object,
    deployments: T.object,
    history: T.object,
    bbox: T.array,
    noRenderEmergencies: T.bool
  };
}

export default withRouter(Homemap);

class MapPopover extends React.Component {
  render () {
    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <div className='popover__headline'>
              {this.props.pageId ? (
                <a className='link--primary' onClick={() => this.props.onTitleClick(this.props.pageId)}>{this.props.title}</a>
              ) : (
                <p>{this.props.title}</p>
              )}
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li><button type='button' className='actions__menu-item poa-xmark' title='Close popover' onClick={this.props.onCloseClick}><span>Dismiss</span></button></li>
              </ul>
            </div>
          </header>
          <div className='popover__body'>
            <dl className='popover__details'>
              {typeof this.props.numBeneficiaries === 'undefined' ? null : <React.Fragment>
                <dd>{n(this.props.numBeneficiaries)}</dd>
                <dt>People Affected</dt>
              </React.Fragment>}
              {typeof this.props.amountRequested === 'undefined' ? null : <React.Fragment>
                <dd>{n(this.props.amountRequested)}</dd>
                <dt>Amount Requested</dt>
              </React.Fragment>}
              {typeof this.props.amountFunded === 'undefined' ? null : <React.Fragment>
                <dd>{n(this.props.amountFunded)}</dd>
                <dt>Amount Funded</dt>
              </React.Fragment>}
            </dl>
            {Array.isArray(this.props.deployments) ? this.props.deployments.map(d => (
              <ul>
                <li>{d.name}, {d.role} ({DateTime.fromISO(d.start_date).toISODate()} - {DateTime.fromISO(d.end_date).toISODate()})</li>
              </ul>
            )) : null}
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
    pageId: T.number,
    numBeneficiaries: T.number,
    amountRequested: T.number,
    amountFunded: T.number,
    deployments: T.array,
    onTitleClick: T.func,
    noExport: T.bool
  };
}
