'use strict';
import { combineReducers } from 'redux';

import user from './user';
import profile from './profile';

export const reducers = {
  user,
  profile
};

export default combineReducers(reducers);
