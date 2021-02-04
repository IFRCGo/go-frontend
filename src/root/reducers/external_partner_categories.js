import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { GET_EXTERNAL_PARTNER_CATEGORIES } from '#actions';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};
export default function externalPartnerCategories (state = initialState, action) {
  switch (action.type) {
    case `${GET_EXTERNAL_PARTNER_CATEGORIES}_INFLIGHT`:
      state = stateInflight(state, action);
      break;
    case `${GET_EXTERNAL_PARTNER_CATEGORIES}_FAILED`:
      state = stateError(state, action);
      break;
    case `${GET_EXTERNAL_PARTNER_CATEGORIES}_SUCCESS`:
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
