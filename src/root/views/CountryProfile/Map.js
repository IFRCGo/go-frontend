import React from 'react';

import newMap from '#utils/get-new-map';
import { getCountryMeta } from '../../utils/get-country-meta';
import turfBbox from '@turf/bbox';
import { countryLabels } from '#utils/country-labels';

export default class ThreeWMap extends React.PureComponent {
  constructor (props) {
    super(props);

    this.mapContainerRef = React.createRef();
    this.mapLoaded = false;
  }

  componentDidMount () {
    const { current: mapContainer } = this.mapContainerRef;
    this.map = newMap(
      mapContainer,
      'mapbox://styles/go-ifrc/ck1izjgrs016k1cmxwekow9m0',
      { interactive: false },
    );

    this.map.on('load', this.handleMapLoad);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    const {
      countryId: oldCountryId,
      districtList: oldDistrictList,
    } = this.props;

    const {
      countryId,
      districtList,
      countries,
    } = nextProps;

    if (countryId !== oldCountryId || districtList !== oldDistrictList) {
      if (this.mapLoaded) {
        this.fillMap(countryId, districtList, countries);
      }
    }
  }

  handleMapLoad = () => {
    this.mapLoaded = true;

    const {
      countryId,
      districtList,
      countries,
      countriesGeojson
    } = this.props;

    if (countriesGeojson) {
      this.map.addSource('countryCentroids', {
        type: 'geojson',
        data: countriesGeojson
      });
      // hide stock labels
      this.map.setLayoutProperty('icrc_admin0_labels', 'visibility', 'none');
    }


    // add custom language labels
    this.map.addLayer(countryLabels);

    this.fillMap(countryId, districtList, countries);
  }

  fillMap = (countryId, districtList, countries) => {
    const countryMeta = getCountryMeta(countryId, countries);
    const bbox = turfBbox(countryMeta.bbox);
    this.map.fitBounds(bbox, { padding: 50 });
    const maxPopulation = Math.max(0, ...districtList.map(district => district.population));
    let opacityProperty;

    const upperShift = 0.3;
    const lowerShift = 0.1;

    if (districtList.length > 0) {
      opacityProperty = [
        'match',
        ['get', 'OBJECTID'],
        ...districtList.map(district => [
          district.id,
          lowerShift + (district.population / maxPopulation) * (1 - upperShift - lowerShift),
        ]).flat(),
        0,
      ];
    } else {
      opacityProperty = 0;
    }

    this.map.setPaintProperty(
      'adm1',
      'fill-opacity',
      opacityProperty,
    );
  }

  render () {
    const { className } = this.props;

    return (
      <div
        ref={this.mapContainerRef}
        className={className}
      />
    );
  }
}
