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
import LanguageContext from '#root/languageContext';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import {
  Country,
  Disaster,
  DistrictMini,
} from '#types';

import {
  BooleanValueOption,
  NumericValueOption,
  emptyNumericOptionList,
  User,
  InformalUpdateFields,
  ActionFields,
  emptyActionList,
  ActionsByOrganization,
  OrganizationType,
  ActionsByOrganizationArrayLists,
  ShareWithOptionsEntity,
  emptyStringOptionList,
} from './common';

export type FormSchema = ObjectSchema<PartialForm<InformalUpdateFields>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export type CountryDistrictType = NonNullable<NonNullable<InformalUpdateFields['country_district']>>[number];
export type CountryDistrictSchema = ObjectSchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictSchemaFields = ReturnType<CountryDistrictSchema['fields']>;
export type CountryDistrictsSchema = ArraySchema<PartialForm<CountryDistrictType>>;
export type CountryDistrictsSchemaMember = ReturnType<CountryDistrictsSchema['member']>;

export type ReferenceType = NonNullable<NonNullable<InformalUpdateFields['reference']>>[number];
export type ReferenceSchema = ObjectSchema<PartialForm<ReferenceType>>;
export type ReferenceSchemaFields = ReturnType<ReferenceSchema['fields']>;
export type ReferencesSchema = ArraySchema<PartialForm<ReferenceType>>;
export type ReferencesSchemaMember = ReturnType<ReferencesSchema['member']>;

export type ImageDataType = NonNullable<NonNullable<InformalUpdateFields['imageData']>>[number];
export type ImageDataSchema = ObjectSchema<PartialForm<ImageDataType>>;
export type ImageDataSchemaFields = ReturnType<ImageDataSchema['fields']>;
export type ImagesDataSchema = ArraySchema<PartialForm<ImageDataType>>;
export type ImagesDataSchemaMember = ReturnType<ImagesDataSchema['member']>;

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
    situational_overview: [requiredCondition],
    title: [requiredCondition],
    reference: [],
    //graphics_id: [],
    //map_id: [],

    actions_ntls: [],
    actions_ntls_desc: [],
    actions_ifrc: [],
    actions_ifrc_desc: [],
    actions_rcrc: [],
    actions_rcrc_desc: [],
    actions_government: [],
    actions_government_desc: [],

    originator_name: [requiredCondition],
    originator_email: [requiredCondition, emailCondition],
    originator_phone: [],
    originator_title: [],
    ifrc_email: [],
    ifrc_name: [],
    ifrc_phone: [],
    ifrc_title: [],
    share_with: [],
    imageData: [],
    map_details: [],
    graphics_details: []

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
  const { strings } = React.useContext(LanguageContext);

  const {
    pending: fetchingUserDetails,
    response: userDetails,
  } = useRequest<User>({
    url: 'api/v2/user/me/',
  });

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

  const yesNoOptions = React.useMemo(() => {
    return [
      { value: true, label: strings.yesLabel },
      { value: false, label: strings.noLabel },
    ] as BooleanValueOption[];
  }, [strings]);

  const {
    pending: fetchingShareWithOptions,
    response: shareWith
  } = useRequest<ShareWithOptionsEntity>({
    url: 'api/v2/informal-options/'
  });

  const shareWithOptions = React.useMemo(() => (
    shareWith?.share_with_options.map((el) => ({
      label: el.label,
      value: el.value
    })).sort(compareString) ?? emptyStringOptionList
  ), [shareWith]);

  const ntls = true;
  const pns = true;
  const ifrc = true;
  const rcrc = true;
  const government = true;

  const organizationsType: OrganizationType = React.useMemo(() => {
    if (ntls) {
      return 'NTLS';
    }

    if (pns) {
      return 'PNS';
    }

    if (ifrc) {
      return "IFRC";
    }

    if (rcrc) {
      return "RCRC";
    }
    if (government) {
      return "GOV";
    }
    return 'FDRN';
  }, [ntls, pns, ifrc, rcrc, government]);

  const {
    pending: fetchingActions,
    response: actionsResponse,
  } = useRequest<ListResponse<ActionFields>>({
    url: 'api/v2/informal_action/',
    query: limitQuery,
  });

  const actionOptionsMap: ActionsByOrganizationArrayLists = React.useMemo(() => {
    if (!actionsResponse?.results?.length) {
      return {
        NTLS: emptyActionList,
        FDRN: emptyActionList,
        PNS: emptyActionList,
        IFRC: emptyActionList,
        RCRC: emptyActionList,
        GOV: emptyActionList,
      } as ActionsByOrganizationArrayLists;
    }

    const actionList = actionsResponse.results;
    const getFilterOrganization = (organizationType: string) => (a: ActionFields) => (
      a.organizations.findIndex(
        (frt: string) => frt === organizationType
      ) !== -1
    );

    const actionMap = {
      NTLS: actionList.filter(getFilterOrganization('NTLS')),
      FDRN: actionList.filter(getFilterOrganization('FDRN')),
      PNS: actionList.filter(getFilterOrganization('PNS')),
      IFRC: actionList.filter(getFilterOrganization('IFRC')),
      RCRC: actionList.filter(getFilterOrganization('RCRC')),
      GOV: actionList.filter(getFilterOrganization('GOV')),
    };

    return actionMap;
  }, [actionsResponse]);

  const orgGroupedActionForCurrentReport = React.useMemo(() => {
    const options = actionOptionsMap[organizationsType];

    return options.reduce((acc, val) => {
      const newAcc = { ...acc } as ActionsByOrganization;
      (Object.keys(newAcc) as OrganizationType[]).forEach((org) => {
        if (val.organizations.findIndex((o) => o === org) !== -1) {
          newAcc[org].push({
            value: val.id,
            label: val.name,
            description: val.tooltip_text ?? undefined,
            category: val.category,
            organization: org,
          });
        }
      });
      return newAcc;
    }, {
      NTLS: [],
      PNS: [],
      FDRN: [],
      IFRC: [],
      RCRC: [],
      GOV: [],
    } as ActionsByOrganization);
  }, [actionOptionsMap, organizationsType]);

  React.useMemo(() => {
    const date = `${(new Date().getMonth() + 1)} / ${(new Date().getFullYear())}`;

    const countryNameTitle = value.country_district?.flatMap((item) => {
      return countryOptions.find((x) => x.value === item?.country)?.label ?? ' ';
    }).reduce((item, name) => {
      return `${item} - ${name}`;
    });
    const hazardTitle = disasterTypeOptions.find((x) => x.value === value?.hazard_type)?.label ?? ' ';

    if (isDefined(value.country_district) && isDefined(value.hazard_type)) {
      value.title = `${countryNameTitle} - ${hazardTitle}  ${date}`;
    }

  }, [value, disasterTypeOptions, countryOptions]);



  return {
    countryOptions,
    districtOptions,
    fetchingDistricts,
    disasterTypeOptions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingUserDetails,
    userDetails,
    yesNoOptions,
    nationalSocietyOptions,
    fetchingShareWithOptions,
    shareWithOptions,
    orgGroupedActionForCurrentReport,
    fetchingActions,
  };
}

export default useInformalUpdateFormOptions;
