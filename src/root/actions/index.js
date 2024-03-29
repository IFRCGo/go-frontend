import {
  fetchJSON,
  fetchCSV,
  postJSON,
  putJSON,
  patchJSON,
  deleteJSON,
  withToken
} from '#utils/network';
import { stringify as buildAPIQS } from 'qs';
import { DateTime } from 'luxon';

import { countriesSelector, countrySelector } from '#selectors';
import { countriesByIso, countriesByRegionSelector } from '../selectors';

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

export const RESEND_VALIDATION = 'RESEND_VALIDATION';
export function resendValidation (username) {
  return postJSON('resend_validation', RESEND_VALIDATION, { username });
}

export const GET_ME = 'GET_ME';
export const getMe = () => (
  fetchJSON('api/v2/user/me/', GET_ME, withToken())
);

export const GET_REGIONAL_PROJECTS = 'GET_REGIONAL_PROJECTS';
export const getRegionalProjects = (regionId, filterValues) => {
  const filters = {
    region: regionId,
    limit: 9999,
    ...filterValues
  };
  const query = buildAPIQS(filters, { arrayFormat: 'comma' });
  return fetchJSON(`api/v2/project/?${query}`, GET_REGIONAL_PROJECTS, withToken());
};

export const GET_REGIONAL_PROJECTS_OVERVIEW = 'GET_REGIONAL_PROJECTS_OVERVIEW';
export function getRegionalProjectsOverview (regionId) {
  return fetchJSON(`api/v2/region-project/${regionId}/overview/`, GET_REGIONAL_PROJECTS_OVERVIEW, withToken());
}

export const GET_REGIONAL_MOVEMENT_ACTIVITIES = 'GET_REGIONAL_MOVEMENT_ACTIVITIES';
export function getRegionalMovementActivities (regionId, filters) {
  const query = buildAPIQS(filters, { arrayFormat: 'comma' });
  return fetchJSON(`api/v2/region-project/${regionId}/movement-activities/?${query}`, GET_REGIONAL_MOVEMENT_ACTIVITIES, withToken());
}

export const GET_NATIONAL_SOCIETY_ACTIVITIES = 'GET_NATIONAL_SOCIETY_ACTIVITIES';
export function getNationalSocietyActivities (regionId, filters) {
  const filtersWithRegion = {
    region: regionId,
    ...filters,
  };
  const query = buildAPIQS(filtersWithRegion, { arrayFormat: 'comma' });

  return fetchJSON(`api/v2/region-project/national-society-activities/?${query}`, GET_NATIONAL_SOCIETY_ACTIVITIES, withToken());
}

// NOTE: this is used to get intial values for the filters
export const GET_NATIONAL_SOCIETY_ACTIVITIES_WO_FILTERS = 'GET_NATIONAL_SOCIETY_ACTIVITIES_WO_FILTERS';
export function getNationalSocietyActivitiesWoFilters (regionId, filters) {
  const filtersWithRegion = {
    region: regionId,
    ...filters,
  };
  const query = buildAPIQS(filtersWithRegion, { arrayFormat: 'comma' });
  return fetchJSON(`api/v2/region-project/national-society-activities/?${query}`, GET_NATIONAL_SOCIETY_ACTIVITIES_WO_FILTERS, withToken());
}

export const GET_PROJECTS = 'GET_PROJECTS';
export function getProjects (countryId, filterValues) {
  return (dispatch, getState) => {
    const { iso } = countrySelector(getState(), countryId);
    const filters = {
      limit: 9999,
      country: iso,
      ...filterValues
    };
    const f = buildAPIQS(filters);
    dispatch(fetchJSON(`api/v2/project/?${f}`, GET_PROJECTS, withToken(), { countryId }));
  };
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

export const DELETE_PROJECT = 'DELETE_PROJECT';
export function deleteProject (projectId) {
  return deleteJSON(`api/v2/project/${projectId}/`, DELETE_PROJECT, withToken());
}

export const GET_REGIONS = 'GET_REGIONS';
export function getRegions () {
  return fetchJSON('api/v2/region/', GET_REGIONS);
}

export const GET_COUNTRY_OVERVIEW = 'GET_COUNTRY_OVERVIEW';
export const getCountryOverview = (countryIso) => {
  return fetchJSON(`api/v2/country/${countryIso}/databank/`, GET_COUNTRY_OVERVIEW, withToken());
};

export const GET_COUNTRIES = 'GET_COUNTRIES';
export function getCountries (region, mini) {
  let filters = {limit: 1000};
  if (region) {
    filters.region = region;
  }
  if (mini) {
    filters.mini = true;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/country/?${f}`, GET_COUNTRIES);
}

export const GET_FIELD_REPORT = 'GET_FIELD_REPORT';
export function getFieldReportById (id, lang=null) {
  const opts = {
    ...withToken(),
    lang
  };
  return fetchJSON(`api/v2/field_report/${id}/`, GET_FIELD_REPORT, opts, { id });
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

export const GET_EXTERNAL_PARTNERS = 'GET_EXTERNAL_PARTNERS';
export function getExternalPartners () {
  let filters = {limit: 500};
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/external_partner/?${f}`, GET_EXTERNAL_PARTNERS);
}

export const GET_SUPPORTED_ACTIVITIES = 'GET_SUPPORTED_ACTIVITIES';
export function getSupportedActivities () {
  let filters = {limit: 500};
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/supported_activity/?${f}`, GET_SUPPORTED_ACTIVITIES);
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
  return (dispatch, getState) => {
    const filters = {
      end_date__gt: DateTime.utc().toISO(),
      limit: 1000
    };
    const f = buildAPIQS(filters);
    dispatch(fetchJSON(`api/v2/appeal/?${f}`, GET_APPEALS_LIST, withToken(), { countries: countriesSelector(getState()) }));
  };
}

export const GET_APPEALS_LIST_STATS = 'GET_APPEALS_LIST_STATS';
export function getAppealsListStats ({countryId = null, regionId = null} = {}) {
  const filters = {
  };
  // Needs !== null, otherwise ID 0 == false
  if (typeof(countryId) === 'number') {
    filters.country = countryId;
  }
  if (typeof(regionId) === 'number') {
    filters.region = regionId;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/appeal/aggregated/?${f}`, GET_APPEALS_LIST_STATS, withToken());
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
  return (dispatch, getState) => {
    const f = buildAPIQS({
      disaster_start_date__gt: DateTime.utc().minus({days: 30}).startOf('day').toISO(),
      limit: 500,
      ordering: '-disaster_start_date'
    });
    dispatch(fetchJSON(`api/v2/event/?${f}`, GET_LAST_MO_EMERGENCIES, withToken(), { countries: countriesByIso(getState()) }));
  };
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

export const GET_PERSONNEL_BY_EVENT = 'GET_PERSONNEL_BY_EVENT';
export function getPersonnelByEvent () {
  return fetchJSON(`api/v2/personnel_by_event`, GET_PERSONNEL_BY_EVENT);
}

export const GET_SITREP_TYPES = 'GET_SITREP_TYPES';
export function getSitrepTypes () {
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
  return (dispatch, getState) => {
    dispatch(fetchJSON('api/v2/eru_owner/?limit=0', GET_ERU_OWNERS, withToken(), { state: getState() }));
  };
}

export const GET_NS_RAPID_RESPONSE = 'GET_NS_RAPID_RESPONSE';
export function getNsRapidResponse () {
  return fetchJSON('api/v2/deployment/aggregated_by_ns/', GET_NS_RAPID_RESPONSE);
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
  return (dispatch, getState) => {
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
    dispatch(fetchJSON(`api/v2/appeal/?${f}`, GET_AA_APPEALS_LIST, withToken(), { countries: countriesSelector(getState()) }));
  };
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
  return (dispatch, getState) => {
    aaType = aaType || 'country';
    const countriesByRegion = countriesByRegionSelector(getState());
    let filters = aaType === 'country' ? { country_deployed_to: id }
      : aaType === 'region' ? { country_deployed_to__in: countriesByRegion[id][0].id.join(',') }
        : { district_deployed_to: id };
    filters.limit = 1000;
    const f = buildAPIQS(filters);
    dispatch(fetchJSON(`api/v2/partner_deployment/?${f}`, GET_PARTNER_DEPLOYMENTS, withToken(), { id }));
  };
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
  return (dispatch, getState) => {
    filters.limit = 1000;
    filters.end_date__gt = DateTime.utc().toISO();
    const f = buildAPIQS(filters);
    dispatch(fetchJSON(`/api/v2/personnel/?${f}`, GET_ACTIVE_PERSONNEL, withToken(), { countries: countriesSelector(getState()) }));
  };
}

export const GET_ALL_DEPLOYMENT_ERU = 'GET_ALL_DEPLOYMENT_ERU';
export function getAllDeploymentERU (filters = {}) {
  return (dispatch, getState) => {
    filters['deployed_to__isnull'] = false;
    filters.limit = 1000;
    const f = buildAPIQS(filters);
    dispatch(fetchJSON(`/api/v2/eru/?${f}`, GET_ALL_DEPLOYMENT_ERU, withToken(), { countries: countriesSelector(getState()) }));
  };
}

export const GET_AGGR_SURGE_KEY_FIGURES = 'GET_AGGR_SURGE_KEY_FIGURES';
export function getAggrSurgeKeyFigures () {
  return fetchJSON(`/api/v2/deployment/aggregated`, GET_AGGR_SURGE_KEY_FIGURES, withToken());
}

export const GET_AGGR_SURGE_EVENT_KEY_FIGURES = 'GET_AGGR_SURGE_EVENT_KEY_FIGURES';
export function getAggrSurgeEventKeyFigures (eventId) {
  return fetchJSON(`/api/v2/deployment/aggregated?event=${eventId}`, GET_AGGR_SURGE_EVENT_KEY_FIGURES, withToken());
}

export const GET_LIST_CSV = 'GET_LIST_CSV';
export function getListAsCsv (url, id) {
  return fetchCSV(url, GET_LIST_CSV, withToken(), { id });
}

export function clearLoadedCsv (id) {
  return { type: 'CLEAR_LOADED_CSV', id };
}

// export const CREATE_PER_FORM = 'CREATE_PER_FORM';
// export function createPerForm (data) {
//   return postJSON('createperform', CREATE_PER_FORM, data, withToken());
// }

// Update one Form and it's FormData
export const UPDATE_PER_FORM = 'UPDATE_PER_FORM';
export function updatePerForm (data) {
  return postJSON('updateperform', UPDATE_PER_FORM, data, withToken());
}

// Update multiple Forms at once with their FormData, let backend handle them
export const UPDATE_MULTIPLE_PER_FORMS = 'UPDATE_MULTIPLE_PER_FORMS';
export function updatePerForms (data) {
  return postJSON('updatemultipleperforms', UPDATE_MULTIPLE_PER_FORMS, data, withToken());
}

// export const DELETE_PER_FORM = 'DELETE_PER_FORM';
// export function deletePerForm (id) {
//   return postJSON('deleteperform', DELETE_PER_FORM, { id: id }, withToken());
// }

export const RESET_PER_STATE = 'RESET_PER_STATE';
export function resetPerState () {
  return { type: RESET_PER_STATE };
}

export const GET_PER_COUNTRIES = 'GET_PER_COUNTRIES';
export function getPerCountries () {
  let filters = {};
  filters.limit = 1000;
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/percountry/?${f}`, GET_PER_COUNTRIES, withToken());
}

export const GET_PER_AREAS = 'GET_PER_AREAS';
export function getPerAreas (id = null, area_num = null) {
  let filters = {};
  filters.limit = 500;
  if (area_num) {
    filters.area_num = area_num;
  }
  if (id) {
    filters.id = id;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/per-formarea/?${f}`, GET_PER_AREAS);
}

export const GET_PER_FORMS = 'GET_PER_FORMS';
export function getPerForms (id = null, overview_id = null, withData = false) {
  let filters = {};
  filters.limit = 9999;
  if (id) {
    filters.id = id;
  }
  if (overview_id) {
    filters.overview_id = overview_id;
  }
  if (withData === true) {
    filters.with_data = true;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/per/?${f}`, GET_PER_FORMS, withToken());
}

export const GET_PER_FORM = 'GET_PER_FORM';
export function getPerForm (formid = null, countryId = null) {
  let filters = {};
  filters.limit = 1000;
  if (formid !== null) {
    filters.form = formid;
  }
  if (countryId !== null) {
    filters.country = countryId;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/perdata/?${f}`, GET_PER_FORM, withToken());
}

export const GET_PER_QUESTIONS = 'GET_PER_QUESTIONS';
export function getPerQuestions (area_id = null) {
  let filters = {};
  filters.limit = 9999;
  if (area_id) {
    filters.area_id = area_id;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/per-formquestion/?${f}`, GET_PER_QUESTIONS);
}

export const GET_PER_COMPONENTS = 'GET_PER_COMPONENTS';
export function getPerComponents (area_id = null) {
  let filters = {};
  filters.limit = 500;
  if (area_id) {
    filters.area_id = area_id;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`/api/v2/per-formcomponent/?${f}`, GET_PER_COMPONENTS);
}

export const GET_PER_ASSESSMENT_TYPES = 'GET_PER_ASSESSMENT_TYPES';
export function getAssessmentTypes () {
  return fetchJSON('/api/v2/per-assessmenttype/', GET_PER_ASSESSMENT_TYPES);
}

export const GET_LATEST_COUNTRY_OVERVIEW = 'GET_LATEST_COUNTRY_OVERVIEW';
export function getLatestCountryOverview(countryId) {
  if (countryId) {
    return fetchJSON(`/api/v2/latest_country_overview/?country_id=${countryId}`, GET_LATEST_COUNTRY_OVERVIEW, withToken());
  }
  return null;
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

export const PER_OVERVIEWS = 'PER_OVERVIEWS';
export function getPerOverviews (countryId = null, formId = null) {
  let filters = {};
  filters.limit = 9999;
  if (countryId) {
    filters.country = countryId;
  }
  if (formId) {
    filters.id = formId;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/peroverview/?${f}`, PER_OVERVIEWS, withToken());
}

export function getPerOverviewsStrict (countryId = null, formId = null) {
  let filters = {};
  filters.limit = 9999;
  if (countryId) {
    filters.country = countryId;
  }
  if (formId) {
    filters.id = formId;
  }
  const f = buildAPIQS(filters);
  return fetchJSON(`api/v2/peroverviewstrict/?${f}`, PER_OVERVIEWS, withToken());
}

export const PER_OVERVIEW_FORM = 'PER_OVERVIEW_FORM';
export function getPerOverviewStrict (formId) {
  if (!formId) {
    return {};
  }
  const f = buildAPIQS({id: formId});
  return fetchJSON(`api/v2/peroverviewstrict/?${f}`, PER_OVERVIEW_FORM, withToken());
}

export const PER_WORK_PLAN = 'PER_WORK_PLAN';
export function getPerWorkPlan (countryId = null) {
  const f = buildAPIQS({country: countryId});
  return fetchJSON(`api/v2/perworkplan/?${f}`, PER_WORK_PLAN, withToken());
}

export const PER_EXPORT_TO_CSV = 'PER_EXPORT_TO_CSV';
export function exportPerToCsv (formId) {
  if (!formId) {
    return {};
  }
  const f = buildAPIQS({overview_id: formId});
  return fetchCSV(`api/v2/exportperresults/?${f}`, PER_EXPORT_TO_CSV, withToken());
}

export const CREATE_PER_OVERVIEW = 'CREATE_PER_OVERVIEW';
export function createPerOverview (payload) {
  return postJSON('createperoverview', CREATE_PER_OVERVIEW, payload, withToken());
}

export const UPDATE_PER_OVERVIEW = 'UPDATE_PER_OVERVIEW';
export function updatePerOverview (payload) {
  return postJSON('updateperoverview', UPDATE_PER_OVERVIEW, payload, withToken());
}

export const DELETE_PER_OVERVIEW = 'DELETE_PER_OVERVIEW';
export function deletePerOverview (id) {
  return postJSON('deleteperoverview', DELETE_PER_OVERVIEW, { id: id }, withToken());
}

export const SEND_PER_WORKPLAN = 'SEND_PER_WORKPLAN';
export function sendPerWorkplan (payload) {
  return postJSON('sendperworkplan', SEND_PER_WORKPLAN, payload, withToken());
}

export const DELETE_PER_WORKPLAN_API = 'DELETE_PER_WORKPLAN_API';
export function deletePerWorkplanApi (payload) {
  return postJSON('api/v2/del_perworkplan/', DELETE_PER_WORKPLAN_API, payload, withToken());
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

export const GET_DOMAIN_WHITELIST = 'GET_DOMAIN_WHITELIST';
export function getDomainWhitelist () {
  const f = buildAPIQS({
    limit: 9999
  });
  return fetchJSON(`/api/v2/domainwhitelist/?${f}`, GET_DOMAIN_WHITELIST, withToken());
}

export const SET_CURRENT_LANGUAGE = 'SET_CURRENT_LANGUAGE';
export const setCurrentLanguageAction = (currentLanguage) => ({
    type: SET_CURRENT_LANGUAGE,
    language: currentLanguage,
});

export const GET_LANGUAGE = 'GET_LANGUAGE';
export const getLanguageAction = (langCode) => {
  return fetchJSON(`/api/v2/language/${langCode}/`, GET_LANGUAGE);
};

export const POST_LANGUAGE_BULK = 'POST_LANGUAGE_BULK';
export const postLanguageBulkAction = (langCode, data) => {
  return postJSON(`/api/v2/language/${langCode}/bulk-action/`, POST_LANGUAGE_BULK, data, withToken());
};

export const GET_ALL_LANGUAGES = 'GET_ALL_LANGUAGES';
export const getAllLanguagesAction = () => {
  return fetchJSON('/api/v2/language/all', GET_ALL_LANGUAGES);
};

export const RESET_ALL_LANGUAGES = 'RESET_ALL_LANGUAGES';
export function resetAllLanguagesAction () {
  return { type: RESET_ALL_LANGUAGES };
}

export const GET_COUNTRIES_ALL = 'GET_COUNTRIES_ALL';
export function getCountriesAllAction () {
  return fetchJSON('api/v2/country/?limit=1000', GET_COUNTRIES_ALL);
}

export const GET_REGIONS_ALL = 'GET_REGIONS_ALL';
export function getRegionsAllAction () {
  return fetchJSON('api/v2/region/', GET_REGIONS_ALL);
}

export const GET_DISASTER_TYPES = 'GET_DISASTER_TYPES';
export function getDisasterTypes () {
  return fetchJSON('api/v2/disaster_type', GET_DISASTER_TYPES);
}

export const GET_MAIN_CONTACTS = 'GET_MAIN_CONTACTS';
export function getMainContacts () {
  return fetchJSON('api/v2/main_contact/?limit=200', GET_MAIN_CONTACTS);
}
