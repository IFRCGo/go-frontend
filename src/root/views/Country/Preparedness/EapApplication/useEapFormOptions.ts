import React from 'react';
import {
  PartialForm,
  ObjectSchema,
} from '@togglecorp/toggle-form';

import {
  positiveNumberCondition,
  positiveIntegerCondition,
  requiredCondition,
  emailCondition,
  lessThanOrEqualToCondition,
} from '#utils/form';
import { compareString } from '#utils/utils';
import LanguageContext from '#root/languageContext';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';

import {
  Country,
  Disaster,
} from '#types';

import {
  NumericValueOption,
  EapsFields,
  emptyNumericOptionList,
  StringKeyValuePair,
  NumericKeyValuePair,
  emptyStringOptionList,
  BooleanValueOption,
} from './common';

export type FormSchema = ObjectSchema<PartialForm<EapsFields>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
    eap_number: [requiredCondition],
    approval_date: [requiredCondition],
    status: [requiredCondition],
    operational_timeframe: [],
    lead_time: [],
    eap_timeframe: [],
    num_of_people: [],
    total_budget: [],
    readiness_budget: [],
    pre_positioning_budget: [],
    early_action_budget: [],
    trigger_statement: [],
    overview: [],
    document: [],
    early_actions: [],
    originator_name: [],
    originator_title: [],
    originator_email: [],
    originator_phone: [],
    nsc_name: [],
    nsc_title: [],
    nsc_email: [],
    nsc_phone: [],
    ifrc_focal_name: [],
    ifrc_focal_title: [],
    ifrc_focal_email: [],
    ifrc_focal_phone: [],
    country: [],
    district: [],
    disaster_type: [],
  })
};

const limitQuery = {
  limit: 500,
};

interface EapOptions {
  status: StringKeyValuePair[];
  early_actions_indicators: StringKeyValuePair[];
  sectors: StringKeyValuePair[];
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

function useEapsFormOptions(value: PartialForm<EapsFields>) {
  const { strings } = React.useContext(LanguageContext);

  const {
    pending: fetchingEapOptions,
    response: eapOptions,
  } = useRequest<EapOptions>({
    url: `api/v2/eap-options/`,
  });

  const [
    statusOptions,
    earlyActionIndicatorsOptions,
    sectorsOptions,
  ] = React.useMemo(() => {
    if (!eapOptions) {
      return [
        emptyStringOptionList,
        emptyStringOptionList,
        emptyStringOptionList,
        emptyStringOptionList,
      ];
    }
    return [
      eapOptions.status.map(transformKeyValueToLabelValue),
      eapOptions.early_actions_indicators.map(transformKeyValueToLabelValue),
      eapOptions.sectors.map(transformKeyValueToLabelValue),
    ];
  }, [eapOptions]);

  const {
    pending: fetchingEapDetails,
    response: eapDetailsResponse,
  } = useRequest<FormSchemaFields>({
    url: `api/v2/eap/`,
  });

  console.log('detailsss', eapDetailsResponse?.eap_number);

  const {
    pending: fetchingDisasterTypes,
    response: disasterTypesResponse,
  } = useRequest<ListResponse<Disaster>>({
    url: 'api/v2/disaster_type/',
  });

  const disasterTypeOptions = React.useMemo(() => (
    disasterTypesResponse?.results?.map((d) => ({
      value: d.id,
      label: d.name,
    })) ?? emptyNumericOptionList
  ), [disasterTypesResponse]);

  const yesNoOptions = React.useMemo(() => {
    return [
      { value: true, label: strings.yesLabel },
      { value: false, label: strings.noLabel },
    ] as BooleanValueOption[];
  }, [strings]);

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

  return {
    countryOptions,
    statusOptions,
    earlyActionIndicatorsOptions,
    sectorsOptions,
    disasterTypeOptions,
    fetchingCountries,
    fetchingDisasterTypes,
    yesNoOptions,
    nationalSocietyOptions,
    eapDetailsResponse,
    fetchingEapDetails,
    fetchingEapOptions,
  };
}

export default useEapsFormOptions;
