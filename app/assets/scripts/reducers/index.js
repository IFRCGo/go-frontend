'use strict';
import { combineReducers } from 'redux';

import { systemAlertsReducer } from '../components/system-alerts';
import user from './user';
import profile from './profile';
import fieldReportForm from './field-report-form';

export const reducers = {
  user,
  profile,
  systemAlertsReducer,
  fieldReportForm
};

export default combineReducers(reducers);
