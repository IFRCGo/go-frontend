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


class DeploymentsMap extends React.Component {
  constructor (props) {
    super(props);
    const scaleBy = 'units';
    const { data } = props;
    this.state = {
      scaleBy,
      layers: this.getLayers(data, scaleBy),
      filters: []
    };
    this.configureMap = this.configureMap.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (data) {
    if (!this.props.data && data) {
      this.setState({
        layers: this.getLayers(data, this.state.scaleBy)
      });
    }
  }

  configureMap (theMap) {
    theMap.on('click', 'surge', e => {
      this.showPopover(theMap, e.features[0]);
    });
    theMap.on('mousemove', 'surge', () => {
      theMap.getCanvas().style.cursor = 'pointer';
    });
    theMap.on('mouseleave', 'surge', () => {
      theMap.getCanvas().style.cursor = '';
    });
  }

  onFieldChange (e) {
    const scaleBy = e.target.value;
    this.setState({
      layers: this.getLayers(this.props.data, scaleBy),
      scaleBy
    });
  }

  getLayers (geoJSON, scaleBy) {
    const ccolor = [
      'case',
      ['all', ['>', ['get', 'units'], 0], ['>', ['get', 'personnel'], 0]],
      '#4c5d9b',
      ['>', ['get', 'units'], 0],
      '#f5333f',
      ['>', ['get', 'personnel'], 0],
      '#ff9e00',
      '#fff'
    ];

    const scaleValues = geoJSON?.features?.map(o => o.properties[scaleBy]);
    let maxScaleValue = 1;
    if (scaleValues.length) {
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
      id: 'inner_circle',
      type: 'circle',
      source,
      paint: {
        'circle-color': ccolor,
        'circle-radius': 5
      }
    });
    layers.push({
      id: 'surge',
      type: 'circle',
      source,
      paint: {
        'circle-color': ccolor,
        'circle-radius': cradius,
        'circle-opacity': 0.4
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
      history={this.props.history}
      uri={feature.properties.id}
      events={JSON.parse(feature.properties.events)}
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

    const { strings } = this.props;
    return (
      <div className='stats-map deployments-map'>
        <div className='inner'>
          {this.props.data ? (
            <div className='map-container'>
              <h2 className='visually-hidden'>
                <Translate stringId='deploymentsMapHeading'/>
              </h2>
              <MapComponent className='map-vis__holder'
                configureMap={this.configureMap}
                noExport={true}
                downloadButton={true}
                downloadedHeaderTitle={strings.emergenciesMapDownloadTitle}
                layers={this.state.layers}
                // filters={this.state.filters}
                geoJSON={this.props.data}
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
                            label: 'ERU',
                            value: 'units'
                          },
                          {
                            label: 'Personnel',
                            value: 'personnel'
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
                          <Translate stringId='eruOnly'/>
                        </dd>
                        <dt className='color color--map-red2'>yellow</dt>
                        <dd>
                          <Translate stringId='rrOnly'/>
                        </dd>
                        <dt className='color color--map-darkblue'>blue</dt>
                        <dd>
                          <Translate stringId='mixedEruRr'/>
                        </dd>
                      </dl>
                    </div>
                  </div>
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
  DeploymentsMap.propTypes = {
    data: T.object,
    history: T.object,
    countriesGeojson: T.object,
  };
}

export default withLanguage(withRouter(DeploymentsMap));

class MapPopover extends React.Component {
  render () {
    const {
      title,
      events,
      history
    } = this.props;
    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <div className='popover__headline'>
              <a
                className='link--primary link--with-icon'
                onClick={() => history.push(`/countries/${this.props.uri}`)}
              >
                <span className='link--with-icon-text'>{title}</span>
                <span className='popover__headline__icon collecticon-chevron-right'></span>
              </a>
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li>
                  <button type='button' className='actions__menu-item poa-xmark' title='Close popover' onClick={this.props.onCloseClick}>
                    <span>
                      <Translate stringId='emergenciesMapPopoverDismiss'/>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </header>
          <div className='popover__body scrollbar__custom'>
            {events && events.map((event) =>
              <>
                <p className='base-font-semi-bold'>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      history.push(`/emergencies/${event.id}`);
                    }}
                  >
                    {event.name}
                  </a>
                </p>
                {event.units &&
                  <p>
                    <Translate
                      stringId='readinessDeployedErus'
                      params={{ numDeployed: n(event.units) }}
                    />
                  </p>
                }
                {event.personnel &&
                  <p>{event.personnel} <Translate stringId='tablePersonnel' /></p>
                }
              </>
            )}
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
    events: T.object,
    history: T.object
  };
}
