import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { GET_SUPPORTED_ACTIVITIES } from '#actions';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};
export default function supportedActivities (state = initialState, action) {
  switch (action.type) {
    case `${GET_SUPPORTED_ACTIVITIES}_INFLIGHT`:
      state = stateInflight(state, action);
      break;
    case `${GET_SUPPORTED_ACTIVITIES}_FAILED`:
      state = stateError(state, action);
      break;
    case `${GET_SUPPORTED_ACTIVITIES}_SUCCESS`:
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
