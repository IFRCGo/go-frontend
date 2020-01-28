'use strict';

import { source } from './../../../../utils/get-new-map';

class MarkerLayerStylesheetFactory {
  constructor () {
    this.buildMarkerLayers = this.buildMarkerLayers.bind(this);
    this.getCircleRadiusPaintProp = this.getCircleRadiusPaintProp.bind(this);
  }

  buildMarkerLayers () {
    const ccolor = {
      property: 'phaseCode',
      type: 'categorical',
      stops: [
        ['1', '#00845F'],
        ['2', '#BD001C'],
        ['3', '#2D5086'],
        ['4', '#740544'],
        ['5', '#CC700E'],
        ['-1', '#CCCCCC']
      ]
    };
    const cradius = this.getCircleRadiusPaintProp();
    const layers = [];
    layers.push({
      'id': 'mapboxPoint', // appeals
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
