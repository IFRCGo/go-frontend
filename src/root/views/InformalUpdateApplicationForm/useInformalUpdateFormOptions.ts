import React from 'react';
import {
  PartialForm,
  ObjectSchema,
  ArraySchema,
  emailCondition,
  requiredCondition,
} from '@togglecorp/toggle-form';
import { isDefined } from '@togglecorp/fujs';
import { compareString } from '#utils/utils';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import {
  Country,
  Disaster,
  DistrictMini,
  NumericValueOption,
  StringValueOption,
} from '#types';

import {
  emptyNumericOptionList,
  InformalUpdateFields,
  emptyActionOptionItemList,
  OrganizationType,
  emptyStringOptionList,
  ActionOptionItem,
} from './common';

export type FormSchema = ObjectSchema<PartialForm<InformalUpdateFields>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export type CountryDistrictType = NonNullable<NonNullable<InformalUpdateFields['country_district']>>[number];
export type CountryDistrictSchema = ObjectSchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictSchemaFields = ReturnType<CountryDistrictSchema['fields']>;
export type CountryDistrictsSchema = ArraySchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictsSchemaMember = ReturnType<CountryDistrictsSchema['member']>;

export type ReferenceType = NonNullable<NonNullable<InformalUpdateFields['references']>>[number];
export type ReferenceSchema = ObjectSchema<PartialForm<ReferenceType>>;
export type ReferenceSchemaFields = ReturnType<ReferenceSchema['fields']>;
export type ReferencesSchema = ArraySchema<PartialForm<ReferenceType>>;
export type ReferencesSchemaMember = ReturnType<ReferencesSchema['member']>;

export type MapType = NonNullable<NonNullable<InformalUpdateFields['map']>>[number];
export type MapSchema = ObjectSchema<PartialForm<MapType>>;
export type MapSchemaFields = ReturnType<MapSchema['fields']>;
export type MapsSchema = ArraySchema<PartialForm<MapType>>;
export type MapsSchemaMember = ReturnType<MapsSchema['member']>;

export type GraphicType = NonNullable<NonNullable<InformalUpdateFields['graphics']>>[number];
export type GraphicSchema = ObjectSchema<PartialForm<GraphicType>>;
export type GraphicSchemaFields = ReturnType<GraphicSchema['fields']>;
export type GraphicsSchema = ArraySchema<PartialForm<GraphicType>>;
export type GraphicsSchemaMember = ReturnType<GraphicsSchema['member']>;

export type ActionType = NonNullable<NonNullable<InformalUpdateFields['actions_taken']>>[number];
export type ActionSchema = ObjectSchema<PartialForm<ActionType>>;
export type ActionSchemaFields = ReturnType<ActionSchema['fields']>;
export type ActionsSchema = ArraySchema<PartialForm<ActionType>>;
export type ActionsSchemaMember = ReturnType<ActionsSchema['member']>;

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
    country_district: {
      keySelector: (c) => c.clientId as string,
      member: (): CountryDistrictsSchemaMember => ({
        fields: (): CountryDistrictSchemaFields => ({
          country: [requiredCondition],
          district: [requiredCondition]
        }),
      }),
    },
    hazard_type: [requiredCondition],
    title: [requiredCondition],
    situational_overview: [requiredCondition],
    graphics: {
      keySelector: (c) => c.clientId as string,
      member: (): GraphicsSchemaMember => ({
        fields: (): GraphicSchemaFields => ({
          file: [],
          caption: [],
        }),
      }),
    },
    map: {
      keySelector: (c) => c.clientId as string,
      member: (): MapsSchemaMember => ({
        fields: (): MapSchemaFields => ({
          file: [],
          caption: [],
        }),
      }),
    },
    references: {
      keySelector: (c) => c.clientId as string,
      member: (): ReferencesSchemaMember => ({
        fields: (): ReferenceSchemaFields => ({
          date: [requiredCondition],
          source_description: [requiredCondition],
          url: [],
          document: [],
        }),
      }),
    },
    actions_taken: {
      keySelector: (c) => c.organization as OrganizationType,
      member: (): ActionsSchemaMember => ({
        fields: (): ActionSchemaFields => ({
          organization: [],
          actions: [],
          summary: [],
        }),
      }),
    },
    originator_name: [requiredCondition],
    originator_email: [requiredCondition, emailCondition],
    originator_phone: [],
    originator_title: [],
    ifrc_email: [],
    ifrc_name: [],
    ifrc_phone: [],
    ifrc_title: [],
    share_with: [],
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

function useInformalUpdateFormOptions(value: PartialForm<InformalUpdateFields>) {
  const {
    pending: fetchingCountries,
    response: countriesResponse,
  } = useRequest<ListResponse<Country>>({
    url: 'api/v2/country/',
    query: limitQuery,
  });

  const countryOptions = React.useMemo(() => {
    if (!countriesResponse) {
      return emptyNumericOptionList;
    }

    const c: NumericValueOption[] = countriesResponse.results
      .filter(d => d.independent && d.iso)
      .map(d => ({
        value: d.id,
        label: d.name,
      })).sort(compareString);

    return c;
  }, [countriesResponse]);

  const countryQuery = React.useMemo(() => ({
    limit: 500,
  }), []);

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<DistrictMini>>({
    skip: !value.country_district,
    url: 'api/v2/district/',
    query: countryQuery,
  });

  const districtOptions = React.useMemo(() => (
    districtsResponse?.results?.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString) ?? emptyNumericOptionList
  ), [districtsResponse]);

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

  const {
    pending: fetchingShareWithOptions,
    response: shareWith
  } = useRequest<{ share_with_options: StringValueOption[] }>({
    url: 'api/v2/informal-options/'
  });

  const shareWithOptions = React.useMemo(() => (
    shareWith?.share_with_options.map((el) => ({
      label: el.label,
      value: el.value
    })).sort(compareString) ?? emptyStringOptionList
  ), [shareWith]);

  const {
    pending: fetchingActions,
    response: actionsResponse,
  } = useRequest<ListResponse<ActionOptionItem>>({
    url: 'api/v2/informal_action/',
    query: limitQuery,
  });

  const actionOptionsMap: Record<OrganizationType, ActionOptionItem[]> = React.useMemo(() => {
    if (!actionsResponse?.results?.length) {
      return {
        NTLS: emptyActionOptionItemList,
        IFRC: emptyActionOptionItemList,
        RCRC: emptyActionOptionItemList,
        GOV: emptyActionOptionItemList,
      };
    }

    const actionList = actionsResponse.results;
    const getFilterOrganization = (organizationType: string) => (a: ActionOptionItem) => (
      a.organizations.findIndex(
        (frt: string) => frt === organizationType
      ) !== -1
    );

    const actionMap = {
      NTLS: actionList.filter(getFilterOrganization('NTLS')),
      IFRC: actionList.filter(getFilterOrganization('IFRC')),
      RCRC: actionList.filter(getFilterOrganization('RCRC')),
      GOV: actionList.filter(getFilterOrganization('GOV')),
    };

    return actionMap;
  }, [actionsResponse]);

  return {
    actionOptionsMap,
    countryOptions,
    disasterTypeOptions,
    districtOptions,
    fetchingActions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingDistricts,
    fetchingShareWithOptions,
    shareWithOptions,
  };
}

export default useInformalUpdateFormOptions;
