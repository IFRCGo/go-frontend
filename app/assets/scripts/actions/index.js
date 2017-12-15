'use strict';
import { fetchJSON, fetchJSONRecursive, postJSON, putJSON, withToken } from '../utils/network';
import { stringify as buildAPIQS } from 'qs';
import { DateTime } from 'luxon';

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
  filters.limit = filters.limit || 10;
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

export const UPDATE_SUBSCRIPTIONS = 'UPDATE_SUBSCRIPTIONS';
export function updateSubscriptions (payload) {
  return postJSON('notifications/', UPDATE_SUBSCRIPTIONS, payload, withToken());
}

export const GET_EVENT = 'GET_EVENT';
export function getEventById (id) {
  return fetchJSON(`api/v1/event/${id}/`, GET_EVENT, withToken(), { id });
}
