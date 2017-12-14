'use strict';
import { combineReducers } from 'redux';

import { getCentroid } from '../utils/country-centroids';
import { get, groupByDisasterType } from '../utils/utils';

const listInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function list (state = listInitialState, action) {
  switch (action.type) {
    case 'GET_EMERGENCIES_LIST_INFLIGHT':
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case 'GET_EMERGENCIES_LIST_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'GET_EMERGENCIES_LIST_SUCCESS':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: action.data
      });
      break;
  }
  return state;
}

const lastMonthInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function lastMonth (state = lastMonthInitialState, action) {
  switch (action.type) {
    case 'GET_LAST_MO_EMERGENCIES_INFLIGHT':
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case 'GET_LAST_MO_EMERGENCIES_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'GET_LAST_MO_EMERGENCIES_SUCCESS':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: createStoreFromRaw(action.data)
      });
      break;
  }
  return state;
}

function createStoreFromRaw (raw) {
  const count = raw.meta.total_count;
  const records = get(raw, 'objects', []);
  const numAffected = records.reduce((acc, next) => acc + get(next, 'num_affected', 0), 0);
  const emergenciesByType = groupByDisasterType(records);
  let totalAppeals = 0;
  let totalAppealsFunding = 0;
  records.forEach(record => {
    get(record, 'appeals', []).forEach(appeal => {
      totalAppeals += Number(get(appeal, 'amount_requested', 0));
      totalAppealsFunding += Number(get(appeal, 'amount_funded', 0));
    });
  });

  // since emergencies can have many countries, group by countries
  // ie:
  // emergency1: { countries: [ country1, country2 ] }
  // >>>
  // { country1: { records: [ emergency1 ] }, country2: { records: [ emergency1 ] } }
  const countries = {};
  records.forEach(record => {
    get(record, 'countries', []).forEach(c => {
      countries[c.iso] = countries[c.iso] || { country: c, records: [] };
      countries[c.iso].records.push(record);
    });
  });

  const geoJSON = {
    type: 'FeatureCollection',
    features: Object.keys(countries).map(iso => {
      const { country, records } = countries[iso];

      const properties = {
        id: country.id,
        name: country.name,

        totalEmergencies: 0,
        withResponse: 0,
        withoutResponse: 0,
        numAffected: 0
      };

      records.forEach(o => {
        if (Array.isArray(o.appeals) && o.appeals.length) {
          properties.withResponse += 1;
        } else {
          properties.withoutResponse += 1;
        }
        properties.totalEmergencies += 1;
        properties.numAffected += Number(get(o, 'num_affected', 0));
      });

      return {
        type: 'Feature',
        properties,
        geometry: {
          type: 'Point',
          coordinates: getCentroid(iso)
        }
      };
    })
  };

  return {
    numAffected,
    totalAppeals,
    totalAppealsFunding,
    count,
    emergenciesByType,
    records,
    geoJSON
  };
}

const aggregateInitialState = {};
function aggregate (state = aggregateInitialState, action) {
  switch (action.type) {
    case 'GET_AGGREGATE_EMERGENCIES_INFLIGHT':
      state = Object.assign({}, state, {
        [action.aggregationUnit]: {
          error: null,
          fetching: true,
          fetched: false
        }
      });
      break;
    case 'GET_AGGREGATE_EMERGENCIES_FAILED':
      state = Object.assign({}, state, {
        [action.aggregationUnit]: {
          fetching: false,
          fetched: true,
          receivedAt: action.receivedAt,
          error: action.error
        }
      });
      break;
    case 'GET_AGGREGATE_EMERGENCIES_SUCCESS':
      state = Object.assign({}, state, {
        [action.aggregationUnit]: {
          fetching: false,
          fetched: true,
          receivedAt: action.receivedAt,
          data: action.data.aggregate.reverse()
        }
      });
      break;
  }
  return state;
}

export default combineReducers({
  list,
  lastMonth,
  aggregate
});
