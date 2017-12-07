'use strict';
import { combineReducers } from 'redux';

const sumstatsInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function sumstats (state = sumstatsInitialState, action) {
  switch (action.type) {
    case 'GET_SUMSTATS_INFLIGHT':
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case 'GET_SUMSTATS_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'GET_SUMSTATS_SUCCESS':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: action.data
      });
      break;
  }
  return state;
}

const emergenciesInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: []
};

function emergencies (state = emergenciesInitialState, action) {
  switch (action.type) {
    case 'GET_EMERGENCIES_LIST_INFLIGHT':
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case 'GET_EMERGENCIES_LIST_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'GET_EMERGENCIES_LIST_SUCCESS':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: action.data
      });
      break;
  }
  return state;
}

// Combined export.
export default combineReducers({
  sumstats,
  emergencies
});
