import React from 'react';
import {
  PartialForm,
  ObjectSchema,
  ArraySchema,
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
  DistrictMini,
} from '#types';

import {
  NumericValueOption,
  EapsFields,
  emptyNumericOptionList,
  StringKeyValuePair,
  NumericKeyValuePair,
  emptyStringOptionList,
} from './common';

export type FormSchema = ObjectSchema<PartialForm<EapsFields>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export type CountryDistrictType = NonNullable<NonNullable<EapsFields['country']>>[number];
export type CountryDistrictSchema = ObjectSchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictSchemaFields = ReturnType<CountryDistrictSchema['fields']>;
export type CountryDistrictsSchema = ArraySchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictsSchemaMember = ReturnType<CountryDistrictsSchema['member']>;


export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
    eap_number: [positiveIntegerCondition, requiredCondition],
    approval_date: [requiredCondition],
    status: [requiredCondition],
    operational_timeframe: [positiveIntegerCondition, requiredCondition],
    lead_time: [positiveIntegerCondition, requiredCondition],
    eap_timeframe: [positiveIntegerCondition, requiredCondition],
    num_of_people: [positiveIntegerCondition, requiredCondition],
    total_budget: [positiveIntegerCondition, requiredCondition],
    readiness_budget: [],
    pre_positioning_budget: [],
    early_action_budget: [],
    trigger_statement: [requiredCondition],
    overview: [requiredCondition],
    document: [],
    early_actions: [requiredCondition],
    budget_per_sector: [],
    sectors: [],
    readiness_activities: [],
    prepositioning_activities: [],
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
    country: [requiredCondition],
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

  const statusOptions = React.useMemo(() => {
    if (!eapOptions) {
      return emptyStringOptionList;
    }
    return [
      eapOptions.status.map(transformKeyValueToLabelValue),
    ];
  }, [eapOptions]);

  const earlyActionIndicatorsOptions = React.useMemo(() => {
    if (!eapOptions) {
      return emptyStringOptionList;
    }
    return eapOptions.early_actions_indicators.map(transformKeyValueToLabelValue);
  }, [eapOptions]);

  const sectorsOptions = React.useMemo(() => {
    if (!eapOptions) {
      return emptyStringOptionList;
    }
    return eapOptions.sectors.map(transformKeyValueToLabelValue);
  }, [eapOptions]);

  const {
    pending: fetchingEapDetails,
    response: eapDetailsResponse,
  } = useRequest<ListResponse<EapsFields>>({
    url: `api/v2/eap/`,
  });

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

  const countryQuery = React.useMemo(() => ({
    country: value.country,
    limit: 500,
  }), [value.country]);

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<DistrictMini>>({
    skip: !value.country,
    url: 'api/v2/district/',
    query: countryQuery,
  });

  const districtOptions = React.useMemo(() => (
    districtsResponse?.results?.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString) ?? emptyNumericOptionList
  ), [districtsResponse]);


  return {
    countryOptions,
    statusOptions,
    earlyActionIndicatorsOptions,
    sectorsOptions,
    disasterTypeOptions,
    fetchingCountries,
    fetchingDisasterTypes,
    nationalSocietyOptions,
    eapDetailsResponse,
    fetchingEapDetails,
    fetchingEapOptions,
    fetchingDistricts,
    districtOptions,
  };
}

export default useEapsFormOptions;
