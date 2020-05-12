
import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';

const initialState = {};

export default function districts (state = initialState, action) {
  let countryId;
  if (action.type.startsWith('GET_DISTRICTS_')) {
    state = Object.assign({}, state);
    countryId = action.country.value;
    state[countryId] = state[countryId] || {
      fetching: false,
      fetched: false,
      receivedAt: null,
      data: {}
    };
  }
  switch (action.type) {
    case 'GET_DISTRICTS_INFLIGHT':
      state[countryId] = stateInflight(state[countryId], action);
      break;
    case 'GET_DISTRICTS_FAILED':
      state[countryId] = stateError(state[countryId], action);
      break;
    case 'GET_DISTRICTS_SUCCESS':
      state[countryId] = stateSuccess(state[countryId], action);
      break;
  }
  return state;
}
