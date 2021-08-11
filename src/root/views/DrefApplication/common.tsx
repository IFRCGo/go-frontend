import { isDefined } from '@togglecorp/fujs';

export interface NumericValueOption {
  value: number;
  label: string;
  description?: string;
}

export interface BooleanValueOption {
  value: boolean;
  label: string;
  description?: string;
}

export interface StringValueOption {
  value: string;
  label: string;
  description?: string;
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

export interface NSEntity {
  title: string;
  description: string;
}

export interface CountryDistrict {
  clientId: string;
  country: number;
  district: number[];
}

export const optionKeySelector = (o: Option) => o.value;
export const numericOptionKeySelector = (o: NumericValueOption) => o.value;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const booleanOptionKeySelector = (o: BooleanValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;
export const optionDescriptionSelector = (o: Option) => o.description;

export interface DrefFields {
  title: string;
  national_society: number;
  disaster_type: number;
  type_of_onset: number;
  disaster_category_level: number;
  country_district: CountryDistrict[];
  num_affected: number;
  num_assisted: number;
  amount_requested: number;
  emergency_appeal_planned: boolean;

  disaster_date: string;
  ns_respond_date: string;

  affect_same_population: boolean;
  affect_same_communities: boolean;
  ns_respond: boolean;
  ns_request: boolean;
  ns_request_text: number; // MDR number, max 10 characters
  lessons_learned: string;

  event_description: string;
  // image: null;
  event_scope: string;

  national_society_actions: number[]; // TODO
  government_requested_assistance: boolean;
  government_requested_assistance_date: string;
  national_authorities: string;
  rcrc_partners: string;
  icrc: string;
  un_or_other: string;
  major_coordination_mechanism: string;

  needs_identified: []; // TODO

  people_assisted: string;
  selection_criteria: string;
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

  planned_interventions: [], // TODO

  ns_request_date: string;
  start_date: string;
  submission_to_geneva: string;
  end_date: string;
  date_of_approval: string;
  operation_timeframe: string;
  publishing_date: string;

  appeal_code: string;
  glide_code: string;
  appeal_manager_name: string;
  appeal_manager_email: string;
  project_manager_name: string;
  project_manager_email: string;
  requestor_name: string;
  requestor_email: string;
  national_society_contact_name: string;
  national_society_contact_email: string;
  ifrc_emergency_name: string;
  ifrc_emergency_email: string;
  media_contact_name: string;
  media_contact_email: string;

  /*
  affect_same_communities_text: string;
  status: null,
  document: null,
  ns_respond_text: string,
  anticipatory_actions: string,
  identified_gaps: string,
  entity_affected: string,
  secretariat_service: string,
  national_society_strengthening: string,
   */
}
