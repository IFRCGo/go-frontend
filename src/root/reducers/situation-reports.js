import { combineReducers } from 'redux';
import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';

const initialState = {
  // fetching: false,
  // fetched: false,
  // receivedAt: null,
  // data: {}
};

function reports (state = initialState, action) {
  switch (action.type) {
    case 'GET_SITREPS_INFLIGHT':
      state = Object.assign({}, state, {
        [action.id]: {
          error: null,
          fetching: true,
          fetched: false
        }
      });
      break;
    case 'GET_SITREPS_FAILED':
      state = Object.assign({}, state, {
        [action.id]: {
          fetching: false,
          fetched: true,
          receivedAt: action.receivedAt,
          error: action.error
        }
      });
      break;
    case 'GET_SITREPS_SUCCESS':
      state = Object.assign({}, state, {
        [action.id]: {
          fetching: false,
          fetched: true,
          receivedAt: action.receivedAt,
          data: action.data
        }
      });
      break;
  }
  return state;
}

const initialReportState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function types (state = initialReportState, action) {
  switch (action.type) {
    case 'GET_SITREP_TYPES_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_SITREP_TYPES_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_SITREP_TYPES_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

// Combined export.
export default combineReducers({
  reports,
  types
});
