'use strict';
import { fetchJSON, postJSON, withToken } from '../utils/network';

export const TOKEN = 'TOKEN';
export function getAuthToken (username, password) {
  return postJSON('get_auth_token', TOKEN, { username, password });
}

export const LOGOUT_USER = 'LOGOUT_USER';
export function logoutUser () {
  return { type: LOGOUT_USER };
}

export const GET_FIELD_REPORT = 'GET_FIELD_REPORT';
export function getFieldReportById (id) {
  return fetchJSON(`api/v1/field_report/${id}`, GET_FIELD_REPORT, withToken());
}
