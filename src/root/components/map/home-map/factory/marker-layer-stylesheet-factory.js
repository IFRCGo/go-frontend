
import { source } from '#utils/get-new-map';

class MarkerLayerStylesheetFactory {
  constructor () {
    this.buildMarkerLayers = this.buildMarkerLayers.bind(this);
    this.getCircleRadiusPaintProp = this.getCircleRadiusPaintProp.bind(this);
  }

  buildMarkerLayers (geoJSON, scaleBy) {
    const ccolor = {
      property: 'atype',
      type: 'categorical',
      stops: [
        ['DREF', '#F39C12'],
        ['Appeal', '#f5333f'],
        ['Movement', '#CCCCCC'],
        ['Mixed', '#4680F2']
      ]
    };
    const cradius = this.getCircleRadiusPaintProp(geoJSON, scaleBy);
    const layers = [];
    layers.push({
      'id': 'appeals',
      'type': 'circle',
      'source': source,
      'paint': {
        'circle-color': ccolor,
        'circle-radius': cradius
      }
    });
    return layers;
  }

  getCircleRadiusPaintProp (geoJSON, scaleBy) {
    const scaleProp = scaleBy === 'amount' ? 'amountRequested' : 'numBeneficiaries';
    const maxScaleValue = Math.max.apply(Math, geoJSON.features.map(o => o.properties[scaleProp]));
    return [
      'interpolate',
      ['linear'],
      ['zoom'],
      3, [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', scaleProp]],
        0,
        0,
        1,
        5,
        maxScaleValue,
        10
      ],
      8, [
        'interpolate',
        ['exponential', 1],
        ['number', ['get', scaleProp]],
        0,
        0,
        1,
        20,
        maxScaleValue,
        40
      ]
    ];
  }
}

export default MarkerLayerStylesheetFactory;
