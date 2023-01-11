import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { IoCheckmarkDone } from 'react-icons/io5';

import SelectInput from '#components/SelectInput';
import Checkbox from '#components/Checkbox';
import Button from '#components/Button';
import useReduxState from '#hooks/useReduxState';

import FilterOutput from './FilterOutput';

import {
  RiskMetricType,
  riskMetricOptions,
  RiskType,
  riskTypeOptions,
  monthKeys,
  monthOptions,
  hazardTypeToNameMap,
  informHazards,
  exposureHazards,
  displacementHazards,
  HazardType,
  MonthKey,
} from '../common';

import styles from './styles.module.scss';

export interface FilterValue {
  countries: string[];
  hazardTypes: HazardType[];
  riskType: RiskType;
  include_coping_capacity: boolean;
  riskMetric: RiskMetricType;
  months: MonthKey[];
}

const defaultHazardTypeByMetric: Record<RiskMetricType, HazardType[]> = {
  informRiskScore: ['FL', 'TC', 'DR'],
  exposure: ['FL', 'TC', 'FI'],
  displacement: ['FL', 'TC'],
};

const DEFAULT_RISK_METRIC = 'informRiskScore';
export const initialFilterValue: FilterValue = {
  countries: [],
  hazardTypes: defaultHazardTypeByMetric[DEFAULT_RISK_METRIC],
  riskType: 'absolute',
  include_coping_capacity: true,
  riskMetric: DEFAULT_RISK_METRIC,

  // Current month
  months: [monthKeys[new Date().getMonth()]],
};

interface Props {
  className?: string;
  value: FilterValue;
  onChange: React.Dispatch<React.SetStateAction<FilterValue>>;
  regionId: number;
}

function Filters(props: Props) {
  const {
    className,
    value,
    onChange,
    regionId,
  } = props;

  const {
    data: {
      results: countryList = [],
    } = {},
  } = useReduxState('allCountries');

  const countryOptions = countryList.filter(
    (country) => country.iso3
      && country.independent
      && !country.is_deprecated
      && country.region === regionId
  ).map((country) => ({
    value: country.iso3 as string,
    label: country.name,
  }));

  const hazardTypeOptions = React.useMemo(() => {
    if (value.riskMetric === 'informRiskScore') {
      return informHazards.map((h) => ({
        value: h,
        label: hazardTypeToNameMap[h],
      }));
    }

    if (value.riskMetric === 'exposure') {
      return exposureHazards.map((h) => ({
        value: h,
        label: hazardTypeToNameMap[h],
      }));
    }

    if (value.riskMetric === 'displacement') {
      return displacementHazards.map((h) => ({
        value: h,
        label: hazardTypeToNameMap[h],
      }));
    }

    return [];
  }, [value.riskMetric]);

  const handleChange = React.useCallback(
    (newValue: FilterValue[keyof FilterValue], name: keyof FilterValue) => {
      if (onChange) {
        if (name === 'riskMetric') {
          onChange((oldValue) => ({
            ...oldValue,
            riskMetric: newValue as RiskMetricType,
            hazardTypes: defaultHazardTypeByMetric[newValue as RiskMetricType],
          }));
          return;
        }

        onChange((oldValue) => ({
          ...oldValue,
          [name]: newValue,
        }));
      }
    },
    [onChange],
  );

  React.useEffect(() => {
    // Setting intial values
    handleChange(countryOptions.map((d) => d.value), 'countries');
  }, [handleChange, countryOptions]);

  const handleSelectAllCountryClick = React.useCallback(() => {
    handleChange(countryOptions.map((d) => d.value), 'countries');
  }, [handleChange, countryOptions]);

  const handleSelectAllMonthClick = React.useCallback(() => {
    handleChange(monthOptions.map(d => d.value), 'months');
  }, [handleChange]);

  return (
    <div className={_cs(styles.filters, className)}>
      <div className={styles.inputs}>
        <SelectInput<'countries', string>
          className={styles.filterInput}
          value={value.countries}
          onChange={handleChange}
          name={"countries" as const}
          options={countryOptions}
          placeholder="Countries"
          isMulti
          hideValue
          isClearable={false}
          actions={(
            <Button
              name={undefined}
              variant="action"
              onClick={handleSelectAllCountryClick}
            >
              <IoCheckmarkDone />
            </Button>
          )}
        />
        <SelectInput
          className={styles.filterInput}
          value={value.riskMetric}
          onChange={handleChange}
          name={"riskMetric" as const}
          options={riskMetricOptions}
          placeholder="Risk Metric"
        />
        <SelectInput<'hazardTypes', HazardType>
          className={styles.filterInput}
          value={value.hazardTypes}
          onChange={handleChange}
          name={"hazardTypes" as const}
          options={hazardTypeOptions}
          isMulti
          placeholder="Hazard Types"
          isClearable={false}
          hideValue
        />
        <SelectInput<'months', string>
          className={styles.filterInput}
          name={"months" as const}
          value={value.months}
          onChange={handleChange}
          placeholder="Months"
          options={monthOptions}
          isMulti
          isClearable={false}
          hideValue
          actions={(
            <Button
              name={undefined}
              variant="action"
              onClick={handleSelectAllMonthClick}
            >
              <IoCheckmarkDone />
            </Button>
          )}
        />
        {value?.riskMetric === 'informRiskScore' && (
          <>
            <SelectInput
              className={styles.filterInput}
              value={value.riskType}
              onChange={handleChange}
              name={"riskType" as const}
              options={riskTypeOptions}
              placeholder="Risk type"
            />
            <Checkbox
              name={"include_coping_capacity" as const}
              label="Country Coping Capacity"
              value={value.include_coping_capacity}
              onChange={handleChange}
            />
          </>
        )}
      </div>
      <div className={styles.outputs}>
        <FilterOutput<'countries', string, (typeof countryOptions)[number]> 
          label="Countries:"
          name={"countries" as const}
          options={countryOptions}
          value={value.countries}
          optionKeySelector={h => h.value}
          optionLabelSelector={h => h.label}
          onChange={handleChange}
          isMulti
        />
        <FilterOutput<'hazardTypes', HazardType, (typeof hazardTypeOptions)[number]> 
          label="Hazard Types:"
          name={"hazardTypes" as const}
          options={hazardTypeOptions}
          value={value.hazardTypes}
          optionKeySelector={h => h.value}
          optionLabelSelector={h => h.label}
          onChange={handleChange}
          isMulti
        />
        <FilterOutput<'months', MonthKey, (typeof monthOptions)[number]>
          label="Months:"
          name={"months" as const}
          options={monthOptions}
          value={value.months}
          optionKeySelector={h => h.value}
          optionLabelSelector={h => h.label}
          onChange={handleChange}
          isMulti
        />
      </div>
    </div>
  );
}

export default Filters;
