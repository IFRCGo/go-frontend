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
    this.map.on('click', this.handleMapClick);
  }

  handleMapLoad = () => {
    this.mapLoaded = true;

    const { countryId } = this.props;

    const iso2 = countryIsoMapById[countryId].toUpperCase();
    const bbox = getBoundingBox(iso2);
    this.map.fitBounds(bbox);
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
