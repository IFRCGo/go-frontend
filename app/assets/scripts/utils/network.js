'use strict';
import * as url from 'url';
import * as localStorage from 'local-storage';
import { api } from '../config';

export function withToken (options = {}) {
  const user = localStorage.get('user');
  options.headers = options.headers || {};

  if (!user) {
    console.error('No login token found');
    return options;
  } else if (Date.parse(user.expires) <= Date.now()) {
    console.error('Token is expired');
    return options;
  }
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

export function fetchJSON (path, action, options) {
  return makeRequest(path, action, options);
}

export function postJSON (path, action, payload, options = {}) {
  options.headers = options.headers || {};
  options.headers['Content-Type'] = 'application/json';
  options.headers['Accept'] = 'application/json';
  options.method = 'POST';
  options.body = JSON.stringify(payload);
  return makeRequest(path, action, options);
}

export function fetchJSONRecursive (path, action, options) {
  options = options || {};
  return function (dispatch) {
    dispatch({ type: inflight(action) });

    // Recursively fetch all items.
    const fetcher = (path) => {
      return request(url.resolve(api, path), options)
        .then(res => {
          if (res.meta.next) {
            return fetcher(res.meta.next)
              .then(items => res.objects.concat(items));
          }
          return res.objects;
        });
    };

    fetcher(path)
      .then(items => {
        dispatch({ type: success(action), data: items, receivedAt: Date.now() });
      })
      .catch(error => {
        dispatch({ type: failed(action), error });
      });
  };
}

export function makeRequest (path, action, options) {
  options = options || {};
  return function (dispatch) {
    dispatch({ type: inflight(action) });
    request(url.resolve(api, path), options)
      .then(data => {
        dispatch({ type: success(action), data, receivedAt: Date.now() });
      })
      .catch(error => {
        dispatch({ type: failed(action), error });
      });
  };
}

export function request (url, options) {
  return fetch(url, options)
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
    });
}
