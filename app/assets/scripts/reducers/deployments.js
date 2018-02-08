'use strict';
import { combineReducers } from 'redux';
import _groupBy from 'lodash.groupby';
import _cloneDeep from 'lodash.clonedeep';

import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';
import { getCentroid } from '../utils/country-centroids';

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

function fact (state = initialState, action) {
  switch (action.type) {
    case 'GET_DEPLOYMENT_FACT_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_DEPLOYMENT_FACT_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_DEPLOYMENT_FACT_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function heop (state = initialState, action) {
  switch (action.type) {
    case 'GET_DEPLOYMENT_HEOP_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_DEPLOYMENT_HEOP_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_DEPLOYMENT_HEOP_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function rdrt (state = initialState, action) {
  switch (action.type) {
    case 'GET_DEPLOYMENT_RDRT_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_DEPLOYMENT_RDRT_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_DEPLOYMENT_RDRT_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

const geojsonInitialState = {
  fetchedCount: 0,
  fetchingCount: 0,
  data: {},
  error: null
};

function geojson (state = geojsonInitialState, action) {
  switch (action.type) {
    case 'GET_ALL_DEPLOYMENT_ERU_INFLIGHT':
    case 'GET_ALL_DEPLOYMENT_FACT_INFLIGHT':
    case 'GET_ALL_DEPLOYMENT_HEOP_INFLIGHT':
    case 'GET_ALL_DEPLOYMENT_RDRT_INFLIGHT':
      state = {
        ...state,
        fetchingCount: state.fetchingCount + 1
      };
      break;
    case 'GET_ALL_DEPLOYMENT_ERU_FAILED':
    case 'GET_ALL_DEPLOYMENT_FACT_FAILED':
    case 'GET_ALL_DEPLOYMENT_HEOP_FAILED':
    case 'GET_ALL_DEPLOYMENT_RDRT_FAILED':
      state = {
        ...state,
        fetchingCount: state.fetchingCount - 1,
        fetchedCount: state.fetchedCount + 1,
        error: action.error
      };
      break;
    case 'GET_ALL_DEPLOYMENT_ERU_SUCCESS':
      state = updateGeoState(state, action, 'eru');
      break;
    case 'GET_ALL_DEPLOYMENT_FACT_SUCCESS':
      state = updateGeoState(state, action, 'fact');
      break;
    case 'GET_ALL_DEPLOYMENT_HEOP_SUCCESS':
      state = updateGeoState(state, action, 'heop');
      break;
    case 'GET_ALL_DEPLOYMENT_RDRT_SUCCESS':
      state = updateGeoState(state, action, 'rdrt');
      break;
  }
  return state;
}

function updateGeoState (state, action, type) {
  let features = _cloneDeep(state.data.features) || [];
  const groupper = type === 'eru' ? 'deployed_to.iso' : 'country.iso';
  const countryGroup = _groupBy(action.data, groupper);

  Object.keys(countryGroup).forEach(cIso => {
    let feat = features.find(f => f.properties.countryIso === cIso);

    const setCount = (feat) => {
      if (type === 'eru') {
        feat.properties.eru += countryGroup[cIso].reduce((acc, o) => acc + o.units, 0);
      } else {
        // Each entry is a unit.
        feat.properties[type] += countryGroup[cIso].length;
      }
    };

    if (feat) {
      setCount(feat);
    } else {
      const country = type === 'eru' ? countryGroup[cIso][0].deployed_to : countryGroup[cIso][0].country;
      feat = {
        type: 'Feature',
        properties: {
          fact: 0,
          rdrt: 0,
          heop: 0,
          eru: 0,
          countryIso: cIso,
          countryId: country.id,
          countryName: country.name
        },
        geometry: {
          type: 'Point',
          coordinates: getCentroid(cIso)
        }
      };

      setCount(feat);
      features.push(feat);
    }
  });

  return {
    fetchingCount: state.fetchingCount - 1,
    fetchedCount: state.fetchedCount + 1,
    error: null,
    data: {
      type: 'FeatureCollection',
      features
    }
  };
}

// Combined export.
export default combineReducers({
  eru,
  fact,
  heop,
  rdrt,
  geojson
});
