import React from 'react';
import c from 'classnames';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import turfBbox from '@turf/bbox';
import newMap from '../../utils/get-new-map';
import html2canvas from 'html2canvas';
import { startDownload } from '../../utils/download-starter';
// import exportMap from '../../utils/export-map';
import { DateTime } from 'luxon';

class EmergencyMap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      ready: false,
      isExporting: false
    };
  }

  exportMap () {
    this.setState({'isExporting': true});
    const timestamp = new Date();
    const $container = document.getElementById('mapContainer');
    html2canvas($container, {useCORS: true}).then((renderedCanvas) => {
      startDownload(
        renderedCanvas,
        'map-' + timestamp.getTime() + '.png'
      );
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
      date
    } = this.props;
    const exportStyle = {
      display: this.state.isExporting ? 'block' : 'none'
    };
    return (
      <div className='emergency-map'>
        <div className='inner'>
          <div className='row text-right'>
            <button className={c('button button--primary-bounded button--export global-margin-3-b', {
              disabled: !this.state.ready
            })} onClick={this.exportMap.bind(this)}>Export Map</button>
          </div>
          <div className='map-container' id='mapContainer'>
            <img style={exportStyle} className='' src='/assets/graphics/layout/logo.png' alt='IFRC GO logo'/>
            <h2 style={exportStyle} className=''>{name}</h2>
            <h3 style={exportStyle} className=''>{DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)}</h3>
            <figure className='map-vis'>
              <div className='fold__actions'>

              </div>
              <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
                <div className='deployments-key'>
                  <div>
                    <label className='form__label'>Key</label>
                    <dl className='legend__dl legend__dl--colors'>
                      <dt className='color color--lightblue'>selected</dt>
                      <dd>Affected country</dd>
                      <dt className='color color--maroon'>selected</dt>
                      <dd>Affected regions</dd>
                    </dl>
                    <dl className='legend__dl legend__dl--borders'>
                      <dt className='border--disputed'>border</dt>
                      <dd>Disputed borders</dd>
                    </dl>
                  </div>
                </div>
              </figcaption>
              <div className="map-vis__holder" ref='map'/>
            </figure>
            <p style={exportStyle} className=''>The maps used do not imply the expresion of any opinion on the part of the International Federation of the Red Cross and Red Crescent Societies or National Societies concerning the legal status of a territory or of its authorities, Map data sources: OCHA, OSM Contributors, ICRC, IFRC. Map design: Netherland Red Cross/IFRC.</p>
          </div>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  EmergencyMap.propTypes = {
    districts: T.array,
    countries: T.array,
    name: T.string,
    date: T.timestamp
  };
}

export default EmergencyMap;
