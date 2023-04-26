import {
  NumericValueOption,
  BooleanValueOption,
  StringValueOption,
} from '#types';

export const SELF_ASSESSMENT = 1;
export const SIMULATION_ASSESSMENT = 2;
export const OPERATIONAL_ASSESSMENT = 3;
export const POST_OPERATIONAL_ASSESSMENT = 4;

export interface TypeOfAssessment {
  id: string;
  name: string;
  name_en: string;
  name_es: string | null;
  name_fr: string | null;
  name_ar: string | null;
}

export interface Country {
  iso: string;
  iso3: string;
  id: string;
  record_type: number;
  record_type_display: string;
  region: number;
  independent: boolean;
  is_deprecated: boolean;
  fdrs: string;
  average_household_size: boolean;
  name: string;
  society_name: string;
}

export interface userDetails {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Area {
  id: string;
  title: string;
  title_en: string;
  title_es: string;
  title_fr: string;
  title_ar: string | null;
  area_num: number;
}

export interface Component {
  area: Area;
  title: string;
  component: string;
  component_letter: string | null;
  description: string;
  id: string;
}
export interface Answer {
  id: string;
  text: string;
  text_en: string;
  text_es: string | null;
  text_fr: string | null;
  text_ar: string | null;
}
export interface ComponentQuestion {
  answer: Answer[];
  component: Component;
  description: string;
  id: string;
  question: string;
}

export type Option = NumericValueOption | BooleanValueOption | StringValueOption;

export const emptyOptionList: Option[] = [];
export const emptyStringOptionList: StringValueOption[] = [];
export const emptyNumericOptionList: NumericValueOption[] = [];
export const emptyBooleanOptionList: BooleanValueOption[] = [];

export const optionKeySelector = (o: Option) => o.value;
export const numericOptionKeySelector = (o: NumericValueOption) => o.value;
export const stringOptionKeySelector = (o: StringValueOption) => o.value;
export const booleanOptionKeySelector = (o: BooleanValueOption) => o.value;
export const optionLabelSelector = (o: Option) => o.label;

export interface PerOverviewFields {
  id: string;
  type_of_assessment_details: TypeOfAssessment;
  country_details: Country;
  userDetails: userDetails;
  workplan: string[];
  created_at: string;
  updated_at: string;
  date_of_orientation: string | null;
  orientation_document: File | File[] | null | undefined;
  assessment_number: number;
  branches_involved: string;
  date_of_assessment: string;
  method_asmt_used: string;
  assess_preparedness_of_country: string | null;
  assess_urban_aspect_of_country: boolean | null;
  assess_climate_environment_of_country: boolean | null;
  date_of_previous_assessment: string | null;
  type_of_per_assessment: string | null;
  date_of_mid_term_review: string | null;
  date_of_next_asmt: string | null;
  facilitator_name: string;
  facilitator_email: string;
  facilitator_phone: string;
  facilitator_contact: string;
  is_epi: boolean;
  is_finalized: boolean;
  ns_focal_point_name: string;
  ns_focal_point_email: string;
  ns_focal_point_phone: string;
  other_consideration: string | null;
  partner_focal_point_name: string | null;
  partner_focal_point_email: string;
  partner_focal_point_phone: string;
  partner_focal_point_organization: string;
  country: number;
  user: number;
  type_of_assessment: number;
  national_society: number;
  component: Component[];
  question: string;
  question_num: number;
  answers: Answer[];
  description: string | [];
}

export const perOverviewFields: (keyof PerOverviewFields)[] = [
  'id',
  'type_of_assessment_details',
  'country_details',
  'userDetails',
  'workplan',
  'created_at',
  'updated_at',
  'date_of_orientation',
  'orientation_document',
  'assessment_number',
  'branches_involved',
  'date_of_assessment',
  'method_asmt_used',
  'assess_preparedness_of_country',
  'assess_urban_aspect_of_country',
  'assess_climate_environment_of_country',
  'date_of_previous_assessment',
  'type_of_per_assessment',
  'date_of_mid_term_review',
  'date_of_next_asmt',
  'facilitator_name',
  'facilitator_email',
  'facilitator_phone',
  'facilitator_contact',
  'is_epi',
  'is_finalized',
  'ns_focal_point_name',
  'ns_focal_point_email',
  'ns_focal_point_phone',
  'other_consideration',
  'partner_focal_point_name',
  'partner_focal_point_email',
  'partner_focal_point_phone',
  'partner_focal_point_organization',
  'country',
  'user',
  'type_of_assessment',
  'national_society',
];

export const perAssessmentFields: (keyof PerOverviewFields)[] = [
  'component',
  'question',
  'question_num',
  'answers',
  'id',
];
