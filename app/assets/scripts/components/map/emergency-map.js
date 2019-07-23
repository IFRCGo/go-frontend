import React from 'react';
import c from 'classnames';
import turfBbox from '@turf/bbox';
import newMap from '../../utils/get-new-map';
import exportMap from '../../utils/export-map';


class EmergencyMap extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      ready: false
    };
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
    console.log('country', country);
    const layers = theMap.getStyle().layers;
    console.log('layers', layers);
    const countryPolys = theMap.queryRenderedFeatures({'layers': ['country'], 'filter': countryFilter});
    console.log('country polys', countryPolys);
    const geom = countryPolys[0].geometry;
    console.log('geom', JSON.stringify(geom));
    const bbox = turfBbox(geom);
    theMap.fitBounds(bbox);
    console.log('district codes', districtCodes);

    theMap.setFilter('admin1-selected', [
      'in',
      'Admin01Cod',
      ...districtCodes
    ]);
    theMap.setFilter('admin1-selected-labels', [
      'in',
      'Admin01Cod',
      ...districtCodes
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
      countries,
      districts
    } = this.props;

    return (
      <div className='emergency-map'>
        <div className='inner'>
          <div className='map-container'>
            <h2 className='visually-hidden'>Emergency</h2>
            <figure className='map-vis'>
              <div className='fold__actions'>

              </div>
              <div className="map-vis__holder" ref='map'/>
            </figure>
          </div>
          <button className={c('button button--primary-bounded button--export', {
                  disabled: !this.state.ready
                })} onClick={() => exportMap(this.theMap)}>Export Map</button>
        </div>
      </div>
    );
  }
}

export default EmergencyMap;