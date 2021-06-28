import React from 'react';
import { _cs } from '@togglecorp/fujs';

import {
  sectorList,
  secondarySectorList,
  programmeTypeList,
  operationTypeList,
} from '#utils/constants';
import { compareLabel } from '#utils/common';

import SelectInput from '#components/SelectInput';
import LanguageContext from '#root/languageContext';
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
  project_country: number[];
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
}

function Filters(props: Props) {
  const {
    className,
    value,
    onChange,
    disabled,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const allCountries = useReduxState('allCountries');
  const countryOptions = React.useMemo(
    () => allCountries?.data?.results.map((c) => ({
      value: c.id,
      label: c.name,
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
        name="project_country"
        placeholder={strings.threeWFilterReceivingCountries}
        options={countryOptions}
        value={value.project_country}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="operation_type"
        placeholder={strings.threeWFilterProjectTypes}
        options={operationTypeOptions}
        value={value.operation_type}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="programme_type"
        placeholder={strings.threeWFilterProgrammeTypes}
        options={programmeTypeOptions}
        value={value.programme_type}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="primary_sector"
        placeholder={strings.threeWFilterSectors}
        options={sectorOptions}
        value={value.primary_sector}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="secondary_sectors"
        placeholder={strings.threeWFilterTags}
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
