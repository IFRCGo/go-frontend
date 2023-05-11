import React from 'react';

import { _cs } from '@togglecorp/fujs';
import Spinner from '#components/spinner';

interface Props {
    className: string;
}

function BlockLoading(props: Props) {
  const { className } = props;

  return (
    <div className={_cs(className, 'block-loading')}>
      <Spinner />
    </div>
  );
}

export default BlockLoading;
