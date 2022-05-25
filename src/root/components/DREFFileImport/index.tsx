import React from 'react';

import GoFileInput, { Props as GoFileInputProps } from '../GoFileInput';

type Props<T extends string> = GoFileInputProps<T, 'url'> & {
}

function DREFFileImport<T extends string>(props: Props<T>) {
  return (
    <GoFileInput
      {...props}
      url={
        props?.multiple ?
          'TODO:'
          : 'TODO:'
      }
    />
  );
}

export default DREFFileImport;
