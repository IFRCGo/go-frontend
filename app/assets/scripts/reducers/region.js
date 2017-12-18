'use strict';

const initialState = {
  // fetching: false,
  // fetched: false,
  // receivedAt: null,
  // data: {}
};

const stateInflight = (state, action, key) => {
  return Object.assign({}, state, {
    [key]: {
      error: null,
      fetching: true,
      fetched: false
    }
  });
};

const stateError = (state, action, key) => {
  return Object.assign({}, state, {
    [key]: {
      fetching: false,
      fetched: true,
      receivedAt: action.receivedAt,
      error: action.error
    }
  });
};

const stateSuccess = (state, action, key) => {
  return Object.assign({}, state, {
    [key]: {
      fetching: false,
      fetched: true,
      receivedAt: action.receivedAt,
      data: action.data
    }
  });
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'GET_REGION_INFLIGHT':
      state = stateInflight(state, action, action.id);
      break;
    case 'GET_REGION_FAILED':
      state = stateError(state, action, action.id);
      break;
    case 'GET_REGION_SUCCESS':
      state = stateSuccess(state, action, action.id);
      break;

    case 'GET_REGION_APPEALS_INFLIGHT':
      state = stateInflight(state, action, 'appeals');
      break;
    case 'GET_REGION_APPEALS_FAILED':
      state = stateError(state, action, 'appeals');
      break;
    case 'GET_REGION_APPEALS_SUCCESS':
      state = stateSuccess(state, action, 'appeals');
      break;

    case 'GET_REGION_DREFS_INFLIGHT':
      state = stateInflight(state, action, 'drefs');
      break;
    case 'GET_REGION_DREFS_FAILED':
      state = stateError(state, action, 'drefs');
      break;
    case 'GET_REGION_DREFS_SUCCESS':
      state = stateSuccess(state, action, 'drefs');
      break;

    case 'GET_REGION_FIELD_REPORTS_INFLIGHT':
      state = stateInflight(state, action, 'fieldReports');
      break;
    case 'GET_REGION_FIELD_REPORTS_FAILED':
      state = stateError(state, action, 'fieldReports');
      break;
    case 'GET_REGION_FIELD_REPORTS_SUCCESS':
      state = stateSuccess(state, action, 'fieldReports');
      break;
  }
  return state;
}
