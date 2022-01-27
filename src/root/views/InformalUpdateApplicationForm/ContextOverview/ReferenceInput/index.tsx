import React, { useContext } from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';
import { isNotDefined } from '@togglecorp/fujs';

import { ReferenceType } from '#views/InformalUpdateApplicationForm/useInformalUpdateFormOptions';
import { ReferenceData } from '#views/InformalUpdateApplicationForm/common';
import BulletTextArea from '#components/BulletTextArea';
import languageContext from '#root/languageContext';
import DateInput from '#components/DateInput';
import TextInput from '#components/TextInput';
import Button from '#components/Button';

import styles from './styles.module.scss';

type SetValueArg<T> = T | ((value: T) => T);
const defaultFormValues: PartialForm<ReferenceData> = {};

interface Props {
  value: PartialForm<ReferenceType>;
  error: ArrayError<ReferenceType> | undefined;
  onChange: (value: SetValueArg<PartialForm<ReferenceData>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  handleAddReference: () => void;
}

function ReferenceInput(props: Props) {
  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    onRemove,
    handleAddReference
  } = props;
  const { strings } = useContext(languageContext);
  const onValueChange = useFormObject(index, onChange, defaultFormValues);
  const error = (value && value?.clientId && errorFromProps)
    ? getErrorObject(errorFromProps?.[value?.clientId])
    : undefined;

  return (
    <div className={styles.reference}>
      <div className={styles.firstRow}>
        <DateInput
          className={styles.inputDate}
          name="date"
          value={value.date}
          onChange={onValueChange}
          error={error?.date}
          label={strings.informalUpdateFormContextReferenceDateLabel}
        />
        <TextInput
          className={styles.inputName}
          name="source_description"
          value={value.source_description}
          onChange={onValueChange}
          error={error?.source_description}
          label={strings.informalUpdateFormContextReferenceNameLabel}
        />
        <div className={styles.actions}>
          {index === 0 &&
            <Button
              name={undefined}
              variant="secondary"
              onClick={handleAddReference}
            >
              {strings.informalUpdateFormContextReferenceAddButtonLabel}
            </Button>
          }
        </div>
        <div>
          {index !== 0 &&
            <Button
              className={styles.removeButton}
              name={index}
              onClick={onRemove}
              variant="action"
            >
              <IoTrash />
            </Button>
          }
        </div>
      </div>

      <div
        className={styles.secondRow}
      >
        <BulletTextArea
          className={styles.inputUrl}
          label={strings.informalUpdateFormContextReferenceUrlLabel}
          name="url"
          value={value.url}
          onChange={onValueChange}
          error={error?.url}
        />
        <div className={styles.actions}>
          <Button
            name={undefined}
            variant="secondary"
            disabled={isNotDefined(value?.source_description)}
          >
            {strings.informalUpdateFormContextReferenceUrlButtonLabel}
          </Button>
          <span>
            {isNotDefined(value.source_description) && (
              strings.informalUpdateFormContextReferenceUrlPlaceholder
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ReferenceInput;
