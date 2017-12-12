'use strict';
import { combineReducers } from 'redux';

const aggregateInitialState = {};
function aggregate (state = aggregateInitialState, action) {
  switch (action.type) {
    case 'GET_AGGREGATE_EMERGENCIES_INFLIGHT':
      state = Object.assign({}, state, {
        [action.aggregationUnit]: {
          error: null,
          fetching: true,
          fetched: false
        }
      });
      break;
    case 'GET_AGGREGATE_EMERGENCIES_FAILED':
      state = Object.assign({}, state, {
        [action.aggregationUnit]: {
          fetching: false,
          fetched: true,
          receivedAt: action.receivedAt,
          error: action.error
        }
      });
      break;
    case 'GET_AGGREGATE_EMERGENCIES_SUCCESS':
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

export default combineReducers({
  aggregate
});
