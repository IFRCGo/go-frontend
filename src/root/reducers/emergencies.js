import { combineReducers } from 'redux';

import { getCentroid } from '#utils/country-centroids';
import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { get, groupByDisasterType, mostRecentReport } from '#utils/utils';

const listInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function list (state = listInitialState, action) {
  switch (action.type) {
    case 'GET_EMERGENCIES_LIST_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_EMERGENCIES_LIST_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_EMERGENCIES_LIST_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

const featuredInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function featured (state = featuredInitialState, action) {
  switch (action.type) {
    case 'GET_FEATURED_EMERGENCIES_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_FEATURED_EMERGENCIES_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_FEATURED_EMERGENCIES_SUCCESS':
      state = stateSuccess(state, action);
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
  const count = raw.count;
  const records = get(raw, 'results', []);
  const emergenciesByType = groupByDisasterType(records);
  let totalAppeals = 0;
  let totalAppealsFunding = 0;
  let numAffected = records.reduce((acc, next) => acc + get(next, 'num_affected', 0), 0);
  records.forEach(record => {
    let appealNumAffected = 0;
    get(record, 'appeals', []).forEach(appeal => {
      totalAppeals += Number(get(appeal, 'amount_requested', 0));
      totalAppealsFunding += Number(get(appeal, 'amount_funded', 0));
      appealNumAffected += Number(get(appeal, 'num_affected', 0));
    });
    // If there is no (non-zero) num_affected field in appeal, then we check the most recent field_report belonging to it:
    numAffected += (appealNumAffected > 0 ? appealNumAffected : Number(get(mostRecentReport(record.field_reports), 'num_affected', 0)));
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

      var properties = {
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

      // determine response status
      const { totalEmergencies, withResponse, withoutResponse } = properties;
      properties.responseStatus = !totalEmergencies ? null
        : withResponse === totalEmergencies ? 'total'
          : withoutResponse === totalEmergencies ? 'none'
            : 'mixed';

      return {
        type: 'Feature',
        properties,
        geometry: {
          type: 'Point',
          coordinates: getCentroid(country.iso)
        }
      };
    }).filter(Boolean)
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
          data: action.data.aggregate
        }
      });
      break;
  }
  return state;
}

const emergencyDeploymentsInitialState = {};
function emergencyDeployments (state = emergencyDeploymentsInitialState, action) {
  switch (action.type) {
    case 'GET_FEATURED_EMERGENCIES_DEPLOYMENTS_SUCCESS':
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

export default combineReducers({
  list,
  featured,
  emergencyDeployments,
  lastMonth,
  aggregate
});
