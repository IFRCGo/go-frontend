import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};
export default function actions (state = initialState, action) {
  switch (action.type) {
    case 'GET_ACTIONS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_ACTIONS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_ACTIONS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
