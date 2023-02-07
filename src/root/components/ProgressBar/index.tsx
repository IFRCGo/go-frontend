import React, { useState } from 'react';

import styles from './styles.module.scss';

interface Props {
  label?: string;
  percent?: number;
}

function ProgressBar(props: Props) {
  const {
    label,
    percent,
  } = props;

  const [width, setWidth] = useState<Number | undefined>(0);

  React.useEffect(() => {
    setTimeout(() => {
      setWidth(percent);
    }, 200);
  }, [percent]);

  if (!percent) {
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
          style={{ width: `${width}%` }}>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
