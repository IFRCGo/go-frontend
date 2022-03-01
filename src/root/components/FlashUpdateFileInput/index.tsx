import React from 'react';

import GoFileInput, { Props as GoFileInputProps } from '../GoFileInput';

type Props<T extends string> = GoFileInputProps<T, 'url'> & {
};

function InformalUpdateFileInput<T extends string>(props: Props<T>) {
  if (props.multiple) {
    return (
      <GoFileInput
        {...props}
        multiple
        url={'api/v2/flash-update-file/multiple/'}
        onChange={props.onChange}
      />
    );
  }

  return (
    <GoFileInput
      {...props}
      onChange={props.onChange}
      url={'api/v2/flash-update-file/'}
    />
  );
}

export default InformalUpdateFileInput;
