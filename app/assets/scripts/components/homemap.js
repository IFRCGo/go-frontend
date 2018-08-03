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

import { countries } from '../utils/field-report-constants';
import { source } from '../utils/get-new-map';
import { commaSeparatedNumber as n } from '../utils/format';
import { environment } from '../config';
import {
  FormRadioGroup
} from './form-elements/';
import Progress from './progress';
import BlockLoading from './block-loading';
import MapComponent from './map';
import { get, aggregateAppealStats } from '../utils/utils';

const scale = chroma.scale(['#F0C9E8', '#861A70']);

class Homemap extends React.Component {
  constructor (props) {
    super(props);
    const scaleBy = 'population';
    // scaleBy needs to be set for us to assign layers
    this.state = {
      scaleBy,
      markerLayers: [],
      markerGeoJSON: null,
      hoverDtype: null,
      selectedDtype: null,
      mapActions: [],
      ready: false
    };
    this.configureMap = this.configureMap.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.navigate = this.navigate.bind(this);
    this.showDeploymentsPopover = this.showDeploymentsPopover.bind(this);
    this.showCountryPopover = this.showCountryPopover.bind(this);
  }

  componentDidMount () {
    const { operations, deployments } = this.props;
    // Init the map if there's data when the component loads.
    if (operations && !operations.error && operations.fetched) {
      this.setMarkerLayers(operations);
    }
    if (deployments && !deployments.error && deployments.fetched) {
      this.setFillLayers(deployments);
    }
  }

  componentWillReceiveProps ({ operations, deployments }) {
    // set initial layers and filters when geojson data is loaded
    if (operations && !this.props.operations.fetched && operations.fetched && !operations.error) {
      this.setMarkerLayers(operations);
    }
    if (deployments && deployments.fetched && !deployments.error && (
      !this.props.deployments.fetched || JSON.stringify(deployments.data.areas) !== JSON.stringify(this.props.deployments.data.areas)
    )) {
      this.setFillLayers(deployments);
    }
  }

  setMarkerLayers (operations) {
    this.setState({
      markerLayers: this.getMarkerLayers(operations.data.geoJSON, this.state.scaleBy),
      markerGeoJSON: this.getMarkerGeoJSON(operations.data.geoJSON, this.getDtypeHighlight())
    });
  }

  getDtypeHighlight () {
    return this.state.hoverDtype || this.state.selectedDtype || '';
  }

  setFillLayers (deployments) {
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
    if (this.state.ready) {
      action();
    } else {
      this.setState({
        mapActions: this.state.mapActions.concat(action)
      });
    }
  }

  onDtypeHover (what, typeId) {
    const hoverDtype = what === 'mouseover' ? typeId : null;
    this.setState({
      hoverDtype,
      markerGeoJSON: this.getMarkerGeoJSON(this.props.operations.data.geoJSON, hoverDtype || this.state.selectedDtype)
    });
  }

  onDtypeClick (typeId) {
    const selectedDtype = this.state.selectedDtype === typeId ? null : typeId;
    this.setState({
      selectedDtype,
      markerGeoJSON: this.getMarkerGeoJSON(this.props.operations.data.geoJSON, selectedDtype)
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
    return [
      'interpolate',
      ['linear'],
      ['zoom'],
      3, [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', scaleProp]],
        0,
        0,
        1,
        5,
        maxScaleValue,
        10
      ],
      8, [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', scaleProp]],
        0,
        0,
        1,
        20,
        maxScaleValue,
        40
      ]
    ];
  }

  configureMap (theMap) {
    // Event listeners.
    theMap.on('load', () => {
      this.state.mapActions.forEach(action => action());
      this.setState({ ready: true });
    });

    theMap.on('click', 'country', e => {
      this.showCountryPopover(theMap, e.features[0]);
    });

    theMap.on('click', 'appeals', e => {
      this.showOperationsPopover(theMap, e.features[0]);
    });

    theMap.on('mousemove', 'appeals', e => {
      theMap.getCanvas().style.cursor = 'pointer';
    });

    theMap.on('mouseleave', 'appeals', e => {
      theMap.getCanvas().style.cursor = '';
    });

    theMap.on('mousemove', 'country', e => {
      theMap.getCanvas().style.cursor = 'pointer';
    });

    theMap.on('mouseleave', 'country', e => {
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
        ['DREF', '#F39C12'],
        ['Appeal', '#C22A26'],
        ['Movement', '#CCCCCC'],
        ['Mixed', '#4680F2']
      ]
    };
    const cradius = this.getCircleRadiusPaintProp(geoJSON, scaleBy);
    const layers = [];
    layers.push({
      'id': 'appeals',
      'type': 'circle',
      'source': source,
      'paint': {
        'circle-color': ccolor,
        'circle-radius': cradius
      }
    });
    return layers;
  }

  getMarkerGeoJSON (geoJSON, dtype) {
    const filterFn = dtype ? d => d.dtype.toString() === dtype.toString() : d => true;
    const features = geoJSON.features.map(d => {
      const appeals = d.properties.appeals.filter(filterFn);
      const properties = Object.assign(aggregateAppealStats(appeals), {
        atype: d.properties.atype,
        id: d.properties.id,
        name: d.properties.name,
        iso: d.properties.iso,
        appeals: d.properties.appeals
      });
      return {
        geometry: d.geometry,
        properties
      };
    });
    return { type: 'FeatureCollection', features };
  }

  navigate (path) {
    this.props.history.push(path);
  }

  onPopoverCloseClick () {
    if (this.popover) {
      this.popover.remove();
    }
  }

  showOperationsPopover (theMap, feature) {
    let popoverContent = document.createElement('div');
    const { properties, geometry } = feature;
    const operations = !properties.appeals ? []
      : Array.isArray(properties.appeals) ? properties.appeals
        : JSON.parse(properties.appeals);
    const title = `${properties.name}`;

    render(<OperationsPopover
      title={title}
      navigate={this.navigate}
      pageId={properties.id}
      operations={operations}
      onCloseClick={this.onPopoverCloseClick.bind(this)} />, popoverContent);

    // Populate the popup and set its coordinates
    // based on the feature found.
    if (this.popover != null) {
      this.popover.remove();
    }

    this.popover = new mapboxgl.Popup({closeButton: false})
      .setLngLat(geometry.coordinates)
      .setDOMContent(popoverContent.children[0])
      .addTo(theMap);
  }

  showCountryPopover (theMap, feature) {
    const iso = get(feature, 'properties.ISO2', 'not found').toLowerCase();
    const features = get(this.state, 'markerGeoJSON.features');
    if (Array.isArray(features)) {
      const found = features.find(d => d.properties.iso === iso);
      if (found) {
        this.showOperationsPopover(theMap, found);
        return;
      }
    }
    const name = get(feature, 'properties.NAME');
    const country = countries.find(d => d.iso === iso);
    if (country) {
      let popoverContent = document.createElement('div');
      render(<OperationsPopover
        title={name}
        navigate={this.navigate}
        pageId={country.value}
        onCloseClick={this.onPopoverCloseClick.bind(this)}
      />, popoverContent);
      if (this.popover != null) {
        this.popover.remove();
      }
      this.popover = new mapboxgl.Popup({closeButton: false})
        .setLngLat(calculateCentroid(feature.geometry).geometry.coordinates)
        .setDOMContent(popoverContent.children[0])
        .addTo(theMap);
    }
  }

  showDeploymentsPopover (theMap, feature) {
    const id = get(feature, 'properties.OBJECTID').toString();
    let deployments = get(this.props, 'deployments.data.areas', []).find(d => d.id === id);
    if (!deployments && !Array.isArray(deployments.deployents)) return;
    deployments = deployments.deployments;

    const districtName = get(deployments, '0.district.name');
    const numDeployments = deployments.length;
    const title = `${districtName} (${numDeployments} Deployment${numDeployments === 1 ? '' : 's'})`;
    let popoverContent = document.createElement('div');
    render(<OperationsPopover
      title={title}
      deployments={deployments}
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
        {this.props.noRenderEmergencyTitle ? <h1>Operations by Type</h1> : (
          <React.Fragment>
            <h1>IFRC Emergency Operations</h1>
            <h2 className='heading--xsmall'>Operations by Type</h2>
          </React.Fragment>
        )}
        <ul className='emergencies__list'>
          {emerg.map(o => (
            <li
              key={o.id}
              className={c('emergencies__item', {'emergencies__item--selected': this.state.selectedDtype === o.id})}
              onClick={this.onDtypeClick.bind(this, o.id)}
              onMouseOver={this.onDtypeHover.bind(this, 'mouseover', o.id)}
              onMouseOut={this.onDtypeHover.bind(this, 'mouseout', o.id)} >
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
    if (this.props.operations.fetching) return null;
    const layers = this.props.layers ? this.state.markerLayers.concat(this.props.layers) : this.state.markerLayers;
    const geoJSON = this.state.markerGeoJSON;
    return (
      <React.Fragment>
        {this.props.noRenderEmergencies ? null : this.renderEmergencies()}
        <div className='map-container'>
          <h2 className='visually-hidden'>Map</h2>
          <MapComponent className='map-vis__holder'
            noExport={this.props.noExport}
            configureMap={this.configureMap}
            layers={layers}
            geoJSON={geoJSON}>
            <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
              <form className='form'>
                <FormRadioGroup
                  label='Scale points by'
                  name='map-scale'
                  classWrapper='map-scale-options'
                  options={[
                    {
                      label: '# of people targeted',
                      value: 'population'
                    },
                    {
                      label: 'IFRC operation request',
                      value: 'amount'
                    }
                  ]}
                  inline={false}
                  selectedOption={this.state.scaleBy}
                  onChange={this.onFieldChange} />
              </form>
              <div className='key'>
                <label className='form__label'>Type</label>
                <dl className='legend__dl legend__dl--colors'>
                  <dt className='color color--red'>Red</dt>
                  <dd>Emergency appeal</dd>
                  <dt className='color color--yellow'>Yellow</dt>
                  <dd>DREF</dd>
                  <dt className='color color--grey'>Grey</dt>
                  <dd>Movement response</dd>
                  <dt className='color color--blue'>Grey</dt>
                  <dd>Multiple types</dd>
                </dl>
              </div>
              {this.props.deployments ? (
                <div className='legend__block'>
                  <h3 className='legend__title'>{this.props.deploymentsKey || 'Deployments'}</h3>
                  <dl className='legend__grandient'>
                    <dt style={{background: 'linear-gradient(to right, #F0C9E8, #861A70)'}}>Scale Gradient</dt>
                    <dd>
                      <span>0</span>
                      <span>to</span>
                      <span>{n(get(this.props.deployments, 'data.max'))}</span>
                    </dd>
                  </dl>
                </div>
              ) : null}
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
    deploymentsKey: T.string,
    history: T.object,
    bbox: T.array,
    noRenderEmergencies: T.bool,
    noRenderEmergencyTitle: T.bool,
    noExport: T.bool,
    layers: T.array
  };
}

export default withRouter(Homemap);

class OperationsPopover extends React.Component {
  render () {
    const { pageId, navigate, title, onCloseClick, operations, deployments } = this.props;
    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <div className='popover__headline'>
              {deployments ? title : <a className='link--primary' onClick={e => { e.preventDefault(); navigate(`/countries/${pageId}`); }}>{title}</a>}
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li>
                  <button type='button' className='actions__menu-item poa-xmark' title='Close popover' onClick={onCloseClick}><span>Dismiss</span></button>
                </li>
              </ul>
            </div>
          </header>
          <div className='popover__body'>
            {Array.isArray(operations) ? operations.map(d => (
              <React.Fragment key={d.id}>
                <h3 className='popover__subtitle'>
                  {d.event ? (
                    <a className='link--primary' onClick={e => { e.preventDefault(); navigate(`/emergencies/${d.event}`); }}>{d.name}</a>
                  ) : d.name}
                </h3>
                <ul className='popover__details'>
                  <li>{n(d.num_beneficiaries)} People Affected</li>
                  <li>{n(d.amount_requested)} Amount Requested (CHF)</li>
                  <li>{n(d.amount_funded)} Amount Funded (CHF)</li>
                </ul>
              </React.Fragment>
            )) : null}
            {Array.isArray(deployments) ? deployments.map((d, i) => (
              <React.Fragment key={i}>
                <h3 className='popover__subtitle'>{get(d.parent, 'society_name', d.parent.name)}</h3>
                <ul className='popover__details'>
                  <li>Activity: {d.activity.activity}</li>
                  <li>Start: {DateTime.fromISO(d.start).toISODate()}</li>
                  <li>End: {DateTime.fromISO(d.end).toISODate()}</li>
                </ul>
              </React.Fragment>
            )) : null}
          </div>
        </div>
      </article>
    );
  }
}

if (environment !== 'production') {
  OperationsPopover.propTypes = {
    onCloseClick: T.func,
    title: T.string,
    pageId: T.number,
    operations: T.array,
    deployments: T.array,
    navigate: T.func
  };
}
