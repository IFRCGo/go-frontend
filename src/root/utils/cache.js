
function getItem(key) {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  const value = JSON.parse(item);
  const now = Number(new Date());

  // if token has expired, return null
  if (now - value.timestamp > value.expiry) {
    return null;
  }
  return item.data;
}

function setItem(key, data, expiry=600000) {
  const timestamp = Number(new Date());
  const valueString = JSON.stringify({
    timestamp,
    expiry,
    data
  });
  localStorage.setItem(key, valueString);
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