import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { sectorList } from '#utils/constants';
import { compareLabel } from '#utils/common';

import SelectInput from '#components/SelectInput';
import useReduxState from '#hooks/useReduxState';

import styles from './styles.module.scss';

const sectorOptions = sectorList.map(p => ({
  value: +p.inputValue,
  label: p.title,
})).sort(compareLabel);

export interface SankeyFilterValue {
  primary_sector: number[];
  project_country: number[];
}

interface Props {
  className?: string;
  value: SankeyFilterValue;
  onChange: React.Dispatch<React.SetStateAction<SankeyFilterValue>>;
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
        name="primary_sector"
        placeholder="Sectors"
        options={sectorOptions}
        value={value.primary_sector}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
      <SelectInput<string, number>
        name="project_country"
        placeholder="Receiving Countries"
        options={countryOptions}
        value={value.project_country}
        isMulti
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );
}

export default Filters;
