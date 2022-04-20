import {
  Country,
  DistrictMini,
} from "#types/country";

export const ONSET_IMMINENT = 0;
export const ONSET_SLOW = 1;
export const ONSET_SUDDEN = 2;
export const timeframe_extension_requested = true;

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

export type Option = NumericValueOption | BooleanValueOption | StringValueOption;

export const emptyOptionList: Option[] = [];
export const emptyStringOptionList: StringValueOption[] = [];
export const emptyNumericOptionList: NumericValueOption[] = [];
export const emptyBooleanOptionList: BooleanValueOption[] = [];

export interface Entity {
  id: number;
  name: string;
}

export interface CountryDistrict {
  clientId: string;
  country: number;
  district: number[];
}

export interface Need {
  clientId: string;
  title: string;
  description: string;
}

export interface NsAction {
  clientId: string;
  title: string;
  description: string;
}

export interface Intervention {
  clientId: string;
  title: string;
  budget: number;
  person_targeted: number;
  indicator: string;
  description: string;
}

export const optionKeySelector = (o: Option) => o.value;
export const numericOptionKeySelector = (o: NumericValueOption) => o.value;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const booleanOptionKeySelector = (o: BooleanValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;

export interface DrefOperationalUpdateFields {
  title: string;
  national_society: number;
  disaster_type: number;
  disaster_category: number;
  type_of_onset: number;
  country_district: CountryDistrict[];
  number_of_people_affected: number;
  number_of_people_targeted: number;
  additional_allocation: number;
  total_dref_allocation: number;
  emergency_appeal_planned: boolean;
  images: number[];
  operational_update_number: number;
  update_date: string;
  reporting_timeframe: string;
  is_timeframe_extension_required: boolean;
  new_operational_end_date: string;
  total_operation_timeframe: number;
  date_of_approval: string;
  changing_timeframe_operation: boolean;
  changing_operation_strategy: boolean;
  changing_target_population_of_operation: boolean;
  changing_geographic_location: boolean;
  changing_budget: boolean;
  request_for_second_allocation: boolean;
  summary_of_change: string;
  change_since_request: string;
  national_society_actions: NsAction[];
  ifrc: string;
  icrc: string;
  partner_national_society: string;
  government_requested_assistance: boolean;
  government_requested_assistance_date: string;
  national_authorities: string;
  un_or_other_actor: string;
  major_coordination_mechanism: string;
  needs_identified: Need[];
  identified_gaps: string;
  people_assisted: string;
  selection_criteria: string;
  entity_affected: string;
  women: number;
  men: number;
  girls: number;
  boys: number;
  disability_people_per: number;
  people_per_urban: number;
  people_per_local: number;
  displaced_people: number;
  people_targeted_with_early_actions: number;
  operation_objective: string;
  response_strategy: string;
  planned_interventions: Intervention[];
  ifrc_appeal_manager_email: string;
  ifrc_appeal_manager_name: string;
  ifrc_appeal_manager_phone_number: string;
  ifrc_appeal_manager_title: string;
  ifrc_emergency_email: string;
  ifrc_emergency_name: string;
  ifrc_emergency_phone_number: string;
  ifrc_emergency_title: string;
  ifrc_project_manager_email: string;
  ifrc_project_manager_name: string;
  ifrc_project_manager_phone_number: string;
  ifrc_project_manager_title: string;
  national_society_contact_email: string;
  national_society_contact_name: string;
  national_society_contact_phone_number: string;
  national_society_contact_title: string;
  media_contact_email: string;
  media_contact_name: string;
  media_contact_phone_number: string;
  media_contact_title: string;
  appeal_code: string;
  glide_code: string;
  id: string;
  created_at: string;
  modified_at: string;
  modified_by: number;
  users: number[];
  dref?: string;
}

export interface DrefOperationalUpdateApiFields extends Omit<DrefOperationalUpdateFields, 'country_district' | 'planned_interventions' | 'national_society_actions' | 'needs_identified'> {
  user: number;
  country_district: (Omit<CountryDistrict, 'clientId'> & {
    id: number
    country_details: Country,
    district_details: DistrictMini[],
  })[];
  planned_interventions: (Omit<Intervention, 'clientId'> & {
    id: number,
    image_url: string,
  })[];
  national_society_actions: (Omit<NsAction, 'clientId'> & { id: number })[];
  needs_identified: (Omit<Need, 'clientId'> & {
    id: number,
    image_url: string,
  })[];
  images_details: {
    id: number;
    file: string;
  }[];
}


export const overviewFields: (keyof DrefOperationalUpdateFields)[] = [
  'title',
  'national_society',
  'disaster_type',
  'disaster_category',
  'country_district',
  'type_of_onset',
  'number_of_people_affected',
  'number_of_people_targeted',
  'additional_allocation',
  'total_dref_allocation',
  'images',
  'operational_update_number',
  'emergency_appeal_planned',
  'update_date',
  'reporting_timeframe',
  'is_timeframe_extension_required',
  'new_operational_end_date',
  'total_operation_timeframe',
  'date_of_approval'

];
export const eventFields: (keyof DrefOperationalUpdateFields)[] = [
  'changing_timeframe_operation',
  'changing_operation_strategy',
  'changing_target_population_of_operation',
  'changing_geographic_location',
  'changing_budget',
  'request_for_second_allocation',
  'summary_of_change',
  'change_since_request',
];
export const needsFields: (keyof DrefOperationalUpdateFields)[] = [
  'national_society_actions',
  'ifrc',
  'icrc',
  'partner_national_society',
  'government_requested_assistance',
  'government_requested_assistance_date',
  'national_authorities',
  'un_or_other_actor',
  'major_coordination_mechanism',
  'needs_identified',
  'identified_gaps',
];
export const operationFields: (keyof DrefOperationalUpdateFields)[] = [
  'people_assisted',
  'selection_criteria',
  'entity_affected',
  'women',
  'men',
  'girls',
  'boys',
  'disability_people_per',
  'people_per_urban',
  'people_per_local',
  'displaced_people',
  'people_targeted_with_early_actions',
  'operation_objective',
  'response_strategy',
  'planned_interventions',
];
export const submissionFields: (keyof DrefOperationalUpdateFields)[] = [
  'appeal_code',
  'glide_code',
  'ifrc_appeal_manager_name',
  'ifrc_appeal_manager_email',
  'ifrc_appeal_manager_phone_number',
  'ifrc_appeal_manager_title',
  'ifrc_project_manager_name',
  'ifrc_project_manager_email',
  'ifrc_project_manager_phone_number',
  'ifrc_project_manager_title',
  'national_society_contact_name',
  'national_society_contact_email',
  'national_society_contact_phone_number',
  'national_society_contact_title',
  'ifrc_emergency_name',
  'ifrc_emergency_email',
  'ifrc_emergency_phone_number',
  'ifrc_emergency_title',
  'media_contact_name',
  'media_contact_email',
  'media_contact_phone_number',
  'media_contact_title',
];
