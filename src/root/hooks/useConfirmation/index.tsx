import React from 'react';

import Button from '#components/Button';
import Container from '#components/Container';
import Backdrop from '#components/backdrop';
import useBooleanState from '#hooks/useBooleanState';

import styles from './styles.module.scss';

function removeElementsWithUndefinedValue<T extends Record<string, any>>(obj: T | undefined) {
    if (obj === undefined) {
        return obj;
    }

    const newObj = { ...obj };

    Object.keys(newObj).forEach((key) => {
        if (obj[key] === undefined) {
            delete newObj[key];
        }
    });

    return newObj;
}

export interface Options<T> {
  showConfirmationInitially?: boolean;
  onConfirm?: (context: T) => void;
  onDeny?: (context: T) => void;
  onResolve?: (hasConfirmed: boolean, context: T) => void;

  heading?: React.ReactNode;
  message?: React.ReactNode;

  denyButtonIcons?: React.ReactNode;
  denyButtonContent?: React.ReactNode;
  denyButtonActions?: React.ReactNode;
  denyButtonClassName?: string;

  confirmButtonIcons?: React.ReactNode;
  confirmButtonContent?: React.ReactNode;
  confirmButtonActions?: React.ReactNode;
  confirmButtonClassName?: string;
}

const defaultOptions = {
  message: 'Are you sure?',
  heading: 'Confirmation',
  confirmButtonContent: 'Yes',
  denyButtonContent: 'No',
};

function useConfirmation<T>(options?: Options<T>) {
  const {
    showConfirmationInitially = false,
    onConfirm,
    onDeny,
    onResolve,
    heading,
    message,
    denyButtonActions,
    denyButtonContent,
    denyButtonIcons,
    denyButtonClassName,
    confirmButtonActions,
    confirmButtonContent,
    confirmButtonIcons,
    confirmButtonClassName,
  } = {
    ...defaultOptions,
    ...removeElementsWithUndefinedValue(options),
  };

  const [context, setContext] = React.useState<T>();

  const [
    showConfirmation,
    setShowConfirmationTrue,
    setShowConfirmationFalse,
  ] = useBooleanState(showConfirmationInitially);

  const handleTriggerButtonClick = React.useCallback((newContext: T) => {
    setContext(newContext);
    setShowConfirmationTrue();
  }, [setShowConfirmationTrue, setContext]);

  const handleDenyButtonClick = React.useCallback(() => {
    setShowConfirmationFalse();
    if (onDeny) {
      onDeny(context as T);
    }

    if (onResolve) {
      onResolve(false, context as T);
    }
  }, [setShowConfirmationFalse, onDeny, onResolve, context]);

  const handleConfirmButtonClick = React.useCallback(() => {
    setShowConfirmationFalse();
    if (onConfirm) {
      onConfirm(context as T);
    }

    if (onResolve) {
      onResolve(true, context as T);
    }
  }, [setShowConfirmationFalse, onResolve, onConfirm, context]);

  const modal = React.useMemo(() => {
    if (!showConfirmation) {
      return null;
    }

    return (
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
                className={denyButtonClassName}
                icons={denyButtonIcons}
                actions={denyButtonActions}
                name={undefined}
                onClick={handleDenyButtonClick}
                variant="secondary"
              >
                {denyButtonContent}
              </Button>
              <Button
                className={confirmButtonClassName}
                icons={confirmButtonIcons}
                actions={confirmButtonActions}
                name={undefined}
                onClick={handleConfirmButtonClick}
              >
                {confirmButtonContent}
              </Button>
            </div>
          )}
        >
          {message}
        </Container>
      </Backdrop>
    );
  }, [
    showConfirmation,
    denyButtonIcons,
    denyButtonActions,
    denyButtonContent,
    confirmButtonActions,
    confirmButtonContent,
    confirmButtonIcons,
    message,
    heading,
    handleDenyButtonClick,
    handleConfirmButtonClick,
    denyButtonClassName,
    confirmButtonClassName,
  ]);

  return [
    modal,
    handleTriggerButtonClick,
  ] as const;
}

export default useConfirmation;
