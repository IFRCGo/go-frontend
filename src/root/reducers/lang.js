import {
  stateInflight,
  stateError,
  stateSuccess,
} from '../utils/reducer-utils';

import lang from '#lang';

const initialState = {
  current: 'en',
  strings: {
    en: {
      ...lang,
    },
    fr: {
      rcActivities: 'Activités de la Croix-Rouge et du Croissant-Rouge',
    }
  }
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
      newState = stateSuccess(state, action);
      break;
    case 'SET_CURRENT_LANGUAGE':
      newState.current = action.language;
      break;
  }

  return newState;
}
