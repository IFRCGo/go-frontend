import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function drefApplications (state = initialState, action) {
  switch (action.type) {
    case 'GET_DREF_APPLICATIONS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_DREF_APPLICATIONS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_DREF_APPLICATIONS_SUCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
