'use strict';
import { combineReducers } from 'redux';

import user from './user';

export const reducers = {
  user
};

export default combineReducers(reducers);
