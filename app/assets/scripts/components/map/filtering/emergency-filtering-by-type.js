'use strict';

import { aggregateAppealStats } from './../../../utils/utils';

export function filterByEmergencyType (geoJSON, dtype) {
  const filterFn = dtype ? d => d.dtype.toString() === dtype.toString() : d => true;
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