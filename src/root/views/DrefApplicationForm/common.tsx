import { isDefined } from '@togglecorp/fujs';
import {
  Country,
  DistrictMini,
} from '#types';

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

export interface Entity {
  id: number;
  name: string;
}

export interface CountryDistrict {
  clientId: string;
  country: number;
  district: number[];
  country_details: Country;
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
  caption: string;
}

export const optionKeySelector = (o: Option) => o.value;
export const numericOptionKeySelector = (o: NumericValueOption) => o.value;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const booleanOptionKeySelector = (o: BooleanValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;

export interface DrefFields {
  affect_same_area: boolean;
  affect_same_population: boolean;
  affect_same_population_text: string;
  amount_requested: number;
  anticipatory_actions: string,
  appeal_code: string;
  boys: number;
  communication: string;
  community_involved: string;
  country_district: CountryDistrict[];
  cover_image: number;
  created_at: string;
  date_of_approval: string;
  disability_people_per: number;
  disaster_category: number;
  disaster_type: number;
  displaced_people: number;
  emergency_appeal_planned: boolean;
  end_date: string;
  event_date: string;
  event_map: number;
  field_report: number;
  images: FileWithCaption[];
  event_description: string;
  event_scope: string;
  event_text: string;
  girls: number;
  glide_code: string;
  go_field_report_date: string;
  government_requested_assistance: boolean;
  government_requested_assistance_date: string;
  human_resource: string;
  icrc: string;
  id: string;
  identified_gaps: string;
  ifrc: string;
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
  major_coordination_mechanism: string;
  media_contact_email: string;
  media_contact_name: string;
  media_contact_phone_number: string;
  media_contact_title: string;
  men: number;
  modified_at: string;
  modified_by: number;

  // FIXME: this typing for details should not be here
  modified_by_details: {};

  national_authorities: string;
  national_society: number;
  national_society_actions: NsAction[];
  national_society_contact_email: string;
  national_society_contact_name: string;
  national_society_contact_phone_number: string;
  national_society_contact_title: string;
  needs_identified: Need[];
  ns_request_date: string;
  ns_request_fund: boolean;
  ns_request_text: string;
  ns_respond: boolean;
  ns_respond_date: string;
  num_affected: number;
  num_assisted: number;
  operation_objective: string;
  operation_timeframe: number;
  originator_email: string;
  originator_name: string;
  originator_phone_number: string;
  originator_title: string;
  partner_national_society: string;
  people_assisted: string;
  people_per_urban: number;
  people_per_local: number;
  people_targeted_with_early_actions: number;
  budget_file: number;
  planned_interventions: Intervention[];
  pmer: string;
  publishing_date: string;
  response_strategy: string;
  selection_criteria: string;
  start_date: string;
  status: number;
  submission_to_geneva: string;
  surge_personnel_deployed: string;
  title: string;
  type_of_onset: number;
  un_or_other: string;
  un_or_other_actor: string;
  women: number;
  dref_recurrent_text: string;
  total_targeted_population: number;
  users: number[];
  is_there_major_coordination_mechanism: boolean;
  is_surge_personnel_deployed: boolean;
  assessment_report: number;
  country: number;
  district: number[];
  country_details: Country;
  people_in_need: number;
  did_national_society: boolean;
  supporting_document: number;
}

export interface DrefApiFields extends Omit<DrefFields, 'country_district' | 'planned_interventions' | 'national_society_actions' | 'needs_identified'> {
  user: number;
  country_district: (Omit<CountryDistrict, 'clientId'> & {
    id: number
    country_details: Country,
    district_details: DistrictMini[],
  })[];
  planned_interventions: (Omit<Intervention, 'clientId' | 'indicators'> & {
    id: number,
    image_url: string,
    indicators: (Omit<Indicator, 'clientId'> & {
      id: number
    })[],
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
  };
  budget_file_preview: string,
  images_details: {
    id: number;
    file: string;
  }[];
  assessment_report_details: {
    id: number;
    file: string;
  };
}

export const overviewFields: (keyof DrefFields)[] = [
  'users',
  'field_report',
  'title',
  'national_society',
  'disaster_type',
  'type_of_onset',
  'disaster_category',
  'num_affected',
  'amount_requested',
  'event_map',
  'cover_image',
  'emergency_appeal_planned',
  'go_field_report_date',
  'ns_request_date',
  'start_date',
  'end_date',
  'submission_to_geneva',
  'date_of_approval',
  'operation_timeframe',
  'country',
  'district',
  'people_in_need',
  'did_national_society',
  'supporting_document',
];

export const eventDetailsFields: (keyof DrefFields)[] = [
  'affect_same_population',
  'affect_same_area',
  'ns_respond',
  'ns_request_fund',
  'ns_request_text',
  'lessons_learned',
  'event_description',
  'event_scope',
  'images',
  'event_date',
  'event_text',
];

export const actionsFields: (keyof DrefFields)[] = [
  'national_society_actions',
  'ifrc',
  'icrc',
  'partner_national_society',
  'government_requested_assistance',
  'national_authorities',
  'un_or_other',
  'major_coordination_mechanism',
  'needs_identified',
  'identified_gaps',
  'ns_respond_date',
  'is_there_major_coordination_mechanism',
  'assessment_report',
];

export const responseFields: (keyof DrefFields)[] = [
  'people_assisted',
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
  'human_resource',
  'surge_personnel_deployed',
  'logistic_capacity_of_ns',
  'pmer',
  'communication',
  'budget_file',
  'planned_interventions',
  'is_surge_personnel_deployed',
];

export const submissionFields: (keyof DrefFields)[] = [
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
