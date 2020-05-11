
import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';
import { combineReducers } from 'redux';
import { DEL_SUBSCRIPTION } from './../actions';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function addSubscriptions (state = initialState, action) {
  switch (action.type) {
    case 'ADD_SUBSCRIPTIONS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'ADD_SUBSCRIPTIONS_FAILED':
      state = stateError(state, action);
      break;
    case 'ADD_SUBSCRIPTIONS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function delSubscriptions (state = initialState, action) {
  switch (action.type) {
    case DEL_SUBSCRIPTION + '_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case DEL_SUBSCRIPTION + '_FAILED':
      state = stateError(state, action);
      break;
    case DEL_SUBSCRIPTION + '_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default combineReducers({
  addSubscriptions,
  delSubscriptions
});
