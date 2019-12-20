'use strict';
import React from 'react';

import { countryIsoMapById } from '../../utils/field-report-constants';

import { getBoundingBox } from '../../utils/country-bounding-box';
import newMap from '../../utils/get-new-map';

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
    );

    this.map.setMaxZoom(7);
    this.map.on('load', this.handleMapLoad);
  }

  componentWillReceiveProps (nextProps) {
    const {
      countryId: oldCountryId,
      districtList: oldDistrictList,
    } = this.props;

    const {
      countryId,
      districtList,
    } = nextProps;

    if (countryId !== oldCountryId || districtList !== oldDistrictList) {
      if (this.mapLoaded) {
        this.fillMap(countryId, districtList);
      }
    }
  }

  handleMapLoad = () => {
    this.mapLoaded = true;

    const {
      countryId,
      districtList,
    } = this.props;

    this.fillMap(countryId, districtList);
  }

  fillMap = (countryId, districtList) => {
    const iso2 = countryIsoMapById[countryId].toUpperCase();
    const bbox = getBoundingBox(iso2);
    this.map.fitBounds(bbox);

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
