'use strict';
import { combineReducers } from 'redux';

import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';

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

function rdit (state = initialState, action) {
  switch (action.type) {
    case 'GET_DEPLOYMENT_RDIT_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_DEPLOYMENT_RDIT_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_DEPLOYMENT_RDIT_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

// Combined export.
export default combineReducers({
  eru,
  fact,
  heop,
  rdit
});
