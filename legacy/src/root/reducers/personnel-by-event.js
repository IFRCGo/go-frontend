import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function personnelByEvent (state = initialState, action) {
  switch (action.type) {
    case 'GET_PERSONNEL_BY_EVENT_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PERSONNEL_BY_EVENT_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PERSONNEL_BY_EVENT_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
