'use strict';
import { combineReducers } from 'redux';

import { get } from '../utils/utils';
import { groupByDisasterType } from '../utils/utils';

const listInitialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function list (state = listInitialState, action) {
  switch (action.type) {
    case 'GET_DISASTERS_LIST_INFLIGHT':
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case 'GET_DISASTERS_LIST_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'GET_DISASTERS_LIST_SUCCESS':
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

  return {
    numAffected,
    totalAppeals,
    totalAppealsFunding,
    count,
    emergenciesByType,
    records
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
  aggregate
});
