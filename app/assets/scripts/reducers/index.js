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
import registration from './registration';
import password from './password';
import appeals from './appeals';
import deployments from './deployments';
import situationReports from './situation-reports';
import appealDocuments from './appeal-documents';

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
  heops,
  registration,
  appeals,
  password,
  deployments,
  appealDocuments,
  situationReports
};

export default combineReducers(reducers);
