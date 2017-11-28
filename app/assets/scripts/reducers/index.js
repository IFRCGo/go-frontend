'use strict';
import { combineReducers } from 'redux';

import user from './user';
import { systemAlertsReducer } from '../components/system-alerts';

export const reducers = {
  user,
  systemAlertsReducer
};

export default combineReducers(reducers);
