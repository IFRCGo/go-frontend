import React from 'react';
import {
  isDefined,
  isFalsy,
  listToMap,
} from '@togglecorp/fujs';
import {
  PartialForm,
  ObjectSchema,
} from '@togglecorp/toggle-form';

import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import { compareString } from '#utils/utils';
import {
  requiredCondition,
  requiredStringCondition,
  positiveIntegerCondition,
  requiredListCondition,
} from '#utils/form';
import {
  statuses,
  sectorList,
  secondarySectorList,
  programmeTypeList,
  operationTypeList,
  projectVisibilityList,
} from '#utils/constants';
import {
  ProjectFormFields,
  Disaster,
  Country,
  District,
  EventMini,
  Project,
} from '#types';
import LanguageContext from '#root/languageContext';

export const OPERATION_TYPE_PROGRAMME = 0;
export const OPERATION_TYPE_EMERGENCY = 1;

export const PROGRAMME_TYPE_MULTILATERAL = 1;
export const PROGRAMME_TYPE_DOMESTIC = 2;

export const PROJECT_STATUS_COMPLETED = 2;
export const PROJECT_STATUS_ONGOING = 1;
export const PROJECT_STATUS_PLANNED = 0;

export interface LabelValue {
  value: number;
  label: string;
}

const emptyLabelValueList: LabelValue[] = [];
const emptyObject = {};

const sectorOptions = sectorList.map(p => ({
  value: (+p.inputValue),
  label: p.title,
})).sort(compareString);

const allSecondarySectorOptions = secondarySectorList.map(p => ({
  value: (+p.inputValue),
  label: p.title,
})).sort(compareString);

const programmeTypeOptions = programmeTypeList.map(p => ({
  value: (+p.key),
  label: p.title,
})).sort(compareString);

const operationTypeOptions = operationTypeList.map((o) => ({
  value: (+o.value),
  label: o.label,
})).sort(compareString);

const projectVisibilityOptions = [...projectVisibilityList].sort(compareString);

export interface FormType extends ProjectFormFields {
  is_project_completed: boolean;
}

const greaterThanStartDateCondition = (
  value: number | string | null | undefined,
  allValue: PartialForm<FormType>,
) => {
  const start = allValue?.start_date;
  const end = value;

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

type FormSchema = ObjectSchema<PartialForm<FormType>>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => {
    let schema: FormSchemaFields = {
      actual_expenditure: [requiredCondition, positiveIntegerCondition],
      budget_amount: [requiredCondition, positiveIntegerCondition],
      dtype: [requiredCondition],
      end_date: [requiredCondition, greaterThanStartDateCondition],
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

    const programmeType = value.programme_type;
    const operationType = value.operation_type;
    const projectStatus = value.status;

    if (operationType === OPERATION_TYPE_PROGRAMME) {
      schema.dtype = [];
    }

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
  fieldDependencies: () => ({
    end_date: ['start_date'],
  }),
};

const limitQuery = {
  limit: 500,
};

export function useThreeWOptions(value: Partial<FormType>) {
  const { strings } = React.useContext(LanguageContext);
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
      return [emptyLabelValueList, emptyLabelValueList];
    }

    const ns: LabelValue[] = countriesResponse.results
      .filter(d => d.independent && d.society_name)
      .map(d => ({
        value: d.id,
        label: d.society_name,
      })).sort(compareString);

    const c: LabelValue[] = countriesResponse.results
      .filter(d => d.independent && d.iso)
      .map(d => ({
        value: d.id,
        label: d.name,
      })).sort(compareString);

    return [ns, c] as const;
  }, [countriesResponse]);

  const projectCountryQuery = React.useMemo(() => ({
    country: value.project_country,
    limit: 500,
  }), [value.project_country]);

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<District>>({
    skip: !value.project_country,
    url: 'api/v2/district/',
    query: projectCountryQuery,
  });

  const districtOptions: LabelValue[] = React.useMemo(() => (
    districtsResponse?.results.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString) ?? emptyLabelValueList 
  ), [districtsResponse]);

  const {
    pending: fetchingEvents,
    response: eventsResponse,
  } = useRequest<ListResponse<EventMini>>({
    skip: !value.project_country,
    url: 'api/v2/event/mini/',
    query: projectCountryQuery,
  });

  const [
    currentOperationOptions,
    currentEmergencyOperationOptions,
    operationToDisasterMap,
  ] = React.useMemo(() => {
    if (!eventsResponse) {
      return [emptyLabelValueList, emptyLabelValueList, emptyObject];
    }

    const {
      results: eventList,
    } = eventsResponse;

    const coo: LabelValue[] = eventList.map((d) => ({
      value: d.id,
      label: d.name,
    }));

    const ceoo: LabelValue[] = eventList
      .filter(d => d.auto_generated_source === 'New field report')
      .map((d) => ({
        value: d.id,
        label: d.name,
      }));

    const otdm = listToMap(eventList, d => d.id, d => d.dtype?.id);

    return [coo, ceoo, otdm] as const;
  }, [eventsResponse]);


  const {
    pending: fetchingDisasterTypes,
    response: disasterTypesResponse,
  } = useRequest<ListResponse<Disaster>>({
    url: 'api/v2/disaster_type/',
  });

  const disasterTypeOptions = React.useMemo(() => {
    if (!disasterTypesResponse) {
      return emptyLabelValueList;
    }

    const dto: LabelValue[] = disasterTypesResponse.results.map((d) => ({
      value: d.id,
      label: d.name,
    }));

    return dto;
  }, [disasterTypesResponse]);

  const shouldDisableDistrictInput = fetchingDistricts
    || !isDefined(value.project_country)
    || districtOptions?.length === 0;

  const [
    shouldShowCurrentEmergencyOperation,
    shouldShowCurrentOperation
  ] = React.useMemo(() => {
    const operationType = value.operation_type;
    const programmeType = value.programme_type;

    const isEmergencyOperation = operationType === OPERATION_TYPE_EMERGENCY;

    return [
      isEmergencyOperation && programmeType === PROGRAMME_TYPE_DOMESTIC,
      isEmergencyOperation && programmeType === PROGRAMME_TYPE_MULTILATERAL,
    ] as const;
  }, [value]);

  let currentOperationPlaceholder = strings.projectFormOperationDefaultPlaceholder;
  let districtPlaceholder = strings.projectFormDistrictSelect;
  if (!isDefined(value.project_country)) {
    currentOperationPlaceholder = strings.projectFormNoCountryOperationPlaceholder;
    districtPlaceholder = strings.projectFormNoCountryDistrictPlaceholder;
  } else {
    if (fetchingEvents) {
      currentOperationPlaceholder = strings.projectFormFetchingCurrentOperationPlaceholder;
    }

    if (fetchingDistricts) {
      districtPlaceholder = strings.projectFormDistrictFetching;
    }
  }

  const shouldDisableDisasterType = shouldShowCurrentEmergencyOperation || shouldShowCurrentOperation;
  let disasterTypePlaceholder = strings.projectFormDisasterTypeDefaultPlaceholder;
  if (fetchingDisasterTypes) {
    disasterTypePlaceholder = strings.projectFormFetchingDisasterTypePlaceholder;
  } else if(shouldDisableDisasterType) {
    disasterTypePlaceholder = strings.projectFormDisasterTypePlaceholder;
  }

  const secondarySectorOptions = React.useMemo(() => (
    allSecondarySectorOptions.filter(d => d.value !== value.primary_sector)
  ), [value.primary_sector]);

  const isReachedTotalRequired = value.status === PROJECT_STATUS_COMPLETED;
  const shouldDisableTotalTarget = !isFalsy(value.target_male)
    || !isFalsy(value.target_female)
    || !isFalsy(value.target_other);
  const shouldDisableTotalReached = !isFalsy(value.reached_male)
    || !isFalsy(value.reached_female)
    || !isFalsy(value.reached_other);

  const disasterTypeLabel = value.operation_type === OPERATION_TYPE_PROGRAMME
    ? strings.projectFormDisasterType
    : strings.projectFormDisasterTypeMandatory;

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
    disasterTypeLabel,
  } as const;
}

export function transformResponseFieldsToFormFields(projectResponse: Project): FormType {
  const {
    actual_expenditure,
    budget_amount,
    dtype,
    end_date,
    event,
    name,
    operation_type,
    primary_sector,
    programme_type,
    project_country,
    project_districts,
    reached_female,
    reached_male,
    reached_other,
    reached_total,
    reporting_ns,
    secondary_sectors,
    start_date,
    status,
    target_female,
    target_male,
    target_other,
    target_total,
    visibility,
  } = projectResponse;

  const formValue: FormType = {
    is_project_completed: status === PROJECT_STATUS_COMPLETED,
    actual_expenditure,
    budget_amount,
    dtype,
    end_date,
    event,
    name,
    operation_type,
    primary_sector,
    programme_type,
    project_country,
    project_districts,
    reached_female,
    reached_male,
    reached_other,
    reached_total,
    reporting_ns,
    secondary_sectors,
    start_date,
    status,
    target_female,
    target_male,
    target_other,
    target_total,
    visibility,
  };

  return formValue;
}
