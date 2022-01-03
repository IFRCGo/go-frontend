import { isDefined } from '@togglecorp/fujs';
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
  clientId: string;
  country: number;
  district: number;
}

export interface ReferenceData {
  clientId: string;
  reference_date: string;
  reference_name: string;
  reference_url: string;
  reference_image: number;
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
  field_report: number;
  users: number[];
  country_district: CountryDistrict[];
  country?: number | undefined;
  district?: number | undefined;
  hazard_type: number;
  title: string;
  situational_overview: string;
  graphic_image: number;
  map_image: number;
  reference_date: string;
  reference_name: string;
  reference_url: string;
  reference_image: number;

  actions_taken_by_national_society: string;
  actions_taken_by_Ifrc: string;
  actions_taken_by_Rcrc: string;
  actions_taken_by_Government: string;

  originator_title: string;
  originator_name: string;
  originator_email: string;
  originator_phone_number: string;
  ifrc_appeal_manager_name: string;
  ifrc_appeal_manager_title: string;
  ifrc_appeal_manager_email: string;
  ifrc_appeal_manager_phone_number: string;
  ifrc_share_with: number;


  actions_ntls: number[];
  actions_ntls_desc: string;
  actions_fdrn: number[];
  actions_fdrn_desc: string;
  actions_pns: number[];
  actions_pns_desc: string;
  bulletin: number;
  actions_others: string;
}

export interface InformalUpdateApiFields extends Omit<InformalUpdateFields, 'country_district'> {
  user: number;
  country_district: (Omit<CountryDistrict, 'clientId'> & {
    id: number
    country_details: Country,
    district_details: DistrictMini[],
  })[];
}

export type OrganizationType = 'NTLS' | 'PNS' | 'FDRN';
export type ReportType = 'EW' | 'EVT' | 'EPI' | 'COVID';

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

export interface FieldReportAPIFields {
  // Actions
  actions_taken: {
    organization: OrganizationType;
    summary?: string;
    actions: number[];
  }[]
}

export type ActionByReportType = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in ReportType]: ActionFields[];
}


export type ActionsByOrganization = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in OrganizationType]: Action[]
};

export const contextFields: (keyof InformalUpdateFields)[] = [
  'country',
  'district',
  'hazard_type',
  'title',
  'situational_overview',
  'graphic_image',
  'map_image',
  'references',
  'country_district',
  'users',
  'field_report',
  'title',
  'reference_name',
  'reference_date',
  'reference_url',
  'reference_image',

];

export const actionsFields: (keyof InformalUpdateFields)[] = [
  'actions_taken_by_national_society',
  'actions_taken_by_Ifrc',
  'actions_taken_by_Rcrc',
  'actions_taken_by_Government',
];

export const focalFields: (keyof InformalUpdateFields)[] = [
  'originator_name',
  'originator_title',
  'originator_email',
  'originator_phone_number',
  'ifrc_share_with',
];

export const submissionFields: (keyof InformalUpdateFields)[] = [
  'ifrc_appeal_manager_name',
  'ifrc_appeal_manager_email',
  'ifrc_appeal_manager_phone_number',
  'ifrc_appeal_manager_title',

];
