import * as localStorage from 'local-storage';

function getItem(key) {
  const item = localStorage.get(key);
  if (!item) {
    return null;
  }
  const value = JSON.parse(item);
  const now = Number(new Date());
  console.log('value', value);
  // if token has expired, return null
  if (now - value.timestamp > value.expiry) {
    console.log('cache expired');
    return null;
  }
  return value.data;
}

function setItem(key, data, expiry=600000) {
  console.log('setting item', key, data);
  const timestamp = Number(new Date());
  const valueString = JSON.stringify({
    timestamp,
    expiry,
    data
  });
  localStorage.set(key, valueString);
}

function getKey(url, options) {
  return `${url}${JSON.stringify(options)}`;
}

function isCacheable(url, options) {
  return !options.method || options.method === 'GET';
}

export default {
  getItem,
  setItem,
  getKey,
  isCacheable
};