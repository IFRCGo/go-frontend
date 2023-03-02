import React, { useState } from 'react';
import _get from 'lodash.get';
import _groupBy from 'lodash.groupby';
import _toNumber from 'lodash.tonumber';
import isUndefined from 'lodash.isundefined';
import _find from 'lodash.find';
import _filter from 'lodash.filter';
import * as EmailValidator from 'email-validator';
import { DateTime } from 'luxon';
import {
  isNotDefined,
  isFalsyString,
} from '@togglecorp/fujs';

import Translate from '#components/Translate';
import { request } from '#utils/network';
import { api } from '#config';
import { appealTypes } from '#utils/appeal-type-constants';
import { getCountryMeta } from '#utils/get-country-meta';

// lodash.get will only return the defaultValue when
// the path is undefined. We want to also catch null and ''
export function get(object, path, defaultValue) {
  const value = _get(object, path, null);
  if (value === null || value === '') {
    return defaultValue || null;
  } else {
    return value;
  }
}

export function getAppealString(appealType) {
  return get(appealTypes, appealType.toString());
}

export function unique(array) {
  return Array.from(new Set(array));
}

export function isLoggedIn(userState) {
  return !!get(userState, 'data.token');
}

// aggregate beneficiaries, requested, and funding for appeals
export function aggregateAppealStats(appeals) {
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
export function aggregateCountryAppeals(appeals, countries) {
  const grouped = _groupBy(appeals.filter(o => o.country), 'country.iso');
  const geojson = {
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
          coordinates: getCountryMeta(countryAppeals[0].country.id, countries).centroid?.coordinates || [0, 0]
        }
      };
    })
  };
  return (geojson);
}

export function aggregatePartnerDeployments(deploymentGroups, filters = []) {
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
export function getCountryIsoFromVt(feature) {
  const { properties } = feature;
  const iso = get(feature, 'properties.ISO2', '').toLowerCase();
  if (!iso || (iso === '-99' && properties.ISO3 !== 'FRA' && properties.ISO3 !== 'NOR')) {
    return null;
  }
  return iso === '-99' ? properties.ISO3.toLowerCase().slice(0, 2) : iso;
}

export function groupByDisasterType(objs) {
  const emergenciesByType = _groupBy(objs, 'dtype.id');
  return Object.keys(emergenciesByType).map(key => {
    const meta = emergenciesByType[key][0]?.dtype;
    if (!meta) return null;
    var replacedDType = emergenciesByType[key];
    // This is needed for ex. main-map to work... weird logic
    replacedDType.forEach(record => {
      record.dtype = record.dtype.id;
    });
    return {
      id: _toNumber(key),
      name: meta.name,
      items: replacedDType
    };
  }).filter(Boolean).sort((a, b) => a.items.length < b.items.length ? 1 : -1);
}

export function mostRecentReport(reports) {
  if (!Array.isArray(reports)) return null;
  return reports.map(d => Object.assign({}, d, { _date: new Date(d['updated_at']) })).sort((a, b) => a._date < b._date ? 1 : -1)[0];
}

export function isValidEmail(email) {
  return EmailValidator.validate(email);
}

export function isWhitelistedEmail(email, whitelistedDomains) {
  if (!isValidEmail(email)) {
    return false;
  }

  // Looking for an EXACT match in the domain whitelist
  // (it finds even if UPPERCASE letters were used)
  const userMailDomain = email.substring(email.lastIndexOf("@") + 1);
  return whitelistedDomains.find(dom => dom === userMailDomain);
}

export function finishedFetch(curr, next, prop) {
  return _get(curr, `${prop}.fetching`, false) && !_get(next, `${prop}.fetching`, false);
}

export function objValues(obj) {
  return Object.keys(obj).map(k => obj[k]);
}

export const dateOptions = [
  { value: 'all', label: 'Anytime' },
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: 'year', label: 'Last year' }
];

export const datesAgo = {
  week: () => DateTime.utc().minus({ days: 7 }).startOf('day').toISO(),
  month: () => DateTime.utc().minus({ months: 1 }).startOf('day').toISO(),
  year: () => DateTime.utc().minus({ years: 1 }).startOf('day').toISO()
};

// TODO: use strings
export const appealStatusOptions = [
  { value: 'all', label: 'All' },
  { value: '0', label: 'Active' },
  { value: '1', label: 'Closed' },
  { value: '2', label: 'Frozen' },
  { value: '3', label: 'Archived' }
];

export function getRecordsByType(types, records) {
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

  const pinnedRecordsByType = {};
  recordsSorted.forEach(record => {
    if (record.type) {
      const recordTypeId = record.type.id;
      if (record.is_pinned) {
        if (!pinnedRecordsByType.hasOwnProperty(recordTypeId)) {
          pinnedRecordsByType[recordTypeId] = [];
        }
        pinnedRecordsByType[recordTypeId].push(record);
      } else {
        recordsByType[recordTypeId].items.push(record);
      }
    }
  });

  // sort the pinned records descending by created_at timestamp
  const pinnedRecordTypeIds = Object.keys(pinnedRecordsByType);
  if (pinnedRecordTypeIds) {
    pinnedRecordTypeIds.forEach(recordTypeId => {
      let pinnedItems = pinnedRecordsByType[recordTypeId].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      recordsByType[recordTypeId].items = pinnedItems.concat(recordsByType[recordTypeId].items);
    });
  }

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
    const aIndex = orderedIds.indexOf(a.typeId);
    const bIndex = orderedIds.indexOf(b.typeId);
    if (aIndex >= 0 && bIndex >= 0) {
      return orderedIds.indexOf(a.typeId) - orderedIds.indexOf(b.typeId);
    }
    return 0;
  });

  // // Filter out non-primary types that doesn't have any records
  recordsByPriority['false'] = _filter(recordsByPriority['false'], (records) => {
    if (records.items.length) {
      return records;
    }
  });

  // append the non primary records
  let sortedRecordsByType;
  if (recordsByPriority['false']) {
    sortedRecordsByType = recordsByPriority['true'].concat(recordsByPriority['false']);
  } else {
    sortedRecordsByType = recordsByPriority['true'];
  }

  return sortedRecordsByType;
}

export const convertJsonToCsv = (data, columnDelimiter = ',', lineDelimiter = '\n', emptyValue = '') => {
  if (!data || data.length <= 0) {
    return undefined;
  }

  let result = '';

  data.forEach((items) => {
    result += items.map((str) => {
      if (isNotDefined(str)) {
        return emptyValue;
      }
      const val = String(str);
      if (val.includes(columnDelimiter)) {
        return `"${val}"`;
      }
      return val;
    }).join(columnDelimiter);
    result += lineDelimiter;
  });

  return result;
};

export const compareString = (a, b) => a.label?.localeCompare(b.label);

// Formats a luxon DateTime object to:
// dd/mm/yyyy
export const formatDateSlashes = (datetime) => {
  return `${datetime.day}/${datetime.month}/${datetime.year}`;
};

export const formatDateMonth = (datetimeStr) => {
  const dt = DateTime.fromISO(datetimeStr);
  return `${dt.monthShort} ${dt.day}`;
};

export const getYear = (datetimeStr) => {
  const dt = DateTime.fromISO(datetimeStr);
  return dt.year;
};

export function getSelectInputNoOptionsMessage(options) {
  if (isFalsyString(options?.inputValue)) {
    return <Translate stringId="searchSelectTypeToSearch" />;
  }

  return <Translate stringId="searchSelectNoOptionsAvailable" />;
}

function getUriForType(type, id, data) {
  switch (type) {
    case 'region':
      return '/regions/' + id;
    case 'country':
      return '/countries/' + id;
    case 'report':
      return '/reports/' + id;
    case 'event':
      return '/emergencies/' + id;
    case 'appeal':
      return data.event_id ? '/emergencies/' + data.event_id : '/appeals/all?record=' + id;
    default:
      return '/uhoh';
  }
}

// 1234 => 7968, so that this linear, comparable order will have:
//  2IFRC                      9
//  4IFRC_NS                   8
//  1MEMBERSHIP (logged in)    7
//  3PUBLIC                    6
function line(p) {
  switch (parseInt(p)) {
    case NaN:
      return 6;
    case 1:
      return 7;
    case 2:
      return 9;
    default:
      return p + p;

  }
}

function nume(p) { // numeric (and linear) representation of orgType
  switch (p) {
    case 'OTHR':
      return 7;
    case 'NTLS':
    case 'DLGN':
      return 8;
    case 'SCRT':
    case 'ICRC':
    case '*': // superuser
      return 9;
    default:
      return 6;
  }
}

// export async function getElasticSearchOptions(input, orgType, callback) {
//   if (!input) {
//     callback([]);
//   }

//   const response  = await request(`${api}api/v1/search/?keyword=${input}`).then(d=> d);
//   console.info("response data",response.countries.map((i) => i.name));
//   // callback(response);
// }

/*

export function getElasticSearchOptions(input, orgType, ns, callback) {
  if (!input) {
    callback([]);
  }

  const response  =   request(`${api}api/v1/search/?keyword=${input}`).then(d=> {
    console.log("list all", d);
  });

  console.log("response ",response);

    request(`${api}api/v1/search/?keyword=${input}`)
    .then(data => {
      console.info('data', data.countries);
      const options = data?.map(o => {
        const d = o._source;
        // for DEBUG: console.log('user ns, orgType | object ns, visibl.Raw', [ns, orgType, '|', d.ns, d.visibility]);
        // for DEBUG: console.log('visibility should be <= permission_level',[line(d.visibility), '<=', nume(orgType)]);
        // If the linearized visibility value > linearized value of organization type, not allowed to see that:
        if (line(d.visibility) > nume(orgType)) { return false; }
        // If the organization ~ NS === 8 === linearized visibility, and ns (list) is given in the object, we accept only our ns in the array:
        if (nume(orgType) === 8 && line(d.visibility) === 8 && d.ns !== null) {
          if (ns === undefined || ns === null || !d.ns.split(" ").includes(ns.toString())) {
            return false;
          }
        }
        const value = getUriForType(d.type, d.id, d);
        const date = d.date ? ` (${isoDate(d.date)})` : '';
        const label = `${u(d.type)}: ${d.name}${date}`;

        return {
          value,
          label
        };
      }).filter(Boolean);

      callback(options);
    });
}
*/

export function getFileName(suffix, extension = 'csv') {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  return `${suffix}-${year}-${month}-${day}-${h}-${m}-${s}.${extension}`;
}

export const getSelectInputValue = (value, options) => {
  if (isUndefined(value)) {
    return undefined;
  }

  return options.find(d => String(d.value) === String(value));
};

/**
 * 
 * @param {String} singular 
 * @param {String} plural 
 * @param {Number} number 
 * @returns {String} - either singular or plural based on number
 */
export function plural(singular, plural, number) {
  return number === 1 ? singular : plural;
}

/**
 * Get duration as a human readable string
 * 
 * @param {DateTime} start - Start date as a luxon DateTime object
 * @param {DateTime} end - End date as a luxon DateTime object
 * @returns {String} - String - eg. "4 months"
 */
export function getDuration(start, end) {
  if (start.invalid || end.invalid) {
    return '';
  }
  const diff = end.diff(start, [
    'months',
    'days'
  ]);

  let months = diff.months ? diff.months : 0;
  let days = diff.days ? diff.days : 0;

  // Normalize to months when days are more than 25 or less than 5
  if (days > 25) {
    months = months + 1;
    days = 0;
  } else if (days < 5 && months > 0) {
    days = 0;
  } else {
    days = Math.round(diff.days);
  }

  const daysString = plural('day', 'days', days);
  const monthsString = plural('month', 'months', months);

  if (months === 0) {
    return `${days} ${daysString}`;
  }

  if (days === 0) {
    return `${months} ${monthsString}`;
  }

  return `${months} ${monthsString} ${days} ${daysString}`;
}

/**
 * Gets Keywords from Molnix tag objects,
 * ignoring certain keywords based on rules
 * 
 * @param {Array<Object>} molnixTags - molnix tag objects
 * @returns {String} Comma separated keywords
 */
export function getMolnixKeywords(molnixTags) {
  const TAGS_TO_IGNORE = [
    'Nosuitable',
    'NotSurge',
    'OpsChange'
  ];
  const filtered = molnixTags.filter(tag => {
    if (tag.name.startsWith('OP-')) {
      return false;
    }
    if (TAGS_TO_IGNORE.indexOf(tag) !== -1) {
      return false;
    }
    return true;
  });
  return filtered.map(tag => tag.name).join(', ');
}
