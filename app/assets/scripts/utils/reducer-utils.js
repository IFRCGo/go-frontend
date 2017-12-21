export const stateInflight = (state, action) => {
  return Object.assign({}, state, {
    error: null,
    fetching: true,
    fetched: false
  });
};

export const stateError = (state, action) => {
  return Object.assign({}, state, {
    fetching: false,
    fetched: true,
    receivedAt: action.receivedAt,
    error: action.error
  });
};

export const stateSuccess = (state, action) => {
  return Object.assign({}, state, {
    fetching: false,
    fetched: true,
    receivedAt: action.receivedAt,
    data: action.data
  });
};
