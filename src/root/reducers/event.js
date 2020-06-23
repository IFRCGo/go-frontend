import { combineReducers } from 'redux';
import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';

const initialState = {
  // fetching: false,
  // fetched: false,
  // receivedAt: null,
  // data: {}
};

function eventList (state = initialState, action) {
  switch (action.type) {
    case 'GET_EVENT_LIST_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_EVENT_LIST_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_EVENT_LIST_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function event (state = initialState, action) {
  switch (action.type) {
    case 'GET_EVENT_INFLIGHT':
      state = Object.assign({}, state, {
        [action.id]: {
          error: null,
          fetching: true,
          fetched: false
        }
      });
      break;
    case 'GET_EVENT_FAILED':
      state = Object.assign({}, state, {
        [action.id]: {
          fetching: false,
          fetched: true,
          receivedAt: action.receivedAt,
          error: action.error
        }
      });
      break;
    case 'GET_EVENT_SUCCESS':
      state = Object.assign({}, state, {
        [action.id]: {
          fetching: false,
          fetched: true,
          receivedAt: action.receivedAt,
          data: action.data
        }
      });
      break;
    case 'CLEAR_EVENTS':
      delete state[action.eventId];
      break;
  }
  return state;
}

function snippets (state = initialState, action) {
  switch (action.type) {
    case 'GET_EVENT_SNIPPETS_INFLIGHT':
      state = Object.assign({}, state, {
        [action.id]: stateInflight(state, action)
      });
      break;
    case 'GET_EVENT_SNIPPETS_FAILED':
      state = Object.assign({}, state, {
        [action.id]: stateError(state, action)
      });
      break;
    case 'GET_EVENT_SNIPPETS_SUCCESS':
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

export default combineReducers({
  eventList,
  event,
  snippets
});
