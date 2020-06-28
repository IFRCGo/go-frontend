import {
  stateInflight,
  stateError,
  stateSuccess,
} from '../utils/reducer-utils';

import lang from '#lang';

const initialState = {
  current: 'en',
  strings: {
    ...lang,
  },
  data: {},
};

export default function reducer (state = initialState, action) {
  let newState = state;

  switch (action.type) {
    case 'GET_LANGUAGE_INFLIGHT':
      newState = stateInflight(state, action);
      break;
    case 'GET_LANGUAGE_FAILED':
      newState = stateError(state, action);
      break;
    case 'GET_LANGUAGE_SUCCESS':
      const successState = stateSuccess(state, action);
      const { data } = successState;

      const newStrings = data.strings.reduce((acc, val) => {
        acc[val.key] = val.value;
        return acc;
      }, { ...lang });

      newState = {
        ...successState,
        strings: newStrings,
        data: data,
      };

      break;
    case 'SET_CURRENT_LANGUAGE':
      newState.current = action.language;
      break;
  }

  return newState;
}
