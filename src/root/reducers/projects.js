'use strict';
import {
  stateInflight,
  stateError,
  stateSuccess,
} from '../utils/reducer-utils';

const initialState = {};

export default function reducer (state = initialState, action) {
  let newState = { ...state };
  switch (action.type) {
    case 'GET_PROJECTS_INFLIGHT':
      newState[action.countryId] = stateInflight(state, action);
      break;
    case 'GET_PROJECTS_FAILED':
      newState[action.countryId] = stateError(state, action);
      break;
    case 'GET_PROJECTS_SUCCESS':
      newState[action.countryId] = stateSuccess(state, action);
      break;
  }

  return newState;
}
