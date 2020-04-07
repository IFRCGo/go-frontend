'use strict';
import _cloneDeep from 'lodash.clonedeep';
import _toNumber from 'lodash.tonumber';
import _undefined from 'lodash.isundefined';
import { DateTime } from 'luxon';

import { api } from '../../config';
import { get } from '../../utils/utils';
import { request } from '../../utils/network';
import * as formData from '../../utils/field-report-constants';

export function dataPathToDisplay (path, keyword) {
  // Remove first . and any array ref.
  if (keyword === 'anyOf') return ''; // return empty string if error is missing "any of" fields
  path = path.substring(1).replace(/\[[0-9]+\]/g, '');
  const index = {
    // Step 1.
    summary: 'Summary',
    country: 'Country',
    countries: 'Countries',
    districts: 'Areas',
    status: 'Status',
    disasterType: 'Disaster Type',
    startDate: 'Start Date',
    event: 'Event',
    sources: 'Sources',
    description: 'Brief Description of the Situation',
    otherSources: 'Details of Other Sources',
    assistance: 'Government requests international assistance?',
    nsAssistance: 'National Society requests international assistance?',

    // Step 2.
    'numInjured.estimation': 'Estimation Injured',
    'numDead.estimation': 'Estimation Dead',
    'numMissing.estimation': 'Estimation Missing',
    'numAffected.estimation': 'Estimation Affected',
    'numDisplaced.estimation': 'Estimation Displaced',
    'numPotentiallyAffected': 'Estimation Potentially Affected',
    'numHighestRisk': 'Estimation Highest Risk',
    'affectedPopCentres': 'Affected Pop Centres',
    'cases': 'Cases',
    'suspectedCases': 'Suspected Cases',
    'probableCases': 'Probable Cases',
    'confirmedCases': 'Confirmed Cases',
    numAssistedGov: 'Assisted by Government',
    numAssistedRedCross: 'Assisted By Red Cross',
    numLocalStaff: 'Number of local staff involved',
    numVolunteers: 'Number of volunteers involved',
    numExpats: 'Number of expats/delegates',
    sitFieldsDate: 'Data of Data',

    // Step 3.
    // No validation for step 3.

    // Step 4.
    'dref.value': 'DREF Requested - Amount CHF',
    'emergencyAppeal.value': 'Emergency Appeal - Amount CHF',
    'rdrtrits.value': 'RDRT/RITS - Number of people',
    'fact.value': 'FACT - Number of people',
    'ifrcStaff.value': 'IFRC Staff Relocated - Number of people',
    'imminentDref.value': 'Imminent DRF - Amount CHF',
    'forecastBasedAction.value': 'Forecast Based Action - Amount CHF',
    'eru.units': 'ERU - Units',

    // Step 5.
    'contactOriginator.name': 'Originator - Name',
    'contactOriginator.title': 'Originator - Title',
    'contactOriginator.email': 'Originator - Email',
    'contactOriginator.phone': 'Originator - Phone',
    'contactPrimary.name': 'Primary Contact - Name',
    'contactPrimary.title': 'Primary Contact - Title',
    'contactPrimary.email': 'Primary Contact - Email',
    'contactPrimary.phone': 'Primary Contact - Phone',
    'contactNatSoc.name': 'National Society Contact - Name',
    'contactNatSoc.title': 'National Society Contact - Title',
    'contactNatSoc.email': 'National Society Contact - Email',
    'contactNatSoc.phone': 'National Society Contact - Phone',
    'contactFederation.name': 'Federation Contact - Name',
    'contactFederation.title': 'Federation Contact - Title',
    'contactFederation.email': 'Federation Contact - Email',
    'contactFederation.phone': 'Federation Contact - Phone',
    'contactMediaNatSoc.name': 'Media Contact in the National Society - Name',
    'contactMediaNatSoc.title': 'Media Contact in the National Society - Title',
    'contactMediaNatSoc.email': 'Media Contact in the National Society - Email',
    'contactMediaNatSoc.phone': 'Media Contact in the National Society - Phone',
    'contactMedia.name': 'Media Contact - Name',
    'contactMedia.title': 'Media Contact - Title',
    'contactMedia.email': 'Media Contact - Email',
    'contactMedia.phone': 'Media Contact - Phone'
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
  const objPropToStr = (prop) => (val) => { val[prop] = val[prop] ? val[prop] : ''; return val; };

  const formatter = {
    // Step 1.
    assistance: toBool,
    nsAssistance: toBool,
    country: (val) => val ? val.value : undefined,
    districts: (val) => val.map(o => o.value),
    // countries: (val) => val.value,
    event: (val) => val ? toNumIfNum(val.value) : undefined,

    // Step 2.
    numInjured: (val) => val.map(objPropToNum('estimation')),
    numDead: (val) => val.map(objPropToNum('estimation')),
    numMissing: (val) => val.map(objPropToNum('estimation')),
    numAffected: (val) => val.map(objPropToNum('estimation')),
    numDisplaced: (val) => val.map(objPropToNum('estimation')),
    numPotentiallyAffected: (val) => val.map(objPropToNum('estimation')),
    numHighestRisk: (val) => val.map(objPropToNum('estimation')),
    affectedPopCentres: (val) => val.map(objPropToStr('estimation')),
    cases: (val) => val.map(objPropToNum('estimation')),
    suspectedCases: (val) => val.map(objPropToNum('estimation')),
    probableCases: (val) => val.map(objPropToNum('estimation')),
    confirmedCases: (val) => val.map(objPropToNum('estimation')),
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
    imminentDref: objPropToNum('value'),
    forecastBasedAction: objPropToNum('value'),
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
    country,
    disasterType,
    districts,
    event,
    startDate,
    sitFieldsDate
  } = originalState;

  // Process properties.
  // if (countries.length) { state.countries = countries.map(o => +o.value); }
  if (disasterType) { state.dtype = +disasterType; }
  if (districts.length) { state.districts = districts.map(o => +o.value); }
  if (event && event.value) { state.event = +event.value; }
  if (country) { state.countries = [country.value]; }

  // set date inputs to DateTime format
  if (startDate) { state.start_date = startDate + 'T00:00:00+00:00'; }
  if (sitFieldsDate) { state.report_date = sitFieldsDate + 'T00:00:00+00:00'; }

  const directMapping = [
    // [source, destination]
    ['summary', 'summary'],
    ['description', 'description'],
    ['otherSources', 'other_sources'],
    ['status', 'status'],
    ['bulletin', 'bulletin'],
    ['numAssistedRedCross', 'num_assisted', Number],
    ['numAssistedGov', 'gov_num_assisted', Number],
    ['numAssistedMinistryOfHealth', 'health_min_num_assisted', Number],
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
  state.ns_request_assistance = Boolean(originalState.nsAssistance === 'true');
  // For these properties when the source is the Red Cross use the provided,
  // when it's Government prepend gov_. This results in:
  // num_injured | gov_num_injured
  const sourceEstimationMapping = [
    ['numInjured', 'num_injured'],
    ['numDead', 'num_dead'],
    ['numMissing', 'num_missing'],
    ['numAffected', 'num_affected'],
    ['numDisplaced', 'num_displaced'],
    ['numPotentiallyAffected', 'num_potentially_affected'],
    ['numHighestRisk', 'num_highest_risk'],
    ['affectedPopCentres', 'affected_pop_centres'],
    ['cases', 'cases'],
    ['suspectedCases', 'suspected_cases'],
    ['probableCases', 'probable_cases'],
    ['confirmedCases', 'confirmed_cases']
  ];

  sourceEstimationMapping.forEach(([src, dest]) => {
    originalState[src].forEach(o => {
      if (_undefined(o.estimation)) { return; }
      if (o.source === 'red-cross') {
        state[dest] = o.estimation;
      } else if (o.source === 'government') {
        state[`gov_${dest}`] = o.estimation;
      } else if (o.source === 'ministry-of-health') {
        state[`health_min_${dest}`] = o.estimation;
      } else if (o.source === 'world-health-organization') {
        state[`who_${dest}`] = o.estimation;
      } else if (o.source === 'other') {
        state[`other_${dest}`] = o.estimation;
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
    ['ifrcStaff', 'ifrc_staff', 'num_ifrc_staff'],
    ['imminentDref', 'imminent_dref', 'imminent_dref_amount'],
    ['forecastBasedAction', 'forecast_based_action', 'forecast_based_action_amount']
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
  const contactsMapping = [
    // [state var, contact type]
    ['contactOriginator', 'Originator'],
    ['contactPrimary', 'Primary'],
    ['contactNatSoc', 'NationalSociety'],
    ['contactFederation', 'Federation'],
    ['contactMediaNatSoc', 'MediaNationalSociety'],
    ['contactMedia', 'Media']
  ];

  state.contacts = contactsMapping.map(([src, contactType]) => {
    return {
      ctype: contactType,
      name: originalState[src].name || '',
      title: originalState[src].title || '',
      email: originalState[src].email || '',
      phone: originalState[src].phone || ''
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
    country: undefined,
    // countries: [],
    districts: [],
    status: '9', // default to "Event"
    startDate: undefined,
    visibility: '3',
    disasterType: undefined,
    event: undefined,
    sources: formData.sources.map(o => ({
      value: o.value,
      checked: false,
      specification: undefined
    })),
    description: undefined,
    otherSources: undefined,
    assistance: undefined,
    nsAssistance: undefined,

    // Step 2
    numInjured: [{ estimation: undefined, source: undefined }],
    numDead: [{ estimation: undefined, source: undefined }],
    numMissing: [{ estimation: undefined, source: undefined }],
    numAffected: [{ estimation: undefined, source: undefined }],
    numDisplaced: [{ estimation: undefined, source: undefined }],
    numPotentiallyAffected: [{ estimation: undefined, source: undefined }],
    numHighestRisk: [{ estimation: undefined, source: undefined }],
    affectedPopCentres: [{ estimation: undefined, source: undefined }],

    cases: [{ estimation: undefined, source: undefined }],
    suspectedCases: [{ estimation: undefined, source: undefined }],
    probableCases: [{ estimation: undefined, source: undefined }],
    confirmedCases: [{ estimation: undefined, source: undefined }],

    sitFieldsDate: undefined,

    numAssistedGov: undefined,
    numAssistedRedCross: undefined,
    numLocalStaff: undefined,
    numVolunteers: undefined,
    numExpats: undefined,

    // Step 3
    bulletin: undefined,
    actionsOthers: undefined,
    actionsNatSoc: {
      options: [],
      description: undefined
    },
    actionsPns: {
      options: [],
      description: undefined
    },
    actionsFederation: {
      options: [],
      description: undefined
    },

    // Step 4
    dref: { status: undefined, value: undefined },
    emergencyAppeal: { status: undefined, value: undefined },
    rdrtrits: { status: undefined, value: undefined },
    fact: { status: undefined, value: undefined },
    ifrcStaff: { status: undefined, value: undefined },
    imminentDref: { status: undefined, value: undefined },
    forecastBasedAction: { status: undefined, value: undefined },
    eru: [{ type: undefined, status: undefined, units: undefined }],

    // Step 5
    contactOriginator: { name: undefined, title: undefined, email: undefined, phone: undefined },
    contactPrimary: { name: undefined, title: undefined, email: undefined, phone: undefined },
    contactNatSoc: { name: undefined, title: undefined, email: undefined, phone: undefined },
    contactFederation: { name: undefined, title: undefined, email: undefined, phone: undefined },
    contactMediaNatSoc: { name: undefined, title: undefined, email: undefined, phone: undefined },
    contactMedia: { name: undefined, title: undefined, email: undefined, phone: undefined }
  };
}

export function convertFieldReportToState (fieldReport, stateData) {
  let state = _cloneDeep(getInitialDataState());
  state.actionsNatSoc = stateData.actionsNatSoc;
  state.actionsFederation = stateData.actionsFederation;
  state.actionsPns = stateData.actionsPns;
  // Process properties.
  state.countries = fieldReport.countries.map(o => ({
    label: o.name,
    value: o.id.toString()
  }));
  state.country = fieldReport.countries.length ? state.countries[0] : null;

  state.districts = fieldReport.districts.map(o => ({
    label: o.name,
    value: o.id.toString()
  }));
  // delete state.countries;

  if (fieldReport.dtype) {
    state.disasterType = fieldReport.dtype.id.toString();
  }

  if (fieldReport.event) {
    state.event = {
      label: fieldReport.event.name,
      value: fieldReport.event.id
    };
  }

  // get just YYYY-MM-DD from the full date timestamp
  if (fieldReport.start_date) {
    state.startDate = fieldReport.start_date.split('T')[0];
  }
  if (fieldReport.sit_fields_date) {
    state.sitFieldsDate = fieldReport.sit_fields_date.split('T')[0];
  }
  // Everything not an early warning is an event.
  state.status = fieldReport.status !== parseInt(formData.statusEarlyWarning.value)
    ? formData.statusEvent.value
    : formData.statusEarlyWarning.value;

  const directMapping = [
    // [source, destination]
    ['summary', 'summary'],
    ['description', 'description'],
    ['other_sources', 'otherSources'],
    ['num_assisted', 'numAssistedRedCross'],
    ['health_min_num_assisted', 'numAssistedMinistryOfHealth'],
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
  state.nsAssistance = fieldReport.ns_request_assistance !== null ? fieldReport.ns_request_assistance.toString() : state.nsAssistance;

  // For these properties when the source is the Red Cross use the provided,
  // when it's Government starts with gov_. This results in:
  // num_injured | gov_num_injured
  const sourceEstimationMapping = [
    // [source, destination]
    ['num_injured', 'numInjured'],
    ['num_dead', 'numDead'],
    ['num_missing', 'numMissing'],
    ['num_affected', 'numAffected'],
    ['num_displaced', 'numDisplaced'],
    ['num_potentially_affected', 'numPotentiallyAffected'],
    ['num_highest_risk', 'numHighestRisk'],
    ['affected_pop_centres', 'affectedPopCentres'],
    ['cases', 'cases'],
    ['suspected_cases', 'suspectedCases'],
    ['probable_cases', 'probableCases'],
    ['confirmed_cases', 'confirmedCases']
  ];

  sourceEstimationMapping.forEach(([src, dest]) => {
    let sourceEstimation = [];
    if (fieldReport[src] !== null) {
      sourceEstimation.push({
        source: 'red-cross',
        estimation: fieldReport[src].toString()
      });
    }
    if (fieldReport[`gov_${src}`]) {
      sourceEstimation.push({
        source: 'government',
        estimation: fieldReport[`gov_${src}`].toString()
      });
    }
    if (fieldReport[`other_${src}`]) {
      sourceEstimation.push({
        source: 'other',
        estimation: fieldReport[`other_${src}`].toString()
      });
    }
    if (fieldReport[`health_min_${src}`]) {
      sourceEstimation.push({
        source: 'ministry-of-health',
        estimation: fieldReport[`health_min_${src}`].toString()
      });
    }
    if (fieldReport[`who_${src}`]) {
      sourceEstimation.push({
        source: 'world-health-organization',
        estimation: fieldReport[`who_${src}`].toString()
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
    const active = action.actions.map(o => Number(o.id));
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
    ['ifrc_staff', 'num_ifrc_staff', 'ifrcStaff'],
    ['imminent_dref', 'imminent_dref_amount', 'imminentDref'],
    ['forecast_based_action', 'forecast_based_action_amount', 'forecastBasedAction']
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
      title: contact.title,
      email: contact.email,
      phone: contact.phone
    };
  });

  return state;
}

export function filterActions (actions, actionType, status) {
  return actions.filter(action => {
    if (status) {
      return action.organizations.includes(actionType) && action.field_report_types.includes(status);
    } else {
      return action.organizations.includes(actionType);
    }
  }).map(action => {
    return {
      value: action.id,
      label: action.name,
      category: action.category,
    };
  });
}

export function checkFalse (actions) {
  return actions.map(action => {
    return {
      value: action.value,
      checked: false
    };
  });
}
