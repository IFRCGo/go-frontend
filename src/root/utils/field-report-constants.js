import { listToMap } from '@togglecorp/fujs';

// FIXME: pull this list from server
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

// FIXME: pull this list from server
export const countryList = [
  {value: '1', label: 'Ukraine', iso: 'ua'},
  {value: '2', label: 'United Arab Emirates', iso: 'ae'},
  {value: '3', label: 'United Kingdom', iso: 'gb'},
  {value: '4', label: 'United States', iso: 'us'},
  {value: '5', label: 'Uruguay', iso: 'uy'},
  {value: '6', label: 'Uzbekistan', iso: 'uz'},
  {value: '7', label: 'Vanuatu', iso: 'vu'},
  {value: '8', label: 'Venezuela', iso: 've'},
  {value: '10', label: 'Yemen', iso: 'ye'},
  // {value: '11', label: 'Serbia and Montenegro', iso: 'cs'},
  {value: '12', label: 'Zambia', iso: 'zm'},
  {value: '13', label: 'Zimbabwe', iso: 'zw'},
  {value: '14', label: 'Afghanistan', iso: 'af'},
  {value: '15', label: 'Albania', iso: 'al'},
  {value: '16', label: 'Algeria', iso: 'dz'},
  {value: '17', label: 'Andorra', iso: 'ad'},
  {value: '18', label: 'Angola', iso: 'ao'},
  {value: '19', label: 'Antigua and Barbuda', iso: 'ag'},
  {value: '20', label: 'Argentina', iso: 'ar'},
  {value: '21', label: 'Armenia', iso: 'am'},
  {value: '22', label: 'Australia', iso: 'au'},
  {value: '23', label: 'Austria', iso: 'at'},
  {value: '25', label: 'Bahamas, The', iso: 'bs'},
  {value: '26', label: 'Bahrain', iso: 'bh'},
  {value: '27', label: 'Bangladesh', iso: 'bd'},
  {value: '28', label: 'Barbados', iso: 'bb'},
  {value: '29', label: 'Belarus', iso: 'by'},
  {value: '30', label: 'Belgium', iso: 'be'},
  {value: '31', label: 'Belize', iso: 'bz'},
  {value: '33', label: 'Bolivia', iso: 'bo'},
  {value: '34', label: 'Botswana', iso: 'bw'},
  {value: '35', label: 'Brazil', iso: 'br'},
  {value: '36', label: 'Brunei Darussalam', iso: 'bn'},
  {value: '37', label: 'Bulgaria', iso: 'bg'},
  {value: '39', label: 'Burundi', iso: 'bi'},
  {value: '40', label: 'Cambodia', iso: 'kh'},
  {value: '41', label: 'Cameroon', iso: 'cm'},
  {value: '42', label: 'Canada', iso: 'ca'},
  {value: '43', label: 'Cape Verde', iso: 'cv'},
  {value: '44', label: 'Central African Republic', iso: 'cf'},
  {value: '45', label: 'Chad', iso: 'td'},
  {value: '46', label: 'Chile', iso: 'cl'},
  {value: '47', label: 'China', iso: 'cn'},
  {value: '48', label: 'Colombia', iso: 'co'},
  {value: '51', label: 'Costa Rica', iso: 'cr'},
  {value: '53', label: 'Croatia', iso: 'hr'},
  {value: '54', label: 'Cuba', iso: 'cu'},
  {value: '55', label: 'Czech Republic', iso: 'cz'},
  {value: '56', label: 'Denmark', iso: 'dk'},
  {value: '57', label: 'Djibouti', iso: 'dj'},
  {value: '58', label: 'Dominica', iso: 'dm'},
  {value: '59', label: 'Dominican Republic', iso: 'do'},
  {value: '60', label: 'Ecuador', iso: 'ec'},
  {value: '61', label: 'Egypt, Arab Rep.', iso: 'eg'},
  {value: '62', label: 'El Salvador', iso: 'sv'},
  {value: '63', label: 'Equatorial Guinea', iso: 'gq'},
  {value: '64', label: 'Estonia', iso: 'ee'},
  {value: '65', label: 'Ethiopia', iso: 'et'},
  {value: '66', label: 'Fiji', iso: 'fj'},
  {value: '67', label: 'Finland', iso: 'fi'},
  {value: '68', label: 'France', iso: 'fr'},
  {value: '69', label: 'Gabon', iso: 'ga'},
  {value: '70', label: 'Gambia, The', iso: 'gm'},
  {value: '71', label: 'Georgia', iso: 'ge'},
  {value: '72', label: 'Germany', iso: 'de'},
  {value: '73', label: 'Ghana', iso: 'gh'},
  {value: '74', label: 'Greece', iso: 'gr'},
  {value: '75', label: 'Grenada', iso: 'gd'},
  {value: '76', label: 'Guatemala', iso: 'gt'},
  {value: '77', label: 'Guinea', iso: 'gn'},
  {value: '79', label: 'Guyana', iso: 'gy'},
  {value: '80', label: 'Haiti', iso: 'ht'},
  {value: '81', label: 'Honduras', iso: 'hn'},
  {value: '82', label: 'Hungary', iso: 'hu'},
  {value: '83', label: 'Iceland', iso: 'is'},
  {value: '84', label: 'India', iso: 'in'},
  {value: '85', label: 'Indonesia', iso: 'id'},
  {value: '87', label: 'Iraq', iso: 'iq'},
  {value: '88', label: 'Ireland', iso: 'ie'},
  {value: '89', label: 'Italy', iso: 'it'},
  {value: '90', label: 'Jamaica', iso: 'jm'},
  {value: '91', label: 'Japan', iso: 'jp'},
  {value: '92', label: 'Jordan', iso: 'jo'},
  {value: '93', label: 'Kenya', iso: 'ke'},
  {value: '94', label: 'Kiribati', iso: 'ki'},
  {value: '97', label: 'Kuwait', iso: 'kw'},
  {value: '98', label: 'Kyrgyzstan', iso: 'kg'},
  {value: '99', label: 'Lao PDR', iso: 'la'},
  {value: '100', label: 'Latvia', iso: 'lv'},
  {value: '101', label: 'Lebanon', iso: 'lb'},
  {value: '102', label: 'Lesotho', iso: 'ls'},
  {value: '103', label: 'Liberia', iso: 'lr'},
  {value: '105', label: 'Liechtenstein', iso: 'li'},
  {value: '106', label: 'Lithuania', iso: 'lt'},
  {value: '107', label: 'Luxembourg', iso: 'lu'},
  {value: '108', label: 'North Macedonia, Republic of', iso: 'mk'},
  {value: '109', label: 'Madagascar', iso: 'mg'},
  {value: '110', label: 'Malawi', iso: 'mw'},
  {value: '111', label: 'Malaysia', iso: 'my'},
  {value: '112', label: 'Mali', iso: 'ml'},
  {value: '113', label: 'Malta', iso: 'mt'},
  {value: '114', label: 'Mauritania', iso: 'mr'},
  {value: '115', label: 'Mauritius', iso: 'mu'},
  {value: '116', label: 'Mexico', iso: 'mx'},
  {value: '117', label: 'Monaco', iso: 'mc'},
  {value: '119', label: 'Morocco', iso: 'ma'},
  {value: '120', label: 'Mozambique', iso: 'mz'},
  {value: '121', label: 'Myanmar', iso: 'mm'},
  {value: '122', label: 'Namibia', iso: 'na'},
  {value: '123', label: 'Nepal', iso: 'np'},
  {value: '124', label: 'Netherlands', iso: 'nl'},
  {value: '125', label: 'New Zealand', iso: 'nz'},
  {value: '126', label: 'Nicaragua', iso: 'ni'},
  {value: '127', label: 'Niger', iso: 'ne'},
  {value: '128', label: 'Nigeria', iso: 'ng'},
  {value: '129', label: 'Norway', iso: 'no'},
  {value: '130', label: 'Palau', iso: 'pw'},
  {value: '131', label: 'Pakistan', iso: 'pk'},
  {value: '132', label: 'Panama', iso: 'pa'},
  {value: '133', label: 'Papua New Guinea', iso: 'pg'},
  {value: '134', label: 'Paraguay', iso: 'py'},
  {value: '135', label: 'Peru', iso: 'pe'},
  {value: '136', label: 'Philippines', iso: 'ph'},
  {value: '138', label: 'Portugal', iso: 'pt'},
  {value: '139', label: 'Qatar', iso: 'qa'},
  {value: '141', label: 'Romania', iso: 'ro'},
  {value: '142', label: 'Russian Federation', iso: 'ru'},
  {value: '143', label: 'Rwanda', iso: 'rw'},
  {value: '147', label: 'Samoa', iso: 'ws'},
  {value: '149', label: 'Saudi Arabia', iso: 'sa'},
  {value: '150', label: 'Senegal', iso: 'sn'},
  {value: '151', label: 'Seychelles', iso: 'sc'},
  {value: '152', label: 'Sierra Leone', iso: 'sl'},
  {value: '153', label: 'Singapore', iso: 'sg'},
  {value: '154', label: 'Slovakia', iso: 'sk'},
  {value: '155', label: 'Slovenia', iso: 'si'},
  {value: '156', label: 'Solomon Islands', iso: 'sb'},
  {value: '157', label: 'Somalia', iso: 'so'},
  {value: '158', label: 'South Africa', iso: 'za'},
  {value: '159', label: 'Spain', iso: 'es'},
  {value: '160', label: 'Sri Lanka', iso: 'lk'},
  {value: '161', label: 'Sudan', iso: 'sd'},
  {value: '163', label: 'eSwatini', iso: 'sz'},
  {value: '164', label: 'Sweden', iso: 'se'},
  {value: '165', label: 'Switzerland', iso: 'ch'},
  {value: '167', label: 'Tajikistan', iso: 'tj'},
  {value: '169', label: 'Thailand', iso: 'th'},
  {value: '170', label: 'Togo', iso: 'tg'},
  {value: '171', label: 'Tonga', iso: 'to'},
  {value: '172', label: 'Trinidad and Tobago', iso: 'tt'},
  {value: '173', label: 'Tunisia', iso: 'tn'},
  {value: '174', label: 'Turkey', iso: 'tr'},
  {value: '175', label: 'Turkmenistan', iso: 'tm'},
  {value: '176', label: 'Uganda', iso: 'ug'},
  {value: '177', label: 'St. Kitts and Nevis', iso: 'kn'},
  {value: '178', label: 'St. Lucia', iso: 'lc'},
  {value: '179', label: 'St. Vincent and the Grenadines', iso: 'vc'},
  {value: '180', label: 'Suriname', iso: 'sr'},
  {value: '181', label: 'Burkina Faso', iso: 'bf'},
  {value: '182', label: 'Côte d\'Ivoire', iso: 'ci'},
  {value: '183', label: 'Guinea-Bissau', iso: 'gw'},
  {value: '184', label: 'Congo', iso: 'cg'},
  {value: '185', label: 'Sao Tomé and Principe', iso: 'st'},
  {value: '186', label: 'Comoros', iso: 'km'},
  {value: '187', label: 'Democratic Republic of the Congo', iso: 'cd'},
  {value: '188', label: 'Eritrea', iso: 'er'},
  {value: '189', label: 'Tanzania, United Republic of', iso: 'tz'},
  {value: '191', label: 'Viet Nam', iso: 'vn'},
  {value: '192', label: 'Republic of Korea', iso: 'kr'},
  {value: '193', label: 'Democratic People\'s Republic of Korea', iso: 'KP'},
  {value: '194', label: 'Mongolia', iso: 'mn'},
  {value: '195', label: 'Micronesia, Federates States of', iso: 'fm'},
  {value: '197', label: 'Bosnia and Herzegovina', iso: 'ba'},
  {value: '199', label: 'Poland', iso: 'pl'},
  {value: '200', label: 'Azerbaijan', iso: 'az'},
  {value: '201', label: 'Kazakhstan', iso: 'kz'},
  {value: '202', label: 'Moldova', iso: 'md'},
  {value: '203', label: 'Iran, Islamic Republic of', iso: 'ir'},
  {value: '204', label: 'Libya', iso: 'ly'},
  {value: '205', label: 'Palestine', iso: 'ps'},
  {value: '206', label: 'Syrian Arab Republic', iso: 'sy'},
  {value: '209', label: 'Benin', iso: 'bj'},
  {value: '210', label: 'Timor-Leste', iso: 'tl'},
  {value: '211', label: 'Cook Islands', iso: 'ck'},
  {value: '212', label: 'Marshall Islands', iso: 'mh'},
  {value: '213', label: 'Tuvalu', iso: 'tv'},
  {value: '215', label: 'British Indian Overseas Territories', iso: 'io'},
  {value: '216', label: 'Montserrat', iso: 'ms'},
  {value: '217', label: 'Anguilla', iso: 'ai'},
  {value: '218', label: 'Virgin Islands, British', iso: 'vg'},
  {value: '219', label: 'Turks and Caicos Islands', iso: 'tc'},
  {value: '220', label: 'Cayman Islands', iso: 'ky'},
  {value: '222', label: 'Israel', iso: 'il'},
  {value: '223', label: 'Netherlands Antilles', iso: 'an'},
  {value: '224', label: 'French Guiana', iso: 'gf'},
  {value: '225', label: 'Guadeloupe', iso: 'gp'},
  {value: '226', label: 'Martinique', iso: 'mq'},
  {value: '227', label: 'Maldives', iso: 'mv'},
  {value: '228', label: 'Cyprus', iso: 'CY'},
  {value: '229', label: 'American Samoa', iso: 'as'},
  {value: '230', label: 'Antarctica', iso: 'aq'},
  {value: '231', label: 'Aruba', iso: 'aw'},
  {value: '232', label: 'Baker Island', iso: 'um'},
  {value: '233', label: 'Bermuda', iso: 'bm'},
  {value: '234', label: 'Bhutan', iso: 'bt'},
  {value: '235', label: 'Christmas Island, Territory of', iso: 'cx'},
  {value: '236', label: 'Cocos Islands, Territory of', iso: 'cc'},
  {value: '237', label: 'Falkland Islands (Malvinas)', iso: 'fk'},
  {value: '238', label: 'Faroe Islands', iso: 'fo'},
  {value: '239', label: 'French Polynesia', iso: 'pf'},
  {value: '240', label: 'French Southern and Antarctic Lands', iso: 'tf'},
  {value: '241', label: 'Gibraltar', iso: 'gi'},
  {value: '242', label: 'Greenland', iso: 'gl'},
  {value: '243', label: 'Guam', iso: 'gu'},
  {value: '244', label: 'Heard I. & McDonald Is.', iso: 'HM'},
  {value: '245', label: 'Howland Island', iso: 'um'},
  {value: '247', label: 'Jarvis Island', iso: 'um'},
  {value: '248', label: 'Johnston Atoll', iso: 'um'},
  {value: '249', label: 'Mayotte', iso: 'yt'},
  {value: '250', label: 'Midway Island', iso: 'um'},
  {value: '251', label: 'Nauru', iso: 'nr'},
  {value: '252', label: 'New Caledonia', iso: 'nc'},
  {value: '253', label: 'Niue', iso: 'nu'},
  {value: '254', label: 'Norkolk Island', iso: 'nf'},
  {value: '255', label: 'Northern Mariana Island', iso: 'mp'},
  {value: '256', label: 'Pitcairn', iso: 'pn'},
  {value: '257', label: 'Puerto Rico', iso: 'pr'},
  {value: '258', label: 'Oman', iso: 'om'},
  {value: '259', label: 'Reunion', iso: 're'},
  {value: '260', label: 'San Marino, Republic of', iso: 'sm'},
  {value: '261', label: 'South Georgia and the South Sandwich Is.', iso: 'gs'},
  {value: '262', label: 'Saint Helena', iso: 'sh'},
  {value: '263', label: 'St. Pierre et Miquelon', iso: 'pm'},
  {value: '264', label: 'Svalbard and Jan Mayen', iso: 'sj'},
  {value: '265', label: 'Tokelau', iso: 'tk'},
  {value: '266', label: 'Virgin Islands, US', iso: 'vi'},
  {value: '267', label: 'Wake Island', iso: 'um'},
  {value: '268', label: 'Wallis and Futuna', iso: 'wf'},
  {value: '269', label: 'Western Sahara', iso: 'eh'},
  {value: '270', label: 'Montenegro', iso: 'me'},
  {value: '271', label: 'Serbia', iso: 'rs'},
  {value: '272', label: 'Guernesey', iso: 'gg'},
  {value: '273', label: 'Jersey', iso: 'je'},
  {value: '274', label: 'Holy See', iso: 'va'},
  // {value: '275', label: 'Hong Kong (China)', iso: 'hk'},
  {value: '276', label: 'Isle of Man', iso: 'im'},
  {value: '277', label: 'Aland Island', iso: 'AX'},
  {value: '278', label: 'Bouvet Island', iso: 'BV'},
  // {value: '279', label: 'Macao', iso: 'MO'},
  {value: '280', label: 'St. Martin (French part)', iso: 'MF'},
  // {value: '281', label: 'Republic of China (Taiwan)', iso: 'TW'},
  {value: '282', label: 'Zone Americas', iso: ''},
  {value: '283', label: 'Zone Asia-Pacific', iso: ''},
  {value: '284', label: 'Zone Central and West Africa', iso: ''},
  {value: '285', label: 'Zone Eastern Africa', iso: ''},
  {value: '286', label: 'Zone Europe', iso: ''},
  {value: '287', label: 'Zone MENA', iso: ''},
  {value: '288', label: 'Zone Southern Africa', iso: ''},
  {value: '289', label: 'Zone GLOBAL', iso: ''},
  {value: '290', label: 'South Sudan', iso: 'ss'}
];

export const countries = (countries) => {
  return [
    {value: '-- Country --', label: ''},
    ...countryList,
  ].sort((a, b) => a.label < b.label ? -1 : 1);
};

// export const countries = [
//   {value: '-- Country --', label: ''},
//   ...countryList,
// ].sort((a, b) => a.label < b.label ? -1 : 1);

export const countryIsoMapById = listToMap(
  countryList,
  d => d.value,
  d => d.iso,
);

export const countryIsoMapByName = listToMap(
  countryList,
  d => window.decodeURI(d.name),
  d => d.iso,
);

export const countryNameMapById = listToMap(
  countryList,
  d => d.value,
  d => d.label,
);

export const countryNameMapByIso = listToMap(
  countryList,
  d => d.iso,
  d => d.label,
);

// FIXME: pull this list from server
export const disasterTypeList = [
  {
    value: '66',
    label: 'Biological Emergency'
  },
  {
    value: '57',
    label: 'Chemical Emergency'
  },
  {
    value: '7',
    label: 'Civil Unrest'
  },
  {
    value: '14',
    label: 'Cold Wave'
  },
  {
    value: '6',
    label: 'Complex Emergency'
  },
  {
    value: '4',
    label: 'Cyclone'
  },
  {
    value: '20',
    label: 'Drought'
  },
  {
    value: '2',
    label: 'Earthquake'
  },
  {
    value: '1',
    label: 'Epidemic'
  },
  {
    value: '15',
    label: 'Fire'
  },
  {
    value: '12',
    label: 'Flood'
  },
  {
    value: '21',
    label: 'Food Insecurity'
  },
  {
    value: '19',
    label: 'Heat Wave'
  },
  {
    value: '62',
    label: 'Insect Infestation'
  },
  {
    value: '24',
    label: 'Landslide'
  },
  {
    value: '13',
    label: 'Other'
  },
  {
    value: '27',
    label: 'Pluvial/Flash Flood'
  },
  {
    value: '5',
    label: 'Population Movement'
  },
  {
    value: '67',
    label: 'Radiological Emergency'
  },
  {
    value: '23',
    label: 'Storm Surge'
  },
  {
    value: '54',
    label: 'Transport Accident'
  },
  {
    value: '68',
    label: 'Transport Emergency'
  },
  {
    value: '11',
    label: 'Tsunami'
  },
  {
    value: '8',
    label: 'Volcanic Eruption'
  }
];

export const disasterType = [
  {
    label: '-- Disaster Type --',
    value: ''
  },
  ...disasterTypeList,
];

export const getIsEpidemicDisasterTypeByValue = value =>
  value === '1';

export const disasterTypes = listToMap(disasterTypeList, d => d.value, d => d.label);

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
      label: strings.fieldsStep1StartDateLabelStartDate,
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
      'placeholder': strings.fieldsStep2DescriptionEVTPlaceholder,
    },
    EPI: {
      'label': strings.fieldsStep2DescriptionEPILabel,
      'desc': strings.fieldsStep2DescriptionEPIDescription,
      'placeholder': strings.fieldsStep2DescriptionEPIPlaceholder,
    },
    EW: {
      'label': strings.fieldsStep2DescriptionEWLabel,
      'desc': strings.fieldsStep2DescriptionEWDescription,
      'placeholder': strings.fieldsStep2DescriptionEWPlaceholder,
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
        'EW': strings.fieldsStep3Section1FieldsAssistedGovEWLabel,
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
