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
    error: null,
    fetching: false,
    fetched: true,
    receivedAt: action.receivedAt,
    data: action.data
  });
};

export const defaultInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export function createReducer (actionName) {
  const inflight = `${actionName}_INFLIGHT`;
  const failed = `${actionName}_FAILED`;
  const success = `${actionName}_SUCCESS`;

  return (state = defaultInitialState, action) => {
    let newState = state;

    switch (action.type) {
      case inflight:
        newState = stateInflight(state, action);
        break;
      case failed:
        newState = stateError(state, action);
        break;
      case success:
        newState = stateSuccess(state, action);
        break;
    }

    return newState;
  };
}
