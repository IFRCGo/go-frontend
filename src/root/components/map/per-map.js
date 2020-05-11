
import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import { withRouter } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
// import chroma from 'chroma-js';
import ExplanationBubble from './per-map/explanation-bubble';
import { environment } from '../../config';
import BlockLoading from '../block-loading';
import MapComponent from './common/map-component';
import OperationsPopover from './per-map/operations-popover';
import { get } from '../../utils/utils';
// import ExplanationBubble from './home-map/explanation-bubble';
// import { filtering } from './home-map/filtering/filtering-processor';
// import { AppealTypeComparator } from './home-map/filtering/comparator/appeal-type-comparator';
// import { EmergencyTypeComparator } from './home-map/filtering/comparator/emergency-type-comparator';
import EmergenciesLeftMenu from './common/emergencies-left-menu';
import MarkerLayerStylesheetFactory from './per-map/factory/marker-layer-stylesheet-factory';
import PerPhaseDropdown from './per-map/per-phase-dropdown';
import PerTypeDropdown from './per-map/per-type-dropdown';

// const scale = chroma.scale(['#F0C9E8', '#861A70']);

class PerMap extends React.Component {
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
      ready: false
    };

    this.markerLayerStylesheetFactory = new MarkerLayerStylesheetFactory();

    this.configureMap = this.configureMap.bind(this);
    // this.onFieldChange = this.onFieldChange.bind(this);
    this.navigate = this.navigate.bind(this);
    // this.setSelectedAppealTypeNeutral = this.setSelectedAppealTypeNeutral.bind(this);
    // this.setSelectedDtypeNeutral = this.setSelectedDtypeNeutral.bind(this);
    this.onPerPhaseChange = this.onPerPhaseChange.bind(this);
    this.onPerTypeChange = this.onPerTypeChange.bind(this);
  }

  componentDidMount () {
    const { data } = this.props;
    if (data && !data.error && data.fetched) {
      this.setMarkerLayers(data);
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps ({ data }) {
    if (data && !this.props.data.fetched && data.fetched && !data.error) {
      this.setMarkerLayers(data);
    }
  }

  setMarkerLayers (data) {
    const geoJSON = data.data.geoJSON;
    geoJSON.features.map(feature => {
      feature.properties.phaseCode = feature.properties.phase.phase.toString();
      return feature;
    });
    this.setState({
      markerLayers: this.markerLayerStylesheetFactory.buildMarkerLayers(geoJSON),
      markerGeoJSON: geoJSON
    });
  }

  onPerPhaseChange (event) {
    const chosenId = parseInt(event.target.value);

    if (chosenId === -1) {
      this.setState({
        markerGeoJSON: this.props.data.data.geoJSON
      });
    } else {
      const data = JSON.parse(JSON.stringify(this.props.data));
      data.data.geoJSON.features = data.data.geoJSON.features.filter((mapObject) => mapObject.properties.phase.phase === chosenId);
      this.setState({
        markerGeoJSON: data.data.geoJSON
      });
    }
  }

  onPerTypeChange (event) {
    const chosenId = parseInt(event.target.value);

    if (chosenId === -1) {
      this.setState({
        markerGeoJSON: this.props.data.data.geoJSON
      });
    } else {
      const data = JSON.parse(JSON.stringify(this.props.data));
      data.data.geoJSON.features = data.data.geoJSON.features.filter((mapObject) => typeof mapObject.properties.overviewData !== 'undefined' && mapObject.properties.overviewData.type_of_capacity_assessment === chosenId);
      this.setState({
        markerGeoJSON: data.data.geoJSON
      });
    }
  }

  configureMap (theMap) {
    // Event listeners.
    theMap.on('load', () => {
      this.state.mapActions.forEach(action => action());
      this.setState({ ready: true });
    });

    theMap.on('click', 'mapboxPoint', e => {
      this.showOperationsPopover(theMap, e.features[0]);
    });

    theMap.on('mousemove', 'mapboxPoint', e => {
      theMap.getCanvas().style.cursor = 'pointer';
    });

    theMap.on('mouseleave', 'mapboxPoint', e => {
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
    const country = JSON.parse(feature.properties.country.replace(/'/g, '"'));
    const phase = JSON.parse(feature.properties.phase.replace(/'/g, '"'));

    render(<OperationsPopover
      title={country.name}
      pageId={country.id}
      navigate={this.navigate}
      phase={phase}
      overviewData={this.props.overviewData}
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

  renderLoading () {
    const { data } = this.props;
    if (get(data, 'fetching')) {
      return <BlockLoading/>;
    }
  }

  renderError () {
    const { data } = this.props;
    if (get(data, 'error')) {
      return <p>Data not available.</p>;
    }
  }

  renderContent () {
    if (this.props.data.data.fetching) return null;
    const layers = this.props.layers ? this.state.markerLayers.concat(this.props.layers) : this.state.markerLayers;
    const geoJSON = this.state.markerGeoJSON;
    const mapContainerClassName = this.props.noRenderEmergencies ? 'map-container map-container-fullwidth' : 'map-container';

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
          <MapComponent className='map-vis__holder'
            noExport={this.props.noExport}
            configureMap={this.configureMap}
            layers={layers}
            geoJSON={geoJSON}
            downloadButton={true}
            downloadedHeaderTitle='Preparedness state'>

            <PerPhaseDropdown onPerPhaseChange={this.onPerPhaseChange} />
            <PerTypeDropdown onPerTypeChange={this.onPerTypeChange} />
            <ExplanationBubble />
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
  PerMap.propTypes = {
    data: T.object,
    deployments: T.object,
    overviewData: T.object,
    deploymentsKey: T.string,
    history: T.object,
    bbox: T.array,
    noRenderEmergencies: T.bool,
    noRenderEmergencyTitle: T.bool,
    noExport: T.bool,
    layers: T.array
  };
}

export default withRouter(PerMap);
