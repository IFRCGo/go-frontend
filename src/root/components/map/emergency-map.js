import React from 'react';
import { connect } from 'react-redux';
import c from 'classnames';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import turfBbox from '@turf/bbox';
import newMap from '#utils/get-new-map';
import html2canvas from 'html2canvas';
import { startDownload } from '#utils/download-starter';
import { DateTime } from 'luxon';
import _find from 'lodash.find';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import { disasterTypesSelectSelector } from '#selectors';

class EmergencyMap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false,
      isExporting: false,
      hideMap: false
    };
  }

  exportMap (country, disasterTypeName) {
    this.setState({'isExporting': true});
    const $container = document.getElementById('mapContainer');
    const $canvas = document.getElementsByClassName('mapboxgl-canvas')[0];
    const $expimg = document.getElementById('exportimage');
    $expimg.src = $canvas.toDataURL('png');
    $expimg.style.display = 'block';
    document.getElementsByClassName('mapboxgl-map')[0].style.visibility = 'hidden';
    html2canvas($container, {useCORS: true}).then((renderedCanvas) => {
      startDownload(
        renderedCanvas,
        `${DateTime.local().toISODate()}-${disasterTypeName}-${country}.png`
      );
      $expimg.style.display = 'none';
      document.getElementsByClassName('mapboxgl-map')[0].style.visibility = 'visible';
      this.setState({'isExporting': false});
    });
  }

  setupData () {
    const {
      countries,
      districts
    } = this.props;

    const theMap = this.theMap;
    const country = countries[0];
    const countryFilter = [
      '==',
      'iso',
      country.iso.toUpperCase()
    ];
    const countryPolys = theMap.queryRenderedFeatures({'layers': ['admin-0'], 'filter': countryFilter});
    // console.log(theMap.getStyle().layers); // do not remove it please, it can be so useful
    let geom;
    if (countryPolys.length > 0) {
      geom = countryPolys[0].geometry;
    } else {
      // NOTE: There is an edge case where the country is not independent / does not have a geom or ISO code.
      // In this case, we just hide the map, and return this function early.
      this.setState({hideMap: true});
      return;
    }
    const districtIds = districts.map(d => d.id);
    const bbox = turfBbox(geom);
    theMap.fitBounds(bbox);

//    theMap.setLayoutProperty('admin-1-highlight', 'visibility', 'visible');

theMap.setFilter('admin-1-highlight', [
  'in',
  'district_id',
  ...districtIds
]);
theMap.setFilter('admin-1-label-selected', [
  'in',
  'district_id',
  ...districtIds
]);

theMap.setFilter('admin-0-highlight', [
  '!in', // not in
  'iso',
  country.iso.toUpperCase()
]);

theMap.setLayoutProperty('admin-1-highlight', 'visibility', 'visible');
theMap.setLayoutProperty('admin-1-label-selected', 'visibility', 'visible');
theMap.setLayoutProperty('admin-0-highlight', 'visibility', 'visible');


/* Original is below – just for checking later:
    theMap.setFilter('admin1-selected', [
      'in',
      'Admin01Cod',
      ...districtCodes
    ]);
    theMap.setFilter('admin1-selected-labels', [
      'in',
      'id',
      ...districtIds
    ]);
    theMap.setFilter('admin1-country-selected', [
      '==',
      'country_name',
      country.name
    ]);
    theMap.setFilter('admin1-country-selected-boundaries', [
      '==',
      'country_name',
      country.name
    ]);

    theMap.setLayoutProperty('admin1-selected', 'visibility', 'visible');
    theMap.setLayoutProperty('admin1-selected-labels', 'visibility', 'visible');
    theMap.setLayoutProperty('admin1-country-selected', 'visibility', 'visible');
    theMap.setLayoutProperty('admin1-country-selected-boundaries', 'visibility', 'visible');

    if (countriesGeojson) {
      this.theMap.addSource('countryCentroids', {
        type: 'geojson',
        data: countriesGeojson
      });
      // hide stock labels
      this.theMap.setLayoutProperty('admin-0-label', 'visibility', 'none');
      this.theMap.setLayoutProperty('additional-geography-labels', 'visibility', 'none');

      // add custom language labels
      this.theMap.addLayer(countryLabels);
    }
*/
    const disputedTerritoriesVisible = this.theMap.queryRenderedFeatures({layers: ['admin-0-disputed']}).length;
    if (disputedTerritoriesVisible) {
      this.setState({ disputedTerritoriesVisible: true });
    }
  }

  componentDidMount () {
    this.mapLoaded = false;
    this.theMap = newMap(this.refs.map, 'mapbox://styles/go-ifrc/ckrfe16ru4c8718phmckdfjh0');
    this.theMap.on('load', () => {
      this.setupData();
      this.mapLoaded = true;
      this.setState({ ready: true });
    });
  }

  render () {
    const {
      name,
      date,
      countries,
      disasterTypeCode
    } = this.props;
    const exportStyle = {
      display: this.state.isExporting ? 'block' : 'none'
    };
    const exportImageStyle = {width: '100%', height: 'auto', display: 'none'};

    // If we have insufficient data or other factors, hide the map and return null.
    if (this.state.hideMap) {
      return null;
    }

    return (
      <div className='col-lg flex-1'>
        <div className='emergency-map'>
          <div className='fold fold--main padding-b-reset'>
            <div className='fold__header'>
              <div className='fold__header__block'>
                <h2 className='fold__title'>
                  <Translate stringId='emergencyAffectedRegions' />
                </h2>
                <div className='fold__title__linkwrap'>
                  <button className={c('button button--primary-bounded button--small button--export', {
                    disabled: !this.state.ready
                  })} onClick={this.exportMap.bind(this, countries[0].name, _find(this.props.disasterTypesSelect, {value: String(disasterTypeCode)})?.label)}>
                    <span className='f-icon-download font-size-sm spacing-half-r'></span>
                    <Translate stringId='emergencyMapExport'/>
                  </button>
                </div>
              </div>
            </div>
            <div className='fold__body'>  
              <div className='inner'>
                <div className='map-container' id='mapContainer'>
                  <div style={exportStyle} className='global-margin'>
                    <img className='' src='/assets/graphics/layout/go-logo-2020.svg' alt='IFRC GO logo'/>
                    <h2 className='map__container__title'>{name}</h2>
                    <div className=''>{DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)}</div>
                  </div>
                  <figure className='map-vis'>
                    <div className='fold__actions'>

                    </div>
                    <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
                      <div className='deployments-key'>
                        <div>
                          <label className='form__label'>Key</label>
                          <dl className='legend__dl legend__dl--colors'>
                            <dt className='color color--lightgrey'>
                              <Translate stringId='emergencyMapSelected'/>
                            </dt>
                            <dd>
                              <Translate stringId='emergencyMapAffectedCountry'/>
                            </dd>
                            <dt className='color color--rose'>
                              <Translate stringId='emergencyMapSelected'/>
                            </dt>
                            <dd>
                              <Translate stringId='emergencyMapAffectedRegion'/>
                            </dd>
                          </dl>
                          <dl className='legend__dl legend__dl--borders'>
                            <dt className='border--disputed'>
                              <Translate stringId='emergencyMapBorder'/>
                            </dt>
                            <dd>
                              <Translate stringId='emergencyMapBorderDisputed'/>
                            </dd>
                          </dl>
                          {
                            this.state.disputedTerritoriesVisible
                              ? <dl className='legend__dl legend__dl--borders'>
                                  <dt className='border--territory'>
                                    <Translate stringId='emergencyMapTerritory'/>
                                  </dt>
                                  <dd>
                                    <Translate stringId='emergencyMapDisputedTerritory'/>
                                  </dd>
                              </dl> : null
                          }
                        </div>
                      </div>
                    </figcaption>
                    <div className="map-vis__holder" ref='map'/>
                    <img id="exportimage" style={exportImageStyle} src='/assets/graphics/layout/go-logo-2020.svg'/>
                  </figure>
                  <p style={exportStyle} className='map__container__disclaimer'>
                    <Translate stringId='mapFooterDisclaimer'/>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    );
  }
}

EmergencyMap.contextType = LanguageContext;

if (environment !== 'production') {
  EmergencyMap.propTypes = {
    districts: T.array,
    countries: T.array,
    name: T.string,
    date: T.string,
    disasterTypeCode: T.string
  };
}

const selector = (state) => ({
  disasterTypesSelect: disasterTypesSelectSelector(state)
});

export default connect(selector)(EmergencyMap);
