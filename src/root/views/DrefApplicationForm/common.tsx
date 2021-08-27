import { isDefined } from '@togglecorp/fujs';

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
  title: string;
  national_society: number;
  disaster_type: number;
  type_of_onset: number;
  disaster_category: number;
  country_district: CountryDistrict[];
  num_affected: number;
  num_assisted: number;
  amount_requested: number;
  emergency_appeal_planned: boolean;

  ns_respond_date: string;

  // Previous operations
  affect_same_population: boolean;
  affect_same_communities: boolean;
  ns_respond: boolean;
  ns_request_text: string;
  lessons_learned: string;

  event_description: string;
  // image: null;
  event_scope: string;

  national_society_actions: NsAction[];
  government_requested_assistance: boolean;
  government_requested_assistance_date: string;
  national_authorities: string;
  partner_national_society: string;
  icrc: string;
  un_or_other: string;
  major_coordination_mechanism: string;

  needs_identified: Need[];
  identified_gaps: string;

  people_assisted: string;
  selection_criteria: string;
  entity_affected: string,
  community_involved: string;

  women: number;
  men: number;
  girls: number;
  boys: number;
  disability_people_per: number;
  people_per: number;
  displaced_people: number;

  operation_objective: string;
  response_strategy: string;

  planned_interventions: Intervention[];

  ns_request_date: string;
  start_date: string;
  submission_to_geneva: string;
  end_date: string;
  date_of_approval: string;
  operation_timeframe: string;
  publishing_date: string;

  appeal_code: string;
  ifrc : string;
  glide_code: string;
  ifrc_appeal_manager_name: string;
  ifrc_appeal_manager_email: string;
  ifrc_project_manager_name: string;
  ifrc_project_manager_email: string;
  national_society_contact_name: string;
  national_society_contact_email: string;
  ifrc_emergency_name: string;
  ifrc_emergency_email: string;
  media_contact_name: string;
  media_contact_email: string;
  event_map : null;
  event_date: string;
  event_text: string;
  affect_same_area: boolean;
  affect_same_population_text : string;
  ns_request_fund : boolean;
  un_or_other_actor : string;
  people_per_urban_local: number;
  people_targeted_with_early_actions: number;
  go_field_report_date : string;
  originator_name: string;
  originator_email : string;
  human_resource : string;
  surge_personnel_deployed : string;
  logistic_capacity_of_ns : string;
  safety_concerns : string;
  pmer : string;
  communication : string;

  /*
  affect_same_communities_text: string;
  status: null,
  document: null,
  ns_respond_text: string,
  anticipatory_actions: string,
   */
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
];

export const eventDetailsFields: (keyof DrefFields)[] = [
  'affect_same_population',
  'affect_same_communities',
];

export const actionsFields: (keyof DrefFields)[] = [
  'national_society_actions',
];

export const responseFields: (keyof DrefFields)[] = [
  'women',
  'men',
  'planned_interventions',
];

export const submissionFields: (keyof DrefFields)[] = [
  'date_of_approval',
];
