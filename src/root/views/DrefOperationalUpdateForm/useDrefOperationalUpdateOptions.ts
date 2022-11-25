import React from 'react';
import { isDefined } from '@togglecorp/fujs';
import {
  ArraySchema,
  defaultEmptyArrayType,
  defaultUndefinedType,
  emailCondition,
  greaterThanOrEqualToCondition,
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
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import {
  positiveIntegerCondition,
  positiveNumberCondition,
} from '#utils/form';
import {
  isSimilarArray,
} from '#utils/common';

import {
  BooleanValueOption,
  DrefOperationalUpdateApiFields,
  DrefOperationalUpdateFields,
  emptyNumericOptionList,
  emptyStringOptionList,
  NumericKeyValuePair,
  NumericValueOption,
  StringKeyValuePair,
  User,
} from './common';

export type ContextType = {
  type: 'dref';
  value: DrefApiFields | undefined;
} | {
  type: 'opsUpdate';
  value: DrefOperationalUpdateApiFields | undefined;
}

export type FormSchema = ObjectSchema<
  PartialForm<DrefOperationalUpdateFields>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export type NeedType = NonNullable<NonNullable<DrefOperationalUpdateFields['needs_identified']>>[number];
export type NeedSchema = ObjectSchema<
  PartialForm<NeedType>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type NeedSchemaFields = ReturnType<NeedSchema['fields']>;
export type NeedsSchema = ArraySchema<
  PartialForm<NeedType>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type NeedsSchemaMember = ReturnType<NeedsSchema['member']>;

export type NsActionType = NonNullable<NonNullable<DrefOperationalUpdateFields['national_society_actions']>>[number];
export type NsActionSchema = ObjectSchema<
  PartialForm<NsActionType>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type NsActionSchemaFields = ReturnType<NsActionSchema['fields']>;
export type NsActionsSchema = ArraySchema<
  PartialForm<NsActionType>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type NsActionsSchemaMember = ReturnType<NsActionsSchema['member']>;

export type InterventionType = NonNullable<NonNullable<DrefOperationalUpdateFields['planned_interventions']>>[number];
export type InterventionSchema = ObjectSchema<
  PartialForm<InterventionType>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type InterventionSchemaFields = ReturnType<InterventionSchema['fields']>;
export type InterventionsSchema = ArraySchema<
  PartialForm<InterventionType>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type InterventionsSchemaMember = ReturnType<InterventionsSchema['member']>;

export type IndicatorType = InterventionType['indicators'][number];
export type IndicatorSchema = ObjectSchema<
  PartialForm<IndicatorType>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type IndicatorSchemaFields = ReturnType<IndicatorSchema['fields']>;
export type IndicatorsSchema = ArraySchema<
  PartialForm<IndicatorType>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type IndicatorsSchemaMember = ReturnType<IndicatorsSchema['member']>;


export type RiskSecurityType = NonNullable<NonNullable<DrefOperationalUpdateFields['risk_security']>>[number];
export type RiskSecuritySchema = ObjectSchema<
  PartialForm<RiskSecurityType>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type RiskSecuritySchemaFields = ReturnType<RiskSecuritySchema['fields']>;
export type RiskSecuritiesSchema = ArraySchema<
  PartialForm<RiskSecurityType>,
  PartialForm<DrefOperationalUpdateFields>,
  ContextType
>;
export type RiskSecuritiesSchemaMember = ReturnType<RiskSecuritiesSchema['member']>;

export const MaxIntLimit = 2147483647;

export function lessThanSixImagesCondition(value: any) {
  return isDefined(value) && Array.isArray(value) && value.length > 6
    ? 'Only six images are allowed'
    : undefined;
}

export function lessThanEqualToTwoImagesCondition(value: any) {
  return isDefined(value) && Array.isArray(value) && value.length > 2
    ? 'Only two images are allowed'
    : undefined;
}

const defaultSchema: FormSchemaFields = {
  // FIXME: un-comment fields that are actually used
  // field_report: [],
  title: [requiredCondition],
  national_society: [requiredCondition],
  disaster_category: [],
  disaster_type: [],
  type_of_onset: [requiredCondition],
  country: [],
  district: [
    (currentValue, allValue, context) => {
      const contextValue = context.value?.district;
      const areDistrictsSimilar = isSimilarArray(currentValue, contextValue ?? []);
      if (allValue?.changing_geographic_location && areDistrictsSimilar) {
        return 'Please select a different value when selected yes on changing geographic location';
      }

      if (!allValue?.changing_geographic_location && !areDistrictsSimilar) {
        return 'Please select yes on changing geographic location first';
      }

      return undefined;
    },
  ],
  number_of_people_targeted: [
    positiveIntegerCondition,
    (currentValue, allValue, context) => {
      const contextValue = context.type === 'dref' ? context.value?.total_targeted_population : context.value?.number_of_people_targeted;
      if (allValue.changing_target_population_of_operation && currentValue === contextValue) {
        return 'Please select a different value when selected yes on changing target population';
      }

      if (!allValue.changing_target_population_of_operation && currentValue !== contextValue) {
        return 'Please select yes on changing target population first';
      }

      return undefined;
    },
  ],
  number_of_people_affected: [positiveIntegerCondition],
  emergency_appeal_planned: [],
  cover_image_file: {
    fields: () => ({
      id: [defaultUndefinedType],
      caption: [defaultUndefinedType],
    }),
  },
  event_map_file: {
    fields: () => ({
      id: [defaultUndefinedType],
      caption: [defaultUndefinedType],
    }),
  },
  images_file: [defaultEmptyArrayType, lessThanEqualToTwoImagesCondition],
  event_date: [],
  event_text: [],
  anticipatory_actions: [],
  // go_field_report_date: [],
  event_description: [],
  government_requested_assistance: [],
  government_requested_assistance_date: [],
  national_authorities: [],
  partner_national_society: [],
  ifrc: [],
  icrc: [],
  un_or_other_actor: [],
  major_coordination_mechanism: [],
  people_assisted: [],
  selection_criteria: [],
  // community_involved: [],
  disability_people_per: [greaterThanOrEqualToCondition(0), lessThanOrEqualToCondition(100)],
  people_per_urban: [greaterThanOrEqualToCondition(0), lessThanOrEqualToCondition(100)],
  people_per_local: [greaterThanOrEqualToCondition(0), lessThanOrEqualToCondition(100)],
  displaced_people: [positiveIntegerCondition],
  people_targeted_with_early_actions: [positiveIntegerCondition],
  total_targeted_population: [positiveIntegerCondition],
  operation_objective: [],
  response_strategy: [],
  budget_file: [],
  new_operational_start_date: [],
  // reporting_timeframe: [],
  new_operational_end_date: [],
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
  users: [defaultEmptyArrayType],
  is_there_major_coordination_mechanism: [],
  is_surge_personnel_deployed: [],
  people_in_need: [],
  // supporting_document: [],
  risk_security_concern: [],
  photos_file: [lessThanEqualToTwoImagesCondition],
  additional_allocation: [
    (currentValue, allValue, _) => {
      if ((allValue?.changing_budget || allValue?.request_for_second_allocation) && !currentValue) {
        return 'Please add a value when selected yes on changing budget or on request for a second allocation!';
      }

      if ((!allValue?.changing_budget || !allValue?.request_for_second_allocation) && currentValue) {
        return 'Please select yes on both changing budget and on request for a second allocation!';
      }

      return undefined;
    },
  ],
  total_dref_allocation: [],
  is_man_made_event: [],
  is_assessment_report: [],
  dref: [],
  has_forecasted_event_materialize: [],
  specified_trigger_met: [],
  changing_timeframe_operation: [],
  changing_operation_strategy: [],
  changing_budget: [],
  changing_target_population_of_operation: [],
  changing_geographic_location: [],
  request_for_second_allocation: [],
  did_national_society: [],
  ns_respond_date: [],
  has_event_occurred: [],
  reporting_start_date: [],
  reporting_end_date: [],
  total_operation_timeframe: [
    (currentValue, allValue, context) => {
      const contextValue = context.type === 'dref' ? context.value?.operation_timeframe : context.value?.total_operation_timeframe;

      if (allValue?.changing_timeframe_operation && currentValue === contextValue) {
        return 'Please select a different timeframe when selected yes on changing the operation timeframe';
      }

      if (currentValue !== contextValue && !allValue?.changing_timeframe_operation) {
        return 'Please select yes on changing the operation timeframe first';
      }

      return undefined;
    }
  ],
  national_society_actions: {
    keySelector: (n) => n.clientId as string,
    member: (): NsActionsSchemaMember => ({
      fields: (): NsActionSchemaFields => ({
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
              title: [],
              target: [positiveNumberCondition],
            })
          })
        },
        description: [],
      }),
    }),
  },
  risk_security: {
    keySelector: (r) => r.clientId as string,
    member: (): RiskSecuritiesSchemaMember => ({
      fields: (): RiskSecuritySchemaFields => ({
        clientId: [],
        risk: [requiredCondition],
        mitigation: [requiredCondition],
      }),
    }),
  },
};

const isNotAssessmentSchema: FormSchemaFields = {
  // FIXME: un-comment fields that are actually used
  // ns_request_fund: [],
  // affect_same_area: [],
  // ns_respond: [],
  // affect_same_population: [],
  // ns_request_text: [],
  // lessons_learned: [],
  // dref_recurrent_text: [],
  identified_gaps: [],
  women: [positiveIntegerCondition],
  men: [positiveIntegerCondition],
  girls: [positiveIntegerCondition],
  boys: [positiveIntegerCondition],
  event_scope: [],
  assessment_report: [],
  logistic_capacity_of_ns: [],
  pmer: [],
  communication: [],
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
};

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => {
    if (value?.is_assessment_report) {
      return {
        ...defaultSchema,
      };
    }
    else {
      return {
        ...defaultSchema,
        ...isNotAssessmentSchema,
      };
    }
  },
  fieldDependencies: () => ({
    'total_operation_timeframe': ['changing_timeframe_operation'],
    'number_of_people_targeted': ['changing_target_population_of_operation'],
    'district': ['changing_geographic_location'],
    'additional_allocation': ['changing_budget', 'request_for_second_allocation'],
  }),
  validation: () => {
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

interface DrefOperationalUpdateOptions {
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

function useDrefOperationalFormOptions(value: PartialForm<DrefOperationalUpdateFields>) {
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
  } = useRequest<DrefOperationalUpdateOptions>({
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
export default useDrefOperationalFormOptions;
