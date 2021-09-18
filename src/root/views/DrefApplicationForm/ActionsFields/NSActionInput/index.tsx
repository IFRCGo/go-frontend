import React from 'react';
import { randomString } from '@togglecorp/fujs';
import {
  PartialForm,
  ArrayError,
  useFormObject,
} from '@togglecorp/toggle-form';
import { IoTrash } from 'react-icons/io5';

import TextArea from '#components/TextArea';
import Button from '#components/Button';
import InputSection from '#components/InputSection';
import LanguageContext from '#root/languageContext';

import {
  NsAction,
  StringValueOption,
} from '../../common';

import styles from './styles.module.scss';

type SetValueArg<T> = T | ((value: T) => T);

const defaultNsActionValue: PartialForm<NsAction> = {
  clientId: randomString(),
};

interface Props {
  value: PartialForm<NsAction>;
  error: ArrayError<NsAction> | undefined;
  onChange: (value: SetValueArg<PartialForm<NsAction>>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  nsActionOptions: StringValueOption[];
}

function NsActionInput(props: Props) {
  const { strings } = React.useContext(LanguageContext);

  const {
    error: errorFromProps,
    onChange,
    value,
    index,
    nsActionOptions,
    onRemove,
  } = props;

  const nsActionLabel = React.useMemo(() => (
    nsActionOptions.find(n => n.value === value.title)?.label
  ), [nsActionOptions, value]);

  const onFieldChange = useFormObject(index, onChange, defaultNsActionValue);
  const error = (value && value.clientId && errorFromProps)
    ? errorFromProps.members?.[value.clientId]
    : undefined;

  return (
    <InputSection
      title={nsActionLabel}
      contentSectionClassName={styles.content}
    >
      <TextArea
        name="description"
        value={value.description}
        onChange={onFieldChange}
        error={error?.fields?.description}
        placeholder={strings.drefFormMaxThreeHundredCharacters}
      />
      <Button
        className={styles.removeButton}
        name={index}
        onClick={onRemove}
        variant="action"
      >
        <IoTrash />
      </Button>
    </InputSection>
  );
}

export default NsActionInput;
