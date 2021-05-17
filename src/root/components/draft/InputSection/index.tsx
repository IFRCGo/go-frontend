import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  description?: React.ReactNode;
  tooltip?: string;
}

function InputSection(props: Props) {
  const {
    className,
    title,
    children,
    description,
    tooltip,
  } = props;

  return (
    <div
      className={_cs(
        'go-input-section',
        className,
        styles.inputSection,
      )}
    >
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
