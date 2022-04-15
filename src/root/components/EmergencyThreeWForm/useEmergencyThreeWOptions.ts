import React from 'react';
import {
  listToMap,
  listToGroupList,
  isNotDefined,
  isDefined,
} from '@togglecorp/fujs';
import {
  PartialForm,
  ObjectSchema,
  ArraySchema,
  forceUndefinedType,
  requiredCondition,
  emailCondition,
  lessThanOrEqualToCondition,
  defaultUndefinedType,
} from '@togglecorp/toggle-form';

import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import {
  NumericValueOption,
  StringValueOption,
  CountryMini,
  ERU,
  Event,
  DistrictMini,
} from '#types';
import { compareString } from '#utils/utils';
import { positiveIntegerCondition } from '#utils/form';

export const ACTIVITY_LEADER_NS = 'national_society';
export const ACTIVITY_LEADER_ERU = 'deployed_eru';

export const STATUS_COMPLETE = 'complete';
export const STATUS_ONGOING = 'on_going';
export const STATUS_PLANNED = 'planned';

export interface EmergencyThreeWOptionsResponse {
  actions: {
    id: number;
    sector: number;
    order: number;
    title: string;
    description: string;
    is_cash_type: boolean;
    has_location: boolean;
    supplies_details: {
      id: number;
      title: string;
      order: number;
    }[]
  }[];
  sectors: {
    id: number;
    title: string;
    order: number;
  }[];
}

export interface Supply {
  client_id: string;
  item: number;
  count: number;
}

export interface CustomSupply {
  client_id: string;
  item: string;
  count: number;
}

export interface Point {
  client_id: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface ActivityBase {
  sector: number;
  details: string;
  is_simplified_report: boolean | null;
  has_no_data_on_people_reached: boolean | null;

  beneficiaries_count?: number | null;
  amount?: number | null;

  people_households: 'people' | 'households';
  household_count: number | null;
  people_count: number | null;
  male_count: number | null;
  female_count: number | null;

  male_0_1_count: number | null;
  male_2_5_count: number | null;
  male_6_12_count: number | null;
  male_13_17_count: number | null;
  male_18_59_count: number | null;
  male_60_plus_count: number | null;
  male_unknown_age_count: number | null;

  female_0_1_count: number | null;
  female_2_5_count: number | null;
  female_6_12_count: number | null;
  female_13_17_count: number | null;
  female_18_59_count: number | null;
  female_60_plus_count: number | null;
  female_unknown_age_count: number | null;

  other_0_1_count: number | null;
  other_2_5_count: number | null;
  other_6_12_count: number | null;
  other_13_17_count: number | null;
  other_18_59_count: number | null;
  other_60_plus_count: number | null;
  other_unknown_age_count: number | null;

  is_disaggregated_for_disabled: boolean | null;

  disabled_male_0_1_count: number | null;
  disabled_male_2_5_count: number | null;
  disabled_male_6_12_count: number | null;
  disabled_male_13_17_count: number | null;
  disabled_male_18_59_count: number | null;
  disabled_male_60_plus_count: number | null;
  disabled_male_unknown_age_count: number | null;

  disabled_female_0_1_count: number | null;
  disabled_female_2_5_count: number | null;
  disabled_female_6_12_count: number | null;
  disabled_female_13_17_count: number | null;
  disabled_female_18_59_count: number | null;
  disabled_female_60_plus_count: number | null;
  disabled_female_unknown_age_count: number | null;

  disabled_other_0_1_count: number | null;
  disabled_other_2_5_count: number | null;
  disabled_other_6_12_count: number | null;
  disabled_other_13_17_count: number | null;
  disabled_other_18_59_count: number | null;
  disabled_other_60_plus_count: number | null;
  disabled_other_unknown_age_count: number | null;

  point_count: number | null;
  points: Point[];
}

export interface Activity extends ActivityBase {
  // NOTE: we call this activity in client
  action?: number | null;
  supplies: Supply[];
  custom_supplies: CustomSupply[];
}

export interface CustomActivity extends ActivityBase {
  client_id: string;
  // NOTE: we call this custom activity in client
  custom_action: string | null;
  custom_supplies: CustomSupply[];
}

export interface Sector {
  sector: number;
  activities: Activity[];
  custom_activities: CustomActivity[];
}

export interface EmergencyThreeWFormFields {
  _firstSubmission: boolean;
  title: string;
  country: number;
  districts: number[];
  status: string;
  event: number;
  start_date: string;
  end_date: string | null;
  activity_lead: string;

  reporting_ns: number | null;
  reporting_ns_contact_name: string | null;
  reporting_ns_contact_role: string | null;
  reporting_ns_contact_email: string | null;

  deployed_eru: number | null;

  sectors: Sector[];
}

type BaseValue = PartialForm<EmergencyThreeWFormFields>;

type FormSchema = ObjectSchema<BaseValue>;

type FormSchemaFields = ReturnType<FormSchema['fields']>;
const emptyNumericOptionList: NumericValueOption[] = [];
const emptyERUList: ERU[] = [];

type SectorSchema = ObjectSchema<PartialForm<Sector>, BaseValue>;
type SectorSchemaFields = ReturnType<SectorSchema['fields']>;

type SectorsSchema = ArraySchema<PartialForm<Sector>, BaseValue>;
type SectorsSchemaMember = ReturnType<SectorsSchema['member']>;

type ActivitySchema = ObjectSchema<PartialForm<Activity>, BaseValue>;
type ActivitySchemaFields = ReturnType<ActivitySchema['fields']>;
type ActivitiesSchema = ArraySchema<PartialForm<Activity>, BaseValue>;
type ActivitiesSchemaMember = ReturnType<ActivitiesSchema['member']>;

type SupplySchema = ObjectSchema<PartialForm<Supply>, BaseValue>;
type SupplySchemaFields = ReturnType<SupplySchema['fields']>;
type SuppliesSchema = ArraySchema<PartialForm<Supply>, BaseValue>;
type SuppliesSchemaMember = ReturnType<SuppliesSchema['member']>;

type CustomActivitySchema = ObjectSchema<PartialForm<CustomActivity>, BaseValue>;
type CustomActivitySchemaFields = ReturnType<CustomActivitySchema['fields']>;
type CustomActivitiesSchema = ArraySchema<PartialForm<CustomActivity>, BaseValue>;
type CustomActivitiesSchemaMember = ReturnType<CustomActivitiesSchema['member']>;

type CustomSupplySchema = ObjectSchema<PartialForm<CustomSupply>, BaseValue>;
type CustomSupplySchemaFields = ReturnType<CustomSupplySchema['fields']>;
type CustomSuppliesSchema = ArraySchema<PartialForm<CustomSupply>, BaseValue>;
type CustomSuppliesSchemaMember = ReturnType<CustomSuppliesSchema['member']>;

type PointSchema = ObjectSchema<PartialForm<Point>, BaseValue>;
type PointSchemaFields = ReturnType<PointSchema['fields']>;
type PointsSchema = ArraySchema<PartialForm<Point>, BaseValue>;
type PointsSchemaMember = ReturnType<PointsSchema['member']>;

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => {
    const isNS = value?.activity_lead === ACTIVITY_LEADER_NS;
    const isERU = value?.activity_lead === ACTIVITY_LEADER_ERU;

    const baseFields: FormSchemaFields = {
      _firstSubmission: [forceUndefinedType],
      title: [requiredCondition],
      event: [requiredCondition],
      activity_lead: [requiredCondition],
      country: [requiredCondition],
      districts: [],
      start_date: [requiredCondition],
      end_date: [(endDateValue) => {
        const start = value?.start_date;
        const end = endDateValue;

        if (!start || !end) {
          return undefined;
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate.getTime() >= endDate.getTime()) {
          return 'End date must be greater than start date';
        }

        return undefined;
      }],
      status: [],
      reporting_ns: isNS ? [requiredCondition] : [forceUndefinedType],
      reporting_ns_contact_name: isNS ? [] : [forceUndefinedType],
      reporting_ns_contact_role: isNS? [] : [forceUndefinedType],
      reporting_ns_contact_email: isNS? [emailCondition] : [forceUndefinedType],
      deployed_eru: isERU ? [requiredCondition] : [forceUndefinedType],
      sectors: {
        keySelector: (s) => s.sector as number,
        member: (): SectorsSchemaMember => ({
          fields: (): SectorSchemaFields => {
            function getDisaggregationAndPoints<F extends ActivitySchemaFields | CustomActivitiesSchemaMember> (
              currentFields: F,
              activity: PartialForm<Activity> | PartialForm<CustomActivity> | undefined,
            ): F {
              const isPeople = activity?.people_households === 'people';
              const isHouseholds = activity?.people_households === 'households';

              type GetKeysForType<T extends object, X> = NonNullable<{
                [key in keyof T]: NonNullable<T[key]> extends X ? key : never;
              }[keyof T]>;

              // NOTE: IDK why action cannot be used here? @ankit?
              type KeysForNumericValue = Exclude<GetKeysForType<Activity, number>, 'action'>;

              const specialLessThanOrEqualToCondition = (key: KeysForNumericValue) => {
                const foreignValue = activity?.[key];
                return (value: number) => {
                  if (isDefined(value)) {
                    if (isDefined(foreignValue)) {
                      return lessThanOrEqualToCondition(foreignValue)(value);
                    } else {
                      return 'Please enter the main disaggregation above first';
                    }
                  }

                  return undefined;
                };
              };

              const baseFields: ActivitySchemaFields | CustomActivitySchemaFields = {
                is_simplified_report: [defaultUndefinedType],
                has_no_data_on_people_reached: [defaultUndefinedType],
                beneficiaries_count: [positiveIntegerCondition],
                amount: [positiveIntegerCondition],
                details: [],
              };

              const positiveIntegerAndMaybeRequired = activity?.has_no_data_on_people_reached
                ? [positiveIntegerCondition]
                : [requiredCondition, positiveIntegerCondition];

              if (activity?.is_simplified_report) {
                return {
                  ...baseFields,
                  ...currentFields,
                  people_households: [requiredCondition],
                  household_count: isHouseholds ? [requiredCondition, positiveIntegerCondition] : [forceUndefinedType],
                  people_count: isPeople ? positiveIntegerAndMaybeRequired : [forceUndefinedType],
                  male_count: isPeople ? [positiveIntegerCondition] : [forceUndefinedType],
                  female_count: isPeople ? [positiveIntegerCondition]: [forceUndefinedType],
                  point_count: [positiveIntegerCondition],
                };
              } else {
                return {
                  ...baseFields,
                  ...currentFields,

                  male_0_1_count: [positiveIntegerCondition],
                  male_2_5_count: [positiveIntegerCondition],
                  male_6_12_count: [positiveIntegerCondition],
                  male_13_17_count: [positiveIntegerCondition],
                  male_18_59_count: [positiveIntegerCondition],
                  male_60_plus_count: [positiveIntegerCondition],
                  male_unknown_age_count: [positiveIntegerCondition],

                  female_0_1_count: [positiveIntegerCondition],
                  female_2_5_count: [positiveIntegerCondition],
                  female_6_12_count: [positiveIntegerCondition],
                  female_13_17_count: [positiveIntegerCondition],
                  female_18_59_count: [positiveIntegerCondition],
                  female_60_plus_count: [positiveIntegerCondition],
                  female_unknown_age_count: [positiveIntegerCondition],

                  other_0_1_count: [positiveIntegerCondition],
                  other_2_5_count: [positiveIntegerCondition],
                  other_6_12_count: [positiveIntegerCondition],
                  other_13_17_count: [positiveIntegerCondition],
                  other_18_59_count: [positiveIntegerCondition],
                  other_60_plus_count: [positiveIntegerCondition],
                  other_unknown_age_count: [positiveIntegerCondition],

                  is_disaggregated_for_disabled: [defaultUndefinedType],

                  disabled_male_0_1_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('male_0_1_count')],
                  disabled_male_2_5_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('male_2_5_count')],
                  disabled_male_6_12_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('male_6_12_count')],
                  disabled_male_13_17_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('male_13_17_count')],
                  disabled_male_18_59_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('male_18_59_count')],
                  disabled_male_60_plus_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('male_60_plus_count')],
                  disabled_male_unknown_age_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('male_unknown_age_count')],

                  disabled_female_0_1_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('female_0_1_count')],
                  disabled_female_2_5_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('female_2_5_count')],
                  disabled_female_6_12_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('female_6_12_count')],
                  disabled_female_13_17_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('female_13_17_count')],
                  disabled_female_18_59_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('female_18_59_count')],
                  disabled_female_60_plus_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('female_60_plus_count')],
                  disabled_female_unknown_age_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('female_unknown_age_count')],

                  disabled_other_0_1_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('other_0_1_count')],
                  disabled_other_2_5_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('other_2_5_count')],
                  disabled_other_6_12_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('other_6_12_count')],
                  disabled_other_13_17_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('other_13_17_count')],
                  disabled_other_18_59_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('other_18_59_count')],
                  disabled_other_60_plus_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('other_60_plus_count')],
                  disabled_other_unknown_age_count: [positiveIntegerCondition, specialLessThanOrEqualToCondition('other_unknown_age_count')],

                  points: {
                    keySelector: (p) => p.client_id as string,
                    member: (): PointsSchemaMember => ({
                      fields: (): PointSchemaFields => ({
                        client_id: [],
                        description: [requiredCondition],
                        latitude: [requiredCondition],
                        longitude: [requiredCondition],
                      }),
                    }),
                  },
                };
              }
            }

            return {
              sector: [],
              activities: {
                keySelector: (a) => a.action as number,
                member: (): ActivitiesSchemaMember => ({
                  fields: (activity): ActivitySchemaFields => {
                    let activitySchemaFields: ActivitySchemaFields = {
                      action: [],
                      supplies: {
                        keySelector: (s) => s.client_id as string,
                        member: (): SuppliesSchemaMember => ({
                          fields: (): SupplySchemaFields => ({
                            item: [requiredCondition],
                            count: [requiredCondition, positiveIntegerCondition],
                          }),
                        }),
                      },
                      custom_supplies: {
                        keySelector: (s) => s.client_id as string,
                        member: (): CustomSuppliesSchemaMember => ({
                          fields: (): CustomSupplySchemaFields => ({
                            client_id: [],
                            item: [requiredCondition],
                            count: [requiredCondition, positiveIntegerCondition],
                          }),
                        }),
                      },
                    };

                    activitySchemaFields = getDisaggregationAndPoints(
                      activitySchemaFields,
                      activity,
                    );

                    return activitySchemaFields;
                  },
                  fieldDependencies: () => ({
                    disabled_male_0_1_count: ['male_0_1_count'],
                    disabled_male_2_5_count: ['male_2_5_count'],
                    disabled_male_6_12_count: ['male_6_12_count'],
                    disabled_male_13_17_count: ['male_13_17_count'],
                    disabled_male_18_59_count: ['male_18_59_count'],
                    disabled_male_60_plus_count: ['male_60_plus_count'],
                    disabled_male_unknown_age_count: ['male_unknown_age_count'],

                    disabled_female_0_1_count: ['female_0_1_count'],
                    disabled_female_2_5_count: ['female_2_5_count'],
                    disabled_female_6_12_count: ['female_6_12_count'],
                    disabled_female_13_17_count: ['female_13_17_count'],
                    disabled_female_18_59_count: ['female_18_59_count'],
                    disabled_female_60_plus_count: ['female_60_plus_count'],
                    disabled_female_unknown_age_count: ['female_unknown_age_count'],

                    disabled_other_0_1_count: ['other_0_1_count'],
                    disabled_other_2_5_count: ['other_2_5_count'],
                    disabled_other_6_12_count: ['other_6_12_count'],
                    disabled_other_13_17_count: ['other_13_17_count'],
                    disabled_other_18_59_count: ['other_18_59_count'],
                    disabled_other_60_plus_count: ['other_60_plus_count'],
                    disabled_other_unknown_age_count: ['other_unknown_age_count'],

                    people_count: ['has_no_data_on_people_reached'],
                  }),
                }),
              },
              custom_activities: {
                keySelector: (ca) => ca.client_id as string,
                member: (): CustomActivitiesSchemaMember => ({
                  fields: (customActivity): CustomActivitySchemaFields => {
                    let customActivitySchemaFields: CustomActivitySchemaFields = {
                      client_id: [],
                      custom_action: [requiredCondition],
                      custom_supplies: {
                        keySelector: (s) => s.client_id as string,
                        member: (): CustomSuppliesSchemaMember => ({
                          fields: (): CustomSupplySchemaFields => ({
                            client_id: [],
                            item: [requiredCondition],
                            count: [requiredCondition, positiveIntegerCondition],
                          }),
                        }),
                      },
                    };

                    customActivitySchemaFields = getDisaggregationAndPoints(
                      customActivitySchemaFields,
                      customActivity,
                    );

                    return customActivitySchemaFields;
                  },
                }),
              },
            };
          },
          validation: (sectorValue) => {
            if (sectorValue
              && (!sectorValue.activities || sectorValue.activities.length === 0)
              && (!sectorValue.custom_activities || sectorValue.custom_activities.length === 0)
            ) {
              return 'There should be at least one activity selected or one custom activity for selected sector';
            }

            return undefined;
          }
        }),
        validation: (sectorList) => {
          if (!sectorList || sectorList.length === 0) {
            return 'At least one sector should be selected';
          }

          return undefined;
        }
      }
    };

    return baseFields;
  },
  fieldDependencies: () => ({
    end_date: ['start_date'],
  }),
};

export function useEmergencyThreeWoptions(
  value: PartialForm<EmergencyThreeWFormFields>
) {
  const {
    pending: fetchingCountries,
    response: countriesResponse,
  } = useRequest<ListResponse<CountryMini>>({
    url: 'api/v2/country/',
    query: {
      limit: 500,
      mini: true,
    },
  });

  const {
    pending: fetchingOptions,
    response: optionsResponse,
  } = useRequest<EmergencyThreeWOptionsResponse>({
    url: 'api/v2/emergency-project/options/',
  });

  const {
    response: eventDetailResponse,
    pending: eventDetailPending,
  } = useRequest<Event>({
    skip: isNotDefined(value?.event),
    url: `api/v2/event/${value?.event}/`,
  });

  const {
    pending: fetchingERUs,
    response: erusResponse,
  } = useRequest<ListResponse<ERU>>({
    url: 'api/v2/eru/',
    query: {
      limit: 500,
      deployed_to__isnull: false,
    },
  });

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<DistrictMini>>({
    skip: !value?.country,
    url: 'api/v2/district/',
    query: {
      country: value?.country,
    },
  });

  const nationalSocietyOptions = React.useMemo(() => {
    if (!countriesResponse) {
      return emptyNumericOptionList;
    }

    const ns: NumericValueOption[] = countriesResponse.results
      // d.independent can be either `null`, `false` or `true`.
      // here, we want to include all countries where
      // independent is either null or true (but exclude false)
      // see https://github.com/IFRCGo/go-frontend/issues/1934
      .filter(d => (d.independent !== false && d.society_name) || d.name.substring(2) === 'RC' || d.iso === 'BX')
      .map(d => ({
        value: d.id,
        label: d.society_name,
      })).sort(compareString);


    return ns;
  }, [countriesResponse]);

  const countryOptions = React.useMemo(() => {
    if (!countriesResponse) {
      return emptyNumericOptionList;
    }

    const co: NumericValueOption[] = countriesResponse.results
      .filter(d => d.independent && isDefined(d.iso))
      .map(d => ({
        value: d.id,
        label: d.name,
      })).sort(compareString);


    return co;
  }, [countriesResponse]);

  /*
  const countryOptions = React.useMemo(() => {
    if (!eventDetailResponse) {
      return emptyNumericOptionList;
    }

    return eventDetailResponse.countries.map((c) => ({
      label: c.name,
      value: c.id,
    }));
  }, [eventDetailResponse]);
  */

  const districtOptions = React.useMemo(() => (
    districtsResponse?.results?.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString) ?? emptyNumericOptionList
  ), [districtsResponse]);

  const activityLeaderOptions: StringValueOption[] = React.useMemo(() => ([
    { value: ACTIVITY_LEADER_NS, label: 'National Society' },
    { value: ACTIVITY_LEADER_ERU, label: 'Deployed ERUs' },
  ]), []);

  const statusOptions: StringValueOption[] = React.useMemo(() => ([
    { value: STATUS_PLANNED, label: 'Planned' },
    { value: STATUS_ONGOING, label: 'On-Going' },
    { value: STATUS_COMPLETE, label: 'Complete' },
  ]), []);

  const statusMap = React.useMemo(() => (
    listToMap(statusOptions, d => d.value, d => d.label)
  ), [statusOptions]);

  const activityListBySectorMap = React.useMemo(() => (
    listToGroupList(
      optionsResponse?.actions,
      d => d.sector,
      d => d
    )
  ), [optionsResponse]);

  const sectorOptions: NumericValueOption[] = React.useMemo(() => (
    optionsResponse?.sectors.map((s) => ({
      value: s.id,
      label: s.title,
    })) ?? []
  ), [optionsResponse?.sectors]);

  const sectorIdToLabelMap = React.useMemo(() => (
    listToMap(optionsResponse?.sectors, d => d.id, d => d.title)
  ), [optionsResponse?.sectors]);

  const activityOptionListBySector: Record<number, (
    NumericValueOption & {
      isCashType?: boolean,
      hasLocation?: boolean,
    }
  )[]> = React.useMemo(() => (
    listToMap(
      optionsResponse?.sectors,
      (d) => d.id,
      (d) => (activityListBySectorMap?.[d.id])?.map((a) => ({
        label: a.title,
        value: a.id,
        description: a.description,
        isCashType: a.is_cash_type,
        hasLocation: a.has_location,
      })) ?? []
    ) ?? {}
  ), [optionsResponse?.sectors, activityListBySectorMap]);

  const supplyOptionListByActivity: Record<number, NumericValueOption[]> = React.useMemo(() => (
    listToMap(
      optionsResponse?.actions,
      (d) => d.id,
      (d) => d.supplies_details.map(
        (s) => ({
          label: s.title,
          value: s.id,
        })
      )
    ) ?? {}
  ), [optionsResponse?.actions]);

  const averageHouseholdSizeForSelectedCountry = React.useMemo(() => {
    if (isNotDefined(value?.country)) {
      return undefined;
    }
    return eventDetailResponse?.countries?.find(d => d.id === value?.country)?.average_household_size;
  }, [value?.country, eventDetailResponse]);

  return {
    fetchingOptions,
    activityLeaderOptions,
    fetchingCountries,
    nationalSocietyOptions,
    countryOptions,
    districtOptions,
    eruOptions: erusResponse?.results?.filter((eru) => isDefined(eru.deployed_to)) ?? emptyERUList,
    fetchingERUs,
    sectorOptions,
    activityOptionListBySector,
    supplyOptionListByActivity,
    sectorIdToLabelMap,
    statusOptions,
    eventDetailPending,
    fetchingDistricts,
    averageHouseholdSizeForSelectedCountry,
    statusMap,
  };
}
