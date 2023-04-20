import React from 'react';

import { ListResponse, useRequest } from '#utils/restRequest';
import { Answer, Component } from './Assessment/CustomActivityInput';
import LanguageContext from '#root/languageContext';

import { compareString } from '#utils/utils';
import {
  Country,
  NumericValueOption,
  BooleanValueOption,
  StringKeyValuePair,
  NumericKeyValuePair,
} from '#types';
import { emptyNumericOptionList, emptyStringOptionList, PerOverviewFields } from './common';
import { ObjectSchema, PartialForm } from '@togglecorp/toggle-form';

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
  })
};

function usePerFormOptions() {
  const { strings } = React.useContext(LanguageContext);

  const {
    pending: fetchingCountries,
    response: countriesResponse,
  } = useRequest<ListResponse<Country>>({
    url: 'api/v2/country/',
  });

  const {
    pending: fetchingPerOptions,
    response: perOptions,
  } = useRequest<PerOptions>({
    url: 'api/v2/per-assessmenttype/',
  });

  const [
    assessmentOptions,
  ] = React.useMemo(() => {
    if (!perOptions) {
      return [
        emptyNumericOptionList,
      ];
    }

    return [
      // perOptions.type_of_per_assessment.map(transformKeyValueToLabelValue),
    ];
  }, [perOptions]);

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
    assessmentOptions,
  };
}

export default usePerFormOptions;
