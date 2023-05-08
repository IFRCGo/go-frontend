import React from 'react';

import { ObjectSchema, PartialForm } from '@togglecorp/toggle-form';
import { ListResponse, useRequest } from '#utils/restRequest';
import { compareString } from '#utils/utils';
import LanguageContext from '#root/languageContext';

import {
  Country,
  NumericValueOption,
  BooleanValueOption,
  StringKeyValuePair,
  NumericKeyValuePair,
} from '#types';
import {
  requiredCondition,
  emailCondition,
} from '#utils/form';

import { ComponentQuestion, emptyNumericOptionList, PerOverviewFields } from './common';

export type OverviewFormSchema = ObjectSchema<PartialForm<PerOverviewFields>>;
export type OverviewFormSchemaFields = ReturnType<OverviewFormSchema['fields']>;

export type AssessmentFormScheme = ObjectSchema<PartialForm<ComponentQuestion>>;
export type AssessmentFormSchemeFields = ReturnType<AssessmentFormScheme['fields']>;

function transformKeyValueToLabelValue<O extends NumericKeyValuePair | StringKeyValuePair>(o: O): {
  label: string;
  value: O['key'];
} {
  return {
    value: o.key,
    label: o.value,
  };
}

export const overviewSchema: OverviewFormSchema = {
  fields: (value): OverviewFormSchemaFields => ({
    id: [],
    type_of_assessment_details: [],
    country_details: [],
    userDetails: [],
    workplan: [],
    created_at: [],
    updated_at: [],
    date_of_orientation: [],
    orientation_document: [],
    assessment_number: [],
    branches_involved: [],
    date_of_assessment: [requiredCondition],
    method_asmt_used: [],
    assess_preparedness_of_country: [],
    assess_urban_aspect_of_country: [],
    assess_climate_environment_of_country: [],
    date_of_previous_assessment: [],
    type_of_per_assessment: [],
    date_of_mid_term_review: [],
    date_of_next_asmt: [],
    facilitator_name: [],
    facilitator_email: [emailCondition],
    facilitator_phone: [],
    facilitator_contact: [],
    is_epi: [],
    is_finalized: [],
    ns_focal_point_name: [],
    ns_focal_point_email: [emailCondition],
    ns_focal_point_phone: [],
    other_consideration: [],
    partner_focal_point_name: [],
    partner_focal_point_email: [emailCondition],
    partner_focal_point_phone: [],
    partner_focal_point_organization: [],
    country: [],
    user: [],
    type_of_assessment: [],
    national_society: [requiredCondition],
    ns_second_focal_point_name: [],
    ns_second_focal_point_email: [],
    ns_second_focal_point_phone: [],
  })
};

export const assessmentSchema: AssessmentFormScheme = {
  fields: (value): AssessmentFormSchemeFields => ({
    id: [],
    answer: [],
    component: [],
    description: [],
    question: [],
  })
};

function usePerFormOptions(value: PartialForm<PerOverviewFields>) {
  const { strings } = React.useContext(LanguageContext);

  const {
    response: countriesResponse,
  } = useRequest<ListResponse<Country>>({
    url: 'api/v2/country/',
  });

  const [
    nationalSocietyOptions,
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
    yesNoOptions,
  };
}

export default usePerFormOptions;
