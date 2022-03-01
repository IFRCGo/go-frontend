import React from 'react';

import GoFileInput, { Props as GoFileInputProps } from '../GoFileInput';

type Props<T extends string> = GoFileInputProps<T, 'url'> & {
}

function DREFFileInput<T extends string>(props: Props<T>) {
  return (
    <GoFileInput
      {...props}
      url={props.multiple ? 'api/v2/dref-files/multiple/' : 'api/v2/dref-files/'}
    />
  );
}

export default DREFFileInput;
