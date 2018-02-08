'use strict';
import {
  fetchJSON,
  fetchJSONRecursive,
  postJSON,
  putJSON,
  withToken
} from '../utils/network';
import { stringify as buildAPIQS } from 'qs';
import { DateTime } from 'luxon';

import { regions, countriesByRegion } from '../utils/region-constants';

export const TOKEN = 'TOKEN';
export function getAuthToken (username, password) {
  return postJSON('get_auth_token', TOKEN, { username, password });
}

export const GET_PROFILE = 'GET_PROFILE';
export function getUserProfile (username) {
  return fetchJSON(`api/v1/user/?username=${username}`, GET_PROFILE, withToken());
}

export const REGISTER_USER = 'REGISTER_USER';
export function registerUser (payload) {
  return postJSON('register', REGISTER_USER, payload);
}

export const LOGOUT_USER = 'LOGOUT_USER';
export function logoutUser () {
  return { type: LOGOUT_USER };
}

export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export function validateAndUpdatePassword (payload) {
  return postJSON('change_password', CHANGE_PASSWORD, payload);
}

export const RECOVER_PASSWORD = 'RECOVER_PASSWORD';
export function recoverPassword (email) {
  return postJSON('recover_password', RECOVER_PASSWORD, { email });
}

export const GET_FIELD_REPORT = 'GET_FIELD_REPORT';
export function getFieldReportById (id) {
  return fetchJSON(`api/v1/field_report/${id}/`, GET_FIELD_REPORT, withToken(), { id });
}

export function getFieldReportsByUser (userId) {
  return fetchJSON(`api/v1/field_report/?user=${userId}`, GET_FIELD_REPORT, withToken(), { id: `user-${userId}` });
}

export const CREATE_FIELD_REPORT = 'CREATE_FIELD_REPORT';
export function createFieldReport (payload) {
  return postJSON('api/v1/field_report/', CREATE_FIELD_REPORT, payload, withToken());
}

export const UPDATE_FIELD_REPORT = 'UPDATE_FIELD_REPORT';
export function updateFieldReport (id, payload) {
  return putJSON(`api/v1/field_report/${id}/`, UPDATE_FIELD_REPORT, payload, withToken());
}

export const GET_FIELD_REPORTS_LIST = 'GET_FIELD_REPORTS_LIST';
export function getFieldReportsList (page = 1, filters = {}) {
  filters.limit = filters.limit || 10;
  filters.offset = filters.limit * (page - 1);
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v1/field_report/?${f}`, GET_FIELD_REPORTS_LIST, withToken());
}

export const GET_SURGE_ALERTS = 'GET_SURGE_ALERTS';
export function getSurgeAlerts (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  const f = buildAPIQS(filters);

  return fetchJSON(`/api/v1/surge_alert/?${f}`, GET_SURGE_ALERTS, withToken());
}

export const GET_APPEALS_LIST = 'GET_APPEALS_LIST';
export function getAppealsList () {
  const f = buildAPIQS({
    end_date__gt: DateTime.local().toISODate(),
    limit: 1000
  });
  return fetchJSONRecursive(`api/v1/appeal/?${f}`, GET_APPEALS_LIST, withToken());
}

export const GET_AGGREGATE_APPEALS = 'GET_AGGREGATE_APPEALS';
export function getAggregateAppeals (date, unit, type) {
  const typeMapping = { drefs: 0, appeals: 1 };

  const f = buildAPIQS({
    start_date: date,
    model_type: 'appeal',
    sum_beneficiaries: 'num_beneficiaries',
    sum_amount_funded: 'amount_funded',
    filter_atype: typeMapping[type],
    unit
  });
  return fetchJSON(`api/v1/aggregate/?${f}`, GET_AGGREGATE_APPEALS, withToken(), {aggregationUnit: unit, aggregationType: type});
}

export const GET_EMERGENCIES_LIST = 'GET_EMERGENCIES_LIST';
export function getEmergenciesList (page = 1, filters = {}) {
  filters.limit = filters.limit || 10;
  filters.offset = filters.limit * (page - 1);
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v1/event/?${f}`, GET_EMERGENCIES_LIST, withToken());
}

export const GET_LAST_MO_EMERGENCIES = 'GET_LAST_MO_EMERGENCIES';
export function getLastMonthsEmergencies () {
  const f = buildAPIQS({
    disaster_start_date__gt: DateTime.local().minus({days: 30}).startOf('day').toISODate(),
    limit: 0,
    order_by: '-disaster_start_date'
  });
  return fetchJSON(`api/v1/event/?${f}`, GET_LAST_MO_EMERGENCIES, {});
}

export const GET_AGGREGATE_EMERGENCIES = 'GET_AGGREGATE_EMERGENCIES';
export function getAggregateEmergencies (date, unit) {
  const f = buildAPIQS({
    start_date: date,
    model_type: 'event',
    unit
  });

  return fetchJSON(`api/v1/aggregate/?${f}`, GET_AGGREGATE_EMERGENCIES, withToken(), {aggregationUnit: unit});
}

export const UPDATE_SUBSCRIPTIONS = 'UPDATE_SUBSCRIPTIONS';
export function updateSubscriptions (payload) {
  return postJSON('notifications/', UPDATE_SUBSCRIPTIONS, payload, withToken());
}

export const GET_EVENT = 'GET_EVENT';
export function getEventById (id) {
  return fetchJSON(`api/v1/event/${id}/`, GET_EVENT, withToken(), { id });
}

export const GET_SITREPS = 'GET_SITREPS';
export function getSitrepsByEventId (id) {
  return fetchJSON(`api/v1/situation_report/?order_by=-created_at&event=${id}`, GET_SITREPS, withToken(), { id });
}

export const GET_ERU_OWNERS = 'GET_ERU_OWNERS';
export function getEruOwners () {
  return fetchJSON('api/v1/eru_owner/?limit=0', GET_ERU_OWNERS, withToken());
}

export const GET_AA = 'GET_AA';
export function getAdmAreaById (aaType, id) {
  switch (aaType) {
    case 'region':
      // Get from static storage.
      return function (dispatch) {
        dispatch({ type: 'GET_AA_INFLIGHT', id });
        setTimeout(() => {
          const region = regions[id];
          if (region) {
            dispatch({ type: 'GET_AA_SUCCESS', data: region, receivedAt: Date.now(), id });
          } else {
            dispatch({ type: 'GET_AA_FAILED', error: { message: 'Region not found.' }, id });
          }
        }, 1);
      };
    case 'country':
      return fetchJSON(`/api/v1/country/${id}/`, GET_AA, withToken(), { id });
    default:
      throw new Error('Invalid admin area type ' + aaType);
  }
}

export const GET_AA_APPEALS = 'GET_AA_APPEALS';
export function getAdmAreaAppeals (aaType, aaId, page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  filters.atype = 1;

  switch (aaType) {
    case 'region':
      filters.region = aaId;
      break;
    case 'country':
      filters.country = aaId;
      break;
    default:
      throw new Error('Invalid admin area type ' + aaType);
  }

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v1/appeal/?${f}`, GET_AA_APPEALS, withToken());
}

export const GET_AA_DREFS = 'GET_AA_DREFS';
export function getAdmAreaDrefs (aaType, aaId, page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  filters.atype = 0;

  switch (aaType) {
    case 'region':
      filters.region = aaId;
      break;
    case 'country':
      filters.country = aaId;
      break;
    default:
      throw new Error('Invalid admin area type ' + aaType);
  }

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v1/appeal/?${f}`, GET_AA_DREFS, withToken());
}

export const GET_AA_FIELD_REPORTS = 'GET_AA_FIELD_REPORTS';
export function getAdmAreaFieldReports (aaType, aaId, page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);

  switch (aaType) {
    case 'region':
      filters.regions__in = aaId;
      break;
    case 'country':
      filters.countries__in = aaId;
      break;
    default:
      throw new Error('Invalid admin area type ' + aaType);
  }

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v1/field_report/?${f}`, GET_AA_FIELD_REPORTS, withToken());
}

export const GET_AA_APPEALS_STATS = 'GET_AA_APPEALS_STATS';
export function getAdmAreaAppealsStats (aaType, aaId) {
  let filters = {
    end_date__gt: DateTime.local().toISODate(),
    limit: 1000
  };

  switch (aaType) {
    case 'region':
      filters.region = aaId;
      break;
    case 'country':
      filters.country = aaId;
      break;
    default:
      throw new Error('Invalid admin area type ' + aaType);
  }

  const f = buildAPIQS(filters);
  return fetchJSONRecursive(`api/v1/appeal/?${f}`, GET_AA_APPEALS_STATS, withToken());
}

export const GET_AA_AGGREGATE_APPEALS = 'GET_AA_AGGREGATE_APPEALS';
export function getAdmAreaAggregateAppeals (aaType, aaId, date, unit) {
  let filters = {
    start_date: date,
    model_type: 'appeal',
    unit
  };

  switch (aaType) {
    case 'region':
      filters.region = aaId;
      break;
    case 'country':
      filters.country = aaId;
      break;
    default:
      throw new Error('Invalid admin area type ' + aaType);
  }

  const f = buildAPIQS(filters);
  return fetchJSON(`api/v1/aggregate/?${f}`, GET_AA_AGGREGATE_APPEALS, withToken(), {aggregationUnit: unit});
}

export const GET_AA_ERU = 'GET_AA_ERU';
export function getAdmAreaERU (aaType, aaId) {
  let filters = {};

  switch (aaType) {
    case 'region':
      filters.countries__in = countriesByRegion[aaId].join(',');
      break;
    case 'country':
      filters.countries__in = aaId;
      break;
    default:
      throw new Error('Invalid admin area type ' + aaType);
  }

  const f = buildAPIQS(filters);
  return fetchJSON(`api/v1/eru/?${f}`, GET_AA_ERU, withToken());
}

export const GET_HEOPS = 'GET_HEOPS';
export function getHeops (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  const f = buildAPIQS(filters);

  return fetchJSON(`/api/v1/heop/?${f}`, GET_HEOPS, withToken());
}

export const GET_YEARLY_HEOPS = 'GET_YEARLY_HEOPS';
export function getYearlyHeops () {
  const f = buildAPIQS({
    model_type: 'heop',
    unit: 'year'
  });
  return fetchJSON(`api/v1/aggregate/?${f}`, GET_YEARLY_HEOPS, withToken());
}

export const GET_HEOPS_DTYPE = 'GET_HEOPS_DTYPE';
export function getHeopsDtype () {
  const f = buildAPIQS({
    model_type: 'heop'
  });
  return fetchJSON(`api/v1/aggregate_dtype/?${f}`, GET_HEOPS_DTYPE, withToken());
}

export const GET_APPEALS = 'GET_APPEALS';
export function getAppeals (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v1/appeal/?${f}`, GET_APPEALS, withToken());
}

export const GET_APPEAL_DOCS = 'GET_APPEAL_DOCS';
export function getAppealDocsByAppealIds (appealIds, id) {
  const ids = (Array.isArray(appealIds) ? appealIds : [appealIds]).join(',');
  return fetchJSON(`api/v1/appeal_document/?order_by=-created_at&appeal__id__in=${ids}`, GET_APPEAL_DOCS, withToken(), { id });
}

export const GET_DEPLOYMENT_ERU = 'GET_DEPLOYMENT_ERU';
export function getDeploymentERU (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  filters['deployed_to__isnull'] = false;

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v1/eru/?${f}`, GET_DEPLOYMENT_ERU, withToken());
}

export const GET_DEPLOYMENT_FACT = 'GET_DEPLOYMENT_FACT';
export function getDeploymentFACT (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v1/fact/?${f}`, GET_DEPLOYMENT_FACT, withToken());
}

export const GET_DEPLOYMENT_HEOP = 'GET_DEPLOYMENT_HEOP';
export function getDeploymentHEOP (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v1/heop/?${f}`, GET_DEPLOYMENT_HEOP, withToken());
}

export const GET_DEPLOYMENT_RDRT = 'GET_DEPLOYMENT_RDRT';
export function getDeploymentRDRT (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v1/rdrt/?${f}`, GET_DEPLOYMENT_RDRT, withToken());
}

export const GET_ALL_DEPLOYMENT_ERU = 'GET_ALL_DEPLOYMENT_ERU';
export function getAllDeploymentERU (filters = {}) {
  filters['deployed_to__isnull'] = false;
  const f = buildAPIQS(filters);
  return fetchJSONRecursive(`/api/v1/eru/?${f}`, GET_ALL_DEPLOYMENT_ERU, withToken());
}

export const GET_ALL_DEPLOYMENT_FACT = 'GET_ALL_DEPLOYMENT_FACT';
export function getAllDeploymentFACT (filters = {}) {
  const f = buildAPIQS(filters);
  return fetchJSONRecursive(`/api/v1/fact/?${f}`, GET_ALL_DEPLOYMENT_FACT, withToken());
}

export const GET_ALL_DEPLOYMENT_HEOP = 'GET_ALL_DEPLOYMENT_HEOP';
export function getAllDeploymentHEOP (filters = {}) {
  const f = buildAPIQS(filters);
  return fetchJSONRecursive(`/api/v1/heop/?${f}`, GET_ALL_DEPLOYMENT_HEOP, withToken());
}

export const GET_ALL_DEPLOYMENT_RDRT = 'GET_ALL_DEPLOYMENT_RDRT';
export function getAllDeploymentRDRT (filters = {}) {
  const f = buildAPIQS(filters);
  return fetchJSONRecursive(`/api/v1/rdrt/?${f}`, GET_ALL_DEPLOYMENT_RDRT, withToken());
}
