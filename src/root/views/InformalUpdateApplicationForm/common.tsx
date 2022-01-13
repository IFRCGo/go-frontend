import {
  isDefined,
  isNotDefined,
  randomString
} from '@togglecorp/fujs';
import {
  Country,
  DistrictMini,
} from '#types';

export const ONSET_IMMINENT = 0;
export const ONSET_SLOW = 1;
export const ONSET_SUDDEN = 2;

export const IFRC_SECRETARIAT = 1;
export const RCRC_NETWORK = 2;
export const RCRC_NETWORK_AND_DONORS = 3;

export interface NumericValueOption {
  value: number;
  label: string;
}

export interface BooleanValueOption {
  value: boolean;
  label: string;
}

export interface StringValueOption {
  value: string;
  label: string;
}

export interface NumericKeyValuePair {
  key: number;
  value: string;
}

export interface StringKeyValuePair {
  key: string;
  value: string;
}

export interface User {
  id: number;
}
export interface InformalUpdateTableFields {
  id: number;
  last_date: string;
  report: string;
  hazard_type: string;
  country: string;
}

export interface Entity {
  id: number;
  name: string;
}

export interface CountryDistrict {
  //clientId: string;
  country: number | undefined;
  district: number | undefined;
}

export interface ReferenceData {
  clientId: string;
  date: string;
  source_description: string;
  url: string;
  image: number;
}

export type Option = NumericValueOption | BooleanValueOption | StringValueOption;
export const emptyOptionList: Option[] = [];
export const emptyStringOptionList: StringValueOption[] = [];
export const emptyNumericOptionList: NumericValueOption[] = [];
export const emptyBooleanOptionList: BooleanValueOption[] = [];

export function getDefinedValues<T extends Record<string, any>>(o: T): Partial<T> {
  type Key = keyof T;
  const keys = Object.keys(o) as Key[];
  const definedValues: Partial<T> = {};
  keys.forEach((key) => {
    if (isDefined(o[key])) {
      definedValues[key] = o[key];
    }
  });

  return definedValues;
}

export const optionKeySelector = (o: Option) => o.value;
export const numericOptionKeySelector = (o: NumericValueOption) => o.value;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const booleanOptionKeySelector = (o: BooleanValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;
export const tableKeySelector = (o: InformalUpdateTableFields) => o.id;

export interface InformalUpdateFields {
  id: number;
  references: ReferenceData[];
  country_district: CountryDistrict[];
  country?: number | undefined;
  district?: number | undefined;
  hazard_type: number;
  title: string;
  situational_overview: string;
  graphic: number;
  map: number;
  reference_date: string;
  reference_name: string;
  reference_url: string;
  reference_image: number;

  actions_fdrn: number[];
  actions_pns: number[];

  actions_ntls: number[];
  actions_ntls_desc: string;
  actions_ifrc: number[];
  actions_ifrc_desc: string;
  actions_rcrc: number[];
  actions_rcrc_desc: string;
  actions_government: number[];
  actions_government_desc: string;

  originator_title: string;
  originator_name: string;
  originator_email: string;
  originator_phone: string;
  ifrc_name: string;
  ifrc_title: string;
  ifrc_email: string;
  ifrc_phone: string;
  share_with: number;
}

export interface InformalUpdateAPIFields {
  country_district: CountryDistrict[];
  hazard_type: number;
  title: string;
  situational_overview: string;
  graphic: number;
  map: number;
  references: ReferenceData[];

  // Actions
  actions_taken: {
    organization: OrganizationType;
    summary?: string;
    actions: number[];
  }[]

  originator_title: string;
  originator_name: string;
  originator_email: string;
  originator_phone: string;
  ifrc_name: string;
  ifrc_title: string;
  ifrc_email: string;
  ifrc_phone: string;
  share_with: number;
}

export type OrganizationType = 'NTLS' | 'PNS' | 'FDRN';
export type ReportType = 'EW' | 'EVT';

export type Action = {
  value: number;
  label: string;
  category: string;
  description: string | undefined;
  organization: OrganizationType;
}

export interface ActionFields {
  category: string;
  field_report_types: ReportType[];
  id: number;
  name: string;
  organizations: OrganizationType[]
  tooltip_text: string | null;
}
export const emptyActionList: ActionFields[] = [];

export type ActionByReportType = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in ReportType]: ActionFields[];
}


export type ActionsByOrganization = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in OrganizationType]: Action[];
};
export type ActionsByOrganizationArrayLists = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in OrganizationType]: ActionFields[];
};

export const contextFields: (keyof InformalUpdateFields)[] = [
  'country',
  'district',
  'hazard_type',
  'title',
  'situational_overview',
  'graphic',
  'map',
  'references',
  'country_district',
  'title',
  'reference_name',
  'reference_date',
  'reference_url',
  'reference_image',

];

export const actionsFields: (keyof InformalUpdateFields)[] = [
  'actions_ntls',
  'actions_ntls_desc',
  'actions_ifrc',
  'actions_ifrc_desc',
  'actions_rcrc',
  'actions_rcrc_desc',
  'actions_government',
  'actions_government_desc'
];

export const focalFields: (keyof InformalUpdateFields)[] = [
  'originator_name',
  'originator_title',
  'originator_email',
  'originator_phone',
  'ifrc_title',
  'ifrc_name',
  'ifrc_email',
  'ifrc_phone',
  'share_with'
];



export function transformFormFieldsToAPIFields(formValues: InformalUpdateFields): InformalUpdateAPIFields {
  const {
    country,
    district,
    country_district,
    hazard_type,
    title,
    situational_overview,
    graphic,
    map,
    references,

    actions_ntls,
    actions_ntls_desc,
    actions_ifrc,
    actions_ifrc_desc,
    actions_rcrc,
    actions_rcrc_desc,
    actions_government,
    actions_government_desc,

    originator_email,
    originator_name,
    originator_title,
    originator_phone,
    ifrc_email,
    ifrc_name,
    ifrc_phone,
    ifrc_title,
    share_with
  } = formValues;

  const actions_taken: InformalUpdateAPIFields['actions_taken'] = [];
  if (isDefined(actions_ntls_desc) || (actions_ntls ?? []).length > 0) {
    actions_taken.push({
      organization: 'NTLS',
      summary: actions_ntls_desc,
      actions: actions_ntls,
    });
  }

  if (isNotDefined(country_district) || (country_district ?? [].length < 1)) {
    country_district.push({
      //clientId: randomString(),
      country: country,
      district: district
    });

  }

  return {
    country_district,
    hazard_type,
    title,
    situational_overview,
    graphic,
    map,
    references,

    actions_taken,
    originator_name,
    originator_title,
    originator_email,
    originator_phone,

    ifrc_email,
    ifrc_name,
    ifrc_title,
    ifrc_phone,
    share_with,
  };
}
