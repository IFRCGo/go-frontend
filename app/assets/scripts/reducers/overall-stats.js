'use strict';
import { combineReducers } from 'redux';
import _toNumber from 'lodash.tonumber';

const sumstatsInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function sumstats (state = sumstatsInitialState, action) {
  switch (action.type) {
    case 'GET_SUMSTATS_INFLIGHT':
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case 'GET_SUMSTATS_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'GET_SUMSTATS_SUCCESS':
      const objs = action.data.objects;
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

      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: struct
      });
      break;
  }
  return state;
}

const emergenciesInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: []
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

// Combined export.
export default combineReducers({
  sumstats,
  emergencies
});
