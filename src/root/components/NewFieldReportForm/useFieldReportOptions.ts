import React from 'react';
import { listToGroupList } from '@togglecorp/fujs';
import {
  PartialForm,
  ObjectSchema,
} from '@togglecorp/toggle-form';

import {
  getStatus,
  STATUS_EARLY_WARNING,
  DISASTER_TYPE_EPIDEMIC,
} from '#utils/field-report-constants';
import { compareString } from '#utils/utils';
import LanguageContext from '#root/languageContext';
import useRequest, { buildUrl } from '#hooks/useRequest';

import {
  Option,
  ReportType,
  emptyOptionList,
  emptyActionList,
  FormType,
  ListResponse,
  ActionFields,
  ActionByReportType,
  ActionsByOrganization,
  OrganizationType,
} from './common';

type FormSchema = ObjectSchema<PartialForm<FormType>>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({
    status: [],
    is_covid_report: [],
    disaster_type: [],
    event: [],
    title: [],
    country: [],
    start_date: [],
    assistance: [],
    ns_assistance: [],

    epi_cases: [],
    epi_suspected_cases: [],
    epi_probable_cases: [],
    epi_confirmed_cases: [],
    epi_num_dead: [],

    epi_cases_since_last_fr: [],
    epi_deaths_since_last_fr: [],

    epi_figures_source: [],
    epi_notes_since_last_fr: [],
    situation_fields_date: [],
    other_sources: [],
    description: [],

    num_injured: [],
    num_dead: [],
    num_missing: [],
    num_affected: [],
    num_displaced: [],
    num_injured_source: [],
    num_dead_source: [],
    num_missing_source: [],
    num_affected_source: [],
    num_displaced_source: [],

    num_potentially_affected: [],
    num_highest_risk: [],
    affected_pop_centres: [],
    num_potentially_affected_source: [],
    num_highest_risk_source: [],
    affected_pop_centres_source: [],

    num_assisted_gov: [],
    num_assisted_red_cross: [],
    num_local_staff: [],
    num_volunteers: [],
    num_expats: [],
  }),

  validation: (value) => {
    if (String(value.status) === STATUS_EARLY_WARNING
        && String(value.disaster_type) === DISASTER_TYPE_EPIDEMIC) {
      return 'Early Warning / Early action cannot be selected when disaster type is Epidemic or vice-versa';
    }

    return undefined;
  }
};

function useFieldReportOptions(value: Partial<FormType>) {
  const { strings } = React.useContext(LanguageContext);

  const [
    fetchingCountries,
    countriesResponse,
  ] = useRequest(
    buildUrl('api/v2/country', { limit: 500 })
  ) as ListResponse;

  const countryOptions = React.useMemo(() => (
    countriesResponse?.results?.map((c) => ({
      value: c.id,
      label: c.name,
    })) ?? emptyOptionList
  ), [countriesResponse]);

  const [
    fetchingDistricts,
    districtsResponse,
  ] = useRequest(
    value.country ? (
      buildUrl('api/v2/district', {
        country: value.country,
        limit: 500,
      })
    ) : ''
  ) as ListResponse;

  const districtOptions = React.useMemo(() => (
    districtsResponse?.results?.map(d => ({
      value: String(d.id),
      label: d.name,
    })).sort(compareString) ?? emptyOptionList
  ), [districtsResponse]);

  const [
    fetchingDisasterTypes,
    disasterTypesResponse,
  ] = useRequest('api/v2/disaster_type') as  ListResponse;

  const disasterTypeOptions = React.useMemo(() => (
    disasterTypesResponse?.results?.map((d) => ({
      value: String(d.id),
      label: d.name,
    })) ?? emptyOptionList
  ), [disasterTypesResponse]);

  const reportType: ReportType = React.useMemo(() => {
    if (String(value.status) === STATUS_EARLY_WARNING) {
      return 'EW';
    }

    if (value.is_covid_report === 'true') {
      return 'COVID';
    }

    if (String(value.disaster_type) === DISASTER_TYPE_EPIDEMIC) {
      return 'EPI';
    }

    return 'EVT';
  }, [value.status, value.disaster_type, value.is_covid_report]);

  const [
    fetchingActions,
    actionsResponse
  ] = useRequest(
    buildUrl('api/v2/action', { limit: 500 })
  ) as ListResponse<ActionFields>;

  const actionOptionsMap: ActionByReportType = React.useMemo(() => {
    if (!actionsResponse?.results?.length) {
      return {
        EVT: emptyActionList,
        EPI: emptyActionList,
        COVID: emptyActionList,
        EW: emptyActionList,
      } as ActionByReportType;
    }

    const actionList = actionsResponse.results;
    const getFilter = (reportType: string) => (a: ActionFields) => (
      a.field_report_types.findIndex(
        (frt: string) => frt === reportType
      ) !== -1
    );

    const actionMap = {
      EW: actionList.filter(getFilter('EW')),
      EPI: actionList.filter(getFilter('EPI')),
      COVID: actionList.filter(getFilter('COVID')),
      EVT: actionList.filter(getFilter('EVT')),
    };

    return actionMap;
  }, [actionsResponse]);

  const orgGroupedActionForCurrentReport = React.useMemo(() => {
    const options = actionOptionsMap[reportType];

    return options.reduce((acc, val) => {
      const newAcc = {...acc} as ActionsByOrganization;
      (Object.keys(newAcc) as OrganizationType[]).forEach((org) => {
        if (val.organizations.findIndex((o) => o === org) !== -1) {
          newAcc[org].push({
            value: String(val.id),
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
  }, [actionOptionsMap, reportType]);

  const statusOptions = React.useMemo(() => (
    getStatus(strings) as Option[]
  ), [strings]);

  const yesNoOptions = React.useMemo(() => {
    return [
      { value: 'true', label: strings.fieldReportFormOptionYesLabel },
      { value: 'false', label: strings.fieldReportFormOptionNoLabel },
    ] as Option[];
  }, [strings]);

  const bulletinOptions: Option[] = React.useMemo(() => [
    { label: strings.fieldReportFormOptionNoLabel, value: '0' },
    { label: strings.fieldReportFormOptionPlannedLabel, value: '2' },
    { label: strings.fieldReportFormOptionPublishedLabel, value: '3' },
  ], [strings]);

  return {
    bulletinOptions,
    orgGroupedActionForCurrentReport,
    fetchingActions,
    fetchingDistricts,
    districtOptions,
    fetchingCountries,
    countryOptions,
    fetchingDisasterTypes,
    disasterTypeOptions,
    reportType,
    yesNoOptions,
    statusOptions,
  };
}

export default useFieldReportOptions;
