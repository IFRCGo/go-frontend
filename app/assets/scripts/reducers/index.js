'use strict';
import { combineReducers } from 'redux';

import { systemAlertsReducer } from '../components/system-alerts';
import user from './user';
import profile from './profile';
import fieldReportForm from './field-report-form';
import surgeAlerts from './surge-alerts';
import overallStats from './overall-stats';

export const reducers = {
  user,
  profile,
  systemAlertsReducer,
  fieldReportForm,
  surgeAlerts,
  overallStats
};

export default combineReducers(reducers);
