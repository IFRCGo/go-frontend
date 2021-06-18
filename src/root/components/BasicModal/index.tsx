import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { IoClose } from 'react-icons/io5';

import Backdrop from '#components/backdrop';
import Header, { Props as HeaderProps } from '#components/Header';
import Button from '#components/Button';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
  heading?: React.ReactNode;
  headingSize?: HeaderProps['headingSize'];
  headerActions?: React.ReactNode;
  onCloseButtonClick?: () => void;
  footerActions?: React.ReactNode;
  footerContent?: React.ReactNode;
  children?: React.ReactNode;
  hideCloseButton?: boolean;
}

function BasicModal(props: Props) {
  const {
    className,
    heading,
    headingSize,
    headerActions,
    onCloseButtonClick,
    footerActions,
    footerContent,
    children,
    hideCloseButton,
  } = props;

  const shouldHideHeader = hideCloseButton && !heading && !headerActions;

  return (
    <Backdrop
      className={styles.backdrop}
    >
      <div className={_cs(styles.basicModal, className)}>
        {!shouldHideHeader && (
          <Header
            className={styles.header}
            heading={heading}
            headingSize={headingSize}
            actions={(
              <>
                {headerActions}
                {!hideCloseButton && (
                  <Button
                    onClick={onCloseButtonClick}
                    variant="action"
                  >
                    <IoClose />
                  </Button>
                )}
              </>
            )}
          />
        )}
        <div className={styles.body}>
          {children}
        </div>
        {(footerContent || footerActions) && (
          <div className={styles.footer}>
            <div className={styles.footerContent}>
              {footerContent}
            </div>
            <div className={styles.footerActions}>
              {footerActions}
            </div>
          </div>
        )}
      </div>
    </Backdrop>
  );
}

export default BasicModal;
