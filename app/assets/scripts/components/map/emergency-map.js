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
    theMap.setCenter(countryCentroid);
    theMap.setZoom(2);
    const countryFilter = [
      '==',
      'ISO2',
      country.iso.toUpperCase()
    ];
    console.log('country', country);

    // FIXME: we need a better event than style.load to trigger this
    setTimeout(() => {
      const countryPolys = theMap.queryRenderedFeatures({'layers': ['country_polys'], 'filter': countryFilter});
      const geom = countryPolys[0].geometry;
      const bbox = turfBbox(geom);
      theMap.fitBounds(bbox);
    }, 2000);
  }

  componentDidMount () {
    this.mapLoaded = false;
    this.theMap = newMap(this.refs.map);
    this.theMap.on('style.load', () => { // FIXME: not style.load, we need something like data.load ?
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
                <button className={c('button button--primary-bounded button--export', {
                  disabled: !this.state.ready
                })} onClick={() => exportMap(this.theMap)}>Export Map</button>
              </div>
              <div className="map-vis__holder" ref='map'/>
            </figure>
          </div>
        </div>
      </div>
    );
  }
}

export default EmergencyMap;