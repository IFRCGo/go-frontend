'use strict';
import { combineReducers } from 'redux';

import { systemAlertsReducer } from '../components/system-alerts';
import user from './user';
import profile from './profile';
import fieldReportForm from './field-report-form';
import surgeAlerts from './surge-alerts';

export const reducers = {
  user,
  profile,
  systemAlertsReducer,
  fieldReportForm,
  surgeAlerts
};

export default combineReducers(reducers);
