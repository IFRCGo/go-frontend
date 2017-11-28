'use strict';
import { combineReducers } from 'redux';

import { systemAlertsReducer } from '../components/system-alerts';
import user from './user';
import fieldReportForm from './field-report-form';

export const reducers = {
  systemAlertsReducer,
  user,
  fieldReportForm
};

export default combineReducers(reducers);
