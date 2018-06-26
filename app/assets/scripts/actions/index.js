'use strict';
import {
  fetchJSON,
  postJSON,
  putJSON,
  patchJSON,
  withToken
} from '../utils/network';
import { stringify as buildAPIQS } from 'qs';
import { DateTime } from 'luxon';

import { countriesByRegion } from '../utils/region-constants';

export const TOKEN = 'TOKEN';
export function getAuthToken (username, password) {
  return postJSON('get_auth_token', TOKEN, { username, password });
}

export const GET_PROFILE = 'GET_PROFILE';
export function getUserProfile (username) {
  return fetchJSON(`api/v2/user/?username=${username}`, GET_PROFILE, withToken());
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

export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export function updateProfile (id, payload) {
  return patchJSON(`api/v2/user/${id}/`, UPDATE_PROFILE, payload, withToken());
}

export const RECOVER_PASSWORD = 'RECOVER_PASSWORD';
export function recoverPassword (email) {
  return postJSON('recover_password', RECOVER_PASSWORD, { email });
}

export const GET_FIELD_REPORT = 'GET_FIELD_REPORT';
export function getFieldReportById (id) {
  return fetchJSON(`api/v2/field_report/${id}/`, GET_FIELD_REPORT, withToken(), { id });
}

export function getFieldReportsByUser (userId) {
  return fetchJSON(`api/v2/field_report/?user=${userId}`, GET_FIELD_REPORT, withToken(), { id: `user-${userId}` });
}

export const CREATE_FIELD_REPORT = 'CREATE_FIELD_REPORT';
export function createFieldReport (payload) {
  return postJSON('api/v2/field_report/', CREATE_FIELD_REPORT, payload, withToken());
}

export const UPDATE_FIELD_REPORT = 'UPDATE_FIELD_REPORT';
export function updateFieldReport (id, payload) {
  return putJSON(`api/v2/field_report/${id}/`, UPDATE_FIELD_REPORT, payload, withToken());
}

export const GET_FIELD_REPORTS_LIST = 'GET_FIELD_REPORTS_LIST';
export function getFieldReportsList (page = 1, filters = {}) {
  filters.limit = filters.limit || 10;
  filters.offset = filters.limit * (page - 1);
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/field_report/?${f}`, GET_FIELD_REPORTS_LIST, withToken());
}

export const GET_SURGE_ALERTS = 'GET_SURGE_ALERTS';
export function getSurgeAlerts (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  const f = buildAPIQS(filters);

  return fetchJSON(`/api/v2/surge_alert/?${f}`, GET_SURGE_ALERTS, withToken());
}

export const GET_APPEALS_LIST = 'GET_APPEALS_LIST';
export function getAppealsList () {
  const f = buildAPIQS({
    end_date__gt: DateTime.utc().toISO(),
    limit: 1000
  });
  return fetchJSON(`api/v2/appeal/?${f}`, GET_APPEALS_LIST, withToken());
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

export const GET_FEATURED_EMERGENCIES = 'GET_FEATURED_EMERGENCIES';
export function getFeaturedEmergencies () {
  return fetchJSON('/api/v2/event/?is_featured=1', GET_FEATURED_EMERGENCIES, withToken());
}

export const GET_EMERGENCIES_LIST = 'GET_EMERGENCIES_LIST';
export function getEmergenciesList (page = 1, filters = {}) {
  filters.limit = filters.limit || 10;
  filters.offset = filters.limit * (page - 1);
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/event/?${f}`, GET_EMERGENCIES_LIST, withToken());
}

export const GET_LAST_MO_EMERGENCIES = 'GET_LAST_MO_EMERGENCIES';
export function getLastMonthsEmergencies () {
  const f = buildAPIQS({
    disaster_start_date__gt: DateTime.utc().minus({days: 30}).startOf('day').toISO(),
    limit: 500,
    ordering: '-disaster_start_date'
  });
  return fetchJSON(`api/v2/event/?${f}`, GET_LAST_MO_EMERGENCIES, {});
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
export function updateSubscriptions (id, payload) {
  return postJSON(`api/v2/update_subscriptions/`, UPDATE_SUBSCRIPTIONS, payload, withToken());
}

export const GET_EVENT = 'GET_EVENT';
export function getEventById (id) {
  return fetchJSON(`api/v2/event/${id}/`, GET_EVENT, withToken(), { id });
}

export const GET_SITREPS = 'GET_SITREPS';
export function getSitrepsByEventId (id) {
  return fetchJSON(`api/v2/situation_report/?ordering=-created_at&event=${id}&limit=100`, GET_SITREPS, withToken(), { id });
}

export const GET_ERU_OWNERS = 'GET_ERU_OWNERS';
export function getEruOwners () {
  return fetchJSON('api/v2/eru_owner/?limit=0', GET_ERU_OWNERS, withToken());
}

export const GET_AA = 'GET_AA';
export function getAdmAreaById (aaType, id) {
  switch (aaType) {
    case 'region':
      return fetchJSON(`/api/v2/region/${id}/`, GET_AA, withToken(), { id });
    case 'country':
      return fetchJSON(`/api/v2/country/${id}/`, GET_AA, withToken(), { id });
    default:
      throw new Error('Invalid admin area type ' + aaType);
  }
}

export const GET_AA_APPEALS = 'GET_AA_APPEALS';
export const GET_AA_DREFS = 'GET_AA_DREFS';
export const GET_AA_FIELD_REPORTS = 'GET_AA_FIELD_REPORTS';
export const GET_AA_APPEALS_LIST = 'GET_AA_APPEALS_LIST';
export function getAdmAreaAppealsList (aaType, aaId) {
  let filters = {
    end_date__gt: DateTime.utc().toISO(),
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
  return fetchJSON(`api/v2/appeal/?${f}`, GET_AA_APPEALS_LIST, withToken());
}

export const GET_COUNTRY_OPERATIONS = 'GET_COUNTRY_OPERATIONS';
export function getCountryOperations (aaType, cId, page, filters = {}) {
  filters.end_date__gt = DateTime.utc().toISO();
  filters.limit = 1000;
  filters.country = cId;
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/appeal/?${f}`, GET_COUNTRY_OPERATIONS, withToken());
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
      filters.deployed_to__in = countriesByRegion[aaId].join(',');
      break;
    case 'country':
      filters.deployed_to__in = aaId;
      break;
    default:
      throw new Error('Invalid admin area type ' + aaType);
  }

  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/eru/?${f}`, GET_AA_ERU, withToken());
}

export const GET_PARTNER_DEPLOYMENTS = 'GET_PARTNER_DEPLOYMENTS';
export function getPartnerDeployments (aaType, id) {
  aaType = aaType || 'country';
  let filters = aaType === 'country' ? { country_deployed_to: id }
    : aaType === 'region' ? { country_deployed_to__in: countriesByRegion[id].join(',') }
      : { district_deployed_to: id };
  filters.limit = 1000;
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/partner_deployment/?${f}`, GET_PARTNER_DEPLOYMENTS, withToken(), { id });
}

export const GET_AA_KEY_FIGURES = 'GET_AA_KEY_FIGURES';
export function getAdmAreaKeyFigures (aaType, aaId) {
  const f = buildAPIQS({
    [aaType === 'region' ? 'region' : 'country']: aaId
  });
  return fetchJSON(`api/v2/${aaType === 'region' ? 'region' : 'country'}_key_figure/?${f}`, GET_AA_KEY_FIGURES, withToken());
}

export const GET_AA_SNIPPETS = 'GET_AA_SNIPPETS';
export function getAdmAreaSnippets (aaType, aaId) {
  const f = buildAPIQS({
    [aaType === 'region' ? 'region' : 'country']: aaId
  });
  return fetchJSON(`api/v2/${aaType === 'region' ? 'region' : 'country'}_snippet/?${f}`, GET_AA_SNIPPETS, withToken());
}

export const GET_HEOPS = 'GET_HEOPS';
export function getHeops (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  const f = buildAPIQS(filters);

  return fetchJSON(`/api/v2/heop/?${f}`, GET_HEOPS, withToken());
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
export function getAppeals (page = 1, filters = {}, action) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/appeal/?${f}`, action || GET_APPEALS, withToken());
}

export const GET_APPEAL_DOCS = 'GET_APPEAL_DOCS';
export function getAppealDocsByAppealIds (appealIds, id) {
  const ids = (Array.isArray(appealIds) ? appealIds : [appealIds]).join(',');
  return fetchJSON(`api/v2/appeal_document/?ordering=-created_at&appeal__in=${ids}&limit=100`, GET_APPEAL_DOCS, withToken(), { id });
}

export const GET_DEPLOYMENT_ERU = 'GET_DEPLOYMENT_ERU';
export function getDeploymentERU (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  filters['deployed_to__isnull'] = false;

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/eru/?${f}`, GET_DEPLOYMENT_ERU, withToken());
}

export const GET_DEPLOYMENT_FACT = 'GET_DEPLOYMENT_FACT';
export function getDeploymentFACT (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/fact_person/?${f}`, GET_DEPLOYMENT_FACT, withToken());
}

export const GET_DEPLOYMENT_HEOP = 'GET_DEPLOYMENT_HEOP';
export function getDeploymentHEOP (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/heop/?${f}`, GET_DEPLOYMENT_HEOP, withToken());
}

export const GET_DEPLOYMENT_RDRT = 'GET_DEPLOYMENT_RDRT';
export function getDeploymentRDRT (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/rdrt_person/?${f}`, GET_DEPLOYMENT_RDRT, withToken());
}

export const GET_ALL_DEPLOYMENT_ERU = 'GET_ALL_DEPLOYMENT_ERU';
export function getAllDeploymentERU (filters = {}) {
  filters['deployed_to__isnull'] = false;
  filters.limit = 1000;
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/eru/?${f}`, GET_ALL_DEPLOYMENT_ERU, withToken());
}

export const GET_ALL_DEPLOYMENT_FACT = 'GET_ALL_DEPLOYMENT_FACT';
export function getAllDeploymentFACT (filters = {}) {
  filters.limit = 1000;
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/fact/?${f}`, GET_ALL_DEPLOYMENT_FACT, withToken());
}

export const GET_ALL_DEPLOYMENT_HEOP = 'GET_ALL_DEPLOYMENT_HEOP';
export function getAllDeploymentHEOP (filters = {}) {
  filters.limit = 1000;
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/heop/?${f}`, GET_ALL_DEPLOYMENT_HEOP, withToken());
}

export const GET_ALL_DEPLOYMENT_RDRT = 'GET_ALL_DEPLOYMENT_RDRT';
export function getAllDeploymentRDRT (filters = {}) {
  filters.limit = 1000;
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/rdrt/?${f}`, GET_ALL_DEPLOYMENT_RDRT, withToken());
}
