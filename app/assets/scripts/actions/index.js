'use strict';
import {
  fetchJSON,
  withToken,
  createResource
} from '../utils/network';

export const TOKEN = 'TOKEN';
export function getAuthToken (username, password) {
  return fetchJSON(null, 'get_auth_token', TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
}

export const LOGOUT_USER = 'LOGOUT_USER';
export function logoutUser () {
  return { type: LOGOUT_USER };
}

export const FIELD_REPORT_SCHEMA = 'FIELD_REPORT_SCHEMA';
export function getFieldReportSchema () {
  return fetchJSON(null, 'api/v1/field_report/schema/', FIELD_REPORT_SCHEMA, withToken());
}

export const GET_FIELD_REPORT = 'GET_FIELD_REPORT';
export function getFieldReportById (id) {
  return fetchJSON(id, `api/v1/field_report/${id}`, GET_FIELD_REPORT, withToken());
}

export const CREATE_FIELD_REPORT = 'CREATE_FIELD_REPORT';
export function createFieldReport (payload) {
  return createResource('api/v1/field_report/', CREATE_FIELD_REPORT, payload, withToken());
}
