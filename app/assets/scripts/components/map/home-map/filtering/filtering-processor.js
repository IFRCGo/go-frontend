'use strict';

import { aggregateAppealStats } from './../../../../utils/utils';

export function filtering (geoJSON, comparator) {
  const features = geoJSON.features.map(d => {
    const appeals = d.properties.appeals.filter(comparator);
    const properties = Object.assign(aggregateAppealStats(appeals), {
      atype: d.properties.atype,
      id: d.properties.id,
      name: d.properties.name,
      iso: d.properties.iso,
      appeals: d.properties.appeals
    });
    return {
      geometry: d.geometry,
      properties
    };
  });
  return { type: 'FeatureCollection', features };
}
