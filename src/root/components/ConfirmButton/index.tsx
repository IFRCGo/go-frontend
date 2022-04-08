import React from 'react';

import Button, { Props as ButtonProps } from '#components/Button';
import Container from '#components/Container';
import Backdrop from '#components/backdrop';
import useBooleanState from '#hooks/useBooleanState';

import styles from './styles.module.scss';


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
    heading = 'Confirmation',
    message = 'Are you sure?',
    confirmButtonLabel = 'Yes',
    denyButtonLabel = 'No',
    onConfirm,
    onDeny,
    onResolve,
    ...otherProps
  } = props;

  const [
    showConfirmationModal,
    setShowConfirmationModalTrue,
    setShowConfirmationModalFalse,
  ] = useBooleanState(false);

  const handleConfirmButtonClick = React.useCallback(() => {
    setShowConfirmationModalFalse();
    if (onConfirm) {
      onConfirm(name);
    }

    if (onResolve) {
      onResolve(true, name);
    }
  }, [name, onConfirm, onResolve, setShowConfirmationModalFalse]);

  const handleDenyButtonClick = React.useCallback(() => {
    setShowConfirmationModalFalse();
    if (onDeny) {
      onDeny(name);
    }

    if (onResolve) {
      onResolve(true, name);
    }
  }, [name, onDeny, onResolve, setShowConfirmationModalFalse]);

  return (
    <>
      <Button
        {...otherProps}
        name={name}
        onClick={setShowConfirmationModalTrue}
      />
      {showConfirmationModal && (
        <Backdrop className={styles.confirmationModal}>
          <Container
            sub
            innerContainerClassName={styles.innerContainer}
            contentClassName={styles.content}
            heading={heading}
            headingSize="small"
            footerActions={(
              <div className={styles.actions}>
                <Button
                  name={undefined}
                  onClick={handleDenyButtonClick}
                  variant="secondary"
                >
                  {denyButtonLabel}
                </Button>
                <Button
                  name={undefined}
                  onClick={handleConfirmButtonClick}
                >
                  {confirmButtonLabel}
                </Button>
              </div>
            )}
          >
            {message}
          </Container>
        </Backdrop>
      )}
    </>
  );
}

export default ConfirmButton;
