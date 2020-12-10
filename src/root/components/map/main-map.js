import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import { withRouter } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import _debounce from 'lodash.debounce';
import chroma from 'chroma-js';
import { environment } from '#config';
import BlockLoading from '../block-loading';
import MapComponent from './common/map-component';
import OperationsPopover from './home-map/operations-popover';
import { get } from '#utils/utils';
import ExplanationBubble from './home-map/explanation-bubble';
import EmergencyTypesDropdown from './home-map/emergency-types-dropdown';
import AppealTypesDropdown from './home-map/appeal-types-dropdown';
import { filtering } from './home-map/filtering/filtering-processor';
import { AppealTypeComparator } from './home-map/filtering/comparator/appeal-type-comparator';
import { DateComparator } from './home-map/filtering/comparator/date-comparator';
import { EmergencyTypeComparator } from './home-map/filtering/comparator/emergency-type-comparator';
import DateFilterHeader from '../common/filters/date-filter-header';
import EmergenciesLeftMenu from './common/emergencies-left-menu';
import MarkerLayerStylesheetFactory from './home-map/factory/marker-layer-stylesheet-factory';

import Translate from '#components/Translate';
import { withLanguage } from '#root/languageContext';

const scale = chroma.scale(['#F0C9E8', '#861A70']);

class MainMap extends React.Component {
  constructor (props) {
    super(props);

    // scaleBy needs to be set for us to assign layers
    const scaleBy = 'population';
    this.state = {
      scaleBy,
      markerLayers: [],
      markerGeoJSON: null,
      hoverDtype: null,
      selectedDtype: null,
      mapActions: [],
      ready: false,
      selectedFeatureISO: '',
      filters: {
        startDate: '',
        endDate: ''
      }
    };

    this.markerLayerStylesheetFactory = new MarkerLayerStylesheetFactory();

    this.configureMap = this.configureMap.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.navigate = this.navigate.bind(this);
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps ({ operations, deployments }) {
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
      markerLayers: this.markerLayerStylesheetFactory.buildMarkerLayers(
        operations.data.geoJSON, this.state.scaleBy),
      markerGeoJSON: markers
    });
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
    if (this.state.selectedDtype === null) {
      const hoverDtype = what === 'mouseover' ? typeId : null;
      const comparator = EmergencyTypeComparator(hoverDtype);
      const markers = filtering(this.props.operations.data.geoJSON, comparator);
      this.setState({
        hoverDtype,
        markerGeoJSON: markers
      });
    }
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

  handleDateChange (dates) {
    const comparator = DateComparator(dates);
    const markers = filtering(this.props.operations.data.geoJSON, comparator);
    this.setState({
      markerGeoJSON: markers
    });
  }

  setSelectedDtypeNeutral () {
    this.setState({selectedDtype: null});
    document.getElementById('top-emergency-dropdown').value = 0;
  }

  setSelectedAppealTypeNeutral () {
    document.getElementById('top-appeal-dropdown').value = 'all';
  }

  onFieldChange (e) {
    const scaleBy = e.target.value;
    this.setState({
      markerLayers: this.markerLayerStylesheetFactory.buildMarkerLayers(
        this.props.operations.data.geoJSON, scaleBy),
      scaleBy
    });
    this.onPopoverCloseClick(scaleBy);
  }

  configureMap (theMap) {
    // Event listeners.
    theMap.on('load', () => {
      this.state.mapActions.forEach(action => action());
      this.setState({ ready: true });
    });

    // theMap.on('click', e => {
    //   console.log('features', e.features);
    //   this.showOperationsPopover(theMap, e.features[0]);
    // });

    // theMap.on('mousemove', 'appeals', e => {
    //   theMap.getCanvas().style.cursor = 'pointer';
    // });

    // theMap.on('mouseleave', 'appeals', e => {
    //   theMap.getCanvas().style.cursor = '';
    // });

    // theMap.on('mousemove', 'icrc_admin0', e => {
    //   theMap.getCanvas().style.cursor = 'pointer';
    // });

    // theMap.on('mouseleave', 'icrc_admin0', e => {
    //   theMap.getCanvas().style.cursor = '';
    // });

    // theMap.on('mousemove', 'district', e => {
    //   const id = get(e, 'features.0.properties.OBJECTID').toString();
    //   if (id && get(this.props, 'deployments.data.areas', []).find(d => d.id === id)) {
    //     theMap.getCanvas().style.cursor = 'pointer';
    //   } else {
    //     theMap.getCanvas().style.cursor = '';
    //   }
    // });

    theMap.on('mousemove', 'icrc_admin0', _debounce(e => {
      const feature = e.features.length ? e.features[0] : undefined;
      if (feature && feature.properties.INDEPENDEN !== 'FALSE' &&
        feature.properties.ISO2 !== this.state.selectedFeatureISO) {
          this.setState({ selectedFeatureISO: feature.properties.ISO2 });
          theMap.setLayoutProperty('icrc_admin0_highlight', 'visibility', 'visible');
          theMap.setFilter('icrc_admin0_highlight', ['==', 'OBJECTID', feature.properties.OBJECTID]);
      }
    }, 80));

    theMap.on('click', 'appeals', e => {
      const feature = e.features.length ? e.features[0] : undefined;
      if (feature) {
        this.showOperationsPopover(theMap, feature, e, this.props.countries, 'appeals');
        // theMap.setLayoutProperty('icrc_admin0_highlight', 'visibility', 'visible');
        // theMap.setFilter('icrc_admin0_highlight', ['==', 'OBJECTID', feature.properties.OBJECTID]);
      }
    });

    theMap.on('click', 'icrc_admin0', e => {
      const feature = e.features.length ? e.features[0] : undefined;
      if (feature && feature.properties.INDEPENDEN !== 'FALSE') {
        this.showOperationsPopover(theMap, feature, e, this.props.countries, 'icrc_admin0');
        // theMap.setLayoutProperty('icrc_admin0_highlight', 'visibility', 'visible');
        // theMap.setFilter('icrc_admin0_highlight', ['==', 'OBJECTID', feature.properties.OBJECTID]);
      }
    });

    theMap.on('mouseleave', 'icrc_admin0', e => {
      theMap.setLayoutProperty('icrc_admin0_highlight', 'visibility', 'none');
    });

    if (Array.isArray(this.props.mapBoundingBox)) {
      const infinite = !isFinite(this.props.mapBoundingBox[0]);
      if (!infinite) {
        theMap.fitBounds(this.props.mapBoundingBox);
      }
    }

    this.theMap = theMap;
  }

  navigate (path) {
    this.props.history.push(path);
  }

  onPopoverCloseClick () {
    if (this.popover) {
      this.popover.remove();
    }
  }

  // FIXME: move this to a utils
  getCountryFromIso(iso, countries) {
    const country = countries.find(country => country.iso.toUpperCase() === iso && country.record_type === 1);
    if (country) {
      return country;
    } else {
      return null;
    }
  }

  showOperationsPopover (theMap, feature, event, countries=[], layer) {
    let popoverContent = document.createElement('div');
    let appealFeature;
    let iso;
    if (layer === 'appeals') {
      appealFeature = feature;
    } else {
      iso = feature.properties.ISO2.toUpperCase();
      appealFeature = this.state.markerGeoJSON.features.find(f => f.properties.iso.toUpperCase() === iso);
    }
    let title, pageId, operations, centroid;
    if (appealFeature) {
      const { properties } = appealFeature;
      title = properties.name;
      pageId = properties.id;
      operations = !properties.appeals ? []
      : Array.isArray(properties.appeals) ? properties.appeals
        : JSON.parse(properties.appeals);
      centroid = appealFeature.geometry.coordinates;
    } else {
      const country = this.getCountryFromIso(iso, countries);
      title = country.label;
      pageId = country.value;
      operations = [];
      centroid = event.lngLat;
    }
    // const { properties, geometry } = feature;
    // const operations = !properties.appeals ? []
    //   : Array.isArray(properties.appeals) ? properties.appeals
    //     : JSON.parse(properties.appeals);
    // const title = `${properties.name}`;

    render(<OperationsPopover
      title={title}
      navigate={this.navigate}
      pageId={pageId}
      operations={operations}
      onCloseClick={this.onPopoverCloseClick.bind(this)} />, popoverContent);

    // Populate the popup and set its coordinates
    // based on the feature found.
    if (this.popover != null) {
      this.popover.remove();
    }

    this.popover = new mapboxgl.Popup({closeButton: false})
      .setLngLat(centroid)
      .setDOMContent(popoverContent.children[0])
      .addTo(theMap);
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
      return <p>
               <Translate stringId='mainMapDataError'/>
             </p>;
    }
  }

  renderContent () {
    if (this.props.operations.fetching) return null;
    const layers = this.props.layers ? this.state.markerLayers.concat(this.props.layers) : this.state.markerLayers;
    const geoJSON = this.state.markerGeoJSON;
    const mapContainerClassName = this.props.noRenderEmergencies ? 'map-container map-container-fullwidth' : 'map-container';
    const emergenciesByType = get(this.props, 'operations.data.emergenciesByType', []);

    const { strings } = this.props;
    return (
      <React.Fragment>
        {this.props.noRenderEmergencies
          ? null
          : <EmergenciesLeftMenu
            data={this.props}
            selectedDtype={this.state.selectedDtype}
            onDtypeClick={this.onDtypeClick.bind(this)}
            onDtypeHover={this.onDtypeHover.bind(this)}/>}

        <div className={mapContainerClassName}>
          {!this.props.fullscreen ? (
            <div className='map-vis__legend__filters'>
              <div className='map-vis__legend__filters-wrap'>
                <DateFilterHeader
                  id='date'
                  title='Date'
                  filter={this.state.filters}
                  featureType='map'
                  onSelect={this.handleDateChange.bind(this)} />
              </div>
              <div className='map-vis__legend__filters-wrap'>
                <EmergencyTypesDropdown emergenciesByType={emergenciesByType}
                  onDtypeClick={this.onDtypeClick.bind(this)} />
              </div>
              <div className='map-vis__legend__filters-wrap'>
                <AppealTypesDropdown onAppealTypeChange={this.onAppealTypeChange.bind(this)} />
              </div>
            </div>
          ) : null
          }
          <MapComponent className='map-vis__holder'
            noExport={this.props.noExport}
            configureMap={this.configureMap}
            layers={layers}
            geoJSON={geoJSON}
            countriesGeojson={this.props.countriesGeojson}
            downloadButton={true}
            downloadedHeaderTitle={strings.mainMapDownloadHeaderTitle}>

            <ExplanationBubble scaleBy={this.state.scaleBy}
              onFieldChange={this.onFieldChange}
              deployments={this.props.deployments}
              deploymentsKey={this.props.deploymentsKey}/>
          </MapComponent>
          <div className='map-vis__legend--fullscreen-wrap'>
            <button className='button button--secondary-bounded button--small button--fullscreen'
              onClick={this.props.toggleFullscreen}
              title={strings.mainMapViewFullscreen}>
              <span>{this.props.fullscreen ? strings.mainMapClose : strings.mainMapPresentation}</span>
            </button>
          </div>
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
  MainMap.propTypes = {
    operations: T.object,
    deployments: T.object,
    deploymentsKey: T.string,
    history: T.object,
    mapBoundingBox: T.array,
    noRenderEmergencies: T.bool,
    noRenderEmergencyTitle: T.bool,
    noExport: T.bool,
    layers: T.array,
    toggleFullscreen: T.func,
    fullscreen: T.bool,
    countriesGeojson: T.object,
    countries: T.array
  };
}

export default withLanguage(withRouter(MainMap));
