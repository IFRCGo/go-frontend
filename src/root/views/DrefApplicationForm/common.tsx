import { isDefined } from '@togglecorp/fujs';

export const ONSET_ANTICIPATORY = 0;
export const ONSET_IMMINENT = 1;
export const ONSET_SLOW = 2;
export const ONSET_SUDDEN = 3;

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
  persons_targeted: number;
  indicator: number;
  description: string;
}

export const optionKeySelector = (o: Option) => o.value;
export const numericOptionKeySelector = (o: NumericValueOption) => o.value;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const booleanOptionKeySelector = (o: BooleanValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;

export interface DrefFields {
  affect_same_area: boolean;
  affect_same_population: boolean;
  affect_same_population_text : string;
  amount_requested: number;
  anticipatory_actions: string,
  appeal_code: string;
  boys: number;
  communication : string;
  community_involved: string;
  country_district: CountryDistrict[];
  created_at: string;
  date_of_approval: string;
  disability_people_per: number;
  disaster_category: number;
  disaster_type: number;
  displaced_people: number;
  emergency_appeal_planned: boolean;
  end_date: string;
  entity_affected: string,
  event_date: string;
  event_description: string;
  event_map : null;
  event_scope: string;
  event_text: string;
  girls: number;
  glide_code: string;
  go_field_report_date : string;
  government_requested_assistance: boolean;
  government_requested_assistance_date: string;
  human_resource : string;
  icrc: string;
  id: string;
  identified_gaps: string;
  ifrc : string;
  ifrc_appeal_manager_email: string;
  ifrc_appeal_manager_name: string;
  ifrc_emergency_email: string;
  ifrc_emergency_name: string;
  ifrc_project_manager_email: string;
  ifrc_project_manager_name: string;
  images: string[],
  lessons_learned: string;
  logistic_capacity_of_ns : string;
  major_coordination_mechanism: string;
  media_contact_email: string;
  media_contact_name: string;
  men: number;
  modified_at: string;
  modified_by: number;
  modified_by_details: {};
  national_authorities: string;
  national_society: number;
  national_society_actions: NsAction[];
  national_society_contact_email: string;
  national_society_contact_name: string;
  needs_identified: Need[];
  ns_request_date: string;
  ns_request_fund : boolean;
  ns_request_text: string;
  ns_respond: boolean;
  ns_respond_date: string;
  num_affected: number;
  num_assisted: number;
  operation_objective: string;
  operation_timeframe: string;
  originator_email : string;
  originator_name: string;
  partner_national_society: string;
  people_assisted: string;
  people_per_urban_local: number;
  people_targeted_with_early_actions: number;
  planned_interventions: Intervention[];
  pmer : string;
  publishing_date: string;
  response_strategy: string;
  safety_concerns : string;
  selection_criteria: string;
  start_date: string;
  status: number;
  submission_to_geneva: string;
  surge_personnel_deployed : string;
  title: string;
  type_of_onset: number;
  un_or_other: string;
  un_or_other_actor : string;
  women: number;
}

export interface DrefApiFields extends Omit<DrefFields, 'country_district' | 'planned_interventions' | 'national_society_actions' | 'needs_identified'> {
  user: number;
  country_district: (Omit<CountryDistrict, 'clientId'> & { id: number })[];
  planned_interventions: (Omit<Intervention, 'clientId'> & { id: number })[];
  national_society_actions: (Omit<NsAction, 'clientId'> & { id: number })[];
  needs_identified: (Omit<Need, 'clientId'> & { id: number })[];
}


export const overviewFields: (keyof DrefFields)[] = [
  'title',
  'national_society',
  'disaster_type',
  'type_of_onset',
  'disaster_category',
  'country_district',
  'num_affected',
  'amount_requested',
  'emergency_appeal_planned',
  'event_date',
  'go_field_report_date',
  'ns_respond_date',
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
];

export const responseFields: (keyof DrefFields)[] = [
  'people_assisted',
  'entity_affected',
  'women',
  'men',
  'girls',
  'boys',
  'disability_people_per',
  'people_per_urban_local',
  'displaced_people',
  'people_targeted_with_early_actions',
  'operation_objective',
  'response_strategy',
  'human_resource',
  'surge_personnel_deployed',
  'logistic_capacity_of_ns',
  'safety_concerns',
  'pmer',
  'communication',
  'planned_interventions',
];

export const submissionFields: (keyof DrefFields)[] = [
  'ns_request_date',
  'start_date',
  'end_date',
  'submission_to_geneva',
  'date_of_approval',
  'operation_timeframe',
  'appeal_code',
  'glide_code',
  'ifrc_appeal_manager_name',
  'ifrc_appeal_manager_email',
  'ifrc_project_manager_name',
  'ifrc_project_manager_email',
  'national_society_contact_name',
  'national_society_contact_email',
  'ifrc_emergency_name',
  'ifrc_emergency_email',
  'media_contact_name',
  'media_contact_email',
];
