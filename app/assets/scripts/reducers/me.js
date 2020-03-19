'use strict';
import {
  stateInflight,
  stateError,
  stateSuccess,
} from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function reducer (state = initialState, action) {
  let newState = { ...state };
  switch (action.type) {
    case 'GET_ME_INFLIGHT':
      newState = {
        ...newState,
        ...stateInflight(state, action),
      };
      break;
    case 'GET_ME_FAILED':
      newState = {
        ...newState,
        ...stateError(state, action),
      };
      break;
    case 'GET_ME_SUCCESS':
      newState = {
        ...newState,
        ...stateSuccess(state, action),
      };
      break;
  }

  return newState;
}
