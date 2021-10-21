import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';
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

export type NsActionType = NonNullable<NonNullable<DrefFields['national_society_actions']>>[number];
export type NsActionSchema = ObjectSchema<PartialForm<NsActionType>>;
export type NsActionSchemaFields = ReturnType<NsActionSchema['fields']>;
export type NsActionsSchema = ArraySchema<PartialForm<NsActionType>>;
export type NsActionsSchemaMember = ReturnType<NsActionsSchema['member']>;

export function max10CharCondition(value: any) {
  return isDefined(value) && value.length > 10
    ? 'only 10 characters are allowed'
    : undefined;
}

export function lessThanSixImagesCondition(value: any) {
  return isDefined(value) && Array.isArray(value) && value.length > 6
    ? 'Only six images are allowed'
    : undefined;
}

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
    field_report: [],
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
          country: [requiredCondition, (value, allValues) =>{
            if (isNotDefined(value)) {
              return undefined;
            }
            const countriesWithCurrentId = (allValues as unknown as DrefFields)?.country_district?.filter(
              d => d.country === value
            );

            if (countriesWithCurrentId.length > 1) {
              return 'Duplicate countries not allowed';
            }

            return undefined;
          }],
          district: [],
        }),
      }),
    },
    num_affected: [positiveIntegerCondition],
    num_assisted: [positiveIntegerCondition],
    amount_requested: [positiveNumberCondition],
    emergency_appeal_planned: [],
    event_map: [requiredCondition],

    event_date: [],
    event_text: [],
    anticipatory_actions: [],

    go_field_report_date: [],
    ns_respond_date: [],

    affect_same_population: [],
    ns_request_fund:[],
    ns_respond: [],
    ns_request_text: [],
    lessons_learned: [],

    event_description: [],
    event_scope: [],
    images: [lessThanSixImagesCondition],

    national_society_actions: {
      keySelector: (n) => n.clientId as string,
      member: (): NsActionsSchemaMember => ({
        fields: (): NsActionSchemaFields => ({
          title: [requiredCondition],
          description: [requiredCondition],
        }),
      }),
    },
    government_requested_assistance: [],
    government_requested_assistance_date: [],
    national_authorities: [],
    partner_national_society: [],
    ifrc: [],
    icrc: [],
    affect_same_area:[],
    un_or_other_actor: [],
    major_coordination_mechanism: [],
    identified_gaps: [],

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
    people_assisted: [],
    selection_criteria: [],
    entity_affected: [],
    community_involved: [],

    women: [positiveIntegerCondition],
    men: [positiveIntegerCondition],
    girls: [positiveIntegerCondition],
    boys: [positiveIntegerCondition],
    disability_people_per: [positiveNumberCondition, lessThanOrEqualToCondition(100)],
    people_per_urban: [positiveNumberCondition, lessThanOrEqualToCondition(100)],
    people_per_local: [positiveNumberCondition, lessThanOrEqualToCondition(100)],
    displaced_people: [positiveIntegerCondition],
    people_targeted_with_early_actions: [positiveIntegerCondition],
    total_targated_population:[positiveIntegerCondition],
    operation_objective: [],
    response_strategy: [],

    budget_file: [],
    planned_interventions: {
      keySelector: (n) => n.clientId as string,
      member: (): InterventionsSchemaMember => ({
        fields: (): InterventionSchemaFields => ({
          clientId: [],
          title: [requiredCondition],
          budget: [requiredCondition, positiveIntegerCondition],
          person_targeted: [positiveIntegerCondition],
          indicator: [],
          description: [],
        }),
      }),
    },
    ns_request_date: [],
    start_date: [],
    submission_to_geneva: [],
    end_date: [],
    date_of_approval: [],
    operation_timeframe: [positiveIntegerCondition],
    publishing_date: [],
    dref_recurrent_text: [],
    appeal_code: [],
    glide_code: [],
    ifrc_appeal_manager_name: [],
    ifrc_appeal_manager_email: [emailCondition],
    ifrc_appeal_manager_phone_number: [],
    ifrc_appeal_manager_title: [],
    ifrc_project_manager_name: [],
    ifrc_project_manager_email: [emailCondition],
    ifrc_project_manager_title: [],
    ifrc_project_manager_phone_number: [],
    national_society_contact_name: [],
    national_society_contact_title: [],
    national_society_contact_email: [emailCondition],
    national_society_contact_phone_number: [],
    ifrc_emergency_name: [],
    ifrc_emergency_title: [],
    ifrc_emergency_email: [emailCondition],
    ifrc_emergency_phone_number: [],
    media_contact_name: [],
    media_contact_title: [],
    media_contact_email: [emailCondition],
    media_contact_phone_number: [],
    human_resource: [],
    surge_personnel_deployed: [],
    logistic_capacity_of_ns: [],
    safety_concerns: [],
    pmer: [],
    communication: [],
    users: [],
  }),
  fieldDependencies: () => ({
  }),
  validation: (value) => {
    return undefined;
  },
};

const limitQuery = {
  limit: 500,
};

interface UserListItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

interface DrefOptions {
  disaster_category: NumericKeyValuePair[];
  national_society_actions: StringKeyValuePair[];
  needs_identified: StringKeyValuePair[];
  planned_interventions: StringKeyValuePair[];
  status: NumericKeyValuePair[];
  type_of_onset: NumericKeyValuePair[];
  users: UserListItem[];
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
    userOptions,
  ] = React.useMemo(() => {
    if (!drefOptions) {
      return [
        emptyNumericOptionList,
        emptyStringOptionList,
        emptyStringOptionList,
        emptyStringOptionList,
        emptyNumericOptionList,
        emptyNumericOptionList,
      ];
    }

    return [
      drefOptions.disaster_category.map(transformKeyValueToLabelValue),
      drefOptions.national_society_actions.map(transformKeyValueToLabelValue),
      drefOptions.needs_identified.map(transformKeyValueToLabelValue),
      drefOptions.planned_interventions.map(transformKeyValueToLabelValue),
      drefOptions.type_of_onset.map(transformKeyValueToLabelValue),
      drefOptions.users.map((u) => ({
        label: `${u.first_name} ${u.last_name} (${u.email || u.username})`,
        value: u.id,
      })),
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
    userOptions,
  };
}

export default useDrefFormOptions;
