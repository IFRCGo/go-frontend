import React from 'react';
import { _cs } from '@togglecorp/fujs';

import {
  AiOutlineInfoCircle,
  AiOutlineWarning,
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiOutlineQuestionCircle,
} from 'react-icons/ai';

import { AlertVariant } from '#components/AlertContext';
import ElementFragments from '#components/draft/ElementFragments';
import RawButton from '#components/draft/RawButton';

import styles from './styles.module.scss';

export interface Props<N> {
  name: N;
  className?: string;
  variant?: AlertVariant;
  children: React.ReactNode;
  nonDismissable?: boolean;
  onCloseButtonClick?: (name: N) => void;
}

const alertVariantToClassNameMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in AlertVariant]: string;
} = {
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  info: styles.info,
};

function Alert<N extends string>(props: Props<N>) {
  const {
    name,
    className,
    variant = 'info',
    children,
    onCloseButtonClick,
    nonDismissable,
  } = props;

  const icon: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [key in AlertVariant]: React.ReactNode;
  } = {
    success: <AiOutlineCheckCircle className={styles.icon} />,
    danger: <AiOutlineWarning className={styles.icon} />,
    info: <AiOutlineInfoCircle className={styles.icon} />,
    warning: <AiOutlineQuestionCircle className={styles.icon} />,
  };

  const handleCloseButtonClick = React.useCallback(() => {
    if (onCloseButtonClick) {
      onCloseButtonClick(name);
    }
  }, [onCloseButtonClick, name]);

  return (
    <div
      className={_cs(
        styles.alert,
        className,
        alertVariantToClassNameMap[variant],
      )}
    >
      <ElementFragments
        icons={icon[variant]}
        childrenContainerClassName={styles.content}
        actions={!nonDismissable && (
          <RawButton
            className={styles.closeButton}
            name={undefined}
            onClick={handleCloseButtonClick}
          >
            <AiOutlineClose className={styles.icon} />
          </RawButton>
        )}
      >
        { children }
      </ElementFragments>
    </div>
  );
}

export default Alert;

