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
    case 'GET_PROJECTS_INFLIGHT':
      newState = {
        ...newState,
        ...stateInflight(state, action),
      };
      break;
    case 'GET_PROJECTS_FAILED':
      newState = {
        ...newState,
        ...stateError(state, action),
      };
      break;
    case 'GET_PROJECTS_SUCCESS':
      newState = {
        ...newState,
        ...stateSuccess(state, action),
      };
      break;
  }

  return newState;
}
