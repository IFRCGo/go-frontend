
const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'CREATE_FIELD_REPORT_INFLIGHT':
    case 'UPDATE_FIELD_REPORT_INFLIGHT':
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case 'CREATE_FIELD_REPORT_FAILED':
    case 'UPDATE_FIELD_REPORT_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'CREATE_FIELD_REPORT_SUCCESS':
    case 'UPDATE_FIELD_REPORT_SUCCESS':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: action.data
      });
      break;
  }
  return state;
}
