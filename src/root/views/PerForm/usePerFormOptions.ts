import React from 'react';

import { ListResponse, useRequest } from '#utils/restRequest';
import { Answer, Component } from './Assessment/CustomActivityInput';
import LanguageContext from '#root/languageContext';

import { compareString } from '#utils/utils';
import {
  Country,
  NumericValueOption,
  BooleanValueOption,
  StringValueOption,
} from '#types';

export interface AssessmentQuestion {
  component: Component;
  question: string;
  question_num: number;
  answer: Answer[];
  is_epi: boolean;
  is_benchmark: boolean;
  description: string | null;
  id: string;
}

export interface TypeOfAssessment {
  id: string;
  name: string;
  name_en: string;
  name_es: string | null;
  name_fr: string | null;
  name_ar: string | null;
}

export interface CountryDetails {
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

export interface PerOverviewFields {
  id: string;
  type_of_assessment_details: TypeOfAssessment[];
  country_details: CountryDetails[];
  userDetails: userDetails;
  workplan: string[];
  created_at: string;
  updated_at: string;
  date_of_orientation: string | null;
  orientation_document: string | null;
  assessment_number: number;
  branches_involved: string;
  date_of_assessment: string;
  method_asmt_used: string;
  assess_preparedness_of_country: string | null;
  assess_urban_aspect_of_country: string | null;
  assess_climate_environment_of_country: string | null;
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
}

const limitQuery = {
  limit: 500,
};

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

function usePerFormOptions() {
  const { strings } = React.useContext(LanguageContext);

  const {
    pending: fetchingCountries,
    response: countriesResponse,
  } = useRequest<ListResponse<Country>>({
    url: 'api/v2/country/',
    query: limitQuery,
  });

  const [
    nationalSocietyOptions,
    countryOptions,
  ] = React.useMemo(() => {
    if (!countriesResponse) {
      return [emptyNumericOptionList, emptyNumericOptionList];
    }

    const ns: NumericValueOption[] = countriesResponse.results
      .filter(d => d.independent && d.society_name)
      .map(d => ({
        value: d.id,
        label: d.society_name,
      })).sort(compareString);

    const c: NumericValueOption[] = countriesResponse.results
      .filter(d => d.independent && d.iso)
      .map(d => ({
        value: d.id,
        label: d.name,
      })).sort(compareString);

    return [ns, c] as const;
  }, [countriesResponse]);

  const yesNoOptions = React.useMemo(() => {
    return [
      { value: true, label: strings.yesLabel },
      { value: false, label: strings.noLabel },
    ] as BooleanValueOption[];
  }, [strings]);

  return {
    nationalSocietyOptions,
    countryOptions,
    yesNoOptions,
  };
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
];

export default usePerFormOptions;
