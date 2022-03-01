import React from 'react';
import {
  PartialForm,
  ArrayError,
  useFormObject,
  getErrorObject,
} from '@togglecorp/toggle-form';

import {
  SetValueArg,
} from '#types';

import Checklist from '#components/Checklist';
import TextArea from '#components/TextArea';
import { listErrorToString } from '#utils/form';

import {
  Action,
  ActionOptionItem,
} from '../../common';

import styles from './styles.module.scss';

type ActionType = PartialForm<Action>;
const defaultValue: ActionType = {};

interface Props {
  value: ActionType;
  error: ArrayError<Action> | undefined;
  onChange: (value: SetValueArg<ActionType>, index: number) => void;
  onRemove: (index: number) => void;
  index: number;
  actionOptions: ActionOptionItem[];
  placeholder?: string;
}

function ActionInput(props: Props) {
  const {
    value,
    error: errorFromProps,
    onChange,
    index,
    actionOptions,
    placeholder,
  } = props;

  const onFieldChange = useFormObject(index, onChange, defaultValue);
  const error = (value && value.client_id && errorFromProps)
    ? getErrorObject(errorFromProps?.[value.client_id])
    : undefined;

  return (
    <div className={styles.actionInput}>
        <TextArea
          name="summary"
          value={value.summary}
          onChange={onFieldChange}
          error={error?.summary}
          placeholder={placeholder}
        />
        <Checklist
          name="actions"
          onChange={onFieldChange}
          options={actionOptions}
          labelSelector={d => d.name}
          keySelector={d => d.id}
          tooltipSelector={d => d.tooltip_text}
          value={value.actions}
          error={listErrorToString(error?.actions)}
        />
    </div>
  );
}

export default ActionInput;
