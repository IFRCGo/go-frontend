import React from 'react';
import {
  PartialForm,
  ObjectSchema,
  ArraySchema,
} from '@togglecorp/toggle-form';
import { isDefined } from '@togglecorp/fujs';

import {
  requiredCondition,
} from '#utils/form';
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
  StringValueOption,
  StringKeyValuePair,
  NumericKeyValuePair,
  IFRC_SECRETARIAT,
  RCRC_NETWORK,
  RCRC_NETWORK_AND_DONORS,
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
    country: [],
    district: [],
    hazard_type: [],
    situational_overview: [],
    title: [],
    country_district: [],
    references: [],

    originator_name: [],
    originator_email: [],
    originator_phone: [],
    originator_title: [],
    ifrc_email: [],
    ifrc_name: [],
    ifrc_phone: [],
    ifrc_title: [],
    share_with: []

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

/*interface UserListItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}
*/

/*function transformKeyValueToLabelValue<O extends NumericKeyValuePair | StringKeyValuePair>(o: O): {
    label: string;
    value: O['key'];
} {
    return {
        value: o.key,
        label: o.value,
    };
}*/

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
    country: value.country,
    limit: 500,
  }), [value.country]);

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<DistrictMini>>({
    skip: !value.country,
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

  const shareWithOptions: NumericValueOption[] = React.useMemo(() => ([
    {
      value: IFRC_SECRETARIAT,
      label: strings.informalUpdateFormFocalIfrcSecretariatLabel
    },
    {
      value: RCRC_NETWORK,
      label: strings.informalUpdateFormFocalIfrcRcrcNetworkLabel
    },
    {
      value: RCRC_NETWORK_AND_DONORS,
      label: strings.informalUpdateFormFocalIfrcRcrcNetworkAndDonorsLabel
    },
  ]), [strings]);


  /* const reportType: ReportType = React.useMemo(() => {
       if (value.status === STATUS_EARLY_WARNING) {
           return 'EW';
       }
 
       if (value.is_covid_report) {
           return 'COVID';
       }
 
       if (value.dtype === DISASTER_TYPE_EPIDEMIC) {
           return 'EPI';
       }
 
       return 'EVT';
   }, [value.status, value.dtype, value.is_covid_report]);*/

  const ntls = true;
  const pns = true;
  const organizationsType: OrganizationType = React.useMemo(() => {
    if (ntls) {
      return 'NTLS';
    }

    if (pns) {
      return 'PNS';
    }
    return 'FDRN';
  }, [ntls, pns]);

  const {
    pending: fetchingActions,
    response: actionsResponse,
  } = useRequest<ListResponse<ActionFields>>({
    url: 'api/v2/action/',
    query: limitQuery,
  });

  const actionOptionsMap: ActionsByOrganizationArrayLists = React.useMemo(() => {
    if (!actionsResponse?.results?.length) {
      return {
        NTLS: emptyActionList,
        FDRN: emptyActionList,
        PNS: emptyActionList,
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
    } as ActionsByOrganization);
  }, [actionOptionsMap, organizationsType]);

  React.useMemo(() => {
    const date = `${(new Date().getMonth() + 1)} / ${(new Date().getFullYear())}`;
    const countryTitle = countryOptions.find((x) => x.value === value?.country)?.label ?? ' ';
    const districtTitle = districtOptions.find((x) => x.value === value?.district)?.label ?? ' ';
    const hazardTitle = disasterTypeOptions.find((x) => x.value === value?.hazard_type)?.label ?? ' ';

    if (isDefined(value.country) && isDefined(value.district) && isDefined(value.hazard_type)) {
      value.title = `${countryTitle} - ${districtTitle} : ${hazardTitle}  ${date}`;
    } else {
      value.title = '';
    }

  }, [value, countryOptions, districtOptions, disasterTypeOptions]);


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
    shareWithOptions,
    orgGroupedActionForCurrentReport,
    fetchingActions,
  };
}

export default useInformalUpdateFormOptions;
