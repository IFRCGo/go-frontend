import React from 'react';

import { ListResponse, useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';

import { compareString } from '#utils/utils';
import {
  Country,
  NumericValueOption,
  BooleanValueOption,
  StringKeyValuePair,
  NumericKeyValuePair,
} from '#types';
import {
  positiveNumberCondition,
  positiveIntegerCondition,
  requiredCondition,
  emailCondition,
  lessThanOrEqualToCondition,
} from '#utils/form';

import { emptyNumericOptionList, PerOverviewFields } from './common';
import { ObjectSchema, PartialForm, defaultEmptyArrayType } from '@togglecorp/toggle-form';

export type FormSchema = ObjectSchema<PartialForm<PerOverviewFields>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

interface PerOptions {
  type_of_assessment_details: NumericKeyValuePair[];
  type_of_per_assessment: NumericKeyValuePair[];
}

function transformKeyValueToLabelValue<O extends NumericKeyValuePair | StringKeyValuePair>(o: O): {
  label: string;
  value: O['key'];
} {
  return {
    value: o.key,
    label: o.value,
  };
}

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
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
    date_of_assessment: [],
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
    component: [],
    question: [],
    question_num: [],
    answers: [],
    description: [],
  })
};

function usePerFormOptions() {
  const { strings } = React.useContext(LanguageContext);

  const {
    pending: fetchingPerOptions,
    response: perOptions,
  } = useRequest<PerOptions>({
    url: 'api/v2/new-per/',
  });

  const {
    pending: fetchingCountries,
    response: countriesResponse,
  } = useRequest<ListResponse<Country>>({
    url: 'api/v2/country/',
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

export default usePerFormOptions;
