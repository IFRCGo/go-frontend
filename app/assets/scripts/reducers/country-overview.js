'use strict';
import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function countries (state = initialState, action) {
  switch (action.type) {
    case 'GET_COUNTRY_OVERVIEW_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_COUNTRY_OVERVIEW_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_COUNTRY_OVERVIEW_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }

  return state;
}
