'use strict';
import { combineReducers } from 'redux';

import { systemAlertsReducer } from '../components/system-alerts';
import user from './user';
import profile from './profile';
import fieldReportForm from './field-report-form';
import fieldReport from './field-report';
import surgeAlerts from './surge-alerts';
import overallStats from './overall-stats';
import emergencies from './emergencies';
import event from './event';
import adminArea from './admin-area';
import eruOwners from './eru-owners';
import heops from './heops';

export const reducers = {
  user,
  profile,
  systemAlertsReducer,
  fieldReportForm,
  fieldReport,
  surgeAlerts,
  overallStats,
  emergencies,
  event,
  adminArea,
  eruOwners,
  heops
};

export default combineReducers(reducers);
