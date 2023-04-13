import React from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import { SetValueArg } from '#utils/common';

import Button from '#components/Button';
import NumberInput from '#components/NumberInput';
import TextInput from '#components/TextInput';

import styles from './styles.module.scss';

function CustomSupplyInput() {

  return (
    <div className={styles.customSupplyInput}>
      <TextInput
        className={styles.item}
        name={"item" as const}
        label="Item"
        value={undefined}
        onChange={undefined}
        error={undefined}
      />
      <NumberInput
        className={styles.count}
        name="count"
        label="Count"
        value={undefined}
        onChange={undefined}
        error={undefined}
      />
      <Button
        className={styles.removeButton}
        name="select"
        onClick={undefined}
        variant="action"
      >
        <IoTrash />
      </Button>
    </div>
  );
}

export default CustomSupplyInput;
