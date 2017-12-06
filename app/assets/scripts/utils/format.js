'use strict';
import { get } from './utils';

export const nope = '--';
export const na = 'N/A';
export const invalid = 'Invalid';

// Ie. given 12345, return '12 345'
export const commaSeparatedNumber = (x) => {
  // isNaN(null) === true :*(
  if (isNaN(x) || (!x && x !== 0)) {
    return nope;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Ie. given 'MadDogIndustries', return 'Mad Dog Industries'
export const separateUppercaseWords = (x) => {
  if (typeof x !== 'string') {
    return nope;
  }
  return x.replace(/([A-Z])/g, ' $1').trim();
};

// Ie. given 'SCRT', return 'Secretariat'.
const organizationCodeToDisplay = {
  'NTLS': 'National Society',
  'DLGN': 'Delegation',
  'SCRT': 'Secretariat',
  'ICRC': 'ICRC'
};
export const organizationType = (code) => organizationCodeToDisplay[code] || invalid;

// Ie. given 'user.username', return 'username'.
export const getPropertyFromPath = (path) => {
  const parts = path.split('.');
  return parts[parts.length - 1];
};

// Ie. given 'user.username', return 'Username'.
// This will console.warn if a match isn't found.
const apiPropertyToDisplay = {
  'username': 'Username',
  'email': 'Email',
  'first_name': 'First Name',
  'last_name': 'Last Name',
  'city': 'City',
  'org': 'Organization',
  'org_type': 'Organization Type',
  'department': 'Department',
  'position': 'Position',
  'phone_number': 'Phone Number'
};
export const apiPropertyDisplay = (propOrPath) => {
  const propertyName = getPropertyFromPath(propOrPath);
  const display = apiPropertyToDisplay[propertyName];
  if (!display) {
    console.warn('No display found for', propertyName);
    return propertyName;
  }
  return display;
};

// Ie. given ('org', { org: 'NATL' }) return 'National Society'.
const apiPropertyFormatters = {
  'org_type': organizationType
};
export const apiPropertyValue = (propOrPath, object) => {
  const value = get(object, propOrPath);
  if (typeof value === 'undefined') {
    return nope;
  }
  const propertyName = getPropertyFromPath(propOrPath);
  const formatter = apiPropertyFormatters[propertyName];
  if (!formatter) {
    return value;
  }
  return formatter(value);
};

export const drefDefinition = {
  1: 'Requested',
  2: 'Planned',
  3: 'Deployed'
};

export const appealDefinition = {
  1: 'Requested',
  2: 'Planned',
  3: 'Active'
};

export const bulletinDefinition = {
  1: 'Requested',
  2: 'Planned',
  3: 'Published'
};

export const deployDefinition = {
  1: 'Requested',
  2: 'Planned',
  3: 'Deployed'
};

export const getResponseStatus = (data, dataPath) => {
  const status = get(data, dataPath, null);
  if (status === null || status === 0) { return null; }
  switch (getPropertyFromPath(dataPath)) {
    case 'dref':
      return drefDefinition[status];
    case 'appeal':
      return appealDefinition[status];
    case 'bulletin':
      return bulletinDefinition[status];
    case 'rdrt':
    case 'fact':
    case 'ifrc_staff':
    default:
      return deployDefinition[status];
  }
};
