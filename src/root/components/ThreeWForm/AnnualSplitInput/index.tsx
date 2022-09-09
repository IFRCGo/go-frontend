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
import { IoTrash } from 'react-icons/io5';

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
    onChange,
    error: errorFromProps,
    index,
    value,
    onRemove,
  } = props;

  const setFieldValue = useFormObject(index, onChange, defaultValue);
  const { strings } = React.useContext(LanguageContext);
  const error = getErrorObject(errorFromProps);

  return (
    <div className={_cs(styles.annualSplitInput, className)}>
      <input type="hidden" name="id" value={value?.id} />
      <span className={styles.bold}>
      <NumberInput
        label={strings.threeWYear}
        name="year"
        value={value?.year}
        onChange={setFieldValue}
        error={error?.year}
      />
      </span>
      <NumberInput
        label={strings.threeWBudgetAmount}
        name="budget_amount"
        value={value?.budget_amount}
        onChange={setFieldValue}
        error={error?.budget_amount}
      />
      <Button
        className={styles.removeButton}
        name={index}
        onClick={onRemove}
        variant="secondary"
      >
        <IoTrash/>
      </Button>
      <div className="break"></div>
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
      <span className={styles.bold}>
      <NumberInput
        label={strings.threeWTargetTotal}
        name="target_total"
        value={value?.target_total}
        onChange={setFieldValue}
        error={error?.target_total}
      />
      </span>
      <NumberInput
        label={strings.threeWReachedMale}
        name="reached_male"
        value={value?.reached_male}
        onChange={setFieldValue}
        error={error?.reached_male}
      />
      <NumberInput
        label={strings.threeWReachedFemale}
        name="reached_female"
        value={value?.reached_female}
        onChange={setFieldValue}
        error={error?.reached_female}
      />
      <NumberInput
        label={strings.threeWReachedOther}
        name="reached_other"
        value={value?.reached_other}
        onChange={setFieldValue}
        error={error?.reached_other}
      />
      <span className={styles.bold}>
      <NumberInput
        label={strings.threeWReachedTotal}
        name="reached_total"
        value={value?.reached_total}
        onChange={setFieldValue}
        error={error?.reached_total}
      />
      </span>
    </div>
  );
}

export default AnnualSplitInput;
