import React from 'react';

import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.scss';
import Spinner from '#goui/components/Spinner';

interface Props {
    className?: string;
}

function BlockLoading(props: Props) {
  const { className } = props;

  return (
    <div className={_cs(className, styles.blockLoading)}>
      <Spinner />
    </div>
  );
}

export default BlockLoading;
