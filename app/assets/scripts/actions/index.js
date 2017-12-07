'use strict';
import { fetchJSON, postJSON, withToken } from '../utils/network';

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

export const UPDATE_SUBSCRIPTIONS = 'UPDATE_SUBSCRIPTIONS';
export function updateSubscriptions (payload) {
  return postJSON('notifications/', UPDATE_SUBSCRIPTIONS, payload, withToken());
}
