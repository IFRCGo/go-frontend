import React from 'react';

import GoFileInput, { Props as GoFileInputProps } from '../GoFileInput';

type Props<T extends string> = GoFileInputProps<T, 'url'> & {
}

function PerFileInput<T extends string>(props: Props<T>) {
  return (
    <GoFileInput
      {...props}
      url='api/v2/new-per/'
    />
  );
}

export default PerFileInput;
