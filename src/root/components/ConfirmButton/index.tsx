import React from 'react';

import Button, { Props as ButtonProps } from '#components/Button';
import useConfirmation from '#hooks/useConfirmation';


interface Props<N> extends Omit<ButtonProps<N>, 'onClick'> {
  name: N;
  heading?: React.ReactNode;
  message?: React.ReactNode;
  onConfirm?: (name: N) => void;
  onDeny?: (name: N) => void;
  onResolve?: (hasConfirmed: boolean, name: N) => void;
  confirmButtonLabel?: React.ReactNode;
  denyButtonLabel?: React.ReactNode;
}

function ConfirmButton<N> (props: Props<N>) {
  const {
    name,
    heading,
    message,
    confirmButtonLabel,
    denyButtonLabel,
    onConfirm,
    onDeny,
    onResolve,
    ...otherProps
  } = props;

  const [
    modal,
    onTriggerClick,
  ] = useConfirmation<N>({
    heading,
    message,
    onConfirm,
    onDeny,
    onResolve,
  });


  return (
    <>
      <Button
        {...otherProps}
        name={name}
        onClick={onTriggerClick}
      />
      {modal}
    </>
  );
}

export default ConfirmButton;
