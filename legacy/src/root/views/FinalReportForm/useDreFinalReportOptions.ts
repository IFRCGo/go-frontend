import React from 'react';
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
import { isDefined } from '@togglecorp/fujs';

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

export type RiskSecurityType = NonNullable<NonNullable<DrefFinalReportFields['risk_security']>>[number];
export type RiskSecuritySchema = ObjectSchema<
  PartialForm<RiskSecurityType>,
  PartialForm<DrefFinalReportFields>
>;
export type RiskSecuritySchemaFields = ReturnType<RiskSecuritySchema['fields']>;
export type RiskSecuritiesSchema = ArraySchema<
  PartialForm<RiskSecurityType>,
  PartialForm<DrefFinalReportFields>
>;
export type RiskSecuritiesSchemaMember = ReturnType<RiskSecuritiesSchema['member']>;


export const MaxIntLimit = 2147483647;
export function lessThanEqualToTwoImagesCondition(value: any) {
  return isDefined(value) && Array.isArray(value) && value.length > 2
    ? 'Only two images are allowed'
    : undefined;
}

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
    title: [],
    national_society: [],
    disaster_type: [],
    disaster_category: [],
    type_of_onset: [],
    date_of_publication: [],
    number_of_people_affected: [positiveIntegerCondition],
    number_of_people_targeted: [positiveIntegerCondition],
    type_of_dref: [requiredCondition],
    total_dref_allocation: [],
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
    women: [positiveIntegerCondition],
    men: [positiveIntegerCondition],
    girls: [positiveIntegerCondition],
    boys: [positiveIntegerCondition],
    disability_people_per: [greaterThanOrEqualToCondition(0), lessThanOrEqualToCondition(100)],
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
    images_file: [defaultEmptyArrayType, lessThanEqualToTwoImagesCondition],
    event_scope: [],
    change_in_operational_strategy: [],
    change_in_operational_strategy_text: [],
    additional_national_society_actions: [],
    want_to_report: [],
    event_map: [],
    country: [requiredCondition],
    district: [requiredCondition],
    photos_file: [lessThanEqualToTwoImagesCondition],
    is_there_major_coordination_mechanism: [],
    risk_security_concern: [],
    total_targeted_population: [],
    modified_at: [],
    people_in_need: [],
    event_date: [],
    event_text: [],
    event_description: [],
    ns_respond_date: [],
    has_national_society_conducted: [],
    national_society_conducted_description: [],
    num_assisted: [],
    financial_report: [],
    financial_report_description: [],
    users: [defaultEmptyArrayType],

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
          person_assisted: [requiredCondition, positiveIntegerCondition, lessThanOrEqualToCondition(MaxIntLimit)],
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
          male: [positiveIntegerCondition],
          female: [positiveIntegerCondition],
          lessons_learnt: [],
          challenges: [],
          narrative_description_of_achievements: [],
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
  type_of_dref: NumericKeyValuePair[];
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
    response: userResponse,
  } = useRequest<ListResponse<UserListItem>>({
    url: 'api/v2/users/'
  });

  const userOptions = React.useMemo(
    () => userResponse?.results.map((u) => ({
      label: `${u.first_name} ${u.last_name}`,
      value: u.id,
    })) ?? [], [userResponse]);

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
    drefTypeOptions,
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
      drefOptions.type_of_dref.map(transformKeyValueToLabelValue)
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
      .filter(cd => cd.independent && cd.society_name)
      .map(ns => ({
        value: ns.id,
        label: ns.society_name,
      })).sort(compareString);

    const country: NumericValueOption[] = countriesResponse.results
      .filter(cd => cd.independent && cd.iso)
      .map(c => ({
        value: c.id,
        label: c.name,
      })).sort(compareString);

    return [ns, country] as const;
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
    drefTypeOptions,
  };
}
export default useDrefFinalReportFormOptions;
