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
import {
  positiveIntegerCondition, positiveNumberCondition,
} from '#utils/form';

import {
  BooleanValueOption,
  DrefApplicationValidateConditionalField,
  DrefOperationalUpdateFields,
  emptyNumericOptionList,
  emptyStringOptionList,
  NumericKeyValuePair,
  NumericValueOption,
  StringKeyValuePair,
  User,
} from './common';

export type FormSchema = ObjectSchema<PartialForm<DrefOperationalUpdateFields>, PartialForm<DrefOperationalUpdateFields>, PartialForm<DrefApplicationValidateConditionalField>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export type NeedType = NonNullable<NonNullable<DrefOperationalUpdateFields['needs_identified']>>[number];
export type NeedSchema = ObjectSchema<PartialForm<NeedType>>;
export type NeedSchemaFields = ReturnType<NeedSchema['fields']>;
export type NeedsSchema = ArraySchema<PartialForm<NeedType>>;
export type NeedsSchemaMember = ReturnType<NeedsSchema['member']>;

export type NsActionType = NonNullable<NonNullable<DrefOperationalUpdateFields['national_society_actions']>>[number];
export type NsActionSchema = ObjectSchema<PartialForm<NsActionType>>;
export type NsActionSchemaFields = ReturnType<NsActionSchema['fields']>;
export type NsActionsSchema = ArraySchema<PartialForm<NsActionType>>;
export type NsActionsSchemaMember = ReturnType<NsActionsSchema['member']>;

export type InterventionType = NonNullable<NonNullable<DrefOperationalUpdateFields['planned_interventions']>>[number];
export type InterventionSchema = ObjectSchema<PartialForm<InterventionType>>;
export type InterventionSchemaFields = ReturnType<InterventionSchema['fields']>;
export type InterventionsSchema = ArraySchema<PartialForm<InterventionType>>;
export type InterventionsSchemaMember = ReturnType<InterventionsSchema['member']>;

export type IndicatorType = InterventionType['indicators'][number];
export type IndicatorSchema = ObjectSchema<PartialForm<IndicatorType>>;
export type IndicatorSchemaFields = ReturnType<IndicatorSchema['fields']>;
export type IndicatorsSchema = ArraySchema<PartialForm<IndicatorType>>;
export type IndicatorsSchemaMember = ReturnType<IndicatorsSchema['member']>;


export type RiskSecurityType = NonNullable<NonNullable<DrefOperationalUpdateFields['risk_security']>>[number];
export type RiskSecuritySchema = ObjectSchema<PartialForm<RiskSecurityType>>;
export type RiskSecuritySchemaFields = ReturnType<RiskSecuritySchema['fields']>;
export type RiskSecuritiesSchema = ArraySchema<PartialForm<RiskSecurityType>>;
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

export function changeTimeFrameCondition(value: any) {
  return isDefined(value) && Array.isArray(value)
    ? "kjghf"
    : undefined;
}

const defaultSchema: FormSchemaFields = {
  field_report: [],
  title: [requiredCondition],
  national_society: [requiredCondition],
  disaster_category: [],
  disaster_type: [],
  type_of_onset: [requiredCondition],
  country: [],
  district: [],
  number_of_people_targeted: [positiveIntegerCondition],
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
  anticipatory_actions: [],
  go_field_report_date: [],
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
  community_involved: [],
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
  reporting_timeframe: [],
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
  supporting_document: [],
  risk_security_concern: [],
  photos_file: [lessThanEqualToTwoImagesCondition],
  additional_allocation: [],
  total_dref_allocation: [],
  is_man_made_event: [],
  is_assessment_report: [],
  dref: [],
  has_forecasted_event_materialize: [],
  specified_trigger_met: [],
  changing_timeframe_operation: [],
  changing_operation_strategy: [],
  changing_budget: [],
  changing_target_population_of_operation: [(_, allValue, contextValue) => {
    if ((allValue?.number_of_people_targeted === contextValue?.number_of_people_targeted)
      && allValue?.changing_target_population_of_operation) {
      return 'Please restore country and region value';
    }
    if ((allValue?.number_of_people_targeted !== contextValue?.number_of_people_targeted)
      && !allValue?.changing_target_population_of_operation) {
      return 'Please select yes to change country and region';
    }
  }],
  changing_geographic_location: [
    (_, allValue, contextValue) => {
      if ((allValue?.country === contextValue?.country)
        && allValue?.changing_geographic_location) {
        return 'Please restore people targeted value';
      }
      if ((allValue?.country !== contextValue?.country)
        && !allValue?.changing_geographic_location) {
        return 'Please select yes to change people targeted value';
      }
    }
  ],
  request_for_second_allocation: [
    (_, allValue, contextValue) => {
      if ((allValue?.additional_allocation === contextValue?.additional_allocation)
        && allValue?.request_for_second_allocation) {
        return 'Please restore additional allocation value';
      }
      if ((allValue?.additional_allocation !== contextValue?.additional_allocation)
        && !allValue?.request_for_second_allocation) {
        return 'Please select yes to change additional allocation';
      }
    }],
  total_operation_timeframe: [
    (_, allValue, contextValue) => {
      if ((allValue?.total_operation_timeframe === contextValue?.total_operation_timeframe)
        && allValue?.changing_timeframe_operation) {
        return 'Please change timeframe';
      }
      if ((allValue?.total_operation_timeframe !== contextValue?.total_operation_timeframe)
        && !allValue?.changing_timeframe_operation) {
        return 'cannot change timeframe';
      }
    }],
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
  ns_request_fund: [],
  affect_same_area: [],
  ns_respond: [],
  affect_same_population: [],
  ns_request_text: [],
  lessons_learned: [],
  dref_recurrent_text: [],
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
