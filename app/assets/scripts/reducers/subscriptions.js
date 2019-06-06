'use strict';

import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function addSubscriptions (state = initialState, action) {
  switch (action.type) {
    case 'ADD_SUBSCRIPTIONS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'ADD_SUBSCRIPTIONS_FAILED':
      state = stateError(state, action);
      break;
    case 'ADD_SUBSCRIPTIONS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default addSubscriptions;
