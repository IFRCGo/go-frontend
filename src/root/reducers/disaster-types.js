import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function disasterTypes (state = initialState, action) {
  switch (action.type) {
    case 'GET_DISASTER_TYPES_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_DISASTER_TYPES_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_DISASTER_TYPES_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
