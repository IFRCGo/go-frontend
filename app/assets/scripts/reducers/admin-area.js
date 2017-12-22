'use strict';
import { combineReducers } from 'redux';
import _toNumber from 'lodash.tonumber';
import _groupBy from 'lodash.groupby';

import { getCentroid } from '../utils/country-centroids';
import { get, groupByDisasterType } from '../utils/utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

const stateInflight = (state, action) => {
  return Object.assign({}, state, {
    error: null,
    fetching: true,
    fetched: false
  });
};

const stateError = (state, action) => {
  return Object.assign({}, state, {
    fetching: false,
    fetched: true,
    receivedAt: action.receivedAt,
    error: action.error
  });
};

const stateSuccess = (state, action) => {
  return Object.assign({}, state, {
    fetching: false,
    fetched: true,
    receivedAt: action.receivedAt,
    data: action.data
  });
};

function aaData (state = initialState, action) {
  switch (action.type) {
    case 'GET_AA_INFLIGHT':
      state = Object.assign({}, state, {
        [action.id]: stateInflight(state, action)
      });
      break;
    case 'GET_AA_FAILED':
      state = Object.assign({}, state, {
        [action.id]: stateError(state, action)
      });
      break;
    case 'GET_AA_SUCCESS':
      state = Object.assign({}, state, {
        [action.id]: stateSuccess(state, action)
      });
      break;
  }
  return state;
}

function appeals (state = initialState, action) {
  switch (action.type) {
    case 'GET_AA_APPEALS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AA_APPEALS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AA_APPEALS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function drefs (state = initialState, action) {
  switch (action.type) {
    case 'GET_AA_DREFS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AA_DREFS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AA_DREFS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function fieldReports (state = initialState, action) {
  switch (action.type) {
    case 'GET_AA_FIELD_REPORTS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AA_FIELD_REPORTS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AA_FIELD_REPORTS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function appealStats (state = initialState, action) {
  switch (action.type) {
    case 'GET_AA_APPEALS_STATS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AA_APPEALS_STATS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AA_APPEALS_STATS_SUCCESS':
      // Statistics.
      const objs = action.data;
      let struct = {
        numBeneficiaries: 0,
        amountRequested: 0,
        amountFunded: 0
      };

      struct = objs.reduce((acc, object) => {
        acc.numBeneficiaries += object.num_beneficiaries || 0;
        acc.amountRequested += _toNumber(object.amount_requested);
        acc.amountFunded += _toNumber(object.amount_funded);
        return acc;
      }, struct);

      // Emergencies Types.
      const emergenciesByType = groupByDisasterType(objs);

      // Features for the map.
      const geoJSON = {
        type: 'FeatureCollection',
        features: objs.reduce((acc, o) => {
          if (o.country) {
            return acc.concat({
              type: 'Feature',
              properties: {
                id: o.id,
                name: get(o, 'event.name'),
                pageId: get(o, 'event.id'),
                atype: o.atype,
                dtype: o.dtype.id,
                numBeneficiaries: o.num_beneficiaries,
                amountRequested: _toNumber(o.amount_requested),
                amountFunded: _toNumber(o.amount_funded)
              },
              geometry: {
                type: 'Point',
                coordinates: getCentroid(o.country.iso)
              }
            });
          }
          return acc;
        }, [])
      };

      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: {
          stats: struct,
          geoJSON,
          emergenciesByType
        }
      });
      break;
  }
  return state;
}

function aggregate (state = {}, action) {
  switch (action.type) {
    case 'GET_AA_AGGREGATE_APPEALS_INFLIGHT':
      state = Object.assign({}, state, {
        [action.aggregationUnit]: stateInflight(state, action)
      });
      break;
    case 'GET_AA_AGGREGATE_APPEALS_FAILED':
      state = Object.assign({}, state, {
        [action.aggregationUnit]: stateError(state, action)
      });
      break;
    case 'GET_AA_AGGREGATE_APPEALS_SUCCESS':
      state = Object.assign({}, state, {
        [action.aggregationUnit]: {
          fetching: false,
          fetched: true,
          receivedAt: action.receivedAt,
          data: action.data.aggregate.reverse()
        }
      });
      break;
  }
  return state;
}

function eru (state = {}, action) {
  switch (action.type) {
    case 'GET_AA_ERU_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AA_ERU_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AA_ERU_SUCCESS':
      const objs = action.data.objects;
      let eruBySociety = _groupBy(objs, 'eru_owner.country.society_name');

      eruBySociety = Object.keys(eruBySociety).map(key => {
        return {
          id: eruBySociety[key][0].eru_owner.country.id,
          name: key,
          count: eruBySociety[key].reduce((acc, o) => acc + o.units, 0)
        };
      });

      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: {
          eruBySociety
        }
      });
      break;
  }
  return state;
}

// Combined export.
export default combineReducers({
  aaData,
  appeals,
  drefs,
  fieldReports,
  appealStats,
  aggregate,
  eru
});
