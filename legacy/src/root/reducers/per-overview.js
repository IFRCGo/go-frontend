import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { PER_OVERVIEW_FORM, RESET_PER_STATE } from '#actions';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function perOverview (state = initialState, action) {
  switch (action.type) {
    case `${PER_OVERVIEW_FORM}_INFLIGHT`:
      state = stateInflight(state, action);
      break;
    case `${PER_OVERVIEW_FORM}_FAILED`:
      state = stateError(state, action);
      break;
    case `${PER_OVERVIEW_FORM}_SUCCESS`:
      state = stateSuccess(state, action);
      break;
    case RESET_PER_STATE:
      state = Object.assign({}, state, {
        error: null,
        fetching: false,
        fetched: false,
        receivedAt: null,
        data: {}
      });
      break;
  }
  return state;
}
