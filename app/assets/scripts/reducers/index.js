'use strict';
import { combineReducers } from 'redux';

import { systemAlertsReducer } from '../components/system-alerts';
import user from './user';
import profile from './profile';
import fieldReportForm from './field-report-form';
import fieldReport from './field-report';
import surgeAlerts from './surge-alerts';
import overallStats from './overall-stats';
import event from './event';

export const reducers = {
  user,
  profile,
  systemAlertsReducer,
  fieldReportForm,
  fieldReport,
  surgeAlerts,
  overallStats,
  event
};

export default combineReducers(reducers);
