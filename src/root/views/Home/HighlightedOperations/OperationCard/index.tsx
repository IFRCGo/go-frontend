import React from 'react';

import { Emergency } from '#types';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  data: Emergency;
}

function OperationCard(props: Props) {
  const {
    className,
    data: {
      name
    },
  } = props;

  return (
    <div className={className}>
      {name}
    </div>
  );
}

export default OperationCard;
