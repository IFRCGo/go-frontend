'use strict';
import { fetchJSON, fetchJSONRecursive, postJSON, withToken } from '../utils/network';
import { stringify as buildAPIQS } from 'qs';
import { DateTime } from 'luxon';

export const TOKEN = 'TOKEN';
export function getAuthToken (username, password) {
  return postJSON('get_auth_token', TOKEN, { username, password });
}

export const GET_PROFILE = 'GET_PROFILE';
export function getUserProfile (username) {
  return fetchJSON(`api/v1/profile/?user__username=${username}`, GET_PROFILE, withToken());
}

export const LOGOUT_USER = 'LOGOUT_USER';
export function logoutUser () {
  return { type: LOGOUT_USER };
}

export const GET_FIELD_REPORT = 'GET_FIELD_REPORT';
export function getFieldReportById (id) {
  return fetchJSON(`api/v1/field_report/${id}`, GET_FIELD_REPORT, withToken());
}

export const CREATE_FIELD_REPORT = 'CREATE_FIELD_REPORT';
export function createFieldReport (payload) {
  return postJSON('api/v1/field_report/', CREATE_FIELD_REPORT, payload, withToken());
}

export const GET_SURGE_ALERTS = 'GET_SURGE_ALERTS';
export function getSurgeAlerts (page = 1, filters = {}) {
  filters.limit = filters.limit || 10;
  filters.offset = filters.limit * (page - 1);
  const f = buildAPIQS(filters);

  return fetchJSON(`/api/v1/surge_alert/?${f}`, GET_SURGE_ALERTS, withToken());
}

export const GET_SUMSTATS = 'GET_SUMSTATS';
export function getSumstats () {
  const f = buildAPIQS({
    end_date__gt: DateTime.local().toISODate(),
    limit: 0
  });
  return fetchJSON(`api/v1/appeal/?${f}`, GET_SUMSTATS, withToken());
}

export const GET_EMERGENCIES_LIST = 'GET_EMERGENCIES_LIST';
export function getEmergenciesList () {
  const f = buildAPIQS({
    limit: 1
  });
  return fetchJSONRecursive(`api/v1/event/?${f}`, GET_EMERGENCIES_LIST, withToken());
}
