'use strict';
import { combineReducers } from 'redux';
import _toNumber from 'lodash.tonumber';
import _groupBy from 'lodash.groupby';

const appealsListInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

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
      // Statistics.
      const objs = action.data;
      const now = Date.now();
      let struct = {
        activeDrefs: 0,
        activeAppeals: 0,
        totalAppeals: 0,
        fundedAppeals: 0,
        budget: 0,
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
          if (amountFunded >= amountRequested) {
            acc.fundedAppeals++;
          }
        }
        return acc;
      }, struct);

      // Features for the map.
      const geoJSON = {
        type: 'FeatureCollection',
        features: objs.reduce((acc, o) => {
          if (o.country) {
            return acc.concat({
              type: 'Feature',
              properties: {
                id: o.id,
                name: o.event.name,
                atype: o.atype,
                numBeneficiaries: o.num_beneficiaries,
                amountRequested: _toNumber(o.amount_requested)
              },
              geometry: {
                type: 'Point',
                coordinates: [0, 0]
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
          geoJSON
        }
      });
      break;
  }
  return state;
}

const emergenciesInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function emergencies (state = emergenciesInitialState, action) {
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
      const objs = action.data;
      // Group by type.
      let emergenciesByType = _groupBy(objs, 'dtype.id');
      // Convert to array.
      emergenciesByType = Object.keys(emergenciesByType).map(key => {
        return {
          id: key,
          name: emergenciesByType[key][0].dtype.name,
          items: emergenciesByType[key]
        };
      }).sort((a, b) => a.name > b.name);

      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: {
          byType: emergenciesByType
        }
      });
      break;
  }
  return state;
}

// Combined export.
export default combineReducers({
  appealsList,
  emergencies
});
