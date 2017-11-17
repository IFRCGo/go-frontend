import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import listen from 'redux-listener-middleware';
import * as localStorage from 'local-storage';

import config from '../config';
import reducer from '../reducers';

const initialState = {
};

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return (config.environment !== 'production');
  }
});

const tokenListener = ({ data }) => {
  localStorage.set('token', {
    Authorization: `ApiKey ${data.username}:${data.token}`,
    expires: data.expires
  });
};
const listener = listen();
listener.createListener(tokenListener).addRule(/^TOKEN_SUCCESS/);

const composeEnhancers = config.environment !== 'production' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;
const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(
  thunkMiddleware,
  listener,
  logger
)));

module.exports = store;
