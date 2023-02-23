import React from 'react';
import InfoPopup from '#components/InfoPopup';

import styles from './styles.module.scss';

interface Props {
  value?: string[];
  title?: React.ReactNode;
}

export function ReduceListDisplay(props: Props) {
  const {
    value,
    title,
  } = props;

  if (!value) {
    return null;
  }

  if (value.length < 4) {
    return (
      <>
        {value.join(', ')}
      </>
    );
  }

  const newList = value.slice(0, 2);

  return (
    <>
      {newList.join(', ')}
      <InfoPopup
        className={styles.reducedListLabel}
        infoLabel={`... and ${value.length - 2} more`}
        hideIcon
        title={title}
        description={value.join(', ')}
      />
    </>
  );
}

export default ReduceListDisplay;
