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
  simplified: boolean;

  people_households: 'people' | 'households';
  household_count: number;
  people_count: number;
  male_count: number;
  female_count: number;

  male_0_5_count: number;
  male_6_12_count: number;
  male_13_17_count: number;
  male_18_29_count: number;
  male_30_39_count: number;
  male_40_49_count: number;
  male_50_59_count: number;
  male_60_69_count: number;
  male_70_plus_count: number;

  female_0_5_count: number;
  female_6_12_count: number;
  female_13_17_count: number;
  female_18_29_count: number;
  female_30_39_count: number;
  female_40_49_count: number;
  female_50_59_count: number;
  female_60_69_count: number;
  female_70_plus_count: number;

  other_0_5_count: number;
  other_6_12_count: number;
  other_13_17_count: number;
  other_18_29_count: number;
  other_30_39_count: number;
  other_40_49_count: number;
  other_50_59_count: number;
  other_60_69_count: number;
  other_70_plus_count: number;

  point_count: number;
  points: Point[];
}

export interface Activity extends ActivityBase {
  // NOTE: we call this activity in client
  action: number;
  supplies: Supply[];
  custom_supplies: CustomSupply[];
}

export interface CustomActivity extends ActivityBase {
  client_id: string;
  // NOTE: we call this custom activity in client
  custom_action: string;
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

  reporting_ns: number;
  reporting_ns_contact_name: string;
  reporting_ns_contact_role: string;
  reporting_ns_contact_email: string;

  deployed_eru: number;

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
      reporting_ns_contact_email: isNS? [] : [forceUndefinedType],
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
                  household_count: peopleHouseholds === 'households' ? [] : [forceUndefinedType],
                  people_count: peopleHouseholds === 'people' ? [] : [forceUndefinedType],
                  male_count: [],
                  female_count: [],
                  point_count: [],
                };
              } else {
                return {
                  ...currentValue,
                  male_0_5_count: [],
                  male_6_12_count: [],
                  male_13_17_count: [],
                  male_18_29_count: [],
                  male_30_39_count: [],
                  male_40_49_count: [],
                  male_50_59_count: [],
                  male_60_69_count: [],
                  male_70_plus_count: [],
                  female_0_5_count: [],
                  female_6_12_count: [],
                  female_13_17_count: [],
                  female_18_29_count: [],
                  female_30_39_count: [],
                  female_40_49_count: [],
                  female_50_59_count: [],
                  female_60_69_count: [],
                  female_70_plus_count: [],
                  other_0_5_count: [],
                  other_6_12_count: [],
                  other_13_17_count: [],
                  other_18_29_count: [],
                  other_30_39_count: [],
                  other_40_49_count: [],
                  other_50_59_count: [],
                  other_60_69_count: [],
                  other_70_plus_count: [],
                  points: {
                    keySelector: (p) => p.client_id as string,
                    member: (): PointsSchemaMember => ({
                      fields: (): PointSchemaFields => ({
                        client_id: [],
                        description: [],
                        latitude: [requiredCondition],
                        longitude: [],
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
                      simplified: [],
                      supplies: {
                        keySelector: (s) => s.client_id as string,
                        member: (): SuppliesSchemaMember => ({
                          fields: (): SupplySchemaFields => ({
                            item: [],
                            count: [],
                          }),
                        }),
                      },
                      custom_supplies: {
                        keySelector: (s) => s.client_id as string,
                        member: (): CustomSuppliesSchemaMember => ({
                          fields: (): CustomSupplySchemaFields => ({
                            client_id: [],
                            item: [],
                            count: [],
                          }),
                        }),
                      },
                    };

                    activitySchemaFields = getDisaggregationAndPoints(
                      activitySchemaFields,
                      activity?.simplified,
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
                      simplified: [],
                      custom_supplies: {
                        keySelector: (s) => s.client_id as string,
                        member: (): CustomSuppliesSchemaMember => ({
                          fields: (): CustomSupplySchemaFields => ({
                            client_id: [],
                            item: [],
                            count: [],
                          }),
                        }),
                      },
                    };

                    customActivitySchemaFields = getDisaggregationAndPoints(
                      customActivitySchemaFields,
                      customActivity?.simplified,
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
