import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function perQuestions (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_QUESTIONS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_QUESTIONS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_QUESTIONS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}
