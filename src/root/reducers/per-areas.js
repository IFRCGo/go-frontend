import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function perAreas (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_AREAS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_AREAS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_AREAS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
