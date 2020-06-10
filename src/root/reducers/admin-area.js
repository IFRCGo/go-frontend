import { combineReducers } from 'redux';
import _groupBy from 'lodash.groupby';

import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import {
  aggregateAppealStats,
  aggregateCountryAppeals,
  aggregatePartnerDeployments,
  groupByDisasterType
} from '#utils/utils';

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

function appealStats (state = initialState, action) {
  switch (action.type) {
    case 'GET_AA_APPEALS_LIST_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AA_APPEALS_LIST_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AA_APPEALS_LIST_SUCCESS':
      const appeals = action.data.results;
      // Emergencies Types.
      const emergenciesByType = groupByDisasterType(appeals);
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: {
          stats: aggregateAppealStats(appeals),
          emergenciesByType,
          geoJSON: aggregateCountryAppeals(appeals),
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

function personnel (state = {}, action) {
  switch (action.type) {
    case 'GET_AA_PERSONNEL_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_AA_PERSONNEL_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_AA_PERSONNEL_SUCCESS':
      const objs = action.data.results;
      const grouped = _groupBy(objs, 'country_from.society_name');
      const personnelBySociety = Object.keys(grouped).filter(Boolean).map(key => {
        return {
          id: grouped[key][0].country_from.id,
          name: key,
          count: grouped[key].length
        };
      });
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: { personnelBySociety }
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

function partnerDeployments (state = {}, action) {
  const { id } = action;
  let next;
  switch (action.type) {
    case 'GET_PARTNER_DEPLOYMENTS_INFLIGHT':
      next = Object.assign({}, state[id], stateInflight(state, action));
      state = Object.assign({}, state, { [id]: next });
      break;
    case 'GET_PARTNER_DEPLOYMENTS_FAILED':
      next = Object.assign({}, state[id], stateError(state, action));
      state = Object.assign({}, state, { [id]: next });
      break;
    case 'GET_PARTNER_DEPLOYMENTS_SUCCESS':
      let filters = state[id] ? state[id].filters : null;
      next = Object.assign({}, state[id], {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: aggregatePartnerDeployments(action.data.results, filters),
        _records: action.data.results
      });
      state = Object.assign({}, state, { [id]: next });
      break;
    case 'SET_PARTNER_DEPLOYMENT_FILTER':
      // We only need to filter data if there are currently records
      next = Object.assign({}, state[id], { filters: action.filters });
      if (Array.isArray(next._records)) {
        next.data = aggregatePartnerDeployments(next._records, next.filters);
      }
      state = Object.assign({}, state, { [id]: next });
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
  personnel,
  keyFigures,
  snippets,
  partnerDeployments
});
