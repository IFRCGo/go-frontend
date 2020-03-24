'use strict';
import _get from 'lodash.get';
import _groupBy from 'lodash.groupby';
import _toNumber from 'lodash.tonumber';
import _find from 'lodash.find';
import { DateTime } from 'luxon';

import { getCentroid } from './country-centroids';
import { disasterType } from './field-report-constants';
import { getDtypeMeta } from './get-dtype-meta';
import { whitelistDomains } from '../schemas/register';
import { appealTypes } from './../utils/appeal-type-constants';

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

export function getAppealString (appealType) {
  return get(appealTypes, appealType.toString());
}

export function unique (array) {
  return Array.from(new Set(array));
}

export function isLoggedIn (userState) {
  return !!get(userState, 'data.token');
}

// aggregate beneficiaries, requested, and funding for appeals
export function aggregateAppealStats (appeals) {
  let struct = {
    numBeneficiaries: 0,
    amountRequested: 0,
    amountFunded: 0
  };
  return appeals.reduce((acc, appeal) => {
    acc.numBeneficiaries += appeal.num_beneficiaries || 0;
    acc.amountRequested += _toNumber(appeal.amount_requested);
    acc.amountFunded += _toNumber(appeal.amount_funded);
    return acc;
  }, struct);
}

// returns a GeoJSON representation of a country's operations
export function aggregateCountryAppeals (appeals) {
  const grouped = _groupBy(appeals.filter(o => o.country), 'country.iso');
  return {
    type: 'FeatureCollection',
    features: Object.keys(grouped).map(countryIso => {
      const countryAppeals = grouped[countryIso];
      const stats = aggregateAppealStats(countryAppeals);
      const appealTypes = unique(countryAppeals.map(a => a.atype));
      return {
        type: 'Feature',
        properties: Object.assign(stats, {
          id: countryAppeals[0].country.id,
          name: countryAppeals[0].country.name,
          iso: countryAppeals[0].country.iso,
          appeals: countryAppeals,
          atype: appealTypes.length === 1 ? getAppealString(appealTypes[0]) : 'Mixed'
        }),
        geometry: {
          type: 'Point',
          coordinates: getCentroid(countryIso)
        }
      };
    })
  };
}

export function aggregatePartnerDeployments (deploymentGroups, filters = []) {
  // flatten
  const filterFn = filters.length ? obj => {
    for (let i = 0; i < filters.length; ++i) {
      if (_get(obj, filters[i].path) !== filters[i].value) {
        return false;
      }
    }
    return true;
  } : () => true;
  const deployments = deploymentGroups.reduce((acc, deployment) => {
    const results = deployment.district_deployed_to.map(district => ({
      district,
      activity: deployment.activity,
      parent: deployment.parent_society,
      start: deployment.start_date,
      end: deployment.end_date
    }));
    return acc.concat(results);
  }, []);

  const grouping = _groupBy(deployments.filter(filterFn), 'district.id');
  const areas = Object.keys(grouping).map(d => ({ id: d, deployments: grouping[d] }));
  const max = Math.max.apply(this, areas.map(d => d.deployments.length));

  const parentSocietyGroupings = _groupBy(deployments, 'parent.iso');
  const parentSocieties = Object.keys(parentSocietyGroupings)
    .map(d => ({ label: parentSocietyGroupings[d][0].parent.name, count: parentSocietyGroupings[d].length }))
    .sort((a, b) => a.count.length > b.count.length ? -1 : 1);

  const activityGroupings = _groupBy(deployments, 'activity.activity');
  const activities = Object.keys(activityGroupings)
    .map(d => ({ label: d, count: activityGroupings[d].length }))
    .sort((a, b) => a.count.length > b.count.length ? -1 : 1);

  return {
    areas,
    max,
    deployments,
    parentSocieties,
    activities
  };
}

// normalize ISO from a country vector tile
export function getCountryIsoFromVt (feature) {
  const { properties } = feature;
  const iso = get(feature, 'properties.ISO2', '').toLowerCase();
  if (!iso || (iso === '-99' && properties.ISO3 !== 'FRA' && properties.ISO3 !== 'NOR')) {
    return null;
  }
  return iso === '-99' ? properties.ISO3.toLowerCase().slice(0, 2) : iso;
}

export function groupByDisasterType (objs) {
  const emergenciesByType = _groupBy(objs, 'dtype.id');
  return Object.keys(emergenciesByType).map(key => {
    let meta = getDtypeMeta(key);
    if (!meta) return null;
    var replacedDType = emergenciesByType[key];
    replacedDType.forEach(record => {
      record.dtype = record.dtype.id;
    });
    return {
      id: _toNumber(key),
      name: meta.label,
      items: replacedDType
    };
  }).filter(Boolean).sort((a, b) => a.items.length < b.items.length ? 1 : -1);
}

export function mostRecentReport (reports) {
  if (!Array.isArray(reports)) return null;
  return reports.map(d => Object.assign({}, d, { _date: new Date(d['updated_at']) })).sort((a, b) => a._date < b._date ? 1 : -1)[0];
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
  week: () => DateTime.utc().minus({days: 7}).startOf('day').toISO(),
  month: () => DateTime.utc().minus({months: 1}).startOf('day').toISO(),
  year: () => DateTime.utc().minus({years: 1}).startOf('day').toISO()
};

export const dTypeOptions = [
  { value: 'all', label: 'All Types' },
  // Exclude the first item since it's a dropdown placeholder
  ...disasterType.slice(1)
];

export const appealStatusOptions = [
  { value: 'all', label: 'All' },
  { value: '0', label: 'Active' },
  { value: '1', label: 'Closed' },
  { value: '2', label: 'Frozen' },
  { value: '3', label: 'Archived' }
];

export function getRecordsByType (types, records) {
  const typeIds = types.data.results.map(t => t.id.toString());
  let recordsByType = typeIds.reduce((memo, typeId) => {
    memo[typeId] = {
      'title': _find(types.data.results, result => result.id === Number(typeId)).type,
      'typeId': typeId,
      'is_primary': _find(types.data.results, result => result.id === Number(typeId)).is_primary,
      'items': []
    };
    return memo;
  }, {});

  // sort records descending by created_at timestamp
  const recordsSorted = records.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });
  recordsSorted.forEach(record => {
    if (record.type) {
      const recordTypeId = record.type.id;
      if (record.is_pinned) {
        recordsByType[recordTypeId].items.splice(0, 0, record);
      } else {
        recordsByType[recordTypeId].items.push(record);
      }
    }
  });

  // Provides sorted list of records to display
  // Categories are sorted according to https://github.com/IFRCGo/go-frontend/issues/773#issuecomment-528883564
  // FIXME: Ideally, we would give the user a way to define this order in the backend and remove this logic.
  const orderedIds = [
    '5', // Situation Reports
    '2', // Key Surge Documents
    '6', // Mobilisation Tables
    '7', // Maps
    '1', // ERU Reports
    '3' // Information Products
  ];

  // group records based on primary and others.
  const recordsByPriority = _groupBy(Object.values(recordsByType), 'is_primary');

  // sort the primary records based on the order defined above.
  recordsByPriority['true'].sort((a, b) => {
    return orderedIds.indexOf(a.typeId) - orderedIds.indexOf(b.typeId);
  });

  // append the non primary records
  const sortedRecordsByType = recordsByPriority['true'].concat(recordsByPriority['false']);

  return sortedRecordsByType;
}
