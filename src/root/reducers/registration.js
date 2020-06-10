import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function registration (state = initialState, action) {
  switch (action.type) {
    case 'REGISTER_USER_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'REGISTER_USER_FAILED':
      state = stateError(state, action);
      break;
    case 'REGISTER_USER_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default registration;
