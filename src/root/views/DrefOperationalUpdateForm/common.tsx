import {
  Country,
  DistrictMini,
} from "#types/country";

export const ONSET_IMMINENT = 0;
export const ONSET_SLOW = 1;
export const ONSET_SUDDEN = 2;

export const DISASTER_FIRE = 15;
export const DISASTER_FLASH_FLOOD = 27;
export const DISASTER_FLOOD = 12;

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
export interface Need {
  clientId: string;
  title: string;
  description: string;
}

export interface NsAction {
  clientId: string;
  title: string;
  description: string;
  title_display: string;
}

export interface Indicator {
  clientId: string;
  title: string;
  target: number;
  actual: number;
}
export interface Intervention {
  clientId: string;
  title: string;
  budget: number;
  person_targeted: number;
  indicators: Indicator[];
  description: string;
  progress_towards_outcome: string;
  male: number;
  female: number;
}

export interface FileWithCaption {
  client_id: string;
  id: number;
  file: string;
  caption: string;
}
export interface RiskSecurityProps {
  clientId: string;
  risk: string;
  mitigation: string;
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
  number_of_people_affected: number;
  number_of_people_targeted: number;
  additional_allocation: number;
  total_dref_allocation: number;
  emergency_appeal_planned: boolean;
  images_file: FileWithCaption[];
  operational_update_number: number;
  new_operational_start_date: string;
  reporting_timeframe: string;
  is_timeframe_extension_required: boolean;
  new_operational_end_date: string;
  total_operation_timeframe: number;
  changing_timeframe_operation: boolean;
  changing_operation_strategy: boolean;
  changing_target_population_of_operation: boolean;
  changing_geographic_location: boolean;
  changing_budget: boolean;
  request_for_second_allocation: boolean;
  summary_of_change: string;
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
  dref_allocated_so_far?: number;
  budget_file: number;
  event_description: string;
  event_scope: string;
  anticipatory_actions: string;
  cover_image_file: FileWithCaption;
  event_map_file: FileWithCaption;
  photos_file: FileWithCaption[];
  country: number;
  district: number[];
  country_details: Country;
  is_assessment_report: boolean;
  is_man_made_event: boolean;
  is_there_major_coordination_mechanism: boolean;
  assessment_report: number;
  risk_security: RiskSecurityProps[];
  risk_security_concern: string;
  human_resource: string;
  pmer: string;
  communication: string;
  logistic_capacity_of_ns: string;
  is_surge_personnel_deployed: boolean;
  surge_personnel_deployed: string;
  has_forecasted_event_materialize: boolean;
  specified_trigger_met: string;
  disaster_type_details: {
    id: number;
    name: string;
    summary: string;
  };
  disaster_category_display: 'Yellow' | 'Red' | 'Orange';
  type_of_onset_display: string;
  supporting_document_details: {
    id: number;
    file: string;
  };
  people_in_need: number;
  event_date: string;
  event_text: string;
  did_national_society: boolean;
  ns_respond_date: string;
  total_targeted_population: number;
  has_event_occurred: boolean;
  reporting_start_date: string;
  reporting_end_date: string;
}

export interface DrefApplicationValidateConditionalField {
  total_operation_timeframe?: number;
  number_of_people_targeted?: number;
  country?: number;
  district?: number[];
  additional_allocation?: number;
}

export interface DrefOperationalUpdateApiFields extends Omit<DrefOperationalUpdateFields, 'district_details' | 'planned_interventions' | 'national_society_actions' | 'needs_identified' | 'cover_image_file' | 'event_map_file' | 'images_file' | 'photos_file'> {
  user: number;
  district_details: DistrictMini[],
  planned_interventions: (Omit<Intervention, 'clientId' | 'indicators'> & {
    id: number,
    image_url: string,
    indicators: (Omit<Indicator, 'clientId'> & {
      id: number,
    })[],
  })[];
  national_society_actions: (Omit<NsAction, 'clientId'> & { id: number })[];
  needs_identified: (Omit<Need, 'clientId'> & {
    id: number,
    image_url: string,
  })[];
  budget_file_details: {
    id: number;
    file: string;
  };
  budget_file_preview: string;
  file: {
    id: number;
    file: string;
  };
  assessment_report_details: {
    id: number;
    file: string;
  };
  disaster_type_details: {
    id: number;
    name: string;
    summary: string;
  };
  disaster_category_display: 'Yellow' | 'Red' | 'Orange';
  type_of_onset_display: string;
  supporting_document_details: {
    id: number;
    file: string;
  };
  assessment_report_preview: string,
  images_file: FileWithCaption[],
  cover_image_file: FileWithCaption;
  event_map_file: FileWithCaption;
  photos_file: FileWithCaption[];
}

export const overviewFields: (keyof DrefOperationalUpdateFields)[] = [
  'title',
  'national_society',
  'disaster_type',
  'disaster_category',
  'type_of_onset',
  'number_of_people_affected',
  'number_of_people_targeted',
  'additional_allocation',
  'total_dref_allocation',
  'cover_image_file',
  'operational_update_number',
  'emergency_appeal_planned',
  'is_timeframe_extension_required',
  'country',
  'district',
  'users',
  'is_assessment_report',
  'is_man_made_event',
  'people_in_need',
];
export const eventFields: (keyof DrefOperationalUpdateFields)[] = [
  'changing_timeframe_operation',
  'changing_operation_strategy',
  'changing_target_population_of_operation',
  'changing_geographic_location',
  'changing_budget',
  'request_for_second_allocation',
  'summary_of_change',
  'event_description',
  'event_scope',
  'images_file',
  'has_forecasted_event_materialize',
  'specified_trigger_met',
  'event_date',
  'event_text',
  'has_event_occurred',
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
  'photos_file',
  'is_there_major_coordination_mechanism',
  'assessment_report',
  'did_national_society',
  'ns_respond_date',
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
  'risk_security',
  'risk_security_concern',
  'logistic_capacity_of_ns',
  'pmer',
  'communication',
  'human_resource',
  'is_surge_personnel_deployed',
  'surge_personnel_deployed',
  'total_targeted_population',
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
  'reporting_timeframe',
  'new_operational_start_date',
  'new_operational_end_date',
  'total_operation_timeframe',
  'reporting_start_date',
  'reporting_end_date',
];
