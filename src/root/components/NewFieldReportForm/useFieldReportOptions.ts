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
  FormType,
  ListResponse,
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

    actions_ns: [],
    actions_ns_desc: [],
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
  ) as [boolean, ListResponse];

  const countryOptions = React.useMemo(() => (
    countriesResponse?.results?.map((c) => ({
      value: c.id,
      label: c.name,
    }))
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
  ) as [boolean, ListResponse];

  const districtOptions = React.useMemo(() => (
    districtsResponse?.results?.map(d => ({
      value: String(d.id),
      label: d.name,
    })).sort(compareString) ?? emptyOptionList
  ), [districtsResponse]);

  const [
    fetchingDisasterTypes,
    disasterTypesResponse,
  ] = useRequest('api/v2/disaster_type') as  [boolean, ListResponse];

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
  ) as [boolean, ListResponse];

  const actionOptionsMap: {
    [key in ReportType]: Option[];
  } = React.useMemo(() => {
    if (!actionsResponse?.results?.length) {
      return {
        EPI: emptyOptionList,
        COVID: emptyOptionList,
        EVT: emptyOptionList,
        EW: emptyOptionList,
      };
    }

    const getFilter = (reportType: string) => (a: {
      reportTypeList: string[];
    }) => (
      a.reportTypeList?.findIndex(
        (frt: string) => frt === reportType
      ) !== -1
    );

    const actions = actionsResponse.results.map(d => ({
        value: String(d.id),
        label: d.name,
        description: d.tooltip_text,
        reportTypeList: d.field_report_types,
        organizations: d.organizations,
        category: d.category,
      }));

    const groupByOrg = (acc: Record<string, any>, val: Record<string, any>) => {
      const newAcc = {...acc};
      Object.keys(newAcc).forEach((org) => {
        if (val.organizations.findIndex((o: string) => o === org) !== -1) {
          newAcc[org].push({
            value: val.value,
            label: val.label,
            description: val.description,
            category: val.category,
            organization: org,
          });
        }
      });

      return newAcc;
    };

    const actionMap = {
      EPI: actions.filter(getFilter('EPI')).reduce(groupByOrg, {
        FDRN: [], NTLS: [], PNS: [],
      }),
      COVID: actions.filter(getFilter('COVID')).reduce(groupByOrg, {
        FDRN: [], NTLS: [], PNS: [],
      }),
      EVT: actions.filter(getFilter('EVT')).reduce(groupByOrg, {
        FDRN: [], NTLS: [], PNS: [],
      }),
      EW: actions.filter(getFilter('EW')).reduce(groupByOrg, {
        FDRN: [], NTLS: [], PNS: [],
      }),
    };

    const actionCategoryReverse = {
      'Health': 'health',
      'NS Institutional Strengthening': 'ns',
      'Socioeconomic Interventions': 'socioeco',
    };

    console.info(
      listToGroupList(actionMap.COVID.NTLS, d => d.category, d => d)
    );

    return actionMap;
  }, [actionsResponse]);

  const statusOptions = React.useMemo(() => (
    getStatus(strings) as Option[]
  ), [strings]);

  const yesNoOptions = React.useMemo(() => {
    return [
      { value: 'true', label: strings.fieldReportFormOptionYesLabel },
      { value: 'false', label: strings.fieldReportFormOptionNoLabel },
    ] as Option[];
  }, [strings]);

  return {
    fetchingActions,
    actionOptions: actionOptionsMap[reportType],
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
