import React from 'react';

import Checkbox, { Props as CheckboxProps } from '#goui/components/Checkbox';
import SwitchIcon from './SwitchIcon';

import styles from './styles.module.scss';

export interface SwitchProps<N extends string> extends Omit<CheckboxProps<N>, 'indeterminate' | 'checkmark'> {
}

function Switch<N extends string>(props: SwitchProps<N>) {
  return (
    <Checkbox
      {...props}
      checkmarkContainerClassName={styles.container}
      checkmark={SwitchIcon}
    />
  );
}

export default Switch;
