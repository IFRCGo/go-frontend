import React from 'react';
import { _cs } from '@togglecorp/fujs';

import {
  sectorList,
  secondarySectorList,
  programmeTypeList,
} from '#utils/constants';
import { compareLabel } from '#utils/common';

import SelectInput from '#components/SelectInput';
import useReduxState from '#hooks/useReduxState';

import styles from './styles.module.scss';

const programmeTypeOptions = programmeTypeList.map(p => ({
  value: +p.key,
  label: p.title,
})).sort(compareLabel);

const sectorOptions = sectorList.map(p => ({
  value: +p.inputValue,
  label: p.title,
})).sort(compareLabel);

const tagOptions = secondarySectorList.map(p => ({
  value: +p.inputValue,
  label: p.title,
})).sort(compareLabel);

export interface FilterValue {
  reporting_ns: number[];
  programme_type: number[];
  primary_sector: number[];
  secondary_sectors: number[];
}

interface Props {
  className?: string;
  value: FilterValue;
  onChange: React.Dispatch<React.SetStateAction<FilterValue>>;
  disabled?: boolean;
}

function Filters(props: Props) {
  const {
    className,
    value,
    onChange,
    disabled,
  } = props;

  const allCountries = useReduxState('allCountries');
  const nsOptions = React.useMemo(
    () => allCountries?.data?.results.filter((c) => (
      c.independent && !c.is_deprecated && c.society_name
    )).map((c) => ({
      value: c.id,
      label: c.society_name,
    })).sort(compareLabel) ?? [],
    [allCountries],
  );

  const handleInputChange = React.useCallback((newValue: number[], name: string) => {
    if (onChange) {
      onChange((oldFilterValue) => {
        const newFilterValue = {
          ...oldFilterValue,
          [name]: newValue,
        };

        return newFilterValue;
      });
    }
  }, [onChange]);

  return (
    <div className={_cs(styles.filters, className)}>
      <SelectInput<string, number>
        name="reporting_ns"
        placeholder="Hazard Type"
        options={nsOptions}
        value={value.reporting_ns}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="programme_type"
        placeholder="Risk Metric"
        options={programmeTypeOptions}
        value={value.programme_type}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );
}

function EventFilters(props: Props) {
  const {
    className,
    value,
    onChange,
    disabled,
  } = props;

  const allCountries = useReduxState('allCountries');
  const nsOptions = React.useMemo(
    () => allCountries?.data?.results.filter((c) => (
      c.independent && !c.is_deprecated && c.society_name
    )).map((c) => ({
      value: c.id,
      label: c.society_name,
    })).sort(compareLabel) ?? [],
    [allCountries],
  );

  const handleInputChange = React.useCallback((newValue: number[], name: string) => {
  }, [onChange]);
  return (
    <div className={_cs(styles.filters, className)}>
      <SelectInput<string, number>
        name="events"
        placeholder="Event"
        options={nsOptions}
        value={value.reporting_ns}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="years"
        placeholder="Last 10 years"
        options={programmeTypeOptions}
        value={value.programme_type}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );
}

function MonthFilters(props: Props) {
  const {
    className,
    value,
    onChange,
    disabled,
  } = props;

  const allCountries = useReduxState('allCountries');
  const nsOptions = React.useMemo(
    () => allCountries?.data?.results.filter((c) => (
      c.independent && !c.is_deprecated && c.society_name
    )).map((c) => ({
      value: c.id,
      label: c.society_name,
    })).sort(compareLabel) ?? [],
    [allCountries],
  );

  const handleInputChange = React.useCallback((newValue: number[], name: string) => {
  }, [onChange]);
  return (
    <div className={_cs(styles.filters, className)}>
      <SelectInput<string, number>
        name="hazard_type"
        placeholder="Hazard Type"
        options={nsOptions}
        value={value.reporting_ns}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="people_affected"
        placeholder="People Affected"
        options={programmeTypeOptions}
        value={value.programme_type}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );
}

export { Filters, EventFilters, MonthFilters };
