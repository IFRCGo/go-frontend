'use strict';

import { aggregateAppealStats } from '../../../utils/utils';

export function filterByAppealType (geoJSON, atype) {
  const filterFn = atype.target.value !== 'all' ? d => d.atype.toString() === atype.target.value.toString() : d => true;
  const features = geoJSON.features.map(d => {
    const appeals = d.properties.appeals.filter(filterFn);
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
