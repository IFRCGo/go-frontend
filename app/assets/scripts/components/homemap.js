'use strict';
import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import { withRouter } from 'react-router-dom';
import c from 'classnames';
import mapboxgl from 'mapbox-gl';

import { source } from '../utils/get-new-map';
import { commaSeparatedNumber as n } from '../utils/format';
import { environment } from '../config';
import {
  FormRadioGroup
} from './form-elements/';
import Progress from './progress';
import BlockLoading from './block-loading';
import MapComponent from './map';

class Homemap extends React.Component {
  constructor (props) {
    super(props);
    const scaleBy = 'amount';
    // scaleBy needs to be set for us to assign layers
    this.state = {
      scaleBy,
      layers: [],
      filters: [],
      hoverEmerType: null,
      selectedEmerType: null
    };
    this.configureMap = this.configureMap.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  componentDidMount () {
    // Init the map if there's data when the component loads.
    if (this.props.appealsList.fetched) {
      this.initMapLayers(this.props);
    }
  }

  componentWillReceiveProps (nextProps) {
    // set initial layers and filters when geojson data is loaded
    if (!this.props.appealsList.fetched && nextProps.appealsList.fetched && !nextProps.appealsList.error) {
      this.initMapLayers(nextProps);
    }
  }

  initMapLayers (props) {
    this.setState({
      layers: this.getLayers(props.appealsList.data.geoJSON, this.state.scaleBy),
      filters: this.getFilters(this.getDtypeHighlight())
    });
  }

  getDtypeHighlight () {
    return this.state.hoverEmerType || this.state.selectedEmerType || '';
  }

  onEmergencyTypeOverOut (what, typeId) {
    const hoverEmerType = what === 'mouseover' ? typeId : null;
    this.setState({
      hoverEmerType,
      filters: this.getFilters(hoverEmerType || this.state.selectedEmerType)
    });
  }

  onEmergencyTypeClick (typeId) {
    const selectedEmerType = this.state.selectedEmerType === typeId ? null : typeId;
    this.setState({
      selectedEmerType,
      filters: this.getFilters(this.state.hoverEmerType || selectedEmerType)
    });
  }

  onFieldChange (e) {
    const scaleBy = e.target.value;
    this.setState({
      layers: this.getLayers(this.props.appealsList.data.geoJSON, scaleBy),
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
    theMap.on('click', 'appeals', e => {
      this.showPopover(theMap, e.features[0]);
    });

    theMap.on('mousemove', 'appeals', e => {
      theMap.getCanvas().style.cursor = 'pointer';
    });

    theMap.on('mouseleave', 'appeals', e => {
      theMap.getCanvas().style.cursor = '';
    });
  }

  getLayers (geoJSON, scaleBy) {
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

  getFilters (dtype) {
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

  navigate (pageId) {
    if (pageId) {
      this.props.history.push(`/emergencies/${pageId}`);
    }
  }

  onPopoverCloseClick () {
    if (this.popover) {
      this.popover.remove();
    }
  }

  showPopover (theMap, feature) {
    let popoverContent = document.createElement('div');

    render(<MapPopover
      title={feature.properties.name}
      onTitleClick={this.navigate}
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

  renderEmergencies () {
    const emerg = this.props.appealsList.data.emergenciesByType;
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
    if (this.props.appealsList.fetching) {
      return <BlockLoading/>;
    }
  }

  renderError () {
    if (this.props.appealsList.error) {
      return <p>Oh no! An error ocurred getting the data.</p>;
    }
  }

  renderContent () {
    const {
      data,
      fetched,
      error
    } = this.props.appealsList;

    if (!fetched || error) { return null; }

    return (
      <React.Fragment>
        {this.renderEmergencies()}
        <div className='map-container'>
          <h2 className='visually-hidden'>Map</h2>

          <MapComponent className='map-vis__holder'
            configureMap={this.configureMap}
            layers={this.state.layers}
            filters={this.state.filters}
            geoJSON={data.geoJSON}>
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
    appealsList: T.object,
    history: T.object
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
              <a className='link--primary' onClick={() => this.props.onTitleClick(this.props.pageId)}>{this.props.title}</a>
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li><button type='button' className='actions__menu-item poa-xmark' title='Close popover' onClick={this.props.onCloseClick}><span>Dismiss</span></button></li>
              </ul>
            </div>
          </header>
          <div className='popover__body'>
            <dl className='popover__details'>
              <dd>{n(this.props.numBeneficiaries)}</dd>
              <dt>People Affected</dt>
              <dd>{n(this.props.amountRequested)}</dd>
              <dt>Amount Requested</dt>
              <dd>{n(this.props.amountFunded)}</dd>
              <dt>Amount Funded</dt>
            </dl>
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
    onTitleClick: T.func
  };
}
