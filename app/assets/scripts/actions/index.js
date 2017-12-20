'use strict';
import { fetchJSON, fetchJSONRecursive, postJSON, putJSON, withToken } from '../utils/network';
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

export const LOGOUT_USER = 'LOGOUT_USER';
export function logoutUser () {
  return { type: LOGOUT_USER };
}

export const GET_FIELD_REPORT = 'GET_FIELD_REPORT';
export function getFieldReportById (id) {
  return fetchJSON(`api/v1/field_report/${id}/`, GET_FIELD_REPORT, withToken(), { id });
}

export const CREATE_FIELD_REPORT = 'CREATE_FIELD_REPORT';
export function createFieldReport (payload) {
  return postJSON('api/v1/field_report/', CREATE_FIELD_REPORT, payload, withToken());
}

export const UPDATE_FIELD_REPORT = 'UPDATE_FIELD_REPORT';
export function updateFieldReport (id, payload) {
  return putJSON(`api/v1/field_report/${id}/`, UPDATE_FIELD_REPORT, payload, withToken());
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
export function getAggregateAppeals (date, unit) {
  const f = buildAPIQS({
    start_date: date,
    model_type: 'appeal',
    unit
  });
  return fetchJSON(`api/v1/aggregate/?${f}`, GET_AGGREGATE_APPEALS, withToken(), {aggregationUnit: unit});
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
    limit: 0
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

export const GET_ERU_OWNERS = 'GET_ERU_OWNERS';
export function getEruOwners () {
  return fetchJSON('api/v1/eru_owner/?limit=0', GET_ERU_OWNERS, withToken());
}

export const GET_REGION = 'GET_REGION';
export function getRegionById (id) {
  // Get from static storage.
  return function (dispatch) {
    dispatch({ type: 'GET_REGION_INFLIGHT', id });
    setTimeout(() => {
      const region = regions[id];
      if (region) {
        dispatch({ type: 'GET_REGION_SUCCESS', data: region, receivedAt: Date.now(), id });
      } else {
        dispatch({ type: 'GET_REGION_FAILED', error: { message: 'Region not found.' }, id });
      }
    }, 1);
  };
}

export const GET_REGION_APPEALS = 'GET_REGION_APPEALS';
export function getRegionAppeals (regionId, page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  filters.atype = 1;
  filters.region = regionId;
  const f = buildAPIQS(filters);

  return fetchJSON(`/api/v1/appeal/?${f}`, GET_REGION_APPEALS, withToken());
}

export const GET_REGION_DREFS = 'GET_REGION_DREFS';
export function getRegionDrefs (regionId, page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  filters.atype = 0;
  filters.region = regionId;
  const f = buildAPIQS(filters);

  return fetchJSON(`/api/v1/appeal/?${f}`, GET_REGION_DREFS, withToken());
}

export const GET_REGION_FIELD_REPORTS = 'GET_REGION_FIELD_REPORTS';
export function getRegionFieldReports (regionId, page = 1, filters = {}) {
  filters.limit = filters.limit || 5;
  filters.offset = filters.limit * (page - 1);
  filters.regions__in = regionId;
  const f = buildAPIQS(filters);

  return fetchJSON(`/api/v1/field_report/?${f}`, GET_REGION_FIELD_REPORTS, withToken());
}

export const GET_REGION_APPEALS_STATS = 'GET_REGION_APPEALS_STATS';
export function getRegionAppealsStats (regionId) {
  const f = buildAPIQS({
    end_date__gt: DateTime.local().toISODate(),
    limit: 1000,
    region: regionId
  });
  return fetchJSONRecursive(`api/v1/appeal/?${f}`, GET_REGION_APPEALS_STATS, withToken());
}

export const GET_REGION_AGGREGATE_APPEALS = 'GET_REGION_AGGREGATE_APPEALS';
export function getRegionAggregateAppeals (regionId, date, unit) {
  const f = buildAPIQS({
    start_date: date,
    region: regionId,
    model_type: 'appeal',
    unit
  });
  return fetchJSON(`api/v1/aggregate/?${f}`, GET_REGION_AGGREGATE_APPEALS, withToken(), {aggregationUnit: unit});
}

export const GET_REGION_ERU = 'GET_REGION_ERU';
export function getRegionERU (regionId) {
  const f = buildAPIQS({
    countries__in: countriesByRegion[regionId].join(',')
  });
  return fetchJSON(`api/v1/eru/?${f}`, GET_REGION_ERU, withToken());
}
