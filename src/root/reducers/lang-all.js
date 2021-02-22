import {
  stateInflight,
  stateError,
  stateSuccess,
} from '../utils/reducer-utils';

import { GET_ALL_LANGUAGES, RESET_ALL_LANGUAGES } from '#actions';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function langAll (state = initialState, action) {
  let newState = state;

  switch (action.type) {
    case `${GET_ALL_LANGUAGES}_INFLIGHT`:
      newState = stateInflight(state, action);
      break;
    case `${GET_ALL_LANGUAGES}_FAILED`:
      newState = stateError(state, action);
      break;
    case `${GET_ALL_LANGUAGES}_SUCCESS`:
      newState = stateSuccess(state, action);
      break;
    case RESET_ALL_LANGUAGES:
      newState = Object.assign({}, state, {
        error: null,
        fetching: false,
        fetched: false,
        receivedAt: null,
        data: {}
      });
      break;
  }

  return newState;
}

