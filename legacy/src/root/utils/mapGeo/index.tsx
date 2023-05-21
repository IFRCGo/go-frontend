type GeojsonType = GeoJSON.FeatureCollection<GeoJSON.Point>;

function getLongDistance(geo: GeojsonType) {
  // NOTE: calculate the distance from one end to another end point
  const longs = geo.features.map((item) => item.geometry.coordinates[0]);
  const maxLong = Math.max(...longs);
  const minLong = Math.min(...longs);
  return {
    maxLong,
    minLong,
    diff: Math.abs(maxLong - minLong),
  };
}

function reflectGeojson(geo: GeojsonType, center: number) {

  const newGeojson = {
    ...geo,
    features: geo.features.map((feature) => ({
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: feature?.geometry.coordinates[0] < center
          ? [feature.geometry.coordinates[0] + 360, feature.geometry.coordinates[1]]
          : feature.geometry.coordinates
      },
    })),
  };

  return newGeojson;
}

function fixGeoJsonZeroLine(geojson: GeojsonType) {
  const {
    diff: diffA,
    maxLong,
    minLong,
  } = getLongDistance(geojson);

  // NOTE: calculate center to break equally
  const center = (maxLong + minLong) / 2;

  // NOTE: move part of map to the other side from center
  const geojsonB = reflectGeojson(geojson, center);

  const {
    diff: diffB,
    // maxLong: maxLongB,
    // minLong: minLongB,
  } = getLongDistance(geojsonB);

  if (diffB < diffA) {
    return geojsonB;
  }

  return geojson;
}
export default fixGeoJsonZeroLine;

