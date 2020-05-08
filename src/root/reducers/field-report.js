'use strict';

const initialState = {
  // fetching: false,
  // fetched: false,
  // receivedAt: null,
  // data: {}
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'GET_FIELD_REPORT_INFLIGHT':
      state = Object.assign({}, state, {
        [action.id]: {
          error: null,
          fetching: true,
          fetched: false
        }
      });
      break;
    case 'GET_FIELD_REPORT_FAILED':
      state = Object.assign({}, state, {
        [action.id]: {
          fetching: false,
          fetched: true,
          receivedAt: action.receivedAt,
          error: action.error
        }
      });
      break;
    case 'GET_FIELD_REPORT_SUCCESS':
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
