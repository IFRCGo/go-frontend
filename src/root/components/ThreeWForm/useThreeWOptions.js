import React from 'react';
import {
  isDefined,
  isFalsy,
  isInteger,
  listToMap,
} from '@togglecorp/fujs';

import {
  requiredCondition,
  requiredListCondition,
  requiredStringCondition,
} from '@togglecorp/toggle-form';

import { useRequest } from '#utils/restRequest';
import { compareString } from '#utils/utils';
import {
  statuses,
  sectorList,
  secondarySectorList,
  programmeTypeList,
  operationTypeList,
  projectVisibilityList,
} from '#utils/constants';


export const OPERATION_TYPE_EMERGENCY = '1';
export const PROGRAMME_TYPE_MULTILATERAL = '1';
export const PROGRAMME_TYPE_DOMESTIC = '2';

export const PROJECT_STATUS_COMPLETED = '2';
export const PROJECT_STATUS_ONGOING = '1';
export const PROJECT_STATUS_PLANNED = '0';

const emptyList = [];
const emptyObject = {};

const sectorOptions = sectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
})).sort(compareString);

const allSecondarySectorOptions = secondarySectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
})).sort(compareString);

const programmeTypeOptions = programmeTypeList.map(p => ({
  value: p.key,
  label: p.title,
})).sort(compareString);

const operationTypeOptions = [...operationTypeList].sort(compareString);
const projectVisibilityOptions = [...projectVisibilityList].sort(compareString);

function positiveIntegerCondition(value) {
  return (value === undefined || value === '')
    || (
      (!Number.isNaN(value))
      && (isFalsy(value) || isInteger(+value))
      && (+value >= 0)
    ) ? undefined : 'Value must be a positive integer';
}

const generateValidEndDateCondition = (start) => (end) => {
  if (!start || !end) {
    return undefined;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate.getTime() >= endDate.getTime()) {
    return 'End date must be greater than start date';
  }

  return undefined;
};

export const schema = {
  fields: (value) => {
    const schema = {
      budget_amount: [requiredCondition, positiveIntegerCondition],
      dtype: [requiredCondition],
      end_date: [requiredCondition, generateValidEndDateCondition(value.start_date)],
      event: [],
      is_project_completed: [],
      name: [requiredStringCondition],
      operation_type: [requiredCondition],
      primary_sector: [requiredCondition],
      programme_type: [requiredCondition],
      project_country: [requiredCondition],
      project_districts: [requiredListCondition],
      reached_female: [positiveIntegerCondition],
      reached_male: [positiveIntegerCondition],
      reached_other: [positiveIntegerCondition],
      reached_total: [positiveIntegerCondition],
      reporting_ns: [requiredCondition],
      secondary_sectors: [],
      start_date: [requiredCondition],
      // Note: Event though status is required field,
      // its not marked required in the schema
      // because it is calculated automatically
      // using value of other required fields
      status: [],
      target_female: [positiveIntegerCondition],
      target_male: [positiveIntegerCondition],
      target_other: [positiveIntegerCondition],
      target_total: [requiredCondition, positiveIntegerCondition],
      visibility: [requiredCondition],
    };

    const programmeType = String(value.programme_type);
    const operationType = String(value.operation_type);
    const projectStatus = String(value.status);

    if (operationType === OPERATION_TYPE_EMERGENCY
      && (programmeType === PROGRAMME_TYPE_MULTILATERAL || programmeType === PROGRAMME_TYPE_DOMESTIC)) {
      schema.event = [requiredCondition];
    }

    if (projectStatus === PROJECT_STATUS_COMPLETED) {
      schema.reached_total = [requiredCondition, positiveIntegerCondition];
      schema.budget_amount = [positiveIntegerCondition];
    }

    return schema;
  },
};

const limitQuery = {
  limit: 500,
};

export function useThreeWOptions(value) {
  const {
    pending: fetchingCountries,
    response: countriesResponse,
  } = useRequest({
    url: 'api/v2/country',
    query: limitQuery,
  });

  const [
    nationalSocietyOptions,
    countryOptions,
  ] = React.useMemo(() => {
    if (!(countriesResponse?.results?.length > 0)) {
      return [emptyList, emptyList];
    }

    const ns = countriesResponse?.results
      .filter(d => d.independent && d.society_name)
      .map(d => ({
        value: d.id,
        label: d.society_name,
      })).sort(compareString);

    const c = countriesResponse.results
      .filter(d => d.independent && d.iso)
      .map(d => ({
        value: d.id,
        label: d.name,
      })).sort(compareString);

    return [ns, c];
  }, [countriesResponse]);

  const projectCountryQuery = React.useMemo(() => ({
    country: value.project_country,
    limit: 500,
  }), [value.project_country]);

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest({
    skip: !value.project_country,
    url: 'api/v2/district',
    query: projectCountryQuery,
  });

  const {
    pending: fetchingEvents,
    response: eventsResponse,
  } = useRequest({
    skip: !value.project_country,
    url: 'api/v2/event/mini/',
    query: projectCountryQuery,
  });

  const districtOptions = React.useMemo(() => (
    districtsResponse?.results.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString) ?? emptyList
  ), [districtsResponse]);

  const [
    currentOperationOptions,
    currentEmergencyOperationOptions,
    operationToDisasterMap,
  ] = React.useMemo(() => {
    if (!(eventsResponse?.results?.length > 0)) {
      return [emptyList, emptyList, emptyObject];
    }

    const {
      results: eventList,
    } = eventsResponse;

    const coo = eventList.map((d) => ({
      value: d.id,
      label: d.name,
    }));

    const ceoo = eventList
      .filter(d => d.auto_generated_source === 'New field report')
      .map((d) => ({
        value: d.id,
        label: d.name,
      }));

    const otdm = listToMap(eventList, d => d.id, d => d.dtype?.id);

    return [coo, ceoo, otdm];
  }, [eventsResponse]);


  const {
    pending: fetchingDisasterTypes,
    response: disasterTypesResponse,
  } = useRequest({
    url: 'api/v2/disaster_type',
  });

  const disasterTypeOptions = React.useMemo(() => {
    if (!(disasterTypesResponse?.results?.length > 0)) {
      return emptyList;
    }

    return disasterTypesResponse.results.map((d) => ({
      value: d.id,
      label: d.name,
    }));
  }, [disasterTypesResponse]);

  const shouldDisableDistrictInput = fetchingDistricts
    || !isDefined(value.project_country)
    || districtOptions?.length === 0;

  const [
    shouldShowCurrentEmergencyOperation,
    shouldShowCurrentOperation
  ] = React.useMemo(() => {
    const operationType = String(value.operation_type);
    const programmeType = String(value.programme_type);

    const isEmergencyOperation = operationType === OPERATION_TYPE_EMERGENCY;

    return [
      isEmergencyOperation && programmeType === PROGRAMME_TYPE_DOMESTIC,
      isEmergencyOperation && programmeType === PROGRAMME_TYPE_MULTILATERAL,
    ];
  }, [value]);

  // FIXME: use strings
  let currentOperationPlaceholder = 'Select an operation';
  let districtPlaceholder = 'Select region(s)';
  if (!isDefined(value.project_country)) {
    currentOperationPlaceholder = 'Select a country to view it\'s current operations';
    districtPlaceholder = 'Select a country to view it\'s regions';
  } else {
    if (fetchingEvents) {
      currentOperationPlaceholder = 'Fetching current operations...';
    }

    if (fetchingDistricts) {
      districtPlaceholder = 'Fetching regions...';
    }
  }

  const shouldDisableDisasterType = shouldShowCurrentEmergencyOperation || shouldShowCurrentOperation;
  let disasterTypePlaceholder = 'Select a disaster type';
  if (fetchingDisasterTypes) {
    disasterTypePlaceholder = 'Fetching disaster types..';
  } else if(shouldDisableDisasterType) {
    disasterTypePlaceholder = 'Select an operation for it\'s disaster type';
  }

  const secondarySectorOptions = React.useMemo(() => (
    allSecondarySectorOptions.filter(d => d.value !== value.primary_sector)
  ), [value.primary_sector]);

  const isReachedTotalRequired = String(value.status) === PROJECT_STATUS_COMPLETED;
  const shouldDisableTotalTarget = !isFalsy(value.target_male)
    || !isFalsy(value.target_female)
    || !isFalsy(value.target_other);
  const shouldDisableTotalReached = !isFalsy(value.reached_male)
    || !isFalsy(value.reached_female)
    || !isFalsy(value.reached_other);

  return {
    fetchingCountries,
    fetchingDistricts,
    fetchingEvents,
    fetchingDisasterTypes,
    nationalSocietyOptions,
    countryOptions,
    districtOptions,
    sectorOptions,
    disasterTypeOptions,
    secondarySectorOptions,
    programmeTypeOptions,
    operationTypeOptions,
    currentOperationOptions,
    currentEmergencyOperationOptions,
    operationToDisasterMap,
    projectVisibilityOptions,
    shouldDisableDistrictInput,
    shouldShowCurrentEmergencyOperation,
    shouldShowCurrentOperation,
    currentOperationPlaceholder,
    districtPlaceholder,
    disasterTypePlaceholder,
    shouldDisableDisasterType,
    statuses,
    isReachedTotalRequired,
    shouldDisableTotalTarget,
    shouldDisableTotalReached,
  };
}
