import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';

import InputLabel from '#goui/components/InputLabel';
import InputError from '#goui/components/InputError';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  labelClassName?: string;
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
    labelClassName,
    disabled,
    error,
    icons,
    label,
    readOnly,
    input,
    errorOnTooltip = false,
    hint,
    variant = 'form',
  } = props;

  return (
    <div
      className={_cs(
        styles.inputContainer,
        !!error && styles.errored,
        disabled && styles.disabled,
        readOnly && styles.readOnly,
        variant === 'form' && styles.form,
        variant === 'general' && styles.general,
        className,
      )}
      title={(errorOnTooltip && isDefined(error) && typeof error === 'string')
        ? error
        : undefined
      }
    >
      <InputLabel
        className={labelClassName}
        disabled={disabled}
      >
        {label}
      </InputLabel>
      <div className={_cs(
        styles.inputSection,
      )}
      >
        {icons && (
          <div className={_cs(
            styles.iconContainer,
            'go-input-icon-container',
          )}
          >
            {icons}
          </div>
        )}
        <div className={styles.internalInputContainer}
        >
          {input}
        </div>
        {actions && (
          <div className={styles.actionContainer}
          >
            {actions}
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
          {error}
        </InputError>
      )}
    </div>
  );
}

export default InputContainer;
