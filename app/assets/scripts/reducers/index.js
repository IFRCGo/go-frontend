'use strict';
import { combineReducers } from 'redux';

import { systemAlertsReducer } from '../components/system-alerts';
import user from './user';
import profile from './profile';
import countries from './countries';
import fieldReportForm from './field-report-form';
import fieldReport from './field-report';
import fieldReports from './field-reports';
import surgeAlerts from './surge-alerts';
import overallStats from './overall-stats';
import emergencies from './emergencies';
import event from './event';
import adminArea from './admin-area';
import eruOwners from './eru-owners';
import heops from './heops';
import registration from './registration';
import password from './password';
import email from './email';
import appeals from './appeals';
import deployments from './deployments';
import situationReports from './situation-reports';
import appealDocuments from './appeal-documents';
import fdrs from './fdrs';
import csv from './csv';
import perForm from './per-form';
import subscriptions from './subscriptions';

export const reducers = {
  user,
  profile,
  countries,
  systemAlertsReducer,
  fieldReportForm,
  fieldReport,
  fieldReports,
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
  email,
  deployments,
  appealDocuments,
  situationReports,
  fdrs,
  csv,
  perForm,
  subscriptions
};

export default combineReducers(reducers);
