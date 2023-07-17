export const countryLabels = {
  'id': 'countryLabels',
  'source': 'countryCentroids',
  'type': 'symbol',
  layout: {
    'text-field': ['get', 'name'],
    'text-font': ['Poppins Regular', 'Arial Unicode MS Regular'],
    'text-letter-spacing': 0.15,
    'text-line-height': 1.2,
    'text-max-width': 8,
    'text-justify': 'center',
    'text-anchor': 'top',
    'text-padding': 2,
    'text-size': [
      'interpolate', ['linear', 1], ['zoom'],
      0, 6,
      6, 16
    ]
  },
  filter: ['==', ['get', 'independent'], true],
  paint: {
   'text-color': '#000000',
   'text-halo-color': '#000000',
   'text-halo-width': 0.2
  }
};

export const countryNonIndependentLabels = {
  'id': 'countryNonIndependentLabels',
  'source': 'countryCentroids',
  'type': 'symbol',
  layout: {
    'text-field': ['get', 'name'],
    'text-font': ['Poppins Regular', 'Arial Unicode MS Regular'],
    'text-letter-spacing': 0.15,
    'text-line-height': 1.2,
    'text-max-width': 8,
    'text-justify': 'center',
    'text-anchor': 'top',
    'text-padding': 2,
    'text-size': [
      'interpolate', ['linear', 1], ['zoom'],
      0, 5,
      6, 15
    ]
  },
  filter: ['==', ['get', 'independent'], false],
  paint: {
   'text-color': '#aaaaaa',
   'text-halo-color': '#000000',
   'text-halo-width': 0.2
  }
};