import React from 'react';
import c from 'classnames';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import turfBbox from '@turf/bbox';
import newMap from '#utils/get-new-map';
import html2canvas from 'html2canvas';
import { startDownload } from '#utils/download-starter';
// import exportMap from '#utils/export-map';
import { DateTime } from 'luxon';
import { disasterType } from '#utils/field-report-constants';
import _find from 'lodash.find';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class EmergencyMap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false,
      isExporting: false
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
      'ISO2',
      country.iso.toUpperCase()
    ];
    const districtCodes = districts.map(d => d.code);
    const districtIds = districts.map(d => d.id);
    const countryPolys = theMap.queryRenderedFeatures({'layers': ['country'], 'filter': countryFilter});
    const geom = countryPolys[0].geometry;
    const bbox = turfBbox(geom);
    theMap.fitBounds(bbox);

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
      'Admin00Nam',
      country.name
    ]);
    theMap.setFilter('admin1-country-selected-boundaries', [
      '==',
      'Admin00Nam',
      country.name
    ]);

    theMap.setLayoutProperty('admin1-selected', 'visibility', 'visible');
    theMap.setLayoutProperty('admin1-selected-labels', 'visibility', 'visible');
    theMap.setLayoutProperty('admin1-country-selected', 'visibility', 'visible');
    theMap.setLayoutProperty('admin1-country-selected-boundaries', 'visibility', 'visible');

    const disputedTerritoriesVisible = this.theMap.queryRenderedFeatures({layers: ['disputed_territories copy']}).length;
    if (disputedTerritoriesVisible) {
      this.setState({ disputedTerritoriesVisible: true });
    }
  }

  componentDidMount () {
    this.mapLoaded = false;
    this.theMap = newMap(this.refs.map, 'mapbox://styles/go-ifrc/cjxa3k4cx39a21cqt9qilk9hp');
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

    return (
      <div className='emergency-map'>
        <div className='inner'>
          <div className='row text-right'>
            <button className={c('button button--primary-bounded button--small button--export margin-2-v', {
              disabled: !this.state.ready
            })} onClick={this.exportMap.bind(this, countries[0].name, _find(disasterType, {value: String(disasterTypeCode)}).label)}>
              <Translate stringId='emergencyMapExport'/>
            </button>
          </div>
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
                      <dt className='color color--lightblue'>
                        <Translate stringId='emergencyMapSelected'/>
                      </dt>
                      <dd>
                        <Translate stringId='emergencyMapAffectedCountry'/>
                      </dd>
                      <dt className='color color--maroon'>
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

export default EmergencyMap;
