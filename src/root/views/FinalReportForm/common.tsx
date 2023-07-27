import {
  Country,
  DistrictMini,
} from "#types/country";
import { Language } from "#types/project";
import { SingleFileWithCaption } from "#views/DrefApplicationForm/common";

export const ONSET_SLOW = 1;
export const ONSET_SUDDEN = 2;

export const TYPE_IMMINENT = 0;
export const TYPE_ASSESSMENT = 1;
export const TYPE_RESPONSE = 2;

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
  first_name: string;
  last_name: string;
  username: string;
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
  person_assisted: number;
  indicators: Indicator[];
  description: string;
  progress_towards_outcome: string;
  male: number;
  female: number;
  challenges: string;
  narrative_description_of_achievements: string;
  lessons_learnt: string;
}

export interface FileWithCaption {
  client_id: string;
  id: number;
  caption: string;
  file: string;
}

export interface NsAction {
  clientId: string;
  title: string;
  description: string;
  title_display: string;
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

export interface DrefFinalReportFields {
  title: string;
  national_society: number;
  disaster_type: number;
  disaster_category: number;
  type_of_onset: number;
  number_of_people_affected: number;
  number_of_people_targeted: number;
  total_dref_allocation: number;
  date_of_publication: string;
  total_operation_timeframe: number;
  appeal_code: string;
  glide_code: string;
  ifrc_appeal_manager_email: string;
  ifrc_appeal_manager_name: string;
  ifrc_appeal_manager_phone_number: string;
  ifrc_appeal_manager_title: string;
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
  ifrc_emergency_email: string;
  ifrc_emergency_name: string;
  ifrc_emergency_phone_number: string;
  ifrc_emergency_title: string;
  images_file: FileWithCaption[];
  event_scope: string;
  event_description: string;
  ifrc: string;
  icrc: string;
  partner_national_society: string;
  government_requested_assistance: boolean;
  national_authorities: string;
  un_or_other_actor: string;
  major_coordination_mechanism: string;
  needs_identified: Need[];
  people_assisted: string;
  selection_criteria: string;
  change_in_operational_strategy: boolean;
  change_in_operational_strategy_text: string;
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
  event_map: number;
  operation_start_date: string;
  operation_end_date: string;
  want_to_report: boolean;
  additional_national_society_actions: string;

  id: string;
  created_at: string;
  modified_at: string;
  modified_by: number;
  users: number[];
  dref?: string;
  country: number;
  district: number[];
  country_details: Country;
  is_assessment_report: boolean;
  people_in_need: number;
  cover_image_file: SingleFileWithCaption;
  event_map_file: SingleFileWithCaption;
  event_text: string;
  event_date: string;
  national_society_actions: NsAction[];
  ns_respond_date: string;
  photos_file: FileWithCaption[]
  is_there_major_coordination_mechanism: boolean;
  risk_security: RiskSecurityProps[];
  risk_security_concern: string;
  total_targeted_population: number;
  num_assisted: number;
  has_national_society_conducted: boolean;
  national_society_conducted_description: string;
  financial_report: number;
  financial_report_description: string;
  type_of_dref: number;
}

export interface DrefFinalReportApiFields extends Omit<DrefFinalReportFields, 'district_details' | 'planned_interventions' | 'national_society_actions' | 'needs_identified' | 'images_file'> {
  user: number;
  district_details: DistrictMini[];
  national_society_actions: (Omit<NsAction, 'clientId'> & { id: number })[];
  planned_interventions: (Omit<Intervention, 'clientId' | 'indicators'> & {
    id: number,
    image_url: string,
    indicators: (Omit<Indicator, 'clientId'> & {
      id: number,
    })[],
  })[];
  needs_identified: (Omit<Need, 'clientId'> & {
    id: number,
    image_url: string,
  })[];
  images_file: {
    id: number,
    caption: string | undefined,
    client_id: string | undefined,
    file: string;
  }[];
  disaster_type_details: {
    id: number;
    name: string;
    summary: string;
  };
  disaster_category_display: 'Yellow' | 'Red' | 'Orange';
  type_of_onset_display: string;
  financial_report_details: {
    id: number;
    file: string;
  };
  users_details: User[];
  translation_module_original_language: Language;
  financial_report_preview: string;
}

export const overviewFields: (keyof DrefFinalReportFields)[] = [
  'title',
  'national_society',
  'disaster_type',
  'disaster_category',
  'type_of_onset',
  'number_of_people_affected',
  'number_of_people_targeted',
  'total_dref_allocation',
  'country',
  'district',
  'people_in_need',
  'event_map_file',
  'cover_image_file',
  'num_assisted',
  'type_of_dref',
];
export const eventFields: (keyof DrefFinalReportFields)[] = [
  'images_file',
  'event_scope',
  'event_description',
  'event_date',
  'event_text',
];
export const needsFields: (keyof DrefFinalReportFields)[] = [
  'ifrc',
  'icrc',
  'partner_national_society',
  'government_requested_assistance',
  'national_authorities',
  'un_or_other_actor',
  'major_coordination_mechanism',
  'needs_identified',
  'want_to_report',
  'additional_national_society_actions',
  'photos_file',
  'is_there_major_coordination_mechanism',
  'national_society_actions',
  'has_national_society_conducted',
  'national_society_conducted_description',
];
export const operationFields: (keyof DrefFinalReportFields)[] = [
  'people_assisted',
  'selection_criteria',
  'change_in_operational_strategy',
  'change_in_operational_strategy_text',
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
  'total_targeted_population',
  'financial_report',
  'financial_report_description',
];
export const submissionFields: (keyof DrefFinalReportFields)[] = [
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
  'ifrc_emergency_name',
  'ifrc_emergency_email',
  'ifrc_emergency_phone_number',
  'ifrc_emergency_title',
  'media_contact_name',
  'media_contact_email',
  'media_contact_phone_number',
  'media_contact_title',
  'date_of_publication',
  'operation_start_date',
  'total_operation_timeframe',
  'operation_end_date',
];
