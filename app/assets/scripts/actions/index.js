'use strict';
import { fetchJSON, withToken } from '../utils/network';

export const TOKEN = 'TOKEN';
export function getAuthToken (username, password) {
  return fetchJSON('get_auth_token', TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
}

}

export const GET_FIELD_REPORT = 'GET_FIELD_REPORT';
export function getFieldReportById (id) {
  return fetchJSON(`api/v1/field_report/${id}`, GET_FIELD_REPORT, withToken());
}
