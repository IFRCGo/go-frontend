import React, { useContext } from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import languageContext from '#root/languageContext';
import DateInput from '#components/DateInput';
import TextInput from '#components/TextInput';
import Button from '#components/Button';
import FlashUpdateFileInput from '#components/FlashUpdateFileInput';

import { Reference } from '../../common';

import styles from './styles.module.scss';

type SetValueArg<T> = T | ((value: T) => T);
const defaultFormValues: PartialForm<Reference> = {};

interface Props {
  value: PartialForm<Reference>;
  error: ArrayError<Reference> | undefined;
  onChange: (value: SetValueArg<PartialForm<Reference>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

function ReferenceInput(props: Props) {
  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    onRemove,
    fileIdToUrlMap,
    setFileIdToUrlMap,
  } = props;

  const { strings } = useContext(languageContext);
  const onValueChange = useFormObject(index, onChange, defaultFormValues);
  const error = (value && value?.client_id && errorFromProps)
    ? getErrorObject(errorFromProps?.[value?.client_id])
    : undefined;

  return (
    <div className={styles.reference}>
      <div className={styles.firstColumn}>
        <DateInput
          className={styles.inputDate}
          name="date"
          value={value?.date}
          onChange={onValueChange}
          error={error?.date}
          label={strings.flashUpdateFormContextReferenceDateLabel}
        />
        <TextInput
          className={styles.inputName}
          name="source_description"
          value={value?.source_description}
          onChange={onValueChange}
          error={error?.source_description}
          label={strings.flashUpdateFormContextReferenceNameLabel}
        />
        <TextInput
          className={styles.inputUrl}
          label={strings.flashUpdateFormContextReferenceUrlLabel}
          name="url"
          value={value?.url}
          onChange={onValueChange}
          error={error?.url}
        />
      </div>
      <div className={styles.secondColumn}>
        <FlashUpdateFileInput
          name="document"
          value={value?.document}
          onChange={onValueChange}
          fileIdToUrlMap={fileIdToUrlMap}
          setFileIdToUrlMap={setFileIdToUrlMap}
          hideClearButton
        >
          Upload a document
        </FlashUpdateFileInput>
      </div>
      <div className={styles.actions}>
        <Button
          className={styles.removeButton}
          name={index}
          onClick={onRemove}
          variant="action"
        >
          <IoTrash />
        </Button>
      </div>
    </div>
  );
}

export default ReferenceInput;
