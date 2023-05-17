import {
  stateInflight,
  stateError,
  stateSuccess,
} from '#utils/reducer-utils';

const initialState = {};

export default function reducer (state = initialState, action) {
  let newState = { ...state };
  switch (action.type) {
    case 'GET_NS_RAPID_RESPONSE_INFLIGHT':
      newState = stateInflight(state, action);
      break;
    case 'GET_NS_RAPID_RESPONSE_FAILED':
      newState = stateError(state, action);
      break;
    case 'GET_NS_RAPID_RESPONSE_SUCCESS':
      newState = stateSuccess(state, action);
      break;
  }

  return newState;
}
