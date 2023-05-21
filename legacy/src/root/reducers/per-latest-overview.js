import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { GET_LATEST_COUNTRY_OVERVIEW } from '#actions';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function perLatestOverview (state = initialState, action) {
  switch (action.type) {
    case `${GET_LATEST_COUNTRY_OVERVIEW}_INFLIGHT`:
      state = stateInflight(state, action);
      break;
    case `${GET_LATEST_COUNTRY_OVERVIEW}_FAILED`:
      state = stateError(state, action);
      break;
    case `${GET_LATEST_COUNTRY_OVERVIEW}_SUCCESS`:
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
