import * as url from 'url';
import * as localStorage from 'local-storage';
import delay from 'delay';
import { api } from '#config';
import store from '#utils/store';
import cache from '#utils/cache';

/**
 * Adds authorization token to request headers.
 * @param  {Object} options Additional options for composition
 * @return {Object}         Options with the authorization header
 */
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
  options.headers['Authorization'] = `Token ${user.token}`;
  return options;
}

/**
 * Adds json content type headers and stringifies the payload.
 * @param  {payload} payload  Payload to stringify.
 * @param  {Object} options Additional options for composition
 * @return {Object}         Options with headers and payload
 */
export function withJSONRequest (payload, options = {}) {
  const currentLanguage = store.getState().lang.current;

  options.headers = options.headers || {};
  options.headers['Content-Type'] = 'application/json';
  options.headers['Accept'] = 'application/json';
  options.headers['Accept-Language'] = currentLanguage;
  options.body = JSON.stringify(payload);
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
  const currentLanguage = store.getState().lang.current;

  const newOptions = {
    ...options,

    headers: {
      ...options?.headers,
      'Accept-Language': currentLanguage,
    },
  };

  return makeRequest(path, action, newOptions, extraData);
}

/**
 * Get all the results of JSON resource.
 * Will continue to make request as long as there are more results.
 * @param  {string} path      Relative path to query. Has to be available from
 *                            the api.
 * @param  {string} action    Base action to dispatch.
 * @param  {Object} options   Options for the request.
 * @param  {Object} extraData Extra data to pass to the action.
 * @param  {number} stopAfter Stops after x requests. DEV parameter. TO REMOVE.
 * @return {func}             Dispatch function.
 */
export function fetchJSONRecursive (path, action, options, extraData, devStopAfter = Infinity) {
  options = options || {};
  return function (dispatch) {
    dispatch({ type: inflight(action) });

    // Recursively fetch all items.
    const fetcher = (path) => {
      return request(url.resolve(api, path), options)
        .then(res => {
          devStopAfter--;
          if (res.meta.next && devStopAfter > 0) {
            return fetcher(res.meta.next)
              .then(items => res.objects.concat(items));
          }
          return res.objects;
        });
    };

    fetcher(path)
      .then(items => {
        dispatch({ type: success(action), data: items, receivedAt: Date.now(), ...extraData });
      })
      .catch(error => {
        dispatch({ type: failed(action), error });
      });
  };
}

// Sends a delete request
export function deleteJSON (path, action, options, extraData) {
  const deleteOptions = {...options};

  deleteOptions.headers['Content-Type'] = 'application/json';
  deleteOptions.headers['Accept'] = 'application/json';
  deleteOptions.method = 'DELETE';

  return makeRequest(path, action, deleteOptions, extraData);
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
  options = withJSONRequest(payload, options);
  options.method = 'POST';
  options.headers['Accept-Language'] = 'en'; // POST only supports english
  return makeRequest(path, action, options, extraData);
}

/**
 * PUT a JSON resource
 * @param  {string} path      Relative path to query. Has to be available from
 *                            the api.
 * @param  {string} action    Base action to dispatch.
 * @param  {payload} payload  Payload to put.
 * @param  {Object} options   Options for the request.
 * @param  {Object} extraData Extra data to pass to the action.
 * @return {func}             Dispatch function.
 */
export function putJSON (path, action, payload, options, extraData) {
  options = withJSONRequest(payload, options);
  options.method = 'PUT';
  return makeRequest(path, action, options, extraData);
}

/**
 * PATCH a JSON resource
 * @param  {string} path      Relative path to query. Has to be available from
 *                            the api.
 * @param  {string} action    Base action to dispatch.
 * @param  {payload} payload  Payload to put.
 * @param  {Object} options   Options for the request.
 * @param  {Object} extraData Extra data to pass to the action.
 * @return {func}             Dispatch function.
 */
export function patchJSON (path, action, payload, options, extraData) {
  options = withJSONRequest(payload, options);
  options.method = 'PATCH';
  return makeRequest(path, action, options, extraData);
}

/**
 * Get a CSV resource
 * @param  {string} path      Relative path to query. Has to be available from
 *                            the api.
 * @param  {string} action    Base action to dispatch.
 * @param  {Object} options   Options for the request.
 * @return {func}             Dispatch function.
 */
export function fetchCSV (path, action, options, extraData = {}) {
  options = options || {};
  return function (dispatch) {
    dispatch({ type: inflight(action), ...extraData });
    const address = /http/.test(path) ? path : url.resolve(api, path);
    return fetch(address, options)
      .then(response => response.text())
      .then(data => dispatch({ type: success(action), data, receivedAt: Date.now(), ...extraData }))
      .catch(error => dispatch({ type: failed(action), error, ...extraData }));
  };
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

  let convertAuthenticationData = function (data, path) {
    if (path.includes('get_auth_token')) {
      data.firstName = data.first;
      data.lastName = data.last;

      delete data.first;
      delete data.last;
    }

    return data;
  };

  return function (dispatch) {
    dispatch({ type: inflight(action), ...extraData });
    const address = /http/.test(path) ? path : url.resolve(api, path);
    request(address, options)
      .then(data => {
        data = convertAuthenticationData(data, path);
        dispatch({ type: success(action), data, receivedAt: Date.now(), ...extraData });
      })
      .catch(error => {
        dispatch({ type: failed(action), error, ...extraData });
      });
  };
}

export function request (url, options) {

  const cacheKey = cache.getKey(url, options);
  console.log('key', cacheKey);

  // if data exists in cache, just return it and do not make any requests
  if (cache.isCacheable(url, options)) {
    const data = cache.getItem(cacheKey);
    console.log('got data', data);
    if (data) {
      return delay(100)
        .then(() => {
          console.log('resolving promise', data);
          return Promise.resolve(data);  
        });
    }
  } 

  return fetch(url, options)
    .then(response => {
      return response.text()
        .then(body => {
          var json;
          if (body) {
            try {
              json = JSON.parse(body);
            } catch (error) {
              console.log('JSON parse error', error, '\n', body);
              return Promise.reject({
                message: error.message,
                body
              });
            }
          }

          return response.status >= 400
            ? Promise.reject(json)
            : cache.setItem(cacheKey, json) && Promise.resolve(json);
        });
    }, error => {
      console.log('JSON fetch error', error);
      return Promise.reject({
        message: error.message
      });
    });
}
