import React from 'react';
import { _cs } from '@togglecorp/fujs';

import {
  sectorList,
  secondarySectorList,
} from '#utils/constants';
import { compareLabel } from '#utils/common';

import SelectInput from '#components/SelectInput';
import useReduxState from '#hooks/useReduxState';

import styles from './styles.module.scss';

const sectorOptions = sectorList.map(p => ({
  value: +p.inputValue,
  label: p.title,
})).sort(compareLabel);

const tagOptions = secondarySectorList.map(p => ({
  value: +p.inputValue,
  label: p.title,
})).sort(compareLabel);

export interface SankeyFilterValue {
  reporting_ns: number[];
  primary_sector: number[];
  secondary_sectors: number[];
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
