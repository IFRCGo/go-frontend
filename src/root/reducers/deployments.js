import { get } from '#utils/utils';
import { combineReducers } from 'redux';
import _groupBy from 'lodash.groupby';
import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { getCountryMeta } from '../utils/get-country-meta';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function aggregated (state = initialState, action) {
  switch (action.type) {
    case 'GET_AGGR_SURGE_KEY_FIGURES_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AGGR_SURGE_KEY_FIGURES_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AGGR_SURGE_KEY_FIGURES_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

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

function allEru (state = locationInitialState, action) {
  switch (action.type) {
    case 'GET_ACTIVE_PERSONNEL_SUCCESS':
    case 'GET_ALL_DEPLOYMENT_ERU_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default combineReducers({
  eru,
  personnel,
  activePersonnel,
  allEru,
  aggregated
});
