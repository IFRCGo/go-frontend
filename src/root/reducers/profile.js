
const initialState = {
  fetching: false,
  fetched: false,
  updating: false,
  updated: false,
  receivedAt: null,
  data: null
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'GET_PROFILE_INFLIGHT':
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case 'GET_PROFILE_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'GET_PROFILE_SUCCESS':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: action.data.results[0]
      });
      break;

    case 'UPDATE_PROFILE_INFLIGHT':
    case 'UPDATE_SUBSCRIPTIONS_INFLIGHT':
      return Object.assign({}, state, { updateError: null, updating: true, updated: false });
    case 'UPDATE_PROFILE_FAILED':
    case 'UPDATE_SUBSCRIPTIONS_FAILED':
      state = Object.assign({}, state, {
        updating: false,
        updated: true,
        updateError: action.error
      });
      break;
    case 'UPDATE_PROFILE_SUCCESS':
    case 'UPDATE_SUBSCRIPTIONS_SUCCESS':
      state = Object.assign({}, state, {
        updating: false,
        updated: true
      });
      break;
  }
  return state;
}
