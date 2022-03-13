import React from 'react';
import {
  listToMap,
  listToGroupList,
  isNotDefined,
} from '@togglecorp/fujs';
import {
  PartialForm,
  ObjectSchema,
  ArraySchema,
  forceUndefinedType,
  requiredCondition,
  emailCondition,
} from '@togglecorp/toggle-form';

import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import {
  NumericValueOption,
  StringValueOption,
  Country,
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

interface EmergencyThreeWOptionsResponse {
  actions: {
    id: number;
    sector: number;
    order: number;
    title: string;
    description: string;
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
  is_simplified_report: boolean;

  people_households: 'people' | 'households';
  household_count: number | null;
  people_count: number | null;
  male_count: number | null;
  female_count: number | null;

  male_0_5_count: number | null;
  male_6_12_count: number | null;
  male_13_17_count: number | null;
  male_18_29_count: number | null;
  male_30_39_count: number | null;
  male_40_49_count: number | null;
  male_50_59_count: number | null;
  male_60_69_count: number | null;
  male_70_plus_count: number | null;

  female_0_5_count: number | null;
  female_6_12_count: number | null;
  female_13_17_count: number | null;
  female_18_29_count: number | null;
  female_30_39_count: number | null;
  female_40_49_count: number | null;
  female_50_59_count: number | null;
  female_60_69_count: number | null;
  female_70_plus_count: number | null;

  other_0_5_count: number | null;
  other_6_12_count: number | null;
  other_13_17_count: number | null;
  other_18_29_count: number | null;
  other_30_39_count: number | null;
  other_40_49_count: number | null;
  other_50_59_count: number | null;
  other_60_69_count: number | null;
  other_70_plus_count: number | null;

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
  title: string;
  country: number;
  districts: number[];
  status: string;
  event: number;
  start_date: string;
  activity_lead: string;

  reporting_ns: number | null;
  reporting_ns_contact_name: string | null;
  reporting_ns_contact_role: string | null;
  reporting_ns_contact_email: string | null;

  deployed_eru: number | null;

  sectors: Sector[];
}

type FormSchema = ObjectSchema<PartialForm<EmergencyThreeWFormFields>>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;
const emptyNumericOptionList: NumericValueOption[] = [];
const emptyERUList: ERU[] = [];

type SectorSchema = ObjectSchema<PartialForm<Sector>>;
type SectorSchemaFields = ReturnType<SectorSchema['fields']>;
type SectorsSchema = ArraySchema<PartialForm<Sector>>;
type SectorsSchemaMember = ReturnType<SectorsSchema['member']>;

type ActivitySchema = ObjectSchema<PartialForm<Activity>>;
type ActivitySchemaFields = ReturnType<ActivitySchema['fields']>;
type ActivitiesSchema = ArraySchema<PartialForm<Activity>>;
type ActivitiesSchemaMember = ReturnType<ActivitiesSchema['member']>;

type SupplySchema = ObjectSchema<PartialForm<Supply>>;
type SupplySchemaFields = ReturnType<SupplySchema['fields']>;
type SuppliesSchema = ArraySchema<PartialForm<Supply>>;
type SuppliesSchemaMember = ReturnType<SuppliesSchema['member']>;

type CustomActivitySchema = ObjectSchema<PartialForm<CustomActivity>>;
type CustomActivitySchemaFields = ReturnType<CustomActivitySchema['fields']>;
type CustomActivitiesSchema = ArraySchema<PartialForm<CustomActivity>>;
type CustomActivitiesSchemaMember = ReturnType<CustomActivitiesSchema['member']>;

type CustomSupplySchema = ObjectSchema<PartialForm<CustomSupply>>;
type CustomSupplySchemaFields = ReturnType<CustomSupplySchema['fields']>;
type CustomSuppliesSchema = ArraySchema<PartialForm<CustomSupply>>;
type CustomSuppliesSchemaMember = ReturnType<CustomSuppliesSchema['member']>;

type PointSchema = ObjectSchema<PartialForm<Point>>;
type PointSchemaFields = ReturnType<PointSchema['fields']>;
type PointsSchema = ArraySchema<PartialForm<Point>>;
type PointsSchemaMember = ReturnType<PointsSchema['member']>;

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => {
    const isNS = value?.activity_lead === ACTIVITY_LEADER_NS;
    const isERU = value?.activity_lead === ACTIVITY_LEADER_ERU;

    const baseFields: FormSchemaFields = {
      title: [requiredCondition],
      event: [requiredCondition],
      activity_lead: [requiredCondition],
      country: [requiredCondition],
      districts: [],
      start_date: [requiredCondition],
      status: [requiredCondition],
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
              currentValue: F,
              simplified?: boolean,
              peopleHouseholds?: string
            ): F {
              if (simplified) {
                return {
                  ...currentValue,
                  people_households: [requiredCondition],
                  household_count: peopleHouseholds === 'households' ? [requiredCondition, positiveIntegerCondition] : [forceUndefinedType],
                  people_count: peopleHouseholds === 'people' ? [requiredCondition, positiveIntegerCondition] : [forceUndefinedType],
                  male_count: peopleHouseholds === 'people' ? [positiveIntegerCondition] : [forceUndefinedType],
                  female_count: peopleHouseholds === 'people' ? [positiveIntegerCondition]: [forceUndefinedType],
                  point_count: [positiveIntegerCondition],
                };
              } else {
                return {
                  ...currentValue,
                  male_0_5_count: [positiveIntegerCondition],
                  male_6_12_count: [positiveIntegerCondition],
                  male_13_17_count: [positiveIntegerCondition],
                  male_18_29_count: [positiveIntegerCondition],
                  male_30_39_count: [positiveIntegerCondition],
                  male_40_49_count: [positiveIntegerCondition],
                  male_50_59_count: [positiveIntegerCondition],
                  male_60_69_count: [positiveIntegerCondition],
                  male_70_plus_count: [positiveIntegerCondition],
                  female_0_5_count: [positiveIntegerCondition],
                  female_6_12_count: [positiveIntegerCondition],
                  female_13_17_count: [positiveIntegerCondition],
                  female_18_29_count: [positiveIntegerCondition],
                  female_30_39_count: [positiveIntegerCondition],
                  female_40_49_count: [positiveIntegerCondition],
                  female_50_59_count: [positiveIntegerCondition],
                  female_60_69_count: [positiveIntegerCondition],
                  female_70_plus_count: [positiveIntegerCondition],
                  other_0_5_count: [positiveIntegerCondition],
                  other_6_12_count: [positiveIntegerCondition],
                  other_13_17_count: [positiveIntegerCondition],
                  other_18_29_count: [positiveIntegerCondition],
                  other_30_39_count: [positiveIntegerCondition],
                  other_40_49_count: [positiveIntegerCondition],
                  other_50_59_count: [positiveIntegerCondition],
                  other_60_69_count: [positiveIntegerCondition],
                  other_70_plus_count: [positiveIntegerCondition],
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
                      is_simplified_report: [],
                      details: [],
                      supplies: {
                        keySelector: (s) => s.client_id as string,
                        member: (): SuppliesSchemaMember => ({
                          fields: (): SupplySchemaFields => ({
                            item: [requiredCondition],
                            count: [requiredCondition],
                          }),
                        }),
                      },
                      custom_supplies: {
                        keySelector: (s) => s.client_id as string,
                        member: (): CustomSuppliesSchemaMember => ({
                          fields: (): CustomSupplySchemaFields => ({
                            client_id: [],
                            item: [requiredCondition],
                            count: [requiredCondition],
                          }),
                        }),
                      },
                    };

                    activitySchemaFields = getDisaggregationAndPoints(
                      activitySchemaFields,
                      activity?.is_simplified_report,
                      activity?.people_households
                    );

                    return activitySchemaFields;
                  },
                }),
              },
              custom_activities: {
                keySelector: (ca) => ca.client_id as string,
                member: (): CustomActivitiesSchemaMember => ({
                  fields: (customActivity): CustomActivitySchemaFields => {
                    let customActivitySchemaFields: CustomActivitySchemaFields = {
                      client_id: [],
                      custom_action: [],
                      is_simplified_report: [],
                      details: [],
                      custom_supplies: {
                        keySelector: (s) => s.client_id as string,
                        member: (): CustomSuppliesSchemaMember => ({
                          fields: (): CustomSupplySchemaFields => ({
                            client_id: [],
                            item: [requiredCondition],
                            count: [requiredCondition],
                          }),
                        }),
                      },
                    };

                    customActivitySchemaFields = getDisaggregationAndPoints(
                      customActivitySchemaFields,
                      customActivity?.is_simplified_report,
                      customActivity?.people_households
                    );

                    return customActivitySchemaFields;
                  },
                }),
              },
            };
          },
        }),
      }
    };

    return baseFields;
  },
};

export function useEmergencyThreeWoptions(
  value: PartialForm<EmergencyThreeWFormFields>
) {
  const {
    pending: fetchingCountries,
    response: countriesResponse,
  } = useRequest<ListResponse<Country>>({
    url: 'api/v2/country/',
    query: { limit: 500 },
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
      available: true,
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
      .filter(d => d.independent && d.society_name)
      .map(d => ({
        value: d.id,
        label: d.society_name,
      })).sort(compareString);


    return ns;
  }, [countriesResponse]);

  const countryOptions = React.useMemo(() => {
    if (!eventDetailResponse) {
      return emptyNumericOptionList;
    }

    return eventDetailResponse.countries.map((c) => ({
      label: c.name,
      value: c.id,
    }));
  }, [eventDetailResponse]);

  const districtOptions = React.useMemo(() => (
    districtsResponse?.results?.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString) ?? emptyNumericOptionList
  ), [districtsResponse]);

  const activityLeaderOptions: StringValueOption[] = [
    { value: ACTIVITY_LEADER_NS, label: 'National Society' },
    { value: ACTIVITY_LEADER_ERU, label: 'Deployed ERUs' },
  ];

  const statusOptions: StringValueOption[] = [
    { value: STATUS_ONGOING, label: 'Activity On-Going' },
    { value: STATUS_COMPLETE, label: 'Activity Complete' },
  ];

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

  const activityOptionListBySector: Record<number, NumericValueOption[]> = React.useMemo(() => (
    listToMap(
      optionsResponse?.sectors,
      (d) => d.id,
      (d) => (activityListBySectorMap?.[d.id])?.map((a) => ({
        label: a.title,
        value: a.id,
        description: a.description,
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

  return {
    fetchingOptions,
    activityLeaderOptions,
    fetchingCountries,
    nationalSocietyOptions,
    countryOptions,
    districtOptions,
    eruOptions: erusResponse?.results ?? emptyERUList,
    fetchingERUs,
    sectorOptions,
    activityOptionListBySector,
    supplyOptionListByActivity,
    sectorIdToLabelMap,
    statusOptions,
    eventDetailPending,
    fetchingDistricts,
  };
}
