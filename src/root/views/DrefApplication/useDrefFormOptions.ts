import React from 'react';
import {
  PartialForm,
  ObjectSchema,
  ArraySchema,
} from '@togglecorp/toggle-form';

import { requiredCondition } from '#utils/form';
import { compareString } from '#utils/utils';
import LanguageContext from '#root/languageContext';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';

import {
  Country
} from '#types';

import {
  BooleanValueOption,
  NumericValueOption,
  emptyNumericOptionList,
  Entity,
  User,
  emptyStringOptionList,
  NSEntity,
  DrefFields,
} from './common';

export type FormSchema = ObjectSchema<PartialForm<DrefFields>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export type CountryDistrictType = NonNullable<NonNullable<DrefFields['country_district']>>[number];
export type CountryDistrictSchema = ObjectSchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictSchemaFields = ReturnType<CountryDistrictSchema['fields']>;
export type CountryDistrictsSchema = ArraySchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictsSchemaMember = ReturnType<CountryDistrictsSchema['member']>;

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
    title: [],
    national_society: [],
    disaster_type: [],
    type_of_onset: [],
    disaster_category_level: [],
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
    num_affected: [],
    num_assisted: [],
    amount_requested: [],
    emergency_appeal_planned: [],

    disaster_date: [],
    ns_respond_date: [],

    affect_same_population: [],
    affect_same_communities: [],
    ns_respond: [],
    ns_request: [],
    ns_request_text: [],
    lessons_learned: [],

    event_description: [],
    event_scope: [],

    national_society_actions: [],
    government_requested_assistance: [],
    government_requested_assistance_date: [],
    national_authorities: [],
    rcrc_partners: [],
    icrc: [],
    un_or_other: [],
    major_coordination_mechanism: [],

    needs_identified: [],

    people_assisted: [],
    selection_criteria: [],
    community_involved: [],

    women: [],
    men: [],
    girls: [],
    boys: [],
    disability_people_per: [],
    people_per: [],
    displaced_people: [],

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

function useDrefFormOptions(value: PartialForm<DrefFields>) {
  const { strings } = React.useContext(LanguageContext);

  const {
    pending: fetchingUserDetails,
    response: userDetails,
  } = useRequest<User>({
    url: 'api/v2/user/me/',
  });

  const {
    pending: fetchingCountries,
    response: countriesResponse,
  } = useRequest<ListResponse<Country>>({
    url: 'api/v2/country/',
    query: limitQuery,
  });

  const countryOptions = React.useMemo(() => (
    countriesResponse?.results?.filter(
      c => c.independent && c.record_type === 1
    ).map((c) => ({
      value: c.id,
      label: c.name,
    })) ?? emptyNumericOptionList
  ), [countriesResponse]);

  const {
    pending: fetchingDisasterTypes,
    response: disasterTypesResponse,
  } = useRequest<ListResponse<Entity>>({
    url: 'api/v2/disaster_type/',
  });

  const disasterTypeOptions = React.useMemo(() => (
    disasterTypesResponse?.results?.map((d) => ({
      value: d.id,
      label: d.name,
    })) ?? emptyNumericOptionList
  ), [disasterTypesResponse]);

  const {
    pending: fetchingNationalSociety,
    response: nationalSocietyResponse,
  } = useRequest<ListResponse<NSEntity>>({
    url: 'api/v2/national-society-action/',
  });

  const nationalSocietyOptions = React.useMemo(() => (
    nationalSocietyResponse?.results?.map((d) => ({
      value: d.title,
      label: d.description,
    })) ?? emptyStringOptionList
  ), [nationalSocietyResponse]);

  const {
    pending: fetchingSupportedActivities,
    response: supportedActivitiesResponse,
  } = useRequest<ListResponse<Entity>>({
    url: 'api/v2/supported_activity/',
    query: limitQuery,
  });

  const supportedActivityOptions = React.useMemo(() => (
    supportedActivitiesResponse?.results?.map((d) => ({
      value: d.id,
      label: d.name,
    })) ?? emptyNumericOptionList
  ), [supportedActivitiesResponse]);

  const {
    pending: fetchingExternalPartners,
    response: externalPartnersResponse,
  } = useRequest<ListResponse<Entity>>({
    url: 'api/v2/external_partner/',
    query: limitQuery,
  });

  const externalPartnerOptions = React.useMemo(() => (
    externalPartnersResponse?.results?.map((d) => ({
      value: d.id,
      label: d.name,
    })) ?? emptyNumericOptionList
  ), [externalPartnersResponse]);

  const yesNoOptions = React.useMemo(() => {
    return [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ] as BooleanValueOption[];
  }, []);

  const ONSET_ANTICIPATORY = 0;
  const ONSET_IMMINENT = 1;
  const ONSET_SLOW = 2;
  const ONSET_SUDDEN = 3;

  const DISASTER_CATEGORY_YELLOW = 0;
  const DISASTER_CATEGORY_ORANGE = 1;
  const DISASTER_CATEGORY_RED = 2;

  const onsetOptions: NumericValueOption[] = React.useMemo(() => ([
    {label: 'Anticipatory', value: ONSET_ANTICIPATORY},
    {label: 'Imminent', value: ONSET_IMMINENT},
    {label: 'Slow', value: ONSET_SLOW},
    {label: 'Sudden onset', value: ONSET_SUDDEN},
  ]), []);

  const disasterCategoryOptions: NumericValueOption[] = React.useMemo(() => ([
    {label: 'Yellow', value: DISASTER_CATEGORY_YELLOW},
    {label: 'Orange', value: DISASTER_CATEGORY_ORANGE},
    {label: 'Red', value: DISASTER_CATEGORY_RED},
  ]), []);


  return {
    countryOptions,
    disasterTypeOptions,
    externalPartnerOptions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingExternalPartners,
    fetchingSupportedActivities,
    fetchingUserDetails,
    supportedActivityOptions,
    userDetails,
    yesNoOptions,
    fetchingNationalSociety,
    nationalSocietyOptions,
    onsetOptions,
    disasterCategoryOptions,
  };
}

export default useDrefFormOptions;
