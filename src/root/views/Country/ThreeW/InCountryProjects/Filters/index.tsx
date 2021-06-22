import React from 'react';
import { _cs } from '@togglecorp/fujs';

import {
  sectorList,
  secondarySectorList,
  programmeTypeList,
  operationTypeList,
} from '#utils/constants';
import { compareLabel } from '#utils/common';

import { District } from '#types';
import SelectInput from '#components/SelectInput';
import useReduxState from '#hooks/useReduxState';

import styles from './styles.module.scss';

const operationTypeOptions = operationTypeList.map(p => ({
  value: +p.value,
  label: p.label,
})).sort(compareLabel);

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
  project_districts: number[];
  operation_type: number[];
  programme_type: number[];
  primary_sector: number[];
  secondary_sectors: number[];
}

interface Props {
  className?: string;
  value: FilterValue;
  onChange: React.Dispatch<React.SetStateAction<FilterValue>>;
  disabled?: boolean;
  districtList: District[];
}

function Filters(props: Props) {
  const {
    className,
    value,
    onChange,
    disabled,
    districtList,
  } = props;

  const allCountries = useReduxState('allCountries');
  const nsOptions = React.useMemo(
    () => allCountries?.data?.results.map((c) => ({
      value: c.id,
      label: c.society_name,
    })).filter(d => d.label).sort(compareLabel) ?? [],
    [allCountries],
  );

  const districtOptions = React.useMemo(
    () => districtList.map((d) => ({
      value: d.id,
      label: d.name,
    })),
    [districtList],
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
        placeholder="National Societies"
        options={nsOptions}
        value={value.reporting_ns}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="project_districts"
        placeholder="Provinces"
        options={districtOptions}
        value={value.project_districts}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="operation_type"
        placeholder="Project Types"
        options={operationTypeOptions}
        value={value.operation_type}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="programme_type"
        placeholder="Programme Types"
        options={programmeTypeOptions}
        value={value.programme_type}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="primary_sector"
        placeholder="Sectors"
        options={sectorOptions}
        value={value.primary_sector}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="secondary_sectors"
        placeholder="Tags"
        options={tagOptions}
        value={value.secondary_sectors}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );
}

export default Filters;
