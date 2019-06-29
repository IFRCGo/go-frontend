'use strict';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'CREATE_PROJECT_INFLIGHT':
    case 'UPDATE_PROJECT_INFLIGHT':
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case 'CREATE_PROJECT_FAILED':
    case 'UPDATE_PROJECT_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'CREATE_PROJECT_SUCCESS':
    case 'UPDATE_PROJECT_SUCCESS':
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
