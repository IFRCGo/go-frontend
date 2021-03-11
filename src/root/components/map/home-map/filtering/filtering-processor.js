
import { aggregateAppealStats } from '#utils/utils';

export function filtering (geoJSON, comparator) {
  const features = geoJSON.features.map(d => {
    const appeals = d.properties.appeals.filter(comparator);
    const properties = Object.assign(aggregateAppealStats(appeals), {
      atype: d.properties.atype,
      id: d.properties.id,
      name: d.properties.name,
      iso: d.properties.iso,
      appeals: appeals
    });
    // console.log('properties', properties);
    return {
      geometry: d.geometry,
      properties
    };
  }).filter(feature => feature.properties.appeals.length > 0);
  return { type: 'FeatureCollection', features };
}
