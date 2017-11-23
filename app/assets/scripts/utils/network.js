'use strict';
import * as url from 'url';
import * as localStorage from 'local-storage';
import { api } from '../config';

export function withToken (options) {
  const user = localStorage.get('user');
  if (!user) {
    throw new Error('No login token found');
  } else if (Date.parse(user.expires) <= Date.now()) {
    throw new Error('Token is expired');
  }
  options = options || {};
  options.headers = options.headers || {};
  options.headers['Authorization'] = `ApiKey ${user.username}:${user.token}`;
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

export function fetchJSON (...args) {
  return makeRequest(...args);
}

export function createResource (path, action, payload, options) {
  options = options || {};
  options.headers = options.headers || {};
  options.headers['Content-Type'] = 'application/json';
  options.headers['Accept'] = 'application/json';
  options.method = 'POST';
  options.body = JSON.stringify(payload);
  return makeRequest(null, path, action, options);
}

function makeRequest (id, path, action, options) {
  options = options || {};
  return function (dispatch) {
    dispatch({ type: inflight(action), id });
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
        dispatch({ type: success(action), data, receivedAt: Date.now(), id });
      })
      .catch(error => {
        dispatch({ type: failed(action), error, id });
      });
  };
}
