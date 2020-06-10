import { get } from '#utils/utils';
import { combineReducers } from 'redux';
import _groupBy from 'lodash.groupby';
import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { getCentroid } from '#utils/country-centroids';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function eru (state = initialState, action) {
  switch (action.type) {
    case 'GET_DEPLOYMENT_ERU_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_DEPLOYMENT_ERU_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_DEPLOYMENT_ERU_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function personnel (state = initialState, action) {
  switch (action.type) {
    case 'GET_PERSONNEL_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PERSONNEL_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PERSONNEL_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

const personnelInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {},
  types: {}
};

function activePersonnel (state = personnelInitialState, action) {
  switch (action.type) {
    case 'GET_ACTIVE_PERSONNEL_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_ACTIVE_PERSONNEL_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_ACTIVE_PERSONNEL_SUCCESS':
      state = Object.assign(stateSuccess(state, action), parseActivePersonnel(action));
      break;
  }
  return state;
}

function parseActivePersonnel ({data}) {
  const results = get(data, 'results', []);
  let types = _groupBy(results, 'type');
  for (let key in types) {
    types[key] = types[key].length;
  }
  return {
    types
  };
}

const locationInitialState = {
  type: 'FeatureCollection',
  features: []
};

function locations (state = locationInitialState, action) {
  switch (action.type) {
    case 'GET_ACTIVE_PERSONNEL_SUCCESS':
    case 'GET_ALL_DEPLOYMENT_ERU_SUCCESS':
      state = parseLocations(state.features, action);
      break;
  }
  return state;
}

function parseLocations (existingFeatures, action) {
  const isEru = action.type === 'GET_ALL_DEPLOYMENT_ERU_SUCCESS';
  const results = get(action, 'data.results', []);
  let countryPath = isEru ? 'deployed_to' : 'deployment.country_deployed_to';
  const countries = _groupBy(results, countryPath + '.id');
  let features = existingFeatures.slice();
  for (let id in countries) {
    let deployments = countries[id];
    let values = isEru
      ? deployments.reduce((acc, next) => {
        acc.eru += next.equipment_units;
        return acc;
      }, {eru: 0})
      : deployments.reduce((acc, next) => {
        acc[next.type] += 1;
        return acc;
      }, {heop: 0, fact: 0, rdrt: 0});
    let existingFeature = features.find(d => d.properties.id.toString() === id);
    if (existingFeature) {
      for (let type in values) {
        existingFeature.properties[type] += values[type];
      }
    } else {
      let country = get(deployments[0], countryPath);
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: getCentroid(country.iso)
        },
        properties: Object.assign({eru: 0, heop: 0, fact: 0, rdrt: 0}, country, values)
      });
    }
  }
  return { type: 'FeatureCollection', features };
}

export default combineReducers({
  eru,
  personnel,
  activePersonnel,
  locations
});
