'use strict';

import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import { withRouter } from 'react-router-dom';
import c from 'classnames';
import mapboxgl from 'mapbox-gl';
import chroma from 'chroma-js';
import calculateCentroid from '@turf/centroid';
import { countries } from '../../utils/field-report-constants';
import { source } from '../../utils/get-new-map';
import { environment } from '../../config';
import Progress from '../progress';
import BlockLoading from '../block-loading';
import MapComponent from './common/map-component';
import OperationsPopover from './home-map/operations-popover';
import { get } from '../../utils/utils';
import { getCentroid } from '../../utils/country-centroids';
import ExplanationBubble from './home-map/explanation-bubble';
import EmergencyTypesDropdown from './home-map/emergency-types-dropdown';
import AppealTypesDropdown from './home-map/appeal-types-dropdown';
import DownloadButton from './common/download-button';
import { filtering } from './home-map/filtering/filtering-processor';
import { AppealTypeComparator } from './home-map/filtering/comparator/appeal-type-comparator';
import { EmergencyTypeComparator } from './home-map/filtering/comparator/emergency-type-comparator';

const scale = chroma.scale(['#F0C9E8', '#861A70']);

class HomeMap extends React.Component {
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
    this.setSelectedAppealTypeNeutral = this.setSelectedAppealTypeNeutral.bind(this);
    this.setSelectedDtypeNeutral = this.setSelectedDtypeNeutral.bind(this);
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
    const comparator = EmergencyTypeComparator(this.state.hoverDtype || this.state.selectedDtype || '');
    const markers = filtering(operations.data.geoJSON, comparator);
    this.setState({
      markerLayers: this.getMarkerLayers(operations.data.geoJSON, this.state.scaleBy),
      markerGeoJSON: markers
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
    const comparator = EmergencyTypeComparator(hoverDtype);
    const markers = filtering(this.props.operations.data.geoJSON, comparator);
    this.setState({
      hoverDtype,
      markerGeoJSON: markers
    });
  }

  onDtypeClick (typeId) {
    const selectedDtype = this.state.selectedDtype === typeId ? null : typeId;
    const comparator = EmergencyTypeComparator(selectedDtype);
    const markers = filtering(this.props.operations.data.geoJSON, comparator);
    this.setState({
      selectedDtype,
      markerGeoJSON: markers
    });
    this.setSelectedAppealTypeNeutral();
  }

  onAppealTypeChange (typeId) {
    const comparator = AppealTypeComparator(typeId);
    const markers = filtering(this.props.operations.data.geoJSON, comparator);
    this.setState({
      markerGeoJSON: markers
    });
    this.setSelectedDtypeNeutral();
  }

  setSelectedDtypeNeutral () {
    this.setState({selectedDtype: 0});
    document.getElementById('top-emergency-dropdown').value = 0;
  }

  setSelectedAppealTypeNeutral () {
    document.getElementById('top-appeal-dropdown').value = 'all';
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
      let coordinates = getCentroid(iso);
      if (!coordinates[0]) {
        coordinates = calculateCentroid(feature.geometry).geometry.coordinates;
      }
      this.popover = new mapboxgl.Popup({closeButton: false})
        .setLngLat(coordinates)
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
    const mapContainerClassName = this.props.noRenderEmergencies ? 'map-container map-container-fullwidth' : 'map-container';
    const emergenciesByType = get(this.props, 'operations.data.emergenciesByType', []);
    const canvas = document.getElementsByClassName('mapboxgl-canvas')[0];

    return (
      <React.Fragment>
        {this.props.noRenderEmergencies ? null : this.renderEmergencies()}
        <div className={mapContainerClassName}>
          <h2 className='visually-hidden'>Map</h2>

          <MapComponent className='map-vis__holder'
            noExport={this.props.noExport}
            configureMap={this.configureMap}
            layers={layers}
            geoJSON={geoJSON}>

            <ExplanationBubble scaleBy={this.state.scaleBy}
              onFieldChange={this.onFieldChange}
              deployments={this.props.deployments}
              deploymentsKey={this.props.deploymentsKey}/>

            <EmergencyTypesDropdown emergenciesByType={emergenciesByType}
              onDtypeClick={this.onDtypeClick.bind(this)} />

            <AppealTypesDropdown onAppealTypeChange={this.onAppealTypeChange.bind(this)} />

            <DownloadButton data={canvas} />
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
  HomeMap.propTypes = {
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

export default withRouter(HomeMap);
