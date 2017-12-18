'use strict';
import _groupBy from 'lodash.groupby';

import { get } from '../utils/utils';
import { nope } from '../utils/format';
import eruTypes from '../utils/eru-types';

const initialState = {
  // fetching: false,
  // fetched: false,
  // receivedAt: null,
  // data: {}
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'GET_ERU_OWNERS_INFLIGHT':
      state = Object.assign({}, state, {
        error: null,
        fetching: true,
        fetched: false
      });
      break;
    case 'GET_ERU_OWNERS_FAILED':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        error: action.error
      });
      break;
    case 'GET_ERU_OWNERS_SUCCESS':
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
  const records = get(raw, 'objects', []);

  // flatten the data structure
  const erus = records.reduce((acc, next) => acc.concat(get(next, 'eru_set', [])), []);
  const eruState = erus.reduce((acc, next) => {
    const units = get(next, 'units', 0);
    // countries are listed, which means these resources are deployed
    if (get(next, 'countries', []).length) {
      acc.deployed += units;
    } else {
      acc.ready += units;
    }
    return acc;
  }, {
    deployed: 0,
    ready: 0
  });

  const erusByType = _groupBy(erus, 'type');
  const types = Object.keys(erusByType).map(key => ({
    name: get(eruTypes, key.toString(), nope),
    items: erusByType[key].reduce((acc, next) => acc + Number(get(next, 'units', 0)), 0)
  })).sort((a, b) => a.items > b.items ? -1 : 1);

  const erusByOwnerNation = _groupBy(erus, 'eru_owner.country.society_name');
  const owners = Object.keys(erusByOwnerNation).map(key => ({
    name: key,
    items: erusByOwnerNation[key].reduce((acc, next) => acc + Number(get(next, 'units', 0)), 0)
  })).sort((a, b) => a.items > b.items ? -1 : 1);

  return Object.assign({}, eruState, {
    types,
    owners,
    records
  });
}
