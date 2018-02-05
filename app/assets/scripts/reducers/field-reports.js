'use strict';
import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function fieldReports (state = initialState, action) {
  switch (action.type) {
    case 'GET_FIELD_REPORTS_LIST_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_FIELD_REPORTS_LIST_ERROR':
      state = stateError(state, action);
      break;
    case 'GET_FIELD_REPORTS_LIST_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default fieldReports;
