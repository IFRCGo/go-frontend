import React from 'react';
import _cs from 'classnames';

import Spinner from '#components/spinner';

function BlockLoading(p) {
  const { className } = p;

  return (
    <div className={_cs(className, 'block-loading')}>
      <Spinner />
    </div>
  );
}

export default BlockLoading;
