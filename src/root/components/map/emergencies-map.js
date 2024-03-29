import React from 'react';
import { render } from 'react-dom';
import { PropTypes as T } from 'prop-types';
import mapboxgl from 'mapbox-gl';
import { withRouter } from 'react-router-dom';

import { environment } from '#config';
import { withLanguage } from '#root/languageContext';
import { source } from '#utils/get-new-map';
import { commaSeparatedNumber as n } from '#utils/format';
import Translate from '#components/Translate';
import EmptyMessage from '#components/EmptyMessage';
import GoMapDisclaimer from '#components/GoMapDisclaimer';

import { FormRadioGroup } from '../form-elements';
import MapComponent from './common/map-component';


class EmergenciesMap extends React.Component {
  constructor (props) {
    super(props);
    const scaleBy = 'numAffected';
    const { lastMonth } = props;
    this.state = {
      scaleBy,
      layers: this.getLayers(lastMonth.data.geoJSON, scaleBy),
      filters: []
    };
    this.configureMap = this.configureMap.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps ({lastMonth}) {
    if (!this.props.lastMonth.fetched && lastMonth.fetched && !lastMonth.error) {
      this.setState({
        layers: this.getLayers(lastMonth.data.geoJSON, this.state.scaleBy)
      });
    }
  }

  configureMap (theMap) {
    theMap.on('click', 'emergencies', e => {
      this.showPopover(theMap, e.features[0]);
    });
    theMap.on('mousemove', 'emergencies', () => {
      theMap.getCanvas().style.cursor = 'pointer';
    });
    theMap.on('mouseleave', 'emergencies', () => {
      theMap.getCanvas().style.cursor = '';
    });
  }

  onFieldChange (e) {
    const scaleBy = e.target.value;
    this.setState({
      layers: this.getLayers(this.props.lastMonth.data.geoJSON, scaleBy),
      scaleBy
    });
  }

  getLayers (geoJSON, scaleBy) {
    const ccolor = {
      property: 'responseStatus',
      type: 'categorical',
      stops: [
        ['total', '#F39C12'],
        ['none', '#f5333f'],
        ['mixed', '#749BE9']
      ]
    };

    const scaleValues = geoJSON?.features?.map(o => o.properties[scaleBy]);
    let maxScaleValue = 1;
    if (scaleValues?.length) {
      maxScaleValue = Math.max.apply(Math, scaleValues) || 1;
    }
    const cradius = {
      property: scaleBy,
      stops: [
        [0, 5],
        [maxScaleValue, 12]
      ]
    };

    const layers = [];
    layers.push({
      id: 'emergencies',
      type: 'circle',
      source,
      paint: {
        'circle-color': ccolor,
        'circle-radius': cradius
      }
    });

    return layers;
  }

  navigate (id) {
    if (id) {
      this.props.history.push(`/countries/${id}`);
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
      uri={feature.properties.id}
      numAffected={feature.properties.numAffected}
      totalEmergencies={feature.properties.totalEmergencies}
      withResponse={feature.properties.withResponse}
      withoutResponse={feature.properties.withoutResponse}
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
      error,
      data
    } = this.props.lastMonth;
    const { strings } = this.props;
    return (
      <div className='stats-map emergencies-map'>
        <div className='container-lg'>
          {!error ? (
            <div className='map-container'>
              <h2 className='visually-hidden'>
                <Translate stringId='emergenciesMapHeading'/>
              </h2>
              <MapComponent className='map-vis__holder'
                configureMap={this.configureMap}
                noExport={true}
                downloadButton={true}
                downloadedHeaderTitle={strings.emergenciesMapDownloadTitle}
                layers={this.state.layers}
                filters={this.state.filters}
                geoJSON={data.geoJSON}
                countriesGeojson={this.props.countriesGeojson}>
                <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
                  <div className='legend__group'>
                    <form className='form'>
                      <FormRadioGroup
                        label='Scale points by'
                        name='map-scale'
                        classWrapper='map-scale-options'
                        options={[
                          {
                            label: 'Number of people affected',
                            value: 'numAffected'
                          },
                          {
                            label: 'Number of emergencies',
                            value: 'totalEmergencies'
                          }
                        ]}
                        inline={false}
                        selectedOption={this.state.scaleBy}
                        onChange={this.onFieldChange} />
                    </form>
                    <div className='key'>
                      <label className='form__label'>Key</label>
                      <dl className='legend__dl legend__dl--colors'>
                        <dt className='color color--red'>red</dt>
                        <dd>
                          <Translate stringId='emergenciesMapWithoutIFRC'/>
                        </dd>
                        <dt className='color color--yellow'>yellow</dt>
                        <dd>
                          <Translate stringId='emergenciesMapWithIFRC'/>
                        </dd>
                        <dt className='color color--blue'>blue</dt>
                        <dd>
                          <Translate stringId='emergenciesMapMixResponse'/>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <p className='legend__note'>
                    <Translate stringId='emergenciesMapDescription'/>
                  </p>
                </figcaption>
              </MapComponent>
              <GoMapDisclaimer className='map-disclaimer' />
            </div>
          ) : (
            <EmptyMessage />
          )}
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  EmergenciesMap.propTypes = {
    lastMonth: T.object,
    history: T.object,
    countriesGeojson: T.object
  };
}

export default withLanguage(withRouter(EmergenciesMap));

class MapPopover extends React.Component {
  render () {
    const {
      title,
      numAffected,
      totalEmergencies,
      withResponse,
      withoutResponse
    } = this.props;
    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <div className='popover__headline'>
              <a className='link--primary link--with-icon' onClick={() => this.props.onTitleClick(this.props.uri)}><span className='link--with-icon-text'>{title}</span>
                <span className='popover__headline__icon collecticon-chevron-right'></span>
              </a>
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li><button type='button' className='actions__menu-item poa-xmark' title='Close popover' onClick={this.props.onCloseClick}>
                      <span>
                        <Translate stringId='emergenciesMapPopoverDismiss'/>
                      </span>
                    </button>
                </li>
              </ul>
            </div>
          </header>
          <div className='popover__body scrollbar__custom'>
            <p className='popover__stat'>
              <Translate
                stringId='emergenciesMapPopoverPeopleAffected'
                params={{
                  numAffected: n(numAffected),
                }}
              />
            </p>
            <p className='popover__stat'>
              <span className='base-font-semi-bold'>
                <Translate
                  stringId='emergenciesMapPopoverTotalEmergencies'
                  params={{
                    totalEmergencies: n(totalEmergencies),
                  }}
                />
              </span>
            </p>
            <p className='popover__stat'>
              <Translate
                stringId='emergenciesMapPopoverWithoutIFRC'
                params={{
                  withoutResponse: n(withoutResponse),
                }}
              />
            </p>
            <p className='popover__stat'>
              <Translate
                stringId='emergenciesMapPopoverWithIFRC'
                params={{
                  withResponse: n(withResponse),
                }}
              />
            </p>
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
    uri: T.string,
    onTitleClick: T.func,
    numAffected: T.number,
    totalEmergencies: T.number,
    withResponse: T.number,
    withoutResponse: T.number
  };
}
