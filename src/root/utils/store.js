import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import listen from 'redux-listener-middleware';
import * as localStorage from 'local-storage';
import { setUser as setUserOnSentry } from '@sentry/react';

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

export const LANG_STORAGE_KEY = 'language';
export const ALL_COUNTRIES_STORAGE_KEY = 'allCountries';
export const ALL_REGIONS_STORAGE_KEY = 'allRegions';
export const ME_STORAGE_KEY = 'me';
export const DTYPES_STORAGE_KEY = 'disasterTypes';

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

const DEFAULT_CACHE_DURATION = ONE_DAY;

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

  if (data.receivedAt + DEFAULT_CACHE_DURATION < new Date().getTime()) {
    // Expired
    console.info('all countries cache expired');
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

  if (data.receivedAt + DEFAULT_CACHE_DURATION < new Date().getTime()) {
    // Expired
    console.info('all regions cache expired');
    return undefined;
  }

  return {
    ...defaultInitialState,
    ...data,
    cached: true,
  };
};

const hydrateDisasterTypes = () => {
  const data = localStorage.get(DTYPES_STORAGE_KEY);

  if (!data) {
    return undefined;
  }

  if (data.receivedAt + DEFAULT_CACHE_DURATION < new Date().getTime()) {
    // Expired
    console.info('all disasterTypes cache expired');
    return undefined;
  }

  return {
    ...defaultInitialState,
    ...data,
    fetched: true,
    cached: true,
  };
};

const initialState = {
  user: hydrateUser(),
  lang: hydrateCurrentLanguage(),
  allCountries: hydrateAllCountries(),
  allRegions: hydrateAllRegions(),
  me: hydrateMe(),
  disasterTypes: hydrateDisasterTypes(),
};

/* Listeners */
const tokenListener = ({ data }) => {
  const userData = {
    username: data.username,
    token: data.token,
    expires: data.expires,
    firstName: data.firstName,
    lastName: data.lastName,
    id: data.id,
  };
  const sentryUserData = {
    id: data.id,
    displayName: data.username,
    email: data.email,
  };
  localStorage.set('user', userData);
  setUserOnSentry(sentryUserData ?? null);
};

const currentLanguageListener = ({ language }) => {
  localStorage.set(LANG_STORAGE_KEY, language);
  localStorage.remove(ALL_COUNTRIES_STORAGE_KEY);
  localStorage.remove(ALL_REGIONS_STORAGE_KEY);
  localStorage.remove(DTYPES_STORAGE_KEY);
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

const disasterTypesListener = ({ data, receivedAt }) => {
  localStorage.set(DTYPES_STORAGE_KEY, {
    data,
    receivedAt,
  });
};

const logoutListener = () => {
  localStorage.remove('user');
  localStorage.remove(ME_STORAGE_KEY);
  // localStorage.remove(LANG_STORAGE_KEY);
  // localStorage.remove(ALL_COUNTRIES_STORAGE_KEY);
  // localStorage.remove(ALL_REGIONS_STORAGE_KEY);
};

export const listener = listen();
listener.createListener(tokenListener).addRule(/^TOKEN_SUCCESS/);
listener.createListener(logoutListener).addRule(/^LOGOUT_USER/);
listener.createListener(currentLanguageListener).addRule(/^SET_CURRENT_LANGUAGE/);
listener.createListener(allCountriesListener).addRule(/^GET_COUNTRIES_ALL_SUCCESS/);
listener.createListener(allRegionsListener).addRule(/^GET_REGIONS_ALL_SUCCESS/);
listener.createListener(meListener).addRule(/^GET_ME_SUCCESS/);
listener.createListener(disasterTypesListener).addRule(/^GET_DISASTER_TYPES_SUCCESS/);

const composeEnhancers = config.environment !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      listener,
    ),
  ),
);

export default store;
