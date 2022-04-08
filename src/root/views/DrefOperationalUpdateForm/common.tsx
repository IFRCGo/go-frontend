
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
  type_of_onset: number;
  disaster_category: number;
  country_district: CountryDistrict[];
  num_affected: number;
  num_assisted: number;
  additional_amount_requested: number;
  amount_total: number;
  operational_update_number: number;

  //TimeFrames
  date_of_the_update: string;
  reporting_timeframe: string;
  timeframe_extension_requested: boolean;
  new_operational_end_date: string;
  total_operating_timeframe: number;
  date_of_approval: string;

  //Tracking Data

  //summary of changes
  changing_the_timeframe: boolean;
  changing_the_operational_strategy: boolean;
  changing_the_target_population: boolean;
  changing_the_geographical_location: boolean;
  changing_the_budget: boolean;
  request_for_second_allocation: boolean;
  explain_summary: string;

  //event
  has_anything_changed: string;

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

  //others
  un_or_other: string;
  affect_same_area: boolean;
  affect_same_population: boolean;
  affect_same_population_text: string;
  anticipatory_actions: string,
  appeal_code: string;
  boys: number;
  communication: string;
  community_involved: string;
  cover_image: number;
  created_at: string;
  disability_people_per: number;
  displaced_people: number;
  emergency_appeal_planned: boolean;
  end_date: string;
  entity_affected: string,
  event_date: string;
  event_map: number;
  field_report: number;
  images: number[];
  event_description: string;
  event_scope: string;
  event_text: string;
  girls: number;
  glide_code: string;
  go_field_report_date: string;
  human_resource: string;
  id: string;
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
  lessons_learned: string;
  logistic_capacity_of_ns: string;
  media_contact_email: string;
  media_contact_name: string;
  media_contact_phone_number: string;
  media_contact_title: string;
  men: number;
  modified_at: string;
  modified_by: number;

  // FIXME: this typing for details should not be here
  modified_by_details: {};

  national_society_contact_email: string;
  national_society_contact_name: string;
  national_society_contact_phone_number: string;
  national_society_contact_title: string;

  ns_request_date: string;
  ns_request_fund: boolean;
  ns_request_text: string;
  ns_respond: boolean;
  ns_respond_date: string;
  operation_objective: string;
  operation_timeframe: number;
  originator_email: string;
  originator_name: string;
  originator_phone_number: string;
  originator_title: string;

  people_assisted: string;
  people_per_urban: number;
  people_per_local: number;
  people_targeted_with_early_actions: number;
  budget_file: number;
  planned_interventions: Intervention[];
  pmer: string;
  publishing_date: string;
  response_strategy: string;
  safety_concerns: string;
  selection_criteria: string;
  start_date: string;
  status: number;
  submission_to_geneva: string;
  surge_personnel_deployed: string;

  women: number;
  dref_recurrent_text: string;
  total_targeted_population: number;
  users: number[];
}

export const overviewFields: (keyof DrefOperationalUpdateFields)[] = [];
export const eventFields: (keyof DrefOperationalUpdateFields)[] = [];
export const needsFields: (keyof DrefOperationalUpdateFields)[] = [];
export const operationFields: (keyof DrefOperationalUpdateFields)[] = [];
export const submissionFields: (keyof DrefOperationalUpdateFields)[] = [];
