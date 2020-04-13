'use strict';
import {
  fetchJSON,
  fetchCSV,
  postJSON,
  putJSON,
  patchJSON,
  withToken
} from '../utils/network';
import { countryIsoMapById } from '../utils/field-report-constants';
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

export const SHOW_USERNAME = 'SHOW_USERNAME';
export function showUsername (email) {
  return postJSON('show_username', SHOW_USERNAME, { email });
}

export const GET_ME = 'GET_ME';
export const getMe = () => (
  fetchJSON('api/v2/user/me/', GET_ME, withToken())
);

export const GET_PROJECTS = 'GET_PROJECTS';
export function getProjects (countryId, filterValues) {
  const filters = {
    country: countryIsoMapById[countryId],
    ...filterValues
  };
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/project/?${f}`, GET_PROJECTS, withToken());
}

export const POST_PROJECT = 'POST_PROJECT';
export function postProject (data) {
  const {
    id,
    ...otherData
  } = data;

  if (id) {
    return putJSON(`api/v2/project/${id}/`, POST_PROJECT, otherData, withToken());
  }

  return postJSON('api/v2/project/', POST_PROJECT, data, withToken());
}

export const GET_COUNTRY_OVERVIEW = 'GET_COUNTRY_OVERVIEW';
export const getCountryOverview = (countryIso) => {
  return fetchJSON(`api/v2/data-bank/country-overview/${countryIso}`, GET_COUNTRY_OVERVIEW, withToken());
};

export const GET_COUNTRIES = 'GET_COUNTRIES';
export function getCountries (region) {
  let filters = {limit: 1000};
  if (region) {
    filters.region = region;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/country/?${f}`, GET_COUNTRIES);
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
  return postJSON('api/v2/create_field_report/', CREATE_FIELD_REPORT, payload, withToken());
}

export const UPDATE_FIELD_REPORT = 'UPDATE_FIELD_REPORT';
export function updateFieldReport (id, payload) {
  return putJSON(`api/v2/update_field_report/${id}/`, UPDATE_FIELD_REPORT, payload, withToken());
}

export const GET_FIELD_REPORTS_LIST = 'GET_FIELD_REPORTS_LIST';
export function getFieldReportsList (page = 1, filters = {}) {
  filters.limit = filters.limit || 10;
  filters.offset = filters.limit * (page - 1);
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/field_report/?${f}`, GET_FIELD_REPORTS_LIST, withToken());
}

export const GET_ACTIONS = 'GET_ACTIONS';
export function getActions () {
  let filters = {limit: 500};
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/action/?${f}`, GET_ACTIONS);
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
  const filters = {
    end_date__gt: DateTime.utc().toISO(),
    limit: 1000
  };
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/appeal/?${f}`, GET_APPEALS_LIST, withToken());
}

export const GET_APPEALS_LIST_STATS = 'GET_APPEALS_LIST_STATS';
export function getAppealsListStats ({countryId = null, regionId = null} = {}) {
  const filters = {
    end_date__gt: DateTime.utc().toISO(),
    limit: 1000
  };
  if (countryId) {
    filters.country = countryId;
  }
  if (regionId) {
    filters.region = regionId;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/appeal/?${f}`, GET_APPEALS_LIST_STATS, withToken());
}

export const GET_AGGREGATE_APPEALS = 'GET_AGGREGATE_APPEALS';
export function getAggregateAppeals (date, unit, type, region = undefined) {
  const typeMapping = { drefs: 0, appeals: 1 };

  const f = buildAPIQS({
    start_date: date,
    model_type: 'appeal',
    sum_beneficiaries: 'num_beneficiaries',
    sum_amount_funded: 'amount_funded',
    filter_atype: typeMapping[type],
    region,
    unit
  });
  return fetchJSON(`api/v1/aggregate/?${f}`, GET_AGGREGATE_APPEALS, withToken(), {aggregationUnit: unit, aggregationType: type});
}

export const GET_FEATURED_EMERGENCIES = 'GET_FEATURED_EMERGENCIES';
export function getFeaturedEmergencies () {
  return fetchJSON('/api/v2/event/?is_featured=1', GET_FEATURED_EMERGENCIES, withToken());
}

export function getFeaturedEmergenciesForRegion (regionId) {
  return fetchJSON(`/api/v2/event/?is_featured_region=1&regions__in=${regionId}`, GET_FEATURED_EMERGENCIES, withToken());
}

export const GET_FEATURED_EMERGENCIES_DEPLOYMENTS = 'GET_FEATURED_EMERGENCIES_DEPLOYMENTS';
export function getFeaturedEmergenciesDeployments () {
  return fetchJSON('/api/v2/featured_event_deployments', GET_FEATURED_EMERGENCIES_DEPLOYMENTS, withToken());
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

export const ADD_SUBSCRIPTIONS = 'ADD_SUBSCRIPTIONS';
export function addSubscriptions (id) {
  const payload = [{type: 'followedEvent', value: id}];
  return postJSON(`api/v2/add_subscription/`, ADD_SUBSCRIPTIONS, payload, withToken());
}

export const DEL_SUBSCRIPTION = 'DEL_SUBSCRIPTION';
export function delSubscription (id) {
  const payload = [{value: id}];
  return postJSON(`api/v2/del_subscription/`, DEL_SUBSCRIPTION, payload, withToken());
}

export const GET_EVENT = 'GET_EVENT';
export function getEventById (id) {
  return fetchJSON(`api/v2/event/${id}/`, GET_EVENT, withToken(), { id });
}

export const GET_EVENT_LIST = 'GET_EVENT_LIST';
export function getEventList (countryId) {
  const query = {
    countries__in: countryId,
    limit: 9999,
  };
  const q = buildAPIQS(query);
  return fetchJSON(`api/v2/event/mini/?${q}`, GET_EVENT_LIST, withToken());
}

export const GET_EVENT_SNIPPETS = 'GET_EVENT_SNIPPETS';
export function getEventSnippets (eventId) {
  return fetchJSON(`api/v2/event_snippet/?event=${eventId}`, GET_EVENT_SNIPPETS, withToken(), { id: eventId });
}

export const GET_SITREP_TYPES = 'GET_SITREP_TYPES';
export function getSitrepTypes (type) {
  return fetchJSON('api/v2/situation_report_type/', GET_SITREP_TYPES);
}

export const GET_SITREPS = 'GET_SITREPS';
export function getSitrepsByEventId (id, filters = {}) {
  filters.event = id;
  filters.ordering = '-created_at';
  filters.limit = 1000;
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/situation_report/?${f}`, GET_SITREPS, withToken(), { id });
}

export const GET_ERU_OWNERS = 'GET_ERU_OWNERS';
export function getEruOwners () {
  return fetchJSON('api/v2/eru_owner/?limit=0', GET_ERU_OWNERS, withToken());
}

export const GET_DISTRICTS = 'GET_DISTRICTS';
export function getDistrictsForCountry (country) {
  // should not be dependent on the country data structure
  // i.e country should already be country.value here

  const filters = {
    country: country.value,
    limit: 200
  };
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/district/?${f}`, GET_DISTRICTS, {}, { country });
}

// PF = project form
export function getDistrictsForCountryPF (country) {
  return getDistrictsForCountry({ value: country });
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

export const GET_AA_PERSONNEL = 'GET_AA_PERSONNEL';
export function getRegionPersonnel (region) {
  const f = buildAPIQS({
    region_deployed_to: region,
    end_date__gt: DateTime.utc().toISO()
  });
  return fetchJSON(`api/v2/personnel/?${f}`, GET_AA_PERSONNEL, withToken());
}

export function setPartnerDeploymentFilter (id, filters) {
  return {type: 'SET_PARTNER_DEPLOYMENT_FILTER', id, filters};
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
  filters.limit = filters.limit || 95;
  filters.offset = filters.limit * (page - 1);
  filters['deployed_to__isnull'] = false;

  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/eru/?${f}`, GET_DEPLOYMENT_ERU, withToken());
}

export const GET_PERSONNEL = 'GET_PERSONNEL';
export function getPersonnel (page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  filters.end_date__gt = DateTime.utc().toISO();
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/personnel/?${f}`, GET_PERSONNEL, withToken());
}

export const GET_ACTIVE_PERSONNEL = 'GET_ACTIVE_PERSONNEL';
export function getActivePersonnel (filters = {}) {
  filters.limit = 1000;
  filters.end_date__gt = DateTime.utc().toISO();
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/personnel/?${f}`, GET_ACTIVE_PERSONNEL, withToken());
}

export const GET_ALL_DEPLOYMENT_ERU = 'GET_ALL_DEPLOYMENT_ERU';
export function getAllDeploymentERU (filters = {}) {
  filters['deployed_to__isnull'] = false;
  filters.limit = 1000;
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/eru/?${f}`, GET_ALL_DEPLOYMENT_ERU, withToken());
}

export const GET_LIST_CSV = 'GET_LIST_CSV';
export function getListAsCsv (url, id) {
  return fetchCSV(url, GET_LIST_CSV, withToken(), { id });
}

export function clearLoadedCsv (id) {
  return { type: 'CLEAR_LOADED_CSV', id };
}

export const SEND_PER_FORM = 'SEND_PER_FORM';
export function sendPerForm (data) {
  return postJSON('sendperform', SEND_PER_FORM, data, withToken());
}

export const GET_PER_COUNTRIES = 'GET_PER_COUNTRIES';
export function getPerCountries () {
  const filters = {};
  filters.limit = 1000;
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/percountry/?${f}`, GET_PER_COUNTRIES, withToken());
}

export const GET_PER_DOCUMENTS = 'GET_PER_DOCUMENTS';
export function getPerDocuments () {
  return fetchJSON(`/api/v2/per/`, GET_PER_DOCUMENTS, withToken());
}

export const GET_PER_DOCUMENT = 'GET_PER_DOCUMENT';
export function getPerDocument (id = null, countryId = null) {
  const filters = {};
  filters.limit = 1000;
  if (id !== null) {
    filters.form = id;
  }
  if (countryId !== null) {
    filters.country = countryId;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/perdata/?${f}`, GET_PER_DOCUMENT, withToken());
}

export const GET_PER_DRAFT_DOCUMENT = 'GET_PER_DRAFT_DOCUMENT';
export function getPerDraftDocument (filters) {
  const filterString = buildAPIQS(filters);
  return fetchJSON(`/api/v2/perdraft/?${filterString}`, GET_PER_DRAFT_DOCUMENT, withToken());
}

export const SEND_PER_DRAFT_DOCUMENT = 'SEND_PER_DRAFT_DOCUMENT';
export function sendPerDraft (data) {
  return postJSON('sendperdraft', SEND_PER_DRAFT_DOCUMENT, data, withToken());
}

export const EDIT_PER_DOCUMENT = 'EDIT_PER_DOCUMENT';
export function editPerDocument (data) {
  return postJSON('editperform', EDIT_PER_DOCUMENT, data, withToken());
}

export const COLLABORATING_PER_COUNTRY = 'COLLABORATING_PER_COUNTRY';
export function getCollaboratingPerCountry () {
  return fetchJSON(`/api/v2/per_country_duedate/`, COLLABORATING_PER_COUNTRY, withToken());
}

export const PER_ENGAGED_NS_PERCENTAGE = 'PER_ENGAGED_NS_PERCENTAGE';
export function getPerEngagedNsPercentage () {
  return fetchJSON(`api/v2/per_engaged_ns_percentage/`, PER_ENGAGED_NS_PERCENTAGE, withToken());
}

export const PER_GLOBAL_PREPAREDNESS = 'PER_GLOBAL_PREPAREDNESS';
export function getPerGlobalPreparedness () {
  return fetchJSON(`api/v2/per_global_preparedness/`, PER_GLOBAL_PREPAREDNESS, withToken());
}

export const PER_NS_PHASE = 'PER_NS_PHASE';
export function getPerNsPhase (countryId = null) {
  const f = buildAPIQS({country: countryId});
  return fetchJSON(`api/v2/per_ns_phase/?${f}`, PER_NS_PHASE, withToken());
}

export const PER_OVERVIEW_FORM = 'PER_OVERVIEW_FORM';
export function getPerOverviewForm (countryId = null, formId = null) {
  const f = buildAPIQS({country: countryId, id: formId});
  return fetchJSON(`api/v2/peroverview/?${f}`, PER_OVERVIEW_FORM, withToken());
}

export function getPerOverviewFormStrict (countryId = null, formId = null) {
  const f = buildAPIQS({country: countryId, id: formId});
  return fetchJSON(`api/v2/peroverviewstrict/?${f}`, PER_OVERVIEW_FORM, withToken());
}

export const PER_WORK_PLAN = 'PER_WORK_PLAN';
export function getPerWorkPlan (countryId = null) {
  const f = buildAPIQS({country: countryId});
  return fetchJSON(`api/v2/perworkplan/?${f}`, PER_WORK_PLAN, withToken());
}

export const PER_SEND_OVERVIEW = 'PER_SEND_OVERVIEW';
export function sendPerOverview (payload) {
  return postJSON('sendperoverview', PER_SEND_OVERVIEW, payload, withToken());
}

export const SEND_PER_WORKPLAN = 'SEND_PER_WORKPLAN';
export function sendPerWorkplan (payload) {
  return postJSON('sendperworkplan', SEND_PER_WORKPLAN, payload, withToken());
}

export const DELETE_PER_WORKPLAN_API = 'DELETE_PER_WORKPLAN_API';
export function deletePerWorkplanApi (payload) {
  return postJSON('api/v2/del_perworkplan/', DELETE_PER_WORKPLAN_API, payload, withToken());
}

export const DELETE_PER_DRAFT = 'DELETE_PER_DRAFT';
export function deletePerDraft (payload) {
  return postJSON('api/v2/del_perdraft', DELETE_PER_DRAFT, payload, withToken());
}

export const GET_PER_UPLOADED_DOCUMENTS = 'GET_PER_UPLOADED_DOCUMENTS';
export function getPerUploadedDocuments (countryId) {
  const f = buildAPIQS({country: countryId});
  return fetchJSON(`api/v2/perdocs/?${f}`, GET_PER_UPLOADED_DOCUMENTS, withToken());
}

export const GET_PER_MISSION = 'GET_PER_MISSION';
export function getPerMission () {
  return fetchJSON(`api/v2/per_mission/`, GET_PER_MISSION, withToken());
}
