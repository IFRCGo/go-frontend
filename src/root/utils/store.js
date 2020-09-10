import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import listen from 'redux-listener-middleware';
import * as localStorage from 'local-storage';

import config from '#config';
import reducer from '../reducers';
import { langInitialState } from '#root/reducers/lang';
import { defaultInitialState } from '#utils/reducer-utils';

const hydrateUser = () => {
  // Check if there's user data in localstorage.
  const user = localStorage.get('user');

  if (!user) {
    // Returning undefined will cause the reducer to use the initial state.
    return undefined;
  } else if (Date.parse(user.expires) <= Date.now()) {
    console.info('user details expired');
    // Expired.
    localStorage.remove('user');
    // Returning undefined will cause the reducer to use the initial state.
    return undefined;
  }
  return {
    fetching: false,
    fetched: true,
    receivedAt: Date.now(),
    data: user,
    cached: true,
  };
};

const LANG_STORAGE_KEY = 'language';
const ALL_COUNTRIES_STORAGE_KEY = 'allCountries';
const ALL_REGIONS_STORAGE_KEY = 'allRegions';
const ME_STORAGE_KEY = 'me';

const hydrateMe = () => {
  const data = localStorage.get(ME_STORAGE_KEY);

  if (!data) {
    return undefined;
  }

  return {
    ...defaultInitialState,
    ...data,
    cached: true,
  };
};

const hydrateCurrentLanguage = () => {
  const current = localStorage.get(LANG_STORAGE_KEY);

  if (!current) {
    return undefined;
  }

  return {
    ...langInitialState,
    current,
  };
};

const hydrateAllCountries = () => {
  const data = localStorage.get(ALL_COUNTRIES_STORAGE_KEY);

  if (!data) {
    return undefined;
  }

  return {
    ...defaultInitialState,
    ...data,
    cached: true,
  };
};

const hydrateAllRegions = () => {
  const data = localStorage.get(ALL_REGIONS_STORAGE_KEY);

  if (!data) {
    return undefined;
  }

  return {
    ...defaultInitialState,
    ...data,
    cached: true,
  };
};

const initialState = {
  user: hydrateUser(),
  lang: hydrateCurrentLanguage(),
  allCountries: hydrateAllCountries(),
  allRegions: hydrateAllRegions(),
  me: hydrateMe(),
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

const allCountriesListener = ({ data, receivedAt }) => {
  localStorage.set(ALL_COUNTRIES_STORAGE_KEY, {
    receivedAt,
    data,
  });
};

const allRegionsListener = ({ data, receivedAt }) => {
  localStorage.set(ALL_REGIONS_STORAGE_KEY, {
    data,
    receivedAt,
  });
};

const meListener = ({ data, receivedAt }) => {
  localStorage.set(ME_STORAGE_KEY, {
    data,
    receivedAt,
  });
};


const logoutListener = ({ data }) => {
  localStorage.remove('user');
  localStorage.remove(ME_STORAGE_KEY);
  // localStorage.remove(LANG_STORAGE_KEY);
  // localStorage.remove(ALL_COUNTRIES_STORAGE_KEY);
  // localStorage.remove(ALL_REGIONS_STORAGE_KEY);
};

const listener = listen();
listener.createListener(tokenListener).addRule(/^TOKEN_SUCCESS/);
listener.createListener(logoutListener).addRule(/^LOGOUT_USER/);
listener.createListener(currentLanguageListener).addRule(/^SET_CURRENT_LANGUAGE/);
listener.createListener(allCountriesListener).addRule(/^GET_COUNTRIES_ALL_SUCCESS/);
listener.createListener(allRegionsListener).addRule(/^GET_REGIONS_ALL_SUCCESS/);
listener.createListener(meListener).addRule(/^GET_ME_SUCCESS/);

const composeEnhancers = config.environment !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(
  thunkMiddleware,
  listener,
  logger
)));

export default store;
