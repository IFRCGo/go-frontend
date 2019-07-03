'use strict';

import { source } from './../../../../utils/get-new-map';

class MarkerLayerStylesheetFactory {
  constructor () {
    this.buildMarkerLayers = this.buildMarkerLayers.bind(this);
    this.getCircleRadiusPaintProp = this.getCircleRadiusPaintProp.bind(this);
  }

  buildMarkerLayers () {
    const ccolor = {
      property: 'code',
      type: 'categorical',
      stops: [
        ['a1', '#42c5f5'],
        ['a2', '#2724ff'],
        ['a3', '#33ff4b'],
        ['a3-2', '#00a313'],
        ['a4', '#e3df00'],
        ['a5', '#e32d00']
      ]
    };
    const cradius = this.getCircleRadiusPaintProp();
    const layers = [];
    layers.push({
      'id': 'mapboxPoint', //appeals
      'type': 'circle',
      'source': source,
      'paint': {
        'circle-color': ccolor,
        'circle-radius': cradius
      }
    });
    return layers;
  }

  getCircleRadiusPaintProp () {
    return [
      'interpolate',
      ['linear'],
      ['zoom'],
      3, [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', 'id']], // scaleProp
        0,
        0,
        1,
        5,
        // maxScaleValue,
        6,
        10
      ],
      8, [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', 'id']], // scaleProp
        0,
        0,
        1,
        20,
        // maxScaleValue,
        21,
        40
      ]
    ];
  }
}

export default MarkerLayerStylesheetFactory;
