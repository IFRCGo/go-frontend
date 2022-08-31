import React from 'react';
import {
  PartialForm,
  useFormObject,
  getErrorObject,
  Error,
} from '@togglecorp/toggle-form';
import { _cs } from '@togglecorp/fujs';

import NumberInput from '#components/NumberInput';
import Button from '#components/Button';
import { SetValueArg } from '#utils/common';
import LanguageContext from '#root/languageContext';

import { AnnualSplit } from '#types';
import styles from './styles.module.scss';

type Value = PartialForm<AnnualSplit>;

const defaultValue: Value = {};

interface Props {
  className?: string;
  onChange: (value: SetValueArg<Value>, index: number) => void;
  error: Error<AnnualSplit> | undefined;
  index: number;
  value: Value;
  onRemove: (index: number) => void;
}

function AnnualSplitInput(props: Props) {
  const {
    className,
    index,
    onChange,
    error: errorFromProps,
    value,
    onRemove,
  } = props;

  const setFieldValue = useFormObject(index, onChange, defaultValue);
  const { strings } = React.useContext(LanguageContext);
  const error = getErrorObject(errorFromProps);

  return (
    <div className={_cs(styles.annualSplitInput, className)}>
      <NumberInput
        label={strings.threeWYear}
        name="year"
        value={value?.year}
        onChange={setFieldValue}
        error={error?.year}
      />
      <NumberInput
        label={strings.threeWBudgetAmount}
        name="budget_amount"
        value={value?.budget_amount}
        onChange={setFieldValue}
        error={error?.budget_amount}
      />
      <NumberInput
        label={strings.threeWTargetMale}
        name="target_male"
        value={value?.target_male}
        onChange={setFieldValue}
        error={error?.target_male}
      />
      <NumberInput
        label={strings.threeWTargetFemale}
        name="target_female"
        value={value?.target_female}
        onChange={setFieldValue}
        error={error?.target_female}
      />
      <NumberInput
        label={strings.threeWTargetOther}
        name="target_other"
        value={value?.target_other}
        onChange={setFieldValue}
        error={error?.target_other}
      />
      {/* Other fields can be added here similarly */}
      <Button
        className={styles.removeButton}
        name={index}
        onClick={onRemove}
        variant="secondary"
      >
        {/* FIXME: use strings */}
        Remove
      </Button>
    </div>
  );
}

export default AnnualSplitInput;
