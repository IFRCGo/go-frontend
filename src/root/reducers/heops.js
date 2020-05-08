'use strict';
import { combineReducers } from 'redux';

import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function list (state = initialState, action) {
  switch (action.type) {
    case 'GET_HEOPS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_HEOPS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_HEOPS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function annual (state = initialState, action) {
  switch (action.type) {
    case 'GET_YEARLY_HEOPS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_YEARLY_HEOPS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_YEARLY_HEOPS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function dtype (state = initialState, action) {
  switch (action.type) {
    case 'GET_HEOPS_DTYPE_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_HEOPS_DTYPE_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_HEOPS_DTYPE_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default combineReducers({
  list,
  annual,
  dtype
});
