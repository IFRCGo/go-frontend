'use strict';
import { combineReducers } from 'redux';

import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function sendPerForm (state = initialState, action) {
  switch (action.type) {
    case 'SEND_PER_FORM_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'SEND_PER_FORM_FAILED':
      state = stateError(state, action);
      break;
    case 'SEND_PER_FORM_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default combineReducers({
  sendPerForm
});
