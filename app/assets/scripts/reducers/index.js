'use strict';
import { combineReducers } from 'redux';

import user from './user';
import fieldReportSchema from './field-report-schema';
import fieldReportDetail from './field-report-detail';

export const reducers = {
  user,
  fieldReportSchema,
  fieldReportDetail
};

export default combineReducers(reducers);
