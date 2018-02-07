'use strict';
import _groupBy from 'lodash.groupby';

import { get } from '../utils/utils';
import { nope } from '../utils/format';
import eruTypes from '../utils/eru-types';
import { getCentroid } from '../utils/country-centroids';

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
    if (next.deployed_to) {
      acc.deployed += units;
    } else if (next.available) {
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

  const erusByOwnerNation = _groupBy(erus, 'eru_owner.national_society_country.society_name');
  const owners = Object.keys(erusByOwnerNation).map(key => ({
    name: key,
    items: erusByOwnerNation[key].reduce((acc, next) => acc + Number(get(next, 'units', 0)), 0)
  })).sort((a, b) => a.items > b.items ? -1 : 1);

  // calculate the number of units deployed to each country
  const recipientCountries = {};
  erus.filter(o => o.deployed_to).forEach(o => {
    const { iso } = o.deployed_to;
    recipientCountries[iso] = recipientCountries[iso] || { meta: o.deployed_to, total: 0, units: [] };
    recipientCountries[iso].total += o.units;
    recipientCountries[iso].units.push(`${o.units} - ${get(o, 'eru_owner.national_society_country.society_name')}`);
  });

  const geoJSON = {
    type: 'FeatureCollection',
    features: Object.keys(recipientCountries).map(iso => {
      const { units, total, meta } = recipientCountries[iso];
      const properties = Object.assign({}, meta, {
        type: 'eru',
        units: units.join('|'),
        total
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

  return Object.assign({}, eruState, {
    geoJSON,
    types,
    owners,
    records
  });
}
