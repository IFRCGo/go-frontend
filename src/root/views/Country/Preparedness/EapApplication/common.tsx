import { Country, DistrictMini } from "#types/country";

export interface CountryDistrict {
  clientId: string;
  country: number;
  district: number[];
}
export interface StringValueOption {
  value: string;
  label: string;
}

export interface NumericKeyValuePair {
  key: number;
  value: string;
}
export interface BooleanValueOption {
  value: boolean;
  label: string;
}

export interface StringKeyValuePair {
  key: string;
  value: string;
}

export interface Status {
  key: number;
}

export const emptyOptionList: Option[] = [];
export const emptyStringOptionList: StringValueOption[] = [];
export const emptyNumericOptionList: NumericValueOption[] = [];
export type Option = NumericValueOption | BooleanValueOption | StringValueOption;

export interface EapsFields {
  eap_number: number;
  approval_date: string;
  status: string;
  operational_timeframe: number;
  lead_time: number;
  eap_timeframe: number;
  num_of_people: number;
  total_budget: number;
  readiness_budget: number;
  pre_positioning_budget: number;
  early_action_budget: number;
  trigger_statement: string;
  overview: string;
  document: number;
  budget_per_sector: number;
  sector: string;
  readiness_activities: string;
  prepositioning_activities: string;
  early_actions: string;
  originator_name: string;
  originator_title: string;
  originator_email: string;
  originator_phone: string;
  nsc_name: string;
  nsc_title: string;
  nsc_email: string;
  nsc_phone: number;
  ifrc_focal_name: string;
  ifrc_focal_title: string;
  ifrc_focal_email: string;
  ifrc_focal_phone: string;
  country: CountryDistrict[];
  district: string[];
  disaster_type: number;
  targeted_people: number;
  partners: string;
  references: string;
}

export interface EapsApiFields extends Omit<EapsFields, 'country_district' | 'planned_interventions' | 'national_society_actions' | 'needs_identified'> {
  country_district: (Omit<CountryDistrict, 'clientId'> & {
    id: number
    country_details: Country,
    district_details: DistrictMini[],
  })[];
}

export interface NumericValueOption {
  value: number;
  label: string;
}

export const eventDetailsFields: (keyof EapsFields)[] = [
  'early_actions',
];

export const overviewFields: (keyof EapsFields)[] = [
  'country',
  'district',
  'disaster_type',
  'eap_number',
  'approval_date',
  'status',
  'operational_timeframe',
  'lead_time',
  'eap_timeframe',
  'num_of_people',
  'total_budget',
  'readiness_budget',
  'pre_positioning_budget',
  'early_action_budget',
  'trigger_statement',
  'overview',
  'document',
  'num_of_people',
  'partners'
];

export const contactFields: (keyof EapsFields)[] = [
  'originator_name',
  'originator_title',
  'originator_email',
  'originator_phone',
  'nsc_name',
  'nsc_title',
  'nsc_email',
  'nsc_phone',
  'ifrc_focal_name',
  'ifrc_focal_title',
  'ifrc_focal_email',
  'ifrc_focal_phone',
];

export const earlyActionFields: (keyof EapsFields)[] = [
  'budget_per_sector',
  'sector',
  'readiness_activities',
  'prepositioning_activities',
  'early_actions',
  'targeted_people',
];
