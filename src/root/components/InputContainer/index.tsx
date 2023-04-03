import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';

import InputLabel from '#components/InputLabel';
import InputError from '#components/InputError';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  actions?: React.ReactNode;
  disabled?: boolean;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  icons?: React.ReactNode;
  label?: React.ReactNode;
  readOnly?: boolean;
  input: React.ReactNode;
  errorOnTooltip?: boolean;
  variant?: 'form' | 'general';
}

function InputContainer(props: Props) {
  const {
    actions,
    className,
    disabled,
    error,
    icons,
    label,
    readOnly,
    input,
    errorOnTooltip = false,
    hint,
    variant='form',
  } = props;

  return (
    <div
      className={_cs(
        'go-input-container',
        styles.inputContainer,
        className,
        !!error && styles.errored,
        disabled && styles.disabled,
        readOnly && styles.readOnly,
        variant === 'form' && styles.form,
        variant === 'general' && styles.general,
      )}
      title={(errorOnTooltip && isDefined(error) && typeof error === 'string') ? error : undefined}
    >
      <InputLabel disabled={disabled}>
        { label } 
      </InputLabel>
      <div
        className={_cs(
          'go-input-internal-input-section',
          styles.inputSection,
        )}
      >
        {icons && (
          <div
            className={_cs(
              styles.iconContainer,
              'go-input-icon-container',
            )}
          >
            { icons }
          </div>
        )}
        <div
          className={_cs(
            styles.internalInputContainer,
            'go-internal-input-container',
          )}
        >
          { input }
        </div>
        {actions && (
          <div
            className={_cs(
              styles.actionContainer,
              'go-input-action-container',
            )}
          >
            { actions }
          </div>
        )}
      </div>
      {hint && (
        <div className={styles.inputHint}>
          {hint}
        </div>
      )}
      {!errorOnTooltip && (
        <InputError
          disabled={disabled}
          className={styles.inputError}
        >
          { error }
        </InputError>
      )}
    </div>
  );
}

export default InputContainer;
