import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

function InputSection(props) {
  const {
    className,
    title,
    children,
    description,
    tooltip,
  } = props;

  return (
    <div className={_cs(className, styles.inputSection)}>
      <div
        className={styles.sectionTitle}
        title={tooltip}
      >
        <div className={styles.title}>
          { title }
        </div>
        <div className={styles.description}>
          { description }
        </div>
      </div>
      <div className={styles.sectionContent}>
        { children }
      </div>
    </div>
  );
}

export default InputSection;
