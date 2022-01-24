import React from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import { compareString } from '#utils/utils';
import SelectInput from '#components/SelectInput';
import Button from '#components/Button';
import { DistrictMini } from '#types';
import LanguageContext from '#root/languageContext';
import { CountryDistrictType } from '#views/InformalUpdateApplicationForm/useInformalUpdateFormOptions';
import { emptyNumericOptionList, NumericValueOption } from '#views/InformalUpdateApplicationForm/common';

import styles from './styles.module.scss';

type SetValueArg<T> = T | ((value: T) => T);

const defaultCountryDistrictValue: PartialForm<CountryDistrictType> = {};
interface Props {
  fetchingCountries?: boolean;
  value: PartialForm<CountryDistrictType>;
  error: ArrayError<CountryDistrictType> | undefined;
  onChange: (value: SetValueArg<PartialForm<CountryDistrictType>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  countryOptions: NumericValueOption[];
}

function CountryProvinceInput(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    fetchingCountries,
    error: errorFromProps,
    onChange,
    countryOptions,
    value,
    index,
    onRemove,
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
  const error = (value && value.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.clientId])
    : undefined;

  return (
    <div className={styles.countryDistrictInput}>
      <SelectInput
        label={strings.informalUpdateFormContextCountryLabel}
        pending={fetchingCountries}
        error={error?.country}
        name="country"
        onChange={onFieldChange}
        options={countryOptions}
        value={value.country}
      />
      <SelectInput
        label={strings.informalUpdateFormContextProvinceLabel}
        pending={fetchingDistricts}
        error={error?.district}
        name="district"
        onChange={onFieldChange}
        options={districtOptions}
        value={value.district}
      />

      <Button
        className={styles.removeButton}
        name={index}
        onClick={onRemove}
        variant="action"
        disabled={index === 0}
      >
        <IoTrash />
      </Button>

    </div>
  );
}

export default CountryProvinceInput;
