export const statusEarlyWarningValue = '8';
export const statusEventValue = '9';

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
  value === statusEventValue;

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
  if (countries[0].hasOwnProperty('value') && countries[0].hasOwnProperty('label')) {
    countriesSelectList = countries;
  } else {
    countriesSelectList = countries.map(country => ({ value: country.id, label: country.name }));
  }

  // show only independent countries (country and region) (include countries with empty or unavailable 'independent' prop)
  countriesSelectList = countries.filter(country => country.record_type === 1 || country.record_type === 3);

  if (independent) {
    countriesSelectList = countriesSelectList
    .filter(
        country => (country.independent === true
        || country.independent === undefined
        || country.independent === null)
      );
  }

  return [
    ...countriesSelectList,
  ].sort((a, b) => a.label < b.label ? -1 : 1);
};

export const getIsEpidemicDisasterTypeByValue = value =>
  value === '1';

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

export const getFieldsStep1 = (strings) => ({
  summary: {
    EVT: {
      label: strings.fieldsStep1SummaryLabel,
      desc: strings.fieldsStep1SummaryDescription,
    },
    EPI: {
      label: strings.fieldsStep1SummaryLabel,
      desc: strings.fieldsStep1SummaryDescription,
    },
    EW: {
      label: strings.fieldsStep1SummaryLabel,
      desc: strings.fieldsStep1SummaryDescription,
    },
  },
  'disaster-type': {
    EVT: {
      label: strings.fieldsStep1DisasterTypeLabel,
      desc: strings.fieldsStep1DisasterTypeDescription,
    },
    EPI: {
      label: strings.fieldsStep1DisasterTypeLabel,
      desc: strings.fieldsStep1DisasterTypeDescription,
    },
    EW: {
      label: strings.fieldsStep1DisasterTypeLabel,
      desc: strings.fieldsStep1DisasterTypeDescription,
    },
  },
  startDate: {
    EVT: {
      label: strings.fieldsStep1StartDateLabelStartDate,
      desc: strings.fieldsStep1StartDateDescriptionEVT,
    },
    EPI: {
      label: strings.fieldsStep1StartDateLabelEPI,
      desc: strings.fieldsStep1StartDateDescriptionEPI,
    },
    EW: {
      label: strings.fieldsStep1StartDateLabelEW,
      desc: strings.fieldsStep1StartDateDescriptionEW,
    }
  },
  country: {
    EVT: {
      label: strings.fieldsStep1CountryLabelAffected,
      desc: '',
    },
    EPI: {
      label: strings.fieldsStep1CountryLabelAffected,
      desc: '',
    },
    EW: {
      label: strings.fieldsStep1CountryLabelEW,
      desc: strings.fieldsStep1CountryDescriptionEW,
    },
  },
  assistance: {
    EVT: {
      label: strings.fieldsStep1AssistanceLabel,
      desc: strings.fieldsStep1AssistanceDescription,
    },
    EPI: {
      label: strings.fieldsStep1AssistanceLabel,
      desc: strings.fieldsStep1AssistanceDescription,
    },
    EW: {
      label: strings.fieldsStep1AssistanceLabel,
      desc: strings.fieldsStep1AssistanceDescription,
    },
  },
  'ns-assistance': {
    EVT: {
      label: strings.fieldsStep1NSAssistanceLabel,
      desc: strings.fieldsStep1NSAssistanceDescription,
    },
    EPI: {
      label: strings.fieldsStep1NSAssistanceLabel,
      desc: strings.fieldsStep1NSAssistanceDescription,
    },
    EW: {
      label: strings.fieldsStep1NSAssistanceLabel,
      desc: strings.fieldsStep1NSAssistanceDescription,
    },
  },
});

export const epiSources = [
  { value: '', label: '-- Source --' },
  { value: '0', label: 'Ministry of Health' },
  { value: '1', label: 'World Health Organization' },
  { value: '2', label: 'Other' }
];

export const getFieldsStep2 = (strings) => ({
  organizations: {
    EVT: [
      {'label': strings.fieldsStep2OrganizationsEVTEWLabelRC, 'value': 'red-cross'},
      {'label': strings.fieldsStep2OrganizationsEVTEWLabelGovernment, 'value': 'government'},
      {'label': strings.fieldsStep2OrganizationsLabelOther, 'value': 'other'},
    ],
    EW: [
      {'label': strings.fieldsStep2OrganizationsEVTEWLabelRC, 'value': 'red-cross'},
      {'label': strings.fieldsStep2OrganizationsEVTEWLabelGovernment, 'value': 'government'},
      {'label': strings.fieldsStep2OrganizationsLabelOther, 'value': 'other'},
    ],
    EPI: [
      {'label': strings.fieldsStep2OrganizationsEPILabelHealthMinistry, 'value': 'ministry-of-health'},
      {'label': strings.fieldsStep2OrganizationsEPILabelWHO, 'value': 'world-health-organization'},
      {'label': strings.fieldsStep2OrganizationsLabelOther, 'value': 'other'},
    ]
  },
  situationFields: {
    EVT: [
      {
        'name': 'num-injured',
        'key': 'numInjured',
        'label': strings.fieldsStep2SituationFieldsEVTInjuredLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEVTInjuredDescription,
      },
      {
        'name': 'num-dead',
        'key': 'numDead',
        'label': strings.fieldsStep2SituationFieldsEVTDeadLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEVTDeadDescription,
      },
      {
        'name': 'num-missing',
        'key': 'numMissing',
        'label': strings.fieldsStep2SituationFieldsEVTMissingLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEVTMissingDescription,
      },
      {
        'name': 'num-affected',
        'key': 'numAffected',
        'label': strings.fieldsStep2SituationFieldsEVTAffectedLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEVTAffectedDescription,
      },
      {
        'name': 'num-displaced',
        'key': 'numDisplaced',
        'label': strings.fieldsStep2SituationFieldsEVTDisplacedLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEVTDisplacedDescription,
      }
    ],
    EPI: [
      {
        'name': 'epi-cases',
        'key': 'epiCases',
        'label': strings.fieldsStep2SituationFieldsEPICasesLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEPICasesDescription,
      },
      {
        'name': 'epi-suspected-cases',
        'key': 'epiSuspectedCases',
        'label': strings.fieldsStep2SituationFieldsEPISuspectedCasesLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEPISuspectedCasesDescription,
      },
      {
        'name': 'epi-probable-cases',
        'key': 'epiProbableCases',
        'label': strings.fieldsStep2SituationFieldsEPIProbableCasesLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEPIProbableCasesDescription,
      },
      {
        'name': 'epi-confirmed-cases',
        'key': 'epiConfirmedCases',
        'label': strings.fieldsStep2SituationFieldsEPIConfirmedCasesLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEPIConfirmedCasesDescription,
      },
      {
        'name': 'epi-num-dead',
        'key': 'epiNumDead',
        'label': strings.fieldsStep2SituationFieldsEPIDeadLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEPIDeadDescription,
      }
    ],
    'EPI-COV': [
      {
        'name': 'epi-cases',
        'key': 'epiCases',
        'label': strings.fieldsStep2SituationFieldsEPICasesLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEPICasesDescription,
      },
      {
        'name': 'epi-num-dead',
        'key': 'epiNumDead',
        'label': strings.fieldsStep2SituationFieldsEPIDeadLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEPIDeadDescription,
      },
      {
        'name': 'epi-cases-since-last-fr',
        'key': 'epiCasesSinceLastFr',
        'label': strings.fieldsStep2SituationFieldsEPICasesSinceLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEPICasesSinceDesciption,
      },
      {
        'name': 'epi-deaths-since-last-fr',
        'key': 'epiDeathsSinceLastFr',
        'label': strings.fieldsStep2SituationFieldsEPIDeathsSinceLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEPIDeathsSinceDescription,
      }
    ],
    EW: [
      {
        'name': 'num-potentially-affected',
        'key': 'numPotentiallyAffected',
        'label': strings.fieldsStep2SituationFieldsEWPotentiallyAffectedLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEWPotentiallyAffectedDescription,
      },
      {
        'name': 'num-highest-risk',
        'key': 'numHighestRisk',
        'label': strings.fieldsStep2SituationFieldsEWHighestRiskLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEWHighestRiskDescription,
      },
      // WARNING: this is the only field that requires a non-numeric response
      {
        'name': 'affected-pop-centres',
        'key': 'affectedPopCentres',
        'label': strings.fieldsStep2SituationFieldsEWAffectedPopCenteresLabel,
        'estimationLabel': strings.fieldsStep2SituationFieldsEstimation,
        'desc': strings.fieldsStep2SituationFieldsEWAffectedPopCenteresDescription,
      }
    ],
  },
  sitFieldsDate: {
    EPI: {
      'name': 'situation-fields-date',
      'key': 'sitFieldsDate',
      'label': strings.fieldsStep2SituationFieldsDateEPILabel,
      'estimationLabel': strings.fieldsStep2SituationFieldsDateEPIEstimationLabel,
      'desc': strings.fieldsStep2SituationFieldsDateEPIDescription,
    }
  },
  description: {
    EVT: {
      'label': strings.fieldsStep2DescriptionEVTLabel,
      'desc': strings.fieldsStep2DescriptionEVTDescription,
      'placeholder': strings.fieldsStep2DescriptionEVTPlaceholder
    },
    EPI: {
      'label': strings.fieldsStep2DescriptionEPILabel,
      'desc': strings.fieldsStep2DescriptionEPIDescription,
      'placeholder': strings.fieldsStep2DescriptionEPIPlaceholder
    },
    'EPI-COV': {
      'label': strings.fieldsStep2DescriptionEPILabel,
      'desc': strings.fieldsStep2DescriptionEPICOVDescription,
      'placeholder': strings.fieldsStep2DescriptionCOVIDPlaceholder
    },
    EW: {
      'label': strings.fieldsStep2DescriptionEWLabel,
      'desc': strings.fieldsStep2DescriptionEWDescription,
      'placeholder': strings.fieldsStep2DescriptionEWPlaceholder
    },
  },
});


export const getFieldsStep3 = (strings) => ({
  section1fields: [
    {
      'name': 'num-assisted-gov',
      'key': 'numAssistedGov',
      'EVT': true,
      'EPI': true,
      'EPI-COV': true,
      'EW': true,
      'label': {
        'EVT': strings.fieldsStep3Section1FieldsAssistedGovEVTEPILabel,
        'EPI': strings.fieldsStep3Section1FieldsAssistedGovEVTEPILabel,
        'EW': strings.fieldsStep3Section1FieldsAssistedGovEWLabel,
      }
    },
    {
      'name': 'num-assisted-red-cross',
      'key': 'numAssistedRedCross',
      'EVT': true,
      'EPI': true,
      'EPI-COV': true,
      'EW': true,
      'label': {
        'EVT': strings.fieldsStep3Section1FieldsAssistedRCRCEVTEPILabel,
        'EPI': strings.fieldsStep3Section1FieldsAssistedRCRCEVTEPILabel,
        'EW': strings.fieldsStep3Section1FieldsAssistedRCRCEWLabel,
      },
      'tooltip': {
        'EPI-COV': {
          'title': null, // strings.fieldsStep3Section1FieldsAssistedRCRCEVTEPILabel,
          'description': strings.fieldsStep3TooltipDescriptionRCRC
        }
      }
    },
    {
      'name': 'num-local-staff',
      'key': 'numLocalStaff',
      'EVT': true,
      'EPI': true,
      'EPI-COV': true,
      'EW': false,
      'label': {
        'EVT': strings.fieldsStep3Section1FieldsLocalStaffEVTEPILabel,
        'EPI': strings.fieldsStep3Section1FieldsLocalStaffEVTEPILabel,
      },
      'tooltip': {
        'EPI-COV': {
          'title': null, // strings.fieldsStep3Section1FieldsLocalStaffEVTEPILabel,
          'description': strings.fieldsStep3TooltipDescriptionNS
        }
      }
    },
    {
      'name': 'num-volunteers',
      'key': 'numVolunteers',
      'EVT': true,
      'EPI': true,
      'EPI-COV': true,
      'EW': false,
      'label': {
        'EVT': strings.fieldsStep3Section1FieldsVolunteersEVTEPILabel,
        'EPI': strings.fieldsStep3Section1FieldsVolunteersEVTEPILabel,
      },
      'tooltip': {
        'EPI-COV': {
          'title': null, // strings.fieldsStep3Section1FieldsVolunteersEVTEPILabel,
          'description': strings.fieldsStep3TooltipDescriptionVolunteers
        }
      }
    },
    {
      'name': 'num-expats',
      'key': 'numExpats',
      'EVT': true,
      'EPI': true,
      'EPI-COV': false,
      'EW': false,
      'label': {
        'EVT': strings.fieldsStep3Section1FieldsExpatsEVTEPILabel,
        'EPI': strings.fieldsStep3Section1FieldsExpatsEVTEPILabel,
      },
      'description': {
        'EVT': strings.fieldsStep3Section1FieldsExpatsEVTEPIDescription,
        'EPI': strings.fieldsStep3Section1FieldsExpatsEVTEPIDescription,
      }
    },
  ],
  checkboxSections: [
    {
      'name': 'actions-nat-soc',
      'key': 'actionsNatSoc',
      'action_type': 'NTLS',
      'label': {
        'EVT': strings.fieldsStep3CheckboxSectionsNSActionsEVTEPILabel,
        'EPI': strings.fieldsStep3CheckboxSectionsNSActionsEVTEPILabel,
        'EW': strings.fieldsStep3CheckboxSectionsNSActionsEWLabel,
      },
      'desc': {
        'EVT': strings.fieldsStep3CheckboxSectionsNSActionsEVTEPIDescription,
        'EPI': strings.fieldsStep3CheckboxSectionsNSActionsEVTEPIDescription,
        'EPI-COV': strings.fieldsStep3CheckboxSectionsNSActionsEVTEPIDescription,
        'EW': strings.fieldsStep3CheckboxSectionsNSActionsEWDescription,
      },
      'placeholder': {
        'EVT': strings.fieldsStep3CheckboxSectionsNSActionsEVTPlaceholder,
        'EPI': strings.fieldsStep3CheckboxSectionsNSActionsEPIEWPlaceholder,
        'EW': strings.fieldsStep3CheckboxSectionsNSActionsEPIEWPlaceholder,
      }
    },
    {
      'name': 'actions-federation',
      'key': 'actionsFederation',
      'action_type': 'FDRN',
      'label': {
        'EVT': strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPILabel,
        'EPI': strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPILabel,
        'EW': strings.fieldsStep3CheckboxSectionsFederationActionsEWLabel,
      },
      'desc': {
        'EVT': strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPIDescription,
        'EPI': strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPIDescription,
        'EPI-COV': strings.fieldsStep3CheckboxSectionsFederationActionsEPICOVDescription,
        'EW': strings.fieldsStep3CheckboxSectionsFederationActionsEWDescription,
      },
      'placeholder': {
        'EVT': strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPIEWPlaceholder,
        'EPI': strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPIEWPlaceholder,
        'EPI-COV': strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPIEWPlaceholder,
        'EW': strings.fieldsStep3CheckboxSectionsFederationActionsEVTEPIEWPlaceholder,
      }
    },
    {
      'name': 'actions-pns',
      'key': 'actionsPns',
      'action_type': 'PNS',
      'label': {
        'EVT': strings.fieldsStep3CheckboxSectionsPNSActionsEVTLabel,
        'EPI': strings.fieldsStep3CheckboxSectionsPNSActionsEPILabel,
        'EW': strings.fieldsStep3CheckboxSectionsPNSActionsEWLabel,
      },
      'desc': {
        'EVT': strings.fieldsStep3CheckboxSectionsPNSActionsEVTEPIDescription,
        'EPI': strings.fieldsStep3CheckboxSectionsPNSActionsEVTEPIDescription,
        'EPI-COV': strings.fieldsStep3CheckboxSectionsPNSActionsEPICOVDescription,
        'EW': strings.fieldsStep3CheckboxSectionsPNSActionsEWDescription,
      },
      'placeholder': {
        'EVT': strings.fieldsStep3CheckboxSectionsPNSActionsEVTEPIEWPlaceholder,
        'EPI': strings.fieldsStep3CheckboxSectionsPNSActionsEVTEPIEWPlaceholder,
        'EPI-COV': strings.fieldsStep3CheckboxSectionsPNSActionsEPICOVPlaceholder,
        'EW': strings.fieldsStep3CheckboxSectionsPNSActionsEVTEPIEWPlaceholder,
      }
    }
  ],
  actionsOthers: {
    'label': {
      'EVT': strings.fieldsStep3ActionsOthersEVTEPILabel,
      'EPI': strings.fieldsStep3ActionsOthersEVTEPILabel,
      'EW': strings.fieldsStep3ActionsOthersEWLabel,
    },
    'desc': {
      'EVT': strings.fieldsStep3ActionsOthersEVTEPIDescription,
      'EPI': strings.fieldsStep3ActionsOthersEVTEPIDescription,
      'EPI-COV': strings.fieldsStep3ActionsOthersEPICOVDescription,
      'EW': strings.fieldsStep3ActionsOthersEWDescription,
    }
  }
});

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

export const getFieldsStep4 = (strings) => ({
  plannedResponseRows: [
    {
      'name': 'dref',
      'valueFieldLabel': strings.fieldsStep4PlannedResponseRowsDREFValueFieldLabel,
      'options': drefOptions,
      'key': 'dref',
      'label': {
        'EVT': strings.fieldsStep4PlannedResponseRowsDREFEVTEPILabel,
        'EPI': strings.fieldsStep4PlannedResponseRowsDREFEVTEPILabel,
        'EW': strings.fieldsStep4PlannedResponseRowsDREFEWLabel,
      }
    },
    {
      'name': 'emergency-appeal',
      'valueFieldLabel': strings.fieldsStep4PlannedResponseRowsEmergencyAppealValueFieldLabel,
      'options': emergencyOptions,
      'key': 'emergencyAppeal',
      'label': {
        'EVT': strings.fieldsStep4PlannedResponseRowsEmergencyAppealEVTEPIEWLabel,
        'EPI': strings.fieldsStep4PlannedResponseRowsEmergencyAppealEVTEPIEWLabel,
        'EW': strings.fieldsStep4PlannedResponseRowsEmergencyAppealEVTEPIEWLabel,
      }
    },
    {
      'name': 'fact',
      'valueFieldLabel': strings.fieldsStep4PlannedResponseRowsFactValueFieldLabel,
      'options': defaultFieldOptions,
      'key': 'fact',
      'label': {
        'EVT': strings.fieldsStep4PlannedResponseRowsFactEVTEPIEWLabel,
        'EPI': strings.fieldsStep4PlannedResponseRowsFactEVTEPIEWLabel,
        'EW': strings.fieldsStep4PlannedResponseRowsFactEVTEPIEWLabel,
      },
      'description': strings.fieldsStep4PlannedResponseRowsFact, // WARNING: This is the only row with a description.
    },
    {
      'name': 'ifrc-staff',
      'valueFieldLabel': strings.fieldsStep4PlannedResponseRowsIFRCStaffValueFieldLabel,
      'options': defaultFieldOptions,
      'key': 'ifrcStaff',
      'label': {
        'EVT': strings.fieldsStep4PlannedResponseRowsIFRCStaffEVTEPIEWLabel,
        'EPI': strings.fieldsStep4PlannedResponseRowsIFRCStaffEVTEPIEWLabel,
        'EW': strings.fieldsStep4PlannedResponseRowsIFRCStaffEVTEPIEWLabel,
      }
    },
    {
      'name': 'forecast-based-action',
      'valueFieldLabel': strings.fieldsStep4PlannedResponseRowsForecastBasedActionValueFieldLabel,
      'options': drefOptions,
      'key': 'forecastBasedAction',
      'label': {
        'EVT': null,
        'EPI': null,
        'EW': strings.fieldsStep4PlannedResponseRowsForecastBasedActionEWLabel,
      }
    }
  ],
  contactRows: [
    {
      'name': 'contact-originator',
      'key': 'contactOriginator',
      'label': strings.fieldsStep4ContactRowsOriginatorLabel,
      'desc': {
        'EVT': strings.fieldsStep4ContactRowsOriginatorEVTEPIEWDesc,
        'EPI': strings.fieldsStep4ContactRowsOriginatorEVTEPIEWDesc,
        'EW': strings.fieldsStep4ContactRowsOriginatorEVTEPIEWDesc,
      }
    },
    {
      'name': 'contact-nat-soc',
      'key': 'contactNatSoc',
      'label': strings.fieldsStep4ContactRowsNSContactLabel,
      'desc': {
        'EVT': strings.fieldsStep4ContactRowsNSContactEVTEPIDesc,
        'EPI': strings.fieldsStep4ContactRowsNSContactEVTEPIDesc,
        'EW': strings.fieldsStep4ContactRowsNSContactEWDesc,
      }
    },
    {
      'name': 'contact-federation',
      'key': 'contactFederation',
      'label': strings.fieldsStep4ContactRowsFederationContactLabel,
      'desc': {
        'EVT': strings.fieldsStep4ContactRowsFederationContactEVTEPIDesc,
        'EPI': strings.fieldsStep4ContactRowsFederationContactEVTEPIDesc,
        'EW': strings.fieldsStep4ContactRowsFederationContactEWDesc,
      }
    },
    {
      'name': 'contact-media',
      'key': 'contactMedia',
      'label': strings.fieldsStep4ContactRowsMediaContactLabel,
      'desc': {
        'EVT': strings.fieldsStep4ContactRowsMediaContactEVTEPIEWDesc,
        'EPI': strings.fieldsStep4ContactRowsMediaContactEVTEPIEWDesc,
        'EW': strings.fieldsStep4ContactRowsMediaContactEVTEPIEWDesc,
      }
    }
  ],
});
