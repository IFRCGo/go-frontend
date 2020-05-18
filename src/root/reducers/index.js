import { combineReducers } from 'redux';

import { systemAlertsReducer } from '#components/system-alerts';
import { createReducer } from '#utils/reducer-utils';

import user from './user';
import profile from './profile';
import countries from './countries';
import districts from './districts';
import actions from './actions';
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
import projects from './projects.js';
import countryOverview from './country-overview.js';
import domainWhitelist from './domain-whitelist';

export const reducers = {
  user,
  profile,
  countries,
  districts,
  systemAlertsReducer,
  actions,
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
  subscriptions,
  projects,
  projectForm: createReducer('POST_PROJECT'),
  projectDelete: createReducer('DELETE_PROJECT'),
  countryOverview,
  regionalProjectsOverview: createReducer('GET_REGIONAL_PROJECTS_OVERVIEW'),
  regionalMovementActivities: createReducer('GET_REGIONAL_MOVEMENT_ACTIVITIES'),
  nationalSocietyActivities: createReducer('GET_NATIONAL_SOCIETY_ACTIVITIES'),
  nationalSocietyActivitiesWoFilters: createReducer('GET_NATIONAL_SOCIETY_ACTIVITIES_WO_FILTERS'),
  regionalProjects: createReducer('GET_REGIONAL_PROJECTS'),
  me: createReducer('GET_ME'),
  domainWhitelist
};

export default combineReducers(reducers);
