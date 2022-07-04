import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import {
  ArraySchema,
  emailCondition,
  lessThanOrEqualToCondition,
  ObjectSchema,
  PartialForm,
  requiredCondition,
} from '@togglecorp/toggle-form';

import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import languageContext from '#root/languageContext';
import { compareString } from '#utils/utils';
import { Disaster } from '#types/project';
import { Country } from '#types/country';
import {
  positiveIntegerCondition,
} from '#utils/form';

import {
  BooleanValueOption,
  DrefFinalReportFields,
  emptyNumericOptionList,
  emptyStringOptionList,
  NumericKeyValuePair,
  NumericValueOption,
  StringKeyValuePair,
  User,
} from './common';

export type FormSchema = ObjectSchema<PartialForm<DrefFinalReportFields>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export type CountryDistrictType = NonNullable<NonNullable<DrefFinalReportFields['country_district']>>[number];
export type CountryDistrictSchema = ObjectSchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictSchemaFields = ReturnType<CountryDistrictSchema['fields']>;
export type CountryDistrictsSchema = ArraySchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictsSchemaMember = ReturnType<CountryDistrictsSchema['member']>;

export type NeedType = NonNullable<NonNullable<DrefFinalReportFields['needs_identified']>>[number];
export type NeedSchema = ObjectSchema<PartialForm<NeedType>>;
export type NeedSchemaFields = ReturnType<NeedSchema['fields']>;
export type NeedsSchema = ArraySchema<PartialForm<NeedType>>;
export type NeedsSchemaMember = ReturnType<NeedsSchema['member']>;

export type InterventionType = NonNullable<NonNullable<DrefFinalReportFields['planned_interventions']>>[number];
export type InterventionSchema = ObjectSchema<PartialForm<InterventionType>>;
export type InterventionSchemaFields = ReturnType<InterventionSchema['fields']>;
export type InterventionsSchema = ArraySchema<PartialForm<InterventionType>>;
export type InterventionsSchemaMember = ReturnType<InterventionsSchema['member']>;

export type IndicatorType = InterventionType['indicators'][number];
export type IndicatorSchema = ObjectSchema<PartialForm<IndicatorType>>;
export type IndicatorSchemaFields = ReturnType<IndicatorSchema['fields']>;
export type IndicatorsSchema = ArraySchema<PartialForm<IndicatorType>>;
export type IndicatorsSchemaMember = ReturnType<IndicatorsSchema['member']>;


export const MaxIntLimit = 2147483647;

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
    title: [],
    national_society: [],
    disaster_type: [],
    disaster_category: [],
    type_of_onset: [],
    country_district: {
      keySelector: (c) => c.clientId as string,
      member: (): CountryDistrictsSchemaMember => ({
        fields: (): CountryDistrictSchemaFields => ({
          clientId: [],
          country: [requiredCondition, (value, allValues) => {
            if (isNotDefined(value)) {
              return undefined;
            }
            const countriesWithCurrentId = (allValues as unknown as DrefFinalReportFields)?.country_district?.filter(
              d => d.country === value
            );

            if (countriesWithCurrentId.length > 1) {
              return 'Duplicate countries not allowed';
            }

            return undefined;
          }],
          district: [requiredCondition],
        }),
      }),
    },
    date_of_publication: [],

    number_of_people_affected: [positiveIntegerCondition],
    number_of_people_targeted: [positiveIntegerCondition],
    total_dref_allocation: [],
    images: [],
    operation_start_date: [],
    total_operation_timeframe: [positiveIntegerCondition],
    ifrc: [],
    icrc: [],
    partner_national_society: [],
    government_requested_assistance: [],
    national_authorities: [],
    un_or_other_actor: [],
    major_coordination_mechanism: [],
    people_assisted: [],
    selection_criteria: [],
    entity_affected: [],
    women: [positiveIntegerCondition],
    men: [positiveIntegerCondition],
    girls: [positiveIntegerCondition],
    boys: [positiveIntegerCondition],
    disability_people_per: [positiveIntegerCondition],
    people_per_urban: [positiveIntegerCondition],
    people_per_local: [positiveIntegerCondition],
    displaced_people: [positiveIntegerCondition],
    people_targeted_with_early_actions: [positiveIntegerCondition],
    operation_objective: [],
    response_strategy: [],
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
    ifrc_emergency_name: [],
    ifrc_emergency_title: [],
    ifrc_emergency_email: [emailCondition],
    ifrc_emergency_phone_number: [],
    media_contact_name: [],
    media_contact_title: [],
    media_contact_email: [emailCondition],
    media_contact_phone_number: [],
    dref: [],
    photos: [],
    budget_file: [],
    event_scope: [],
    change_in_operational_strategy: [],
    change_in_operational_strategy_text: [],
    additional_national_society_actions: [],
    want_to_report: [],

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
    planned_interventions: {
      keySelector: (n) => n.clientId as string,
      member: (): InterventionsSchemaMember => ({
        fields: (): InterventionSchemaFields => ({
          clientId: [],
          title: [requiredCondition],
          budget: [requiredCondition, positiveIntegerCondition, lessThanOrEqualToCondition(MaxIntLimit)],
          person_targeted: [requiredCondition, positiveIntegerCondition, lessThanOrEqualToCondition(MaxIntLimit)],
          indicators: {
            keySelector: (n) => n.clientId as string,
            member: (): IndicatorsSchemaMember => ({
              fields: (): IndicatorSchemaFields => ({
                clientId: [],
                title: [requiredCondition],
                target: [positiveIntegerCondition],
                actual: [positiveIntegerCondition],
              })
            })
          },
          description: [],
          progress_towards_outcome: [],
          male: [positiveIntegerCondition],
          female: [positiveIntegerCondition],
          lessons_learnt: [],
          challenges: [],
        }),
      }),
    },
  })
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

interface DrefFinalReportOptions {
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

function useDrefFinalReportFormOptions(value: PartialForm<DrefFinalReportFields>) {
  const { strings } = React.useContext(languageContext);

  const {
    pending: fetchingUserDetails,
    response: userDetails,
  } = useRequest<User>({
    url: 'api/v2/user/me/',
  });

  const {
    pending: fetchingDrefOptions,
    response: drefOptions,
  } = useRequest<DrefFinalReportOptions>({
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
        label: `${u.first_name} ${u.last_name}`,
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
export default useDrefFinalReportFormOptions;
