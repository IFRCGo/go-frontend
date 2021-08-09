import React from 'react';
import {
  isDefined,
} from '@togglecorp/fujs';
import {
  PartialForm,
  ObjectSchema,
} from '@togglecorp/toggle-form';

import { compareString } from '#utils/utils';
import LanguageContext from '#root/languageContext';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';

import {
  requiredCondition,
} from '#utils/form';

import {
  Country
} from '#types';

import {
  BooleanValueOption,
  NumericValueOption,
  StringValueOption,
  emptyNumericOptionList,
  FormType,
  Entity,
  ActionFields,
  STATUS_EARLY_WARNING,
  STATUS_EVENT,
  BULLETIN_PUBLISHED_NO,
  BULLETIN_PUBLISHED_PLANNED,
  BULLETIN_PUBLISHED_YES,
  SOURCE_RC,
  SOURCE_GOV,
  SOURCE_OTHER,
  User,
  emptyStringOptionList,
  NSEntity,
} from './common';

type FormSchema = ObjectSchema<PartialForm<FormType>>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const getRequiredWithCondition = (key: keyof FormType) => (
  value: number | string | null | undefined,
  allValue: PartialForm<FormType>
) => {
  if (!isDefined(value) && isDefined(allValue?.[key])) {
    return 'This field is required';
  }

  return undefined;
};

const getRequiredWithNonEmptyCondition = (key: keyof FormType) => (
  value: number | string | null | undefined,
  allValue: PartialForm<FormType>
) => {
  if (!value && allValue?.[key]) {
    return 'This field is required';
  }

  return undefined;
};

const validStatusCondition = (value: number | string | null | undefined) => {
  if (value === STATUS_EARLY_WARNING || value === STATUS_EVENT) {
    return undefined;
  }

  return 'Status should either be an Event or an Early Warning / Early Action';
};

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
    status: [requiredCondition, validStatusCondition]}),

  validation: (value) => {
    // if (value.status === STATUS_EARLY_WARNING
    //     && value.dtype === DISASTER_TYPE_EPIDEMIC) {
    //   return 'Early Warning / Early action cannot be selected when disaster type is Epidemic or vice-versa';
    // }

    return undefined;
  },
};

const limitQuery = {
  limit: 500,
};

function useDrefFormOptions(value: Partial<FormType>) {
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

  const countryOptions = React.useMemo(() => (
    countriesResponse?.results?.filter(
      c => c.independent && c.record_type === 1
    ).map((c) => ({
      value: c.id,
      label: c.name,
    })) ?? emptyNumericOptionList
  ), [countriesResponse]);

  const countryQuery = React.useMemo(() => ({
    country: value.country,
    limit: 500,
  }), [value.country]);

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<Entity>>({
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
  } = useRequest<ListResponse<Entity>>({
    url: 'api/v2/disaster_type/',
  });

  const disasterTypeOptions = React.useMemo(() => (
    disasterTypesResponse?.results?.map((d) => ({
      value: d.id,
      label: d.name,
    })) ?? emptyNumericOptionList
  ), [disasterTypesResponse]);

  const {
    pending: fetchingNationalSociety,
    response: nationalSocietyResponse,
  } = useRequest<ListResponse<NSEntity>>({
    url: 'api/v2/national-society-action/',
  });

  const nationalSocietyOptions = React.useMemo(() => (
    nationalSocietyResponse?.results?.map((d) => ({
      value: d.title,
      label: d.description,
    })) ?? emptyStringOptionList
  ), [nationalSocietyResponse]);

  const {
    pending: fetchingSupportedActivities,
    response: supportedActivitiesResponse,
  } = useRequest<ListResponse<Entity>>({
    url: 'api/v2/supported_activity/',
    query: limitQuery,
  });

  const supportedActivityOptions = React.useMemo(() => (
    supportedActivitiesResponse?.results?.map((d) => ({
      value: d.id,
      label: d.name,
    })) ?? emptyNumericOptionList
  ), [supportedActivitiesResponse]);

  const {
    pending: fetchingExternalPartners,
    response: externalPartnersResponse,
  } = useRequest<ListResponse<Entity>>({
    url: 'api/v2/external_partner/',
    query: limitQuery,
  });

  const externalPartnerOptions = React.useMemo(() => (
    externalPartnersResponse?.results?.map((d) => ({
      value: d.id,
      label: d.name,
    })) ?? emptyNumericOptionList
  ), [externalPartnersResponse]);

  const {
    pending: fetchingActions,
    response: actionsResponse,
  } = useRequest<ListResponse<ActionFields>>({
    url: 'api/v2/action/',
    query: limitQuery,
  });

  const statusOptions: NumericValueOption[] = React.useMemo(() => ([
    {
      value: STATUS_EARLY_WARNING,
      label: strings.fieldReportConstantStatusEarlyWarningLabel,
      description: strings.fieldReportConstantStatusEarlyWarningDescription,
    },
    {
      value: STATUS_EVENT,
      label: strings.fieldReportConstantStatusEventLabel,
      description: strings.fieldReportConstantStatusEventDescription,
    },
  ]), [strings]);

  const yesNoOptions = React.useMemo(() => {
    return [
      { value: true, label: strings.fieldReportFormOptionYesLabel },
      { value: false, label: strings.fieldReportFormOptionNoLabel },
    ] as BooleanValueOption[];
  }, [strings]);

  const bulletinOptions: NumericValueOption[] = React.useMemo(() => [
    { label: strings.fieldReportFormOptionNoLabel, value: BULLETIN_PUBLISHED_NO },
    { label: strings.fieldReportFormOptionPlannedLabel, value: BULLETIN_PUBLISHED_PLANNED },
    { label: strings.fieldReportFormOptionPublishedLabel, value: BULLETIN_PUBLISHED_YES },
  ], [strings]);

  const sourceOptions: StringValueOption[] = React.useMemo(() => ([
    {label: strings.fieldsStep2OrganizationsEVTEWLabelRC, value: SOURCE_RC},
    {label: strings.fieldsStep2OrganizationsEVTEWLabelGovernment, value: SOURCE_GOV},
    {label: strings.fieldsStep2OrganizationsLabelOther, value: SOURCE_OTHER},
  ]), [strings]);

  return {
    bulletinOptions,
    countryOptions,
    disasterTypeOptions,
    districtOptions,
    externalPartnerOptions,
    fetchingActions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingDistricts,
    fetchingExternalPartners,
    fetchingSupportedActivities,
    fetchingUserDetails,
    sourceOptions,
    statusOptions,
    supportedActivityOptions,
    userDetails,
    yesNoOptions,
    fetchingNationalSociety,
    nationalSocietyOptions,
  };
}

export default useDrefFormOptions;
