import * as url from 'url';
import * as localStorage from 'local-storage';
import { api } from '../config';

export const TOKEN = 'TOKEN';
export function getAuthToken (username, password) {
  return get('get_auth_token', TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
}

export const GET_FIELD_REPORT = 'GET_FIELD_REPORT';
export function getFieldReportById (id) {
  return get(`api/v1/field_report/${id}`, GET_FIELD_REPORT, withToken());
}

function withToken (options) {
  const token = localStorage.get('token');
  if (!token) {
    throw new Error('No login token found');
  } else if (Date.parse(token.expires) <= Date.now()) {
    throw new Error('Token is expired');
  }
  options = options || {};
  options.headers = options.headers || {};
  options.headers['Authorization'] = token.Authorization;
  return options;
}

function inflight (action) {
  return action + '_INFLIGHT';
}

function success (action) {
  return action + '_SUCCESS';
}

function failed (action) {
  return action + '_FAILED';
}

function get (path, action, options) {
  options = options || {};
  return function (dispatch) {
    dispatch({ type: inflight(action) });
    fetch(url.resolve(api, path), options)
      .then(response => {
        return response.text()
          .then(body => {
            var json;
            try {
              json = JSON.parse(body);
            } catch (error) {
              console.log('JSON parse error', error, '\n', body);
              return Promise.reject({
                message: error.message,
                body
              });
            }

            return response.status >= 400
              ? Promise.reject(json)
              : Promise.resolve(json);
          });
      }, error => {
        console.log('JSON fetch error', error);
        return Promise.reject({
          message: error.message
        });
      })
      .then(data => {
        dispatch({ type: success(action), data });
      })
      .catch(error => {
        dispatch({ type: failed(action), error });
      });
  };
}
