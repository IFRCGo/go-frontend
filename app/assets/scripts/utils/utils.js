'use strict';
import _get from 'lodash.get';
import _groupBy from 'lodash.groupby';
import _toNumber from 'lodash.tonumber';
import { DateTime } from 'luxon';

import { na } from './format';
import { disasterType } from './field-report-constants';
import { whitelistDomains } from '../schemas/register';

// lodash.get will only return the defaultValue when
// the path is undefined. We want to also catch null and ''
export function get (object, path, defaultValue) {
  const value = _get(object, path, null);
  if (value === null || value === '') {
    return defaultValue || null;
  } else {
    return value;
  }
}

export function groupByDisasterType (objs) {
  const emergenciesByType = _groupBy(objs, 'dtype.id');
  return Object.keys(emergenciesByType).map(key => {
    return {
      id: _toNumber(key),
      name: get(emergenciesByType[key][0], 'dtype.name', na),
      items: emergenciesByType[key]
    };
  }).sort((a, b) => a.items.length < b.items.length);
}

export function isValidEmail (email) {
  // https://stackoverflow.com/a/1373724
  // The official standard is known as RFC 2822. It describes the syntax that valid email addresses must adhere to. You can (but you shouldn't — read on) implement it with this regular expression:

  // (?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])

  // (...) We get a more practical implementation of RFC 2822 if we omit the syntax using double quotes and square brackets. It will still match 99.99% of all email addresses in actual use today.

  // [a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?

  // A further change you could make is to allow any two-letter country code top level domain, and only specific generic top level domains. This regex filters dummy email addresses like asdf@adsf.adsf. You will need to update it as new top-level domains are added.

  // [a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b

  // So even when following official standards, there are still trade-offs to be made. Don't blindly copy regular expressions from online libraries or discussion forums. Always test them on your own data and with your own applications.
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email);
}

export function isWhitelistedEmail (email) {
  return isValidEmail(email) && whitelistDomains.find(o => email.indexOf(`@${o}`) !== -1);
}

export function finishedFetch (curr, next, prop) {
  return _get(curr, `${prop}.fetching`, false) && !_get(next, `${prop}.fetching`, false);
}

export function objValues (obj) {
  return Object.keys(obj).map(k => obj[k]);
}

export const dateOptions = [
  { value: 'all', label: 'Anytime' },
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: 'year', label: 'Last year' }
];

export const datesAgo = {
  week: () => DateTime.local().minus({days: 7}).startOf('day').toISODate(),
  month: () => DateTime.local().minus({months: 1}).startOf('day').toISODate(),
  year: () => DateTime.local().minus({years: 1}).startOf('day').toISODate()
};

export const dTypeOptions = [
  { value: 'all', label: 'All Types' },
  // Exclude the first item since it's a dropdown placeholder
  ...disasterType.slice(1)
];
