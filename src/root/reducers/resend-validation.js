import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function resendValidation (state = initialState, action) {
  switch (action.type) {
    case 'RESEND_VALIDATION_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'RESEND_VALIDATION_FAILED':
      state = stateError(state, action);
      break;
    case 'RESEND_VALIDATION_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default resendValidation;