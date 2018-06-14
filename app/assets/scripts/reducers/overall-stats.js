'use strict';
import { combineReducers } from 'redux';
import _toNumber from 'lodash.tonumber';

import { getCentroid } from '../utils/country-centroids';
import { groupByDisasterType } from '../utils/utils';

const appealsListInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

// Query for all active appeals
function appealsList (state = appealsListInitialState, action) {
  switch (action.type) {
    case 'GET_APPEALS_LIST_INFLIGHT':
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case 'GET_APPEALS_LIST_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'GET_APPEALS_LIST_SUCCESS':
      const objs = action.data.results;
      const now = Date.now();

      // Aggregate number of DREFs, number of Appeals,
      // percent funding, total budget, and targeted population
      let struct = {
        activeDrefs: 0,
        activeAppeals: 0,
        totalAppeals: 0,
        budget: 0,
        appealsBudget: 0,
        appealsFunding: 0,
        targetPop: 0
      };
      struct = objs.reduce((acc, object) => {
        const endTime = new Date(object.end_date).getTime();
        const amountRequested = _toNumber(object.amount_requested);

        acc.targetPop += object.num_beneficiaries || 0;
        acc.budget += amountRequested;

        // Drefs.
        if (object.atype === 0) {
          if (endTime > now) {
            acc.activeDrefs++;
          }

        // Appeal.
        } else if (object.atype === 1 || object.atype === 2) {
          acc.totalAppeals++;
          if (endTime > now) {
            acc.activeAppeals++;
          }
          const amountFunded = _toNumber(object.amount_funded);
          acc.appealsBudget += amountRequested;
          acc.appealsFunding += amountFunded;
        }
        return acc;
      }, struct);

      // Emergencies Types.
      const emergenciesByType = groupByDisasterType(objs);

      // Features for the map.
      const geoJSON = {
        type: 'FeatureCollection',
        features: objs.reduce((acc, o) => {
          if (o.country) {
            return acc.concat({
              type: 'Feature',
              properties: {
                id: o.id,
                pageId: o.event || false,
                name: o.name,
                atype: o.atype,
                dtype: o.dtype.id,
                numBeneficiaries: o.num_beneficiaries,
                amountRequested: _toNumber(o.amount_requested),
                amountFunded: _toNumber(o.amount_funded)
              },
              geometry: {
                type: 'Point',
                coordinates: getCentroid(o.country.iso)
              }
            });
          }
          return acc;
        }, [])
      };

      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: {
          stats: struct,
          geoJSON,
          emergenciesByType
        }
      });
      break;
  }
  return state;
}

const aggregateInitialState = {
  // fetching: false,
  // fetched: false,
  // receivedAt: null,
  // data: {}
};

function aggregate (state = aggregateInitialState, action) {
  switch (action.type) {
    case 'GET_AGGREGATE_APPEALS_INFLIGHT':
      state = Object.assign({}, state, {
        [`${action.aggregationUnit}-${action.aggregationType}`]: {
          error: null,
          fetching: true,
          fetched: false
        }
      });
      break;
    case 'GET_AGGREGATE_APPEALS_FAILED':
      state = Object.assign({}, state, {
        [`${action.aggregationUnit}-${action.aggregationType}`]: {
          fetching: false,
          fetched: true,
          receivedAt: action.receivedAt,
          error: action.error
        }
      });
      break;
    case 'GET_AGGREGATE_APPEALS_SUCCESS':
      state = Object.assign({}, state, {
        [`${action.aggregationUnit}-${action.aggregationType}`]: {
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

// Combined export.
export default combineReducers({
  appealsList,
  aggregate
});
