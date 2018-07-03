'use strict';
import _cloneDeep from 'lodash.clonedeep';
import _toNumber from 'lodash.tonumber';
import _undefined from 'lodash.isundefined';
import { DateTime } from 'luxon';

import { api } from '../../config';
import { get } from '../../utils/utils';
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
    'contactOriginator.role': 'Originator - Role',
    'contactOriginator.contact': 'Originator - Contact',
    'contactPrimary.name': 'Primary Contact - Name',
    'contactPrimary.role': 'Primary Contact - Role',
    'contactPrimary.contact': 'Primary Contact - Contact',
    'contactNatSoc.name': 'National Society Contact - Name',
    'contactNatSoc.role': 'National Society Contact - Role',
    'contactNatSoc.contact': 'National Society Contact - Contact',
    'contactFederation.name': 'Federation Contact - Name',
    'contactFederation.role': 'Federation Contact - Role',
    'contactFederation.contact': 'Federation Contact - Contact',
    'contactMediaNatSoc.name': 'Media Contact in the National Society - Name',
    'contactMediaNatSoc.role': 'Media Contact in the National Society - Role',
    'contactMediaNatSoc.contact': 'Media Contact in the National Society - Contact',
    'contactMedia.name': 'Media Contact - Name',
    'contactMedia.role': 'Media Contact - Role',
    'contactMedia.contact': 'Media Contact - Contact'
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
  if (countries.length) { state.countries = countries.map(o => +o.value); }
  if (disasterType) { state.dtype = +disasterType; }
  if (event && event.value) { state.event = +event.value; }

  const directMapping = [
    // [source, destination]
    ['summary', 'summary'],
    ['description', 'description'],
    ['status', 'status'],
    ['bulletin', 'bulletin'],
    ['numAssistedRedCross', 'num_assisted', Number],
    ['numAssistedGov', 'gov_num_assisted', Number],
    ['numLocalStaff', 'num_localstaff', Number],
    ['numVolunteers', 'num_volunteers', Number],
    ['numExpats', 'num_expats_delegates', Number],
    ['actionsOthers', 'actions_others'],
    ['visibility', 'visibility', Number]
  ];

  directMapping.forEach(([src, dest, fn]) => {
    if (_undefined(originalState[src])) { return; }
    state[dest] = fn ? fn(originalState[src]) : originalState[src];
  });

  // Boolean values
  state.request_assistance = Boolean(originalState.assistance === 'true');

  // For these properties when the source is the Red Cross use the provided,
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

  // Sources.
  // Sources are checkboxes with a specification, ie the name of the source,
  // and the type, ie "Government"
  state.sources = [];
  get(originalState, 'sources', []).forEach(source => {
    if (source.checked) {
      state.sources.push({ stype: source.value, spec: source.specification });
    }
  });

  // Actions.
  // In the payload all the action are in the same array.
  // Convert the state to the correct structure:
  // [
  //   { organization: "NTLS", actions: [ 1, 2 ], summary: "foo bar baz" },
  //   { organization: "PNS" ... }
  // ]
  const actionsMapping = [
    // [state var, org name]
    ['actionsNatSoc', 'NTLS'],
    ['actionsPns', 'PNS'],
    ['actionsFederation', 'FDRN']
  ];

  state.actions_taken = actionsMapping.map(([src, orgName]) => {
    return {
      organization: orgName,
      summary: originalState[src].description || '',
      actions: originalState[src].options.filter(o => o.checked).map(o => o.value)
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
      email: originalState[src].contact || ''
    };
  }).filter(o => Boolean(o.name));

  get(originalState, 'eru', []).forEach(eru => {
    if (_undefined(eru.type) || _undefined(eru.status)) { return; }
    state[eru.type] = eru.status;
    state[eru.type + '_units'] = eru.units;
  });

  return state;
}

export function getEventsFromApi (input) {
  return !input
    ? Promise.resolve({ options: [] })
    : request(`${api}api/v1/es_search/?type=event&keyword=${input}`)
      .then(data => ({
        options: data.hits.map(o => ({
          value: o._source.id,
          label: `${o._source.name} (${DateTime.fromISO(o._source.date).toISODate()})`
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
    visibility: '1',
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
    contactOriginator: { name: undefined, role: undefined, contact: undefined },
    contactPrimary: { name: undefined, role: undefined, contact: undefined },
    contactNatSoc: { name: undefined, role: undefined, contact: undefined },
    contactFederation: { name: undefined, role: undefined, contact: undefined },
    contactMediaNatSoc: { name: undefined, role: undefined, contact: undefined },
    contactMedia: { name: undefined, role: undefined, contact: undefined }
  };
}

export function convertFieldReportToState (fieldReport) {
  let state = _cloneDeep(getInitialDataState());

  // Process properties.
  state.countries = fieldReport.countries.map(o => ({
    label: o.name,
    value: o.id.toString()
  }));
  if (fieldReport.dtype) {
    state.disasterType = fieldReport.dtype.id.toString();
  }

  if (fieldReport.event) {
    state.event = {
      label: fieldReport.event.name,
      value: fieldReport.event.id
    };
  }

  // Everything not an early warning is an event.
  state.status = fieldReport.status !== parseInt(formData.statusEarlyWarning.value)
    ? formData.statusEvent.value
    : formData.statusEarlyWarning.value;

  const directMapping = [
    // [source, destination]
    ['summary', 'summary'],
    ['description', 'description'],
    ['num_assisted', 'numAssistedRedCross'],
    ['gov_num_assisted', 'numAssistedGov'],
    ['num_localstaff', 'numLocalStaff'],
    ['num_volunteers', 'numVolunteers'],
    ['num_expats_delegates', 'numExpats'],
    ['actions_others', 'actionsOthers'],
    ['bulletin', 'bulletin'],
    ['visibility', 'visibility']
  ];

  directMapping.forEach(([src, dest]) => {
    if (fieldReport[src] === null || _undefined(fieldReport[src])) { return; }
    state[dest] = fieldReport[src].toString();
  });

  // Boolean values
  state.assistance = fieldReport.request_assistance !== null ? fieldReport.request_assistance.toString() : state.assistance;

  // For these properties when the source is the Red Cross use the provided,
  // when it's Government starts with gov_. This results in:
  // num_injured | gov_num_injured
  const sourceEstimationMapping = [
    // [source, destination]
    ['num_injured', 'numInjured'],
    ['num_dead', 'numDead'],
    ['num_missing', 'numMissing'],
    ['num_affected', 'numAffected'],
    ['num_displaced', 'numDisplaced']
  ];

  sourceEstimationMapping.forEach(([src, dest]) => {
    let sourceEstimation = [];

    if (fieldReport[src] !== null) {
      sourceEstimation.push({
        source: 'red-cross',
        estimation: fieldReport[src].toString()
      });
    }
    if (fieldReport[`gov_${src}`] !== null) {
      sourceEstimation.push({
        source: 'government',
        estimation: fieldReport[`gov_${src}`].toString()
      });
    }
    if (sourceEstimation.length) {
      state[dest] = sourceEstimation;
    }
  });

  // Sources.
  // Determine whether a source is checked, using the source name
  get(fieldReport, 'sources', []).forEach(source => {
    state.sources.forEach(stateSource => {
      if (stateSource.value.toLowerCase() === source.stype.toLowerCase()) {
        stateSource.checked = true;
        stateSource.specification = source.spec;
      }
    });
  });

  // Actions.
  // In the payload all the action are in the same array.
  // Separate them into different ones.
  const actionsMapping = {
    'NTLS': 'actionsNatSoc',
    'PNS': 'actionsPns',
    'FDRN': 'actionsFederation'
  };

  get(fieldReport, 'actions_taken', []).forEach(action => {
    const dest = actionsMapping[action.organization];
    if (!dest) return;

    const active = action.actions.map(o => o.id.toString());
    state[dest].description = action.summary;
    state[dest].options = state[dest].options.map(option => {
      if (active.indexOf(option.value) !== -1) {
        option.checked = true;
      }
      return option;
    });
  });

  // Planned Response Mapping
  // In the field report data the variables are not grouped in an object,
  // and some of them refer to people and others to amount.
  // Example:
  // dref and dref_amount
  //    dref: { status: dref, value: dref_amount }
  // ifrc_staff and num_ifrc_staff
  //    ifrcStaff: { status: ifrc_staff, value: num_ifrc_staff }
  const planResponseMapping = [
    // [mapping status, mapping value, state var]
    ['dref', 'dref_amount', 'dref'],
    ['appeal', 'appeal_amount', 'emergencyAppeal'],
    ['rdrt', 'num_rdrt', 'rdrtrits'],
    ['fact', 'num_fact', 'fact'],
    ['ifrc_staff', 'num_ifrc_staff', 'ifrcStaff']
  ];

  planResponseMapping.forEach(([statusMap, valueMap, dest]) => {
    if (fieldReport[statusMap] !== null) {
      state[dest] = {
        status: fieldReport[statusMap].toString(),
        value: fieldReport[valueMap] !== null ? fieldReport[valueMap].toString() : undefined
      };
    }
  });

  // ERU
  // Get ERU keys:
  const eruKeys = Object.keys(fieldReport)
    .filter(o => /^eru_/.test(o) && !/_units$/.test(o))
    .filter(o => fieldReport[o] !== 0);

  state.eru = eruKeys.map(key => {
    const unitK = `${key}_units`;
    return {
      type: key,
      status: fieldReport[key].toString(),
      units: fieldReport[unitK] !== null ? fieldReport[unitK].toString() : undefined
    };
  });

  // Contacts.
  // In the payload all the contacts are in the same array.
  // Separate them into different ones.
  const contactsMapping = {
    // ctype: state var
    'Originator': 'contactOriginator',
    'Primary': 'contactPrimary',
    'NationalSociety': 'contactNatSoc',
    'Federation': 'contactFederation',
    'MediaNationalSociety': 'contactMediaNatSoc',
    'Media': 'contactMedia'
  };

  get(fieldReport, 'contacts', []).forEach(contact => {
    const dest = contactsMapping[contact.ctype];
    if (!dest) return;

    state[dest] = {
      name: contact.name,
      role: contact.title,
      contact: contact.email
    };
  });

  return state;
}
