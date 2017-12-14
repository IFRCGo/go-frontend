'use strict';
import _cloneDeep from 'lodash.clonedeep';
import _toNumber from 'lodash.tonumber';
import _get from 'lodash.get';
import _undefined from 'lodash.isundefined';

import { api } from '../../config';
import { request } from '../../utils/network';
import * as formData from '../../utils/field-report-constants';

export function dataPathToDisplay (path) {
  // Remove first . and any array ref.
  path = path.substring(1).replace(/\[[0-9]+\]/g, '');
  const index = {
    // Step 1.
    summary: 'Summary',
    countries: 'Countries',
    status: 'Status',
    disasterType: 'Disaster Type',
    event: 'Event',
    sources: 'Sources',
    description: 'Brief Description of the Situation',
    assistance: 'Government requests international assistance?',

    // Step 2.
    'numInjured.estimation': 'Estimation Injured',
    'numDead.estimation': 'Estimation Dead',
    'numMissing.estimation': 'Estimation Missing',
    'numAffected.estimation': 'Estimation Affected',
    'numDisplaced.estimation': 'Estimation Displaced',
    numAssistedGov: 'Assisted by Government',
    numAssistedRedCross: 'Assisted By Red Cross',
    numLocalStaff: 'Number of local staff involved',
    numVolunteers: 'Number of volunteers involved',
    numExpats: 'Number of expats/delegates',

    // Step 3.
    // No validation for step 3.

    // Step 4.
    'dref.value': 'DREF Requested - Amount CHF',
    'emergencyAppeal.value': 'Emergency Appeal - Amount CHF',
    'rdrtrits.value': 'RDRT/RITS - Number of people',
    'fact.value': 'FACT - Number of people',
    'ifrcStaff.value': 'IFRC Staff Relocated - Number of people',
    'eru.units': 'ERU - Units',

    // Step 5.
    'contactOriginator.name': 'Originator - Name',
    'contactOriginator.func': 'Originator - Function',
    'contactOriginator.email': 'Originator - Email',
    'contactPrimary.name': 'Primary Contact - Name',
    'contactPrimary.func': 'Primary Contact - Function',
    'contactPrimary.email': 'Primary Contact - Email',
    'contactNatSoc.name': 'National Society Contact - Name',
    'contactNatSoc.func': 'National Society Contact - Function',
    'contactNatSoc.email': 'National Society Contact - Email',
    'contactFederation.name': 'Federation Contact - Name',
    'contactFederation.func': 'Federation Contact - Function',
    'contactFederation.email': 'Federation Contact - Email',
    'contactMediaNatSoc.name': 'Media Contact in the National Society - Name',
    'contactMediaNatSoc.func': 'Media Contact in the National Society - Function',
    'contactMediaNatSoc.email': 'Media Contact in the National Society - Email',
    'contactMedia.name': 'Media Contact - Name',
    'contactMedia.func': 'Media Contact - Function',
    'contactMedia.email': 'Media Contact - Email'
  };
  if (!index[path]) {
    console.warn('No display value found for', path);
    return 'N/A';
  }
  return index[path];
}

export function prepStateForValidation (state) {
  state = _cloneDeep(state);

  // Conversion functions.
  const toBool = (val) => Boolean(val === 'true');
  const toNumIfNum = (val) => {
    let v = _toNumber(val);
    return isNaN(v) ? val : v;
  };

  const objPropToNum = (prop) => (val) => { val[prop] = toNumIfNum(val[prop]); return val; };

  const formatter = {
    // Step 1.
    assistance: toBool,
    countries: (val) => val.map(o => o.value),
    event: (val) => val ? toNumIfNum(val.value) : undefined,

    // Step 2.
    numInjured: (val) => val.map(objPropToNum('estimation')),
    numDead: (val) => val.map(objPropToNum('estimation')),
    numMissing: (val) => val.map(objPropToNum('estimation')),
    numAffected: (val) => val.map(objPropToNum('estimation')),
    numDisplaced: (val) => val.map(objPropToNum('estimation')),
    numAssistedGov: toNumIfNum,
    numAssistedRedCross: toNumIfNum,
    numLocalStaff: toNumIfNum,
    numVolunteers: toNumIfNum,
    numExpats: toNumIfNum,

    // Step 4.
    dref: objPropToNum('value'),
    emergencyAppeal: objPropToNum('value'),
    rdrtrits: objPropToNum('value'),
    fact: objPropToNum('value'),
    ifrcStaff: objPropToNum('value'),
    eru: (val) => val.map(objPropToNum('units'))
  };

  for (let prop in state) {
    if (formatter[prop]) {
      state[prop] = formatter[prop](state[prop]);
    }
  }

  return state;
}

export function convertStateToPayload (originalState) {
  // Prepare the payload for submission.
  // Extract properties that need processing.
  originalState = _cloneDeep(originalState);
  let state = {};
  const {
    countries,
    disasterType,
    event
  } = originalState;

  // Process properties.
  if (countries.length) { state.countries = countries.map(o => ({pk: o.value})); }
  if (disasterType) { state.dtype = {pk: disasterType}; }
  if (event && event.value) { state.event = {pk: event.value}; }

  const directMapping = [
    // [source, destination]
    ['summary', 'summary'],
    ['description', 'description'],
    ['status', 'status'],
    ['numAssistedRedCross', 'num_assisted'],
    ['numAssistedGov', 'gov_num_assisted'],
    ['numLocalStaff', 'num_localstaff'],
    ['numVolunteers', 'num_volunteers'],
    ['numExpats', 'num_expats_delegates']
  ];

  directMapping.forEach(([src, dest]) => {
    if (_undefined(originalState[src])) { return; }
    state[dest] = originalState[src];
  });

  // Boolean values
  state.request_assistance = Boolean(originalState.assistance === 'true');

  // For this properties when the source is the Red Cross use the provided,
  // when it's Government prepend gov_. This results in:
  // num_injured | gov_num_injured
  const sourceEstimationMapping = [
    ['numInjured', 'num_injured'],
    ['numDead', 'num_dead'],
    ['numMissing', 'num_missing'],
    ['numAffected', 'num_affected'],
    ['numDisplaced', 'num_displaced']
  ];

  sourceEstimationMapping.forEach(([src, dest]) => {
    originalState[src].forEach(o => {
      if (_undefined(o.estimation)) { return; }
      if (o.source === 'red-cross') {
        state[dest] = o.estimation;
      } else if (o.source === 'government') {
        state[`gov_${dest}`] = o.estimation;
      }
    });
  });

  // Actions.
  // In the payload all the action are in the same array.
  // Convert the state to the correct structure:
  // [
  //   { organization: "NATL", actions: [ { id: 1 }, { id: 2 } ], summary: "foo bar baz" },
  //   { organization: "PNS" ... }
  // ]
  const actionsMapping = [
    // [state var, org name]
    ['actionsNatSoc', 'NATL'],
    ['actionsPns', 'PNS'],
    ['actionsFederation', 'FDRN']
  ];

  state.actions_taken = actionsMapping.map(([src, orgName]) => {
    return {
      organization: orgName,
      summary: originalState[src].description || '',
      actions: originalState[src].options.reduce((orgActions, o) => {
        return o.checked ? orgActions.concat({id: o.value}) : orgActions;
      }, [])
    };
  }).filter(o => o.actions.length);

  // Planned Response Mapping
  // In the payload the status and value may mean different things.
  // The `value` for dref refers to Amount. The `value` for FACT refers to
  // number of people. We need to convert from an object {status, value}
  // to plain state props.
  const planResponseMapping = [
    // [state var, mapping status, mapping value]
    ['dref', 'dref', 'dref_amount'],
    ['emergencyAppeal', 'appeal', 'appeal_amount'],
    ['rdrtrits', 'rdrt', 'num_rdrt'],
    ['fact', 'fact', 'num_fact'],
    ['ifrcStaff', 'ifrc_staff', 'num_ifrc_staff']
  ];

  planResponseMapping.forEach(([src, statusMap, valueMap]) => {
    if (_undefined(originalState[src].status)) { return; }
    state[statusMap] = originalState[src].status;
    state[valueMap] = originalState[src].value;
  });

  // Contacts.
  // In the payload all the contacts are in the same array.
  // Convert the state to the correct structure:
  // [
  //   { ctype: "originator", name: 'John', title: 'Medic', email: 'john@gmail.com' },
  //   { ctype: "primary" ... }
  // ]
  const contatcsMapping = [
    // [state var, contact type]
    ['contactOriginator', 'Originator'],
    ['contactPrimary', 'Primary'],
    ['contactNatSoc', 'NationalSociety'],
    ['contactFederation', 'Federation'],
    ['contactMediaNatSoc', 'MediaNationalSociety'],
    ['contactMedia', 'Media']
  ];

  state.contacts = contatcsMapping.map(([src, contactType]) => {
    return {
      ctype: contactType,
      name: originalState[src].name || '',
      title: originalState[src].title || '',
      email: originalState[src].email || ''
    };
  }).filter(o => Boolean(o.name));

  _get(originalState, 'eru', []).forEach(eru => {
    if (_undefined(eru.type) || _undefined(eru.status) || _undefined(eru.units)) { return; }
    state[eru.type] = eru.status;
    state[eru.type + '_units'] = eru.units;
  });

  return state;
}

export function getEventsFromApi (input) {
  return !input
    ? Promise.resolve({ options: [] })
    : request(`${api}/api/v1/es_search/?type=event&keyword=${input}`)
      .then(data => ({
        options: data.hits.map(o => ({
          value: o._source.id,
          label: o._source.name
        }))
      }));
}

export function getInitialDataState () {
  return {
    // Step 1
    summary: undefined,
    // Countries follows the structure defined by react-select.
    // Will need to be converted.
    countries: [],
    status: undefined,
    visibility: 'membership',
    disasterType: undefined,
    event: undefined,
    sources: formData.sources.map(o => ({
      value: o.value,
      checked: false,
      specification: undefined
    })),
    description: undefined,
    assistance: undefined,

    // Step 2
    numInjured: [{ estimation: undefined, source: undefined }],
    numDead: [{ estimation: undefined, source: undefined }],
    numMissing: [{ estimation: undefined, source: undefined }],
    numAffected: [{ estimation: undefined, source: undefined }],
    numDisplaced: [{ estimation: undefined, source: undefined }],
    numAssistedGov: undefined,
    numAssistedRedCross: undefined,
    numLocalStaff: undefined,
    numVolunteers: undefined,
    numExpats: undefined,

    // Step 3
    bulletin: undefined,
    actionsOthers: undefined,
    actionsNatSoc: {
      options: formData.actions.map(o => ({
        value: o.value,
        checked: false
      })),
      description: undefined
    },
    actionsPns: {
      options: formData.actions.map(o => ({
        value: o.value,
        checked: false
      })),
      description: undefined
    },
    actionsFederation: {
      options: formData.actions.map(o => ({
        value: o.value,
        checked: false
      })),
      description: undefined
    },

    // Step 4
    dref: { status: undefined, value: undefined },
    emergencyAppeal: { status: undefined, value: undefined },
    rdrtrits: { status: undefined, value: undefined },
    fact: { status: undefined, value: undefined },
    ifrcStaff: { status: undefined, value: undefined },
    eru: [{ type: undefined, status: undefined, units: undefined }],

    // Step 5
    contactOriginator: { name: undefined, func: undefined, email: undefined },
    contactPrimary: { name: undefined, func: undefined, email: undefined },
    contactNatSoc: { name: undefined, func: undefined, email: undefined },
    contactFederation: { name: undefined, func: undefined, email: undefined },
    contactMediaNatSoc: { name: undefined, func: undefined, email: undefined },
    contactMedia: { name: undefined, func: undefined, email: undefined }
  };
}
