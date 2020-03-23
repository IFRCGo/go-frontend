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
    case 'DELETE_PROJECT_INFLIGHT':
      newState = {
        ...newState,
        ...stateInflight(state, action),
      };
      break;
    case 'DELETE_PROJECT_FAILED':
      newState = {
        ...newState,
        ...stateError(state, action),
      };
      break;
    case 'DELETE_PROJECT_SUCCESS':
      newState = {
        ...newState,
        ...stateSuccess(state, action),
      };
      break;
  }

  return newState;
}
