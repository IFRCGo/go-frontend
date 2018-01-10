'use strict';

import { stateInflight, stateError } from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  error: null
};

function password (state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_PASSWORD_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'CHANGE_PASSWORD_FAILED':
      state = stateError(state, action);
      break;
    case 'CHANGE_PASSWORD_SUCCESS':
      state = {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: null
      };
      break;
  }
  return state;
}

export default password;
