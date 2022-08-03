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
  key: string;
  value: string;
}

export interface Sector {
  clientId: string;
  key: string;
  value: string;
}

export interface Indicator {
  clientId: string;
  indicator: string;
  indicator_value: string;
}

export interface Risk {
  risks: string;
  early_action: number;
  clientId: string;
}

export interface KeyPartner {
  clientId: string;
  name: string;
  url: string;
}

export interface Reference {
  clientId: string;
  source: string;
  url: string;
}

export interface Action {
  clientId: string;
  early_act: string;
}

export interface EarlyAction {
  actions: Action[];
  budget_per_sector: number;
  clientId: string;
  indicators: Indicator[];
  prepositioning_activities: string;
  prioritized_risks: Risk[];
  readiness_activities: string;
  sector: string;
  targeted_people: number;
}

export const emptyOptionList: Option[] = [];
export const emptyStringOptionList: StringValueOption[] = [];
export const emptyNumericOptionList: NumericValueOption[] = [];
export type Option = NumericValueOption | BooleanValueOption | StringValueOption;

export interface EapFormFields {
  id: number;
  eap_number: string;
  approval_date: string;
  early_actions: EarlyAction[];
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
  prepositioning_activities: string;
  originator_name: string;
  originator_title: string;
  originator_email: string;
  originator_phone: number;
  nsc_name: string;
  nsc_title: string;
  nsc_email: string;
  nsc_phone: number;
  ifrc_focal_name: string;
  ifrc_focal_title: string;
  ifrc_focal_email: string;
  ifrc_focal_phone: number;
  country: string;
  district: string;
  disaster_type: number;
  references: Reference[];
  partners: KeyPartner[];
  indicator_value: string[];
  early_act: Action[];
}

export interface EapsApiFields extends Omit<
  EapFormFields,
  'country_district'
  | 'partners'
  | 'references'
> {
  country_district: (Omit<CountryDistrict, 'clientId'> & {
    id: number
    country_details: Country,
    district_details: DistrictMini[],
  })[];
  documents_details: {
    id: number,
    created_by_details: {
      id: number,
      username: string,
      first_name: string,
      last_name: string,
    },
    file: string,
    created_by: string,
  }[];
}

export interface NumericValueOption {
  value: number;
  label: string;
}

export const overviewFields: (keyof EapFormFields)[] = [
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
  'partners',
  'references',
];

export const contactFields: (keyof EapFormFields)[] = [
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

export const earlyActionFields: (keyof EapFormFields)[] = [
  'budget_per_sector',
  'prepositioning_activities',
  'early_actions',
  'indicator_value',
  'early_act',
];
