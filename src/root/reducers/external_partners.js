import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { GET_EXTERNAL_PARTNERS } from '#actions';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};
export default function externalPartners (state = initialState, action) {
  switch (action.type) {
    case `${GET_EXTERNAL_PARTNERS}_INFLIGHT`:
      state = stateInflight(state, action);
      break;
    case `${GET_EXTERNAL_PARTNERS}_FAILED`:
      state = stateError(state, action);
      break;
    case `${GET_EXTERNAL_PARTNERS}_SUCCESS`:
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
