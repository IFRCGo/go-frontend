'use strict';
import * as url from 'url';
import * as localStorage from 'local-storage';
import { api } from '../config';

/**
 * Adds authorization token to request headers.
 * @param  {Object} options Additional options for composition
 * @return {Object}         Options with the authorization header
 */
export function withToken (options = {}) {
  const user = localStorage.get('user');
  if (!user) {
    throw new Error('No login token found');
  } else if (Date.parse(user.expires) <= Date.now()) {
    throw new Error('Token is expired');
  }
  options.headers = options.headers || {};
  options.headers['Authorization'] = `ApiKey ${user.username}:${user.token}`;
  return options;
}

/**
 * Create Inflight action
 * @param  {string} action  Base action.
 * @return {string}         Inflight action
 */
function inflight (action) {
  return action + '_INFLIGHT';
}

/**
 * Create Success action
 * @param  {string} action  Base action.
 * @return {string}         Success action
 */
function success (action) {
  return action + '_SUCCESS';
}

/**
 * Create Failed action
 * @param  {string} action  Base action.
 * @return {string}         Failed action
 */
function failed (action) {
  return action + '_FAILED';
}

/**
 * Get a JSON resource
 * @param  {string} path      Relative path to query. Has to be available from
 *                            the api.
 * @param  {string} action    Base action to dispatch.
 * @param  {Object} options   Options for the request.
 * @param  {Object} extraData Extra data to pass to the action.
 * @return {func}             Dispatch function.
 */
export function fetchJSON (path, action, options, extraData) {
  return makeRequest(path, action, options, extraData);
}

/**
 * Post a JSON resource
 * @param  {string} path      Relative path to query. Has to be available from
 *                            the api.
 * @param  {string} action    Base action to dispatch.
 * @param  {payload} payload  Payload to post.
 * @param  {Object} options   Options for the request.
 * @param  {Object} extraData Extra data to pass to the action.
 * @return {func}             Dispatch function.
 */
export function postJSON (path, action, payload, options, extraData) {
  options = options || {};
  options.headers = options.headers || {};
  options.headers['Content-Type'] = 'application/json';
  options.headers['Accept'] = 'application/json';
  options.method = 'POST';
  options.body = JSON.stringify(payload);
  return makeRequest(path, action, options, extraData);
}

/**
 * Make a HTTP request
 * @param  {string} path      Relative path to query. Has to be available from
 *                            the api.
 * @param  {string} action    Base action to dispatch.
 * @param  {Object} options   Options for the request.
 * @param  {Object} extraData Extra data to pass to the action.
 * @return {func}             Dispatch function.
 */
export function makeRequest (path, action, options, extraData = {}) {
  options = options || {};
  return function (dispatch) {
    dispatch({ type: inflight(action), ...extraData });
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
        dispatch({ type: success(action), data, receivedAt: Date.now(), ...extraData });
      })
      .catch(error => {
        dispatch({ type: failed(action), error, ...extraData });
      });
  };
}
