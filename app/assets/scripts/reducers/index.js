'use strict';
import { combineReducers } from 'redux';

import { systemAlertsReducer } from '../components/system-alerts';
import user from './user';
import profile from './profile';
import fieldReportForm from './field-report-form';
import fieldReport from './field-report';

export const reducers = {
  user,
  profile,
  systemAlertsReducer,
  fieldReport,
  fieldReportForm
};

export default combineReducers(reducers);
