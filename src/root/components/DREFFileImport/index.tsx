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
          'api/v2/dref-file-upload/'
          : 'api/v2/dref-file-upload/'
      }
    />
  );
}

export default DREFFileImport;
