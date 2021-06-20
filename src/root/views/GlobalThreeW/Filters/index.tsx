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
  programme_types: number[];
  primary_sectors: number[];
  secondary_sectors: number[];
}

interface Props {
  className?: string;
  value: FilterValue;
  onChange: React.Dispatch<React.SetStateAction<FilterValue>>;
}

function Filters(props: Props) {
  const {
    className,
    value,
    onChange,
  } = props;

  const allCountries = useReduxState('allCountries');
  const nsOptions = React.useMemo(
    () => allCountries?.data?.results.map((c) => ({
      value: c.id,
      label: c.society_name,
    })).filter(d => d.label).sort(compareLabel) ?? [],
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
        placeholder="National Societies"
        options={nsOptions}
        value={value.reporting_ns}
        isMulti
        onChange={handleInputChange}
      />
      <SelectInput<string, number>
        name="programme_types"
        placeholder="Programme Types"
        options={programmeTypeOptions}
        value={value.programme_types}
        isMulti
        onChange={handleInputChange}
      />
      <SelectInput<string, number>
        name="primary_sectors"
        placeholder="Sectors"
        options={sectorOptions}
        value={value.primary_sectors}
        isMulti
        onChange={handleInputChange}
      />
      <SelectInput<string, number>
        name="secondary_sectors"
        placeholder="Sectors"
        options={tagOptions}
        value={value.secondary_sectors}
        isMulti
        onChange={handleInputChange}
      />
    </div>
  );
}

export default Filters;

