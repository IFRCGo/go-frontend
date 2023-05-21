import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function domainWhitelist (state = initialState, action) {
  switch (action.type) {
    case 'GET_DOMAIN_WHITELIST_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_DOMAIN_WHITELIST_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_DOMAIN_WHITELIST_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default domainWhitelist;
