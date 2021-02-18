import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { GET_MAIN_CONTACTS } from '#actions';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};
export default function mainContacts (state = initialState, action) {
  switch (action.type) {
    case `${GET_MAIN_CONTACTS}_INFLIGHT`:
      state = stateInflight(state, action);
      break;
    case `${GET_MAIN_CONTACTS}_FAILED`:
      state = stateError(state, action);
      break;
    case `${GET_MAIN_CONTACTS}_SUCCESS`:
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
