import React from 'react';
import { _cs } from '@togglecorp/fujs';

import InputLabel from '#components/draft/InputLabel';
import InputError from '#components/draft/InputError';

import styles from './styles.module.scss';

function InputContainer(props) {
  const {
    actions,
    className,
    disabled,
    error,
    icons,
    label,
    readOnly,
    input,
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
      )}
    >
      <InputLabel>
        { label }
      </InputLabel>
      <div
        className={_cs(
          'go-input-section',
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
          { input}
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
      <InputError>
        { error }
      </InputError>
    </div>
  );
}

export default InputContainer;
