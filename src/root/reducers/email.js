
import { stateInflight, stateError } from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  error: null
};

function email (state = initialState, action) {
  switch (action.type) {
    case 'SHOW_USERNAME_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'SHOW_USERNAME_FAILED':
      state = stateError(state, action);
      break;
    case 'SHOW_USERNAME_SUCCESS':
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

export default email;
