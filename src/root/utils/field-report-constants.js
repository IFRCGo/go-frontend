export const statusEarlyWarningValue = '8';
export const statusEventValue = '9';

export const STATUS_EARLY_WARNING = '8';
export const STATUS_EVENT = '9';
export const DISASTER_TYPE_EPIDEMIC = '1';

export const getStatusEarlyWarning = (strings) => ({
  value: statusEarlyWarningValue,
  label: strings.fieldReportConstantStatusEarlyWarningLabel,
  description: strings.fieldReportConstantStatusEarlyWarningDescription,
});

export const getStatusEvent = (strings) => ({
  value: statusEventValue,
  label: strings.fieldReportConstantStatusEventLabel,
  description: strings.fieldReportConstantStatusEventDescription,
});

export const getIsStatusEventByValue = value =>
  String(value) === statusEventValue;

export const getStatus = (strings) => [
  getStatusEarlyWarning(strings),
  getStatusEvent(strings),
];

export const statusValues = [
  {value: statusEarlyWarningValue},
  {value: statusEventValue},
];

export const getVisibility = (strings) => [
  {
    label: strings.fieldReportConstantVisibilityPublicLabel,
    value: '3'
  },
  {
    label: strings.fieldReportConstantVisibilityRCRCMovementLabel,
    value: '1'
  },
  {
    label: strings.fieldReportConstantVisibilityIFRCSecretariatLabel,
    value: '2'
  }
];

// This transforms a countries collection to be used
// directly in a select dropdown
export const countries = (countries, independent=false) => {
  let countriesSelectList = [];

  // show only independent countries (country and region) (include countries with empty or unavailable 'independent' prop)
  countriesSelectList = countries.filter(country => country.record_type === 1);

  if (independent) {
    countriesSelectList = countriesSelectList
    .filter(
        country => country.independent === true
      );
  }

  if (!countries[0].hasOwnProperty('value') && !countries[0].hasOwnProperty('label')) {
    countriesSelectList = countries.map(country => ({ value: country.id, label: country.name }));
  }

  return [
    ...countriesSelectList,
  ].sort((a, b) => a.label < b.label ? -1 : 1);
};

export const getIsEpidemicDisasterTypeByValue = value =>
  String(value) === '1';

// FIXME: pull this list from server
export const sources = [
  {
    label: 'National Society',
    value: 'National Society'
  },
  {
    label: 'Government',
    value: 'Government'
  },
  {
    label: 'Delegation/Secretariat',
    value: 'Delegation/Secretariat'
  },
  {
    label: 'UN agency',
    value: 'UN'
  },
  {
    label: 'Academia/Research',
    value: 'Academia/Research'
  },
  {
    label: 'Press',
    value: 'Local press'
  },
  {
    label: 'NGOs',
    value: 'NGOs'
  },
  {
    label: 'Other',
    value: 'Others'
  }
];

// FIXME: pull this list from server
// Step 4.
export const eruTypes = [
  {
    label: '-- Disaster Type --',
    value: ''
  },
  {
    value: 'eru_base_camp',
    label: 'Base Camp'
  },
  {
    value: 'eru_it_telecom',
    label: 'IT & Telecommunications'
  },
  {
    value: 'eru_logistics',
    label: 'Logistics'
  },
  {
    value: 'eru_deployment_hospital',
    label: 'RCRC Emergency Hospital'
  },
  {
    value: 'eru_referral_hospital',
    label: 'RCRC Emergency Clinic'
  },
  {
    value: 'eru_relief',
    label: 'Relief'
  },
  {
    value: 'eru_water_sanitation_15',
    label: 'WASH M15'
  },
  {
    value: 'eru_water_sanitation_20',
    label: 'WASH MSM20'
  },
  {
    value: 'eru_water_sanitation_40',
    label: 'WASH M40'
  }
];

// FIXME: pull this list from server
export const orgTypes = [
  {
    label: 'National Society',
    value: 'NTLS'
  },
  {
    label: 'IFRC',
    value: 'SCRT'
  },
  {
    label: 'ICRC',
    value: 'ICRC'
  },
  {
    label: 'Other',
    value: 'OTHR'
  }
];

export const epiSources = [
  { value: '', label: '-- Source --' },
  { value: '0', label: 'Ministry of Health' },
  { value: '1', label: 'World Health Organization' },
  { value: '2', label: 'Other' }
];


const defaultFieldOptions = [
  {
    'label': 'Planned',
    'value': '2'
  },
  {
    'label': 'Requested',
    'value': '1',
  },
  {
    'label': 'Deployed',
    'value': '3'
  }
];

const drefOptions = defaultFieldOptions.slice(0, -1);

drefOptions.push({
  'label': 'Allocated',
  'value': '3'
});

const emergencyOptions = defaultFieldOptions.slice(0, -1);
emergencyOptions.push({
  'label': 'Launched',
  'value': '3'
});
