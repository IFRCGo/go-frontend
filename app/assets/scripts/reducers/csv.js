'use strict';
import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';
import { combineReducers } from 'redux';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function list (state = initialState, action) {
  switch (action.type) {
    case 'GET_LIST_CSV_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_LIST_CSV_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_LIST_CSV_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default combineReducers({
  list
});
