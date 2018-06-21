'use strict';
import { get } from '../utils/utils';
import { stateInflight, stateError } from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case 'GET_FDRS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_FDRS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_FDRS_SUCCESS':
      state = Object.assign({}, state, {
        fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        data: processFdrsResponse(action.data)
      });
      break;
  }
  return state;
}

function processFdrsResponse (resp) {
  const results = get(resp, 'data', []).map(d => {
    const { id, data } = d;
    const years = get(data, '0.years');
    const values = get(data, '0.data');
    if (!Array.isArray(years) || !Array.isArray(values)) {
      return null;
    }
    const mostRecentYear = get(data, '0.years', []).map(Number).sort((a, b) => a < b ? 1 : -1)[0];
    const value = values.find(d => d.year === mostRecentYear.toString()).value;
    return {
      id,
      data: { value, year: mostRecentYear }
    };
  }).filter(Boolean);
  const obj = {};
  results.forEach(d => {
    obj[d.id] = d.data;
  });
  return obj;
}
