import React from 'react';
import { compareString } from '#utils/utils';
import {
  PartialForm,
  ObjectSchema,
  ArraySchema,
} from '@togglecorp/toggle-form';

import { positiveIntegerCondition, requiredCondition } from '#utils/form';
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
  BooleanValueOption,
  NumericValueOption,
  emptyNumericOptionList,
  emptyStringOptionList,
  User,
  DrefFields,
  NumericKeyValuePair,
  StringKeyValuePair,
} from './common';
import { isDefined } from '@togglecorp/fujs';

export type FormSchema = ObjectSchema<PartialForm<DrefFields>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export type CountryDistrictType = NonNullable<NonNullable<DrefFields['country_district']>>[number];
export type CountryDistrictSchema = ObjectSchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictSchemaFields = ReturnType<CountryDistrictSchema['fields']>;
export type CountryDistrictsSchema = ArraySchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictsSchemaMember = ReturnType<CountryDistrictsSchema['member']>;

export type NeedType = NonNullable<NonNullable<DrefFields['needs_identified']>>[number];
export type NeedSchema = ObjectSchema<PartialForm<NeedType>>;
export type NeedSchemaFields = ReturnType<NeedSchema['fields']>;
export type NeedsSchema = ArraySchema<PartialForm<NeedType>>;
export type NeedsSchemaMember = ReturnType<NeedsSchema['member']>;

export type InterventionType = NonNullable<NonNullable<DrefFields['planned_interventions']>>[number];
export type InterventionSchema = ObjectSchema<PartialForm<InterventionType>>;
export type InterventionSchemaFields = ReturnType<InterventionSchema['fields']>;
export type InterventionsSchema = ArraySchema<PartialForm<InterventionType>>;
export type InterventionsSchemaMember = ReturnType<InterventionsSchema['member']>;

export function max500CharCondition(value: any) {
  return isDefined(value) && value.length > 500
    ? 'Only 500 characters are allowed'
    : undefined;
}

export function max800CharCondition(value: any) {
  return isDefined(value) && value.length > 800
  ? 'only 800 characters are allowed'
  : undefined;
}

export function max300CharCondition(value: any) {
  return isDefined(value) && value.length > 300
  ? 'only 300 characters are allowed'
  : undefined;
}

export function max10CharCondition(value: any) {
  return isDefined(value) && value.length > 10
  ? 'only 10 characters are allowed'
  : undefined;
}
export function validEmailCondition (email : any) {
  const emailRegex = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;
  return !isDefined(email) || !emailRegex.test(email) 
  ? 'Invalid Email' : undefined;
}

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
    title: [requiredCondition],
    national_society: [requiredCondition],
    disaster_type: [requiredCondition],
    type_of_onset: [requiredCondition],
    disaster_category: [requiredCondition],
    country_district: {
      keySelector: (c) => c.clientId as string,
      member: (): CountryDistrictsSchemaMember => ({
        fields: (): CountryDistrictSchemaFields => ({
          clientId: [],
          country: [requiredCondition],
          district: [],
        }),
      }),
    },
    num_affected: [positiveIntegerCondition],
    num_assisted: [positiveIntegerCondition],
    amount_requested: [positiveIntegerCondition],
    emergency_appeal_planned: [],

    disaster_date: [],
    ns_respond_date: [],

    affect_same_population: [],
    affect_same_communities: [],
    ns_respond: [],
    ns_request: [],
    ns_request_text: [max10CharCondition],
    lessons_learned: [max500CharCondition],

    event_description: [max800CharCondition],
    event_scope: [max800CharCondition],

    national_society_actions: [],
    government_requested_assistance: [],
    government_requested_assistance_date: [],
    national_authorities: [max300CharCondition],
    rcrc_partners: [max300CharCondition],
    icrc: [max300CharCondition],
    un_or_other: [max300CharCondition],
    major_coordination_mechanism: [max300CharCondition],
    identified_gaps : [max300CharCondition],

    needs_identified: {
      keySelector: (n) => n.clientId as string,
      member: (): NeedsSchemaMember => ({
        fields: (): NeedSchemaFields => ({
          clientId: [],
          title: [requiredCondition],
          description: [requiredCondition],
        }),
      }),
    },

    people_assisted: [max300CharCondition],
    selection_criteria: [max300CharCondition],
    entity_affected: [max300CharCondition],
    community_involved: [max300CharCondition],

    women: [positiveIntegerCondition],
    men: [positiveIntegerCondition],
    girls: [positiveIntegerCondition],
    boys: [positiveIntegerCondition],
    disability_people_per: [positiveIntegerCondition],
    people_per: [positiveIntegerCondition],
    displaced_people: [positiveIntegerCondition],

    operation_objective: [],
    response_strategy: [],

    planned_interventions: [], // TODO

    ns_request_date: [],
    start_date: [],
    submission_to_geneva: [],
    end_date: [],
    date_of_approval: [],
    operation_timeframe: [],
    publishing_date: [],

    appeal_code: [],
    glide_code: [],
    appeal_manager_name: [],
    appeal_manager_email: [],
    project_manager_name: [],
    project_manager_email: [],
    requestor_name: [],
    requestor_email: [],
    national_society_contact_name: [],
    national_society_contact_email: [],
    ifrc_emergency_name: [],
    ifrc_emergency_email: [],
    media_contact_name: [],
    media_contact_email: [],
  }),
  validation: (value) => {
    return undefined;
  },
};

const limitQuery = {
  limit: 500,
};

interface DrefOptions {
  disaster_category: NumericKeyValuePair[];
  national_society_actions: StringKeyValuePair[];
  needs_identified: StringKeyValuePair[];
  planned_interventions: StringKeyValuePair[];
  status: NumericKeyValuePair[];
  type_of_onset: NumericKeyValuePair[];
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

function useDrefFormOptions(value: PartialForm<DrefFields>) {
  const { strings } = React.useContext(LanguageContext);

  const {
    pending: fetchingUserDetails,
    response: userDetails,
  } = useRequest<User>({
    url: 'api/v2/user/me/',
  });

  const {
    pending: fetchingDrefOptions,
    response: drefOptions,
  } = useRequest<DrefOptions>({
    url: 'api/v2/dref-options/',
  });

  const [
    disasterCategoryOptions,
    nsActionOptions,
    needOptions,
    interventionOptions,
    onsetOptions,
  ] = React.useMemo(() => {
    if (!drefOptions) {
      return [
        emptyNumericOptionList,
        emptyStringOptionList,
        emptyStringOptionList,
        emptyStringOptionList,
        emptyNumericOptionList,
      ];
    }

    return [
      drefOptions.disaster_category.map(transformKeyValueToLabelValue),
      drefOptions.national_society_actions.map(transformKeyValueToLabelValue),
      drefOptions.needs_identified.map(transformKeyValueToLabelValue),
      drefOptions.planned_interventions.map(transformKeyValueToLabelValue),
      drefOptions.type_of_onset.map(transformKeyValueToLabelValue),
    ];
  }, [drefOptions]);

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

  return {
    countryOptions,
    disasterCategoryOptions,
    disasterTypeOptions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingDrefOptions,
    fetchingUserDetails,
    interventionOptions,
    needOptions,
    nsActionOptions,
    onsetOptions,
    userDetails,
    yesNoOptions,
    nationalSocietyOptions,
  };
}

export default useDrefFormOptions;
