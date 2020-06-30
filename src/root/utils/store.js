import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import listen from 'redux-listener-middleware';
import * as localStorage from 'local-storage';

import config from '#config';
import reducer from '../reducers';
import { langInitialState } from '#root/reducers/lang';

const hydrateUser = () => {
  // Check if there's user data in localstorage.
  const user = localStorage.get('user');

  if (!user) {
    // Returning undefined will cause the reducer to use the initial state.
    return undefined;
  } else if (Date.parse(user.expires) <= Date.now()) {
    // Expired.
    localStorage.remove('user');
    // Returning undefined will cause the reducer to use the initial state.
    return undefined;
  }
  return {
    fetching: false,
    fetched: true,
    receivedAt: Date.now(),
    data: user
  };
};

const LANG_STORAGE_KEY = 'language';

const hydrateCurrentLanguage = () => {
  // Check if there's user data in localstorage.
  const current = localStorage.get(LANG_STORAGE_KEY);

  if (!current) {
    // Returning undefined will cause the reducer to use the initial state.
    return undefined;
  }

  return {
    ...langInitialState,
    current,
  };
};

const initialState = {
  user: hydrateUser(),
  lang: hydrateCurrentLanguage(),
};

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return (config.environment !== 'production');
  }
});

/* Listeners */
const tokenListener = ({ data }) => {
  localStorage.set('user', {
    username: data.username,
    token: data.token,
    expires: data.expires,
    firstName: data.firstName,
    lastName: data.lastName,
    id: data.id
  });
};

const currentLanguageListener = ({ language }) => {
  localStorage.set(LANG_STORAGE_KEY, language);
};

const logoutListener = ({ data }) => {
  localStorage.remove('user');
  localStorage.remove(LANG_STORAGE_KEY);
};

const listener = listen();
listener.createListener(tokenListener).addRule(/^TOKEN_SUCCESS/);
listener.createListener(logoutListener).addRule(/^LOGOUT_USER/);
listener.createListener(currentLanguageListener).addRule(/^SET_CURRENT_LANGUAGE/);

const composeEnhancers = config.environment !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(
  thunkMiddleware,
  listener,
  logger
)));

export default store;
