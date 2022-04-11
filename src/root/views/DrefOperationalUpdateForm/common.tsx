import {
  Country,
  DistrictMini,
} from "#types/country";

export const ONSET_IMMINENT = 0;
export const ONSET_SLOW = 1;
export const ONSET_SUDDEN = 2;


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
  //TODO
  //Overview
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

  //TimeFrames
  update_date: string;
  reporting_timeframe: string;
  is_timeframe_extension_required: boolean;
  new_operational_end_date: string;
  total_operation_timeframe: number;
  date_of_approval: string;

  //summary of changes
  changing_timeframe_operation: boolean;
  changing_operation_strategy: boolean;
  changing_target_population_of_operation: boolean;
  changing_geographic_location: boolean;
  changing_budget: boolean;
  request_for_second_allocation: boolean;
  summary_of_change: string;
  change_since_request: string;

  //needs  
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

  //operation
  people_assisted: string;
  selection_criteria: string;
  community_involved: string;
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

  //submission
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

  //others
  un_or_other: string;
  affect_same_area: boolean;
  affect_same_population: boolean;
  affect_same_population_text: string;
  anticipatory_actions: string,
  communication: string;
  created_at: string;
  end_date: string;
  entity_affected: string,
  event_date: string;
  field_report: number;
  event_description: string;
  event_scope: string;
  event_text: string;
  go_field_report_date: string;
  human_resource: string;
  id: string;
  lessons_learned: string;
  logistic_capacity_of_ns: string;
  modified_at: string;
  modified_by: number;

  // FIXME: this typing for details should not be here
  modified_by_details: {};
  ns_request_date: string;
  ns_request_fund: boolean;
  ns_request_text: string;
  ns_respond: boolean;
  ns_respond_date: string;
  operation_timeframe: number;
  originator_email: string;
  originator_name: string;
  originator_phone_number: string;
  originator_title: string;
  budget_file: number;
  total_targeted_population: number;

  pmer: string;
  publishing_date: string;

  safety_concerns: string;
  start_date: string;
  status: number;
  submission_to_geneva: string;
  surge_personnel_deployed: string;

  dref_recurrent_text: string;
  users: number[];
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
  event_map_details: {
    id: number;
    file: string;
  };
  cover_image_details: {
    id: number;
    file: string;
  } | null;
  budget_file_details: {
    id: number;
    file: string;
  }
  budget_file_preview: string,
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
  'community_involved',
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
export const submissionFields: (keyof DrefOperationalUpdateFields)[] = [];
