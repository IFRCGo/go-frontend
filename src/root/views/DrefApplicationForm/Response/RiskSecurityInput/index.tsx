import React from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';
import { randomString } from '@togglecorp/fujs';

import Button from '#components/Button';
import LanguageContext from '#root/languageContext';
import { RiskSecurityType } from '#views/DrefApplicationForm/useDrefFormOptions';
import TextArea from '#components/TextArea';

import styles from './styles.module.scss';

type SetValueArg<T> = T | ((value: T) => T);

const defaultCountryDistrictValue: PartialForm<RiskSecurityType> = {
  clientId: randomString(),
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
      <TextArea
        label={strings.drefFormRiskSecurityRiskLabel}
        name="risk"
        value={value.risk}
        error={error?.risk}
        onChange={onFieldChange}
      />
      <TextArea
        label={strings.drefFormRiskSecurityMitigationLabel}
        name="mitigation"
        value={value.mitigation}
        error={error?.mitigation}
        onChange={onFieldChange}
      />
      <Button
        className={styles.removeButton}
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
