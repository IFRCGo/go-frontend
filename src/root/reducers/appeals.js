'use strict';
import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function appeals (state = initialState, action) {
  switch (action.type) {
    case 'GET_APPEALS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_APPEALS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_APPEALS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
