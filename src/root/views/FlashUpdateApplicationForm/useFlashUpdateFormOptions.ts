import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import {
  PartialForm,
  ObjectSchema,
  ArraySchema,
  emailCondition,
  requiredCondition,
} from '@togglecorp/toggle-form';
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
  FlashUpdateFields,
  emptyActionOptionItemList,
  OrganizationType,
  emptyStringOptionList,
  ActionOptionItem,
} from './common';

export type FormSchema = ObjectSchema<PartialForm<FlashUpdateFields>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export type CountryDistrictType = NonNullable<NonNullable<FlashUpdateFields['country_district']>>[number];
export type CountryDistrictSchema = ObjectSchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictSchemaFields = ReturnType<CountryDistrictSchema['fields']>;
export type CountryDistrictsSchema = ArraySchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictsSchemaMember = ReturnType<CountryDistrictsSchema['member']>;

export type ReferenceType = NonNullable<NonNullable<FlashUpdateFields['references']>>[number];
export type ReferenceSchema = ObjectSchema<PartialForm<ReferenceType>>;
export type ReferenceSchemaFields = ReturnType<ReferenceSchema['fields']>;
export type ReferencesSchema = ArraySchema<PartialForm<ReferenceType>>;
export type ReferencesSchemaMember = ReturnType<ReferencesSchema['member']>;

export type MapType = NonNullable<NonNullable<FlashUpdateFields['map_files']>>[number];
export type MapSchema = ObjectSchema<PartialForm<MapType>>;
export type MapSchemaFields = ReturnType<MapSchema['fields']>;
export type MapsSchema = ArraySchema<PartialForm<MapType>>;
export type MapsSchemaMember = ReturnType<MapsSchema['member']>;

export type GraphicType = NonNullable<NonNullable<FlashUpdateFields['graphics_files']>>[number];
export type GraphicSchema = ObjectSchema<PartialForm<GraphicType>>;
export type GraphicSchemaFields = ReturnType<GraphicSchema['fields']>;
export type GraphicsSchema = ArraySchema<PartialForm<GraphicType>>;
export type GraphicsSchemaMember = ReturnType<GraphicsSchema['member']>;

export type ActionType = NonNullable<NonNullable<FlashUpdateFields['actions_taken']>>[number];
export type ActionSchema = ObjectSchema<PartialForm<ActionType>>;
export type ActionSchemaFields = ReturnType<ActionSchema['fields']>;
export type ActionsSchema = ArraySchema<PartialForm<ActionType>>;
export type ActionsSchemaMember = ReturnType<ActionsSchema['member']>;

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
    country_district: {
      keySelector: (c) => c.client_id as string,
      member: (): CountryDistrictsSchemaMember => ({
        fields: (): CountryDistrictSchemaFields => ({
          client_id: [],
          country: [requiredCondition, (value, allValues) => {
            if (isNotDefined(value)) {
              return undefined;
            }
            const countriesWithCurrentId = (allValues as unknown as FlashUpdateFields)?.country_district?.filter(
              d => d.country === value
            );

            if (countriesWithCurrentId.length > 1) {
              return 'Duplicate countries not allowed';
            }

            return undefined;
          }],
          district: []
        }),
      }),
    },
    hazard_type: [requiredCondition],
    title: [requiredCondition],
    situational_overview: [requiredCondition],
    graphics_files: {
      keySelector: (c) => c.client_id as string,
      member: (): GraphicsSchemaMember => ({
        fields: (): GraphicSchemaFields => ({
          id: [],
          caption: [],
        }),
      }),
    },
    map_files: {
      keySelector: (c) => c.client_id as string,
      member: (): MapsSchemaMember => ({
        fields: (): MapSchemaFields => ({
          id: [],
          caption: [],
        }),
      }),
    },
    references: {
      keySelector: (c) => c.client_id as string,
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
      keySelector: (c) => c.client_id as string,
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
  validation: (value) => {
    const errors = [];
    if ((value?.country_district?.length ?? 0) > 10) {
      errors.push('More that 10 countires are not allowed');
    }

    if ((value?.graphics_files?.length ?? 0) > 3) {
      errors.push('More that 3 graphics are not allowed');
    }

    if ((value?.map_files?.length ?? 0) > 3) {
      errors.push('More that 3 maps are not allowed');
    }

    if (errors.length > 0) {
      return errors.join(', ');
    }

    return undefined;
  },
};

const limitQuery = {
  limit: 500,
};

function useFlashUpdateFormOptions(value: PartialForm<FlashUpdateFields>) {
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
    url: 'api/v2/flash-update-options/'
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
    url: 'api/v2/flash-update-action/',
    query: limitQuery,
  });

  const actionOptionsMap: Record<OrganizationType, ActionOptionItem[]> = React.useMemo(() => {
    if (!actionsResponse?.results?.length) {
      return {
        NTLS: emptyActionOptionItemList,
        PNS: emptyActionOptionItemList,
        FDRN: emptyActionOptionItemList,
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
      PNS: actionList.filter(getFilterOrganization('PNS')),
      FDRN: actionList.filter(getFilterOrganization('FDRN')),
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

export default useFlashUpdateFormOptions;
