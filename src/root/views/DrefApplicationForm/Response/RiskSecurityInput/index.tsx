import React from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import Button from '#components/Button';
import LanguageContext from '#root/languageContext';
import { RiskSecurityType } from '#views/DrefApplicationForm/useDrefFormOptions';
import TextInput from '#components/TextInput';

import styles from './styles.module.scss';

type SetValueArg<T> = T | ((value: T) => T);

const defaultCountryDistrictValue: PartialForm<RiskSecurityType> = {
  clientId: 'test',
};

interface Props {
  value: PartialForm<RiskSecurityType>;
  error: ArrayError<RiskSecurityType> | undefined;
  onChange: (value: SetValueArg<PartialForm<RiskSecurityType>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
}

function RiskSecurityInput(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    onRemove,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultCountryDistrictValue);
  const error = (value && value.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.clientId])
    : undefined;

  return (
    <div className={styles.riskSecurityInput}>
      <TextInput
        label={strings.drefFormRiskSecurityRiskLabel}
        name="risk"
        value={value.risk}
        error={error?.risk}
        onChange={onFieldChange}
      />
      <TextInput
        label={strings.drefFormRiskSecurityMitigationLabel}
        name="mitigation"
        value={value.mitigation}
        error={error?.mitigation}
        onChange={onFieldChange}
      />
      <Button
        name={index}
        onClick={onRemove}
        variant="action"
      >
        <IoTrash />
      </Button>
    </div>
  );
}

export default RiskSecurityInput;
