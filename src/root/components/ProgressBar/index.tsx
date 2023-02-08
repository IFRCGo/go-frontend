import React from 'react';

import styles from './styles.module.scss';

interface Props {
  label?: string;
  value?: number;
}

function ProgressBar(props: Props) {
  const {
    label,
    value,
  } = props;

  if (!value) {
    return (
      <div>-</div>
    );
  }

  return (
    <div className={styles.progress}>
      <div className={styles.progressLabel}>
        {label}
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressDone}
          style={{ width: `${value}%` }}>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
