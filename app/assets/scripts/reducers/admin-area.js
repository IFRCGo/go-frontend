'use strict';
import { combineReducers } from 'redux';
import _toNumber from 'lodash.tonumber';
import _groupBy from 'lodash.groupby';

import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';
import { getCentroid } from '../utils/country-centroids';
import { get, groupByDisasterType } from '../utils/utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
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

function getAppealsStats (appeals) {
  let struct = {
    numBeneficiaries: 0,
    amountRequested: 0,
    amountFunded: 0
  };
  return appeals.reduce((acc, appeal) => {
    acc.numBeneficiaries += appeal.num_beneficiaries || 0;
    acc.amountRequested += _toNumber(appeal.amount_requested);
    acc.amountFunded += _toNumber(appeal.amount_funded);
    return acc;
  }, struct);
}

function getAdminGeojson (appeals) {
  const grouped = _groupBy(appeals.filter(o => o.country), 'country.iso');
  return {
    type: 'FeatureCollection',
    features: Object.keys(grouped).map(countryIso => {
      const countryAppeals = grouped[countryIso];
      const stats = getAppealsStats(countryAppeals);
      return {
        type: 'Feature',
        properties: Object.assign(stats, {
          id: countryAppeals[0].country.id,
          name: countryAppeals.map(o => get(o, 'event.name', o.name)).join(', '),
          // TODO this should have some way of showing multiple types.
          atype: countryAppeals[0].atype,
          dtype: countryAppeals[0].dtype
        }),
        geometry: {
          type: 'Point',
          coordinates: getCentroid(countryIso)
        }
      };
    })
  };
}

function appealStats (state = initialState, action) {
  switch (action.type) {
    case 'GET_AA_APPEALS_LIST_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AA_APPEALS_LIST_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AA_APPEALS_LIST_SUCCESS':
      const appeals = action.data;
      // Emergencies Types.
      const emergenciesByType = groupByDisasterType(appeals);
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: {
          stats: getAppealsStats(appeals),
          emergenciesByType,
          geoJSON: getAdminGeojson(appeals),
          results: appeals
        }
      });
      break;
  }
  return state;
}

function countryOperations (state = initialState, action) {
  switch (action.type) {
    case 'GET_COUNTRY_OPERATIONS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_COUNTRY_OPERATIONS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_COUNTRY_OPERATIONS_SUCCESS':
      state = stateSuccess(state, action);
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
          data: action.data.aggregate
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
      const objs = action.data;
      const grouped = _groupBy(objs, 'eru_owner.national_society_country.society_name');
      const eruBySociety = Object.keys(grouped).filter(Boolean).map(key => {
        return {
          id: grouped[key][0].eru_owner.national_society_country.id,
          name: key,
          count: grouped[key].reduce((acc, o) => acc + o.equipment_units, 0)
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

function keyFigures (state = initialState, action) {
  switch (action.type) {
    case 'GET_AA_KEY_FIGURES_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AA_KEY_FIGURES_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AA_KEY_FIGURES_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function snippets (state = initialState, action) {
  switch (action.type) {
    case 'GET_AA_SNIPPETS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AA_SNIPPETS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AA_SNIPPETS_SUCCESS':
      state = stateSuccess(state, action);
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
  countryOperations,
  aggregate,
  eru,
  keyFigures,
  snippets
});
