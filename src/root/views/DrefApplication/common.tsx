import { isDefined } from '@togglecorp/fujs';
import { PartialForm } from '@togglecorp/toggle-form';
import { DateTime } from 'luxon';

import { api } from '#config';
import { request } from '#utils/network';
import type { Option as SearchSelectOption } from '#components/SearchSelectInput';

export const STATUS_EARLY_WARNING = 8;
export const STATUS_EVENT = 9;
export const DISASTER_TYPE_EPIDEMIC = 1;

export type ReportType = 'EVT' | 'EPI' | 'EW' | 'COVID';

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

export function fetchEventsFromApi(input: string | undefined, callback: (options: SearchSelectOption[]) => void) {
  if (!input) {
    callback([]);
  }

  request(`${api}api/v1/es_search/?type=event&keyword=${input}`)
    .then(data => {
      const options = data.hits.map((o: any) => ({
        value: o._source.id,
        label: `${o._source.name} (${DateTime.fromISO(o._source.date).toISODate()})`
      }));

      callback(options);
    });
}

export interface FormType {
  /* DREF Overview */
  title: string;
  national_society: string | null;
  disaster_type: string | null;
  type_of_onset: string | null;
  disaster_category_level: string | null;
  country : string | undefined;
  country_district: string [] | undefined;
  num_affected: number;
  num_assisted: number;
  amount_requested: number | null;
  emergency_appeal_planned: boolean | undefined;
  disaster_date: string | null;
  ns_respond_date: string | null;

  /* Event Details */
  ns_request: boolean | undefined;
  ns_respond_text: boolean | undefined;
  status: string | undefined;
  lessons_learned: string | undefined;
  image: string | undefined;
  document: string | undefined;
  event_description: string | undefined;
  event_scope: string | undefined;
  needs_identified: string[];
  anticipatory_actions: string | undefined;

  /* Action/Needs */
  national_society_actions: string[];
  government_requested_assistance: string | undefined;
  government_requested_assistance_date: boolean | undefined;
  national_authorities: string | undefined;
  rcrc_partners: string | undefined;
  icrc: string | undefined;
  un_or_other: string | undefined;
  major_coordination_mechanism: string | undefined;
  identified_gaps: string | undefined;

  /* Response */
  people_assisted: string | undefined;
  selection_criteria: string | undefined;
  entity_affected: string | undefined;
  community_involved: string | undefined;
  women: string | undefined;
  men: string | undefined;
  girls: string | undefined;
  boys: string | undefined;
  disability_people_per: string | undefined;
  people_per: string | undefined;
  displaced_people: string | null;
  response_strategy: string | undefined;
  planned_interventions: string[];
  secretariat_service: string | undefined;
  national_society_strengthening: string | undefined;

  /* Submission/Contacts*/
  ns_request_date: Date;
  start_date: string | undefined;
  submission_to_geneva: Date;
  end_date: Date;
  operation_objective: string | undefined;
  date_of_approval: Date;
  publishing_date: string | undefined;
  appeal_code: string | undefined;
  glide_code: string | undefined;
  appeal_manager_name: string | undefined;
  appeal_manager_email: string | undefined;
  project_manager_name: string | undefined;
  project_manager_email: string | undefined;
  national_scoiety_contact_name: string | undefined;
  national_scoiety_contact_email: string | undefined;
  media_contact_name: string | undefined;
  media_contact_email: string | undefined;
  ifrc_emergency_name: string | undefined;
  ifrc_emergency_email: string | undefined;
}

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

export const optionKeySelector = (o: Option) => o.value;
export const numericOptionKeySelector = (o: NumericValueOption) => o.value;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const booleanOptionKeySelector = (o: BooleanValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;
export const optionDescriptionSelector = (o: Option) => o.description;

export const BULLETIN_PUBLISHED_NO = 0;
export const BULLETIN_PUBLISHED_PLANNED = 2;
export const BULLETIN_PUBLISHED_YES = 3;

export const SOURCE_RC = 'red-cross';
export const SOURCE_GOV = 'government';
export const SOURCE_OTHER = 'other';

export const VISIBILITY_PUBLIC = 3;
export const VISIBILITY_RCRC_MOVEMENT = 1;
export const VISIBILITY_IFRC_SECRETARIAT = 2;

export const EPI_SOURCE_MOH = 0;
export const EPI_SOURCE_WHO = 1;
export const EPI_SOURCE_OTHER = 2;
export const epiSourceOptions: NumericValueOption[] = [
  { value: EPI_SOURCE_MOH, label: 'Ministry of Health' },
  { value: EPI_SOURCE_WHO, label: 'World Health Organization' },
  { value: EPI_SOURCE_OTHER, label: 'Other' },
];

// NTLS: National society of Red Cross
// FDRN: IFRC
// PNS: Other RCRC (Partner NS)
export type OrganizationType = 'NTLS' | 'PNS' | 'FDRN';
export type FieldReportType = 'EW' | 'EVT' | 'EPI' | 'COVID';
type ContactType = 'Originator' | 'NationalSociety' | 'Federation' | 'Media';

export interface ActionFields {
  category: string;
  field_report_types: FieldReportType[];
  id: number;
  name: string;
  organizations: OrganizationType[]
  tooltip_text: string | null;
}

export type ActionByReportType = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in FieldReportType]: ActionFields[];
}

export type ActionsByOrganization = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in OrganizationType]: Action[]
};

export const emptyActionList: ActionFields[] = [];

export type Action = {
  value: number;
  label: string;
  category: string;
  description: string | undefined;
  organization: OrganizationType;
}

export interface DrefApplicationAPIFields {
  /* DREF Overview */
  title: string;
  national_society: string | null;
  disaster_type: string | null;
  type_of_onset: string | null;
  disaster_category_level: string | null;
  country : string | undefined;
  country_district: string [] | undefined;
  num_affected: number;
  num_assisted: number;
  amount_requested: number | null;
  emergency_appeal_planned: boolean | undefined;
  disaster_date: string | null;
  ns_respond_date: string | null;

  /* Event Details */
  ns_request: boolean | undefined;
  ns_respond_text: boolean | undefined;
  status: string | undefined;
  lessons_learned: string | undefined;
  image: string | undefined;
  document: string | undefined;
  event_description: string | undefined;
  event_scope: string | undefined;
  needs_identified: string[];
  anticipatory_actions: string | undefined;

  /* Action/Needs */
  national_society_actions: string[];
  government_requested_assistance: string | undefined;
  government_requested_assistance_date: boolean | undefined;
  national_authorities: string | undefined;
  rcrc_partners: string | undefined;
  icrc: string | undefined;
  un_or_other: string | undefined;
  major_coordination_mechanism: string | undefined;
  identified_gaps: string | undefined;

  /* Response */
  people_assisted: string | undefined;
  selection_criteria: string | undefined;
  entity_affected: string | undefined;
  community_involved: string | undefined;
  women: string | undefined;
  men: string | undefined;
  girls: string | undefined;
  boys: string | undefined;
  disability_people_per: string | undefined;
  people_per: string | undefined;
  displaced_people: string | null;
  response_strategy: string | undefined;
  planned_interventions: string [] | undefined;
  secretariat_service: string | undefined;
  national_society_strengthening: string | undefined;

  /* Submission/Contacts*/
  ns_request_date: Date;
  start_date: string | undefined;
  submission_to_geneva: Date;
  end_date: Date;
  operation_objective: string | undefined;
  date_of_approval: Date;
  publishing_date: string | undefined;
  appeal_code: string | undefined;
  glide_code: string | undefined;
  appeal_manager_name: string | undefined;
  appeal_manager_email: string | undefined;
  project_manager_name: string | undefined;
  project_manager_email: string | undefined;
  national_scoiety_contact_name: string | undefined;
  national_scoiety_contact_email: string | undefined;
  media_contact_name: string | undefined;
  media_contact_email: string | undefined;
  ifrc_emergency_name: string | undefined;
  ifrc_emergency_email: string | undefined;
}

export function transformFormFieldsToAPIFields(formValues: FormType): DrefApplicationAPIFields {

}

export interface FieldReportAPIResponseFields extends Omit<DrefApplicationAPIFields, 'user' | 'dtype' | 'event' | 'countries' | 'districts' | 'actions_taken'> {

}

export function transformAPIFieldsToFormFields(apiValues: DrefApplicationAPIFields): PartialForm<FormType> {
}

