import React from 'react';
import {
  PartialForm,
  Error,
  useFormObject,
} from '@togglecorp/toggle-form';

import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import { compareString } from '#utils/utils';
import SelectInput from '#components/SelectInput';
import { DistrictMini } from '#types';
import { CountryDistrictType } from '../../useDrefFormOptions';
import {
  NumericValueOption,
  emptyNumericOptionList,
} from '../../common';

import styles from './styles.module.scss';

type SetValueArg<T> = T | ((value: T) => T);

interface Props {
  fetchingCountries?: boolean;
  value: PartialForm<CountryDistrictType>;
  error: Error<CountryDistrictType> | undefined;
  onChange: (value: SetValueArg<PartialForm<CountryDistrictType>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  countryOptions: NumericValueOption[];
}

const defaultCountryDistrictValue: PartialForm<CountryDistrictType> = {
  clientId: 'test',
};

function CountryDistrictInput(props: Props) {
  const {
    fetchingCountries,
    error,
    onChange,
    countryOptions,
    value,
    index,
  } = props;

  const countryQuery = React.useMemo(() => ({
    country: value.country,
    limit: 500,
  }), [value.country]);

  const {
    pending: fetchingDistricts,
    response: districtsResponse,
  } = useRequest<ListResponse<DistrictMini>>({
    skip: !value.country,
    url: 'api/v2/district/',
    query: countryQuery,
  });

  const districtOptions = React.useMemo(() => (
    districtsResponse?.results?.map(d => ({
      value: d.id,
      label: d.name,
    })).sort(compareString) ?? emptyNumericOptionList
  ), [districtsResponse]);

  const onFieldChange = useFormObject(index, onChange, defaultCountryDistrictValue);

  return (
    <div className={styles.countryDistrictInput}>
      <SelectInput
        label="Country"
        pending={fetchingCountries}
        error={error?.fields?.country}
        name="country"
        onChange={onFieldChange}
        options={countryOptions}
        value={value.country}
      />
      <SelectInput
        label="Regions"
        pending={fetchingDistricts}
        isMulti={true}
        error={error?.fields?.district}
        name="district"
        onChange={onFieldChange}
        options={districtOptions}
        value={value.district}
      />
    </div>
  );
}

export default CountryDistrictInput;
