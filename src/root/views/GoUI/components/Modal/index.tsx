import React from 'react';
import { _cs } from '@togglecorp/fujs';
import Portal from '#goui/Portal';
import BodyOverlay from '#goui/BodyOverlay';
import Header from '#goui/Header';
import Footer from '#goui/Footer';
import Button from '#components/Button';
import { IoClose } from 'react-icons/io5';
import { FocusOn } from 'react-focus-on';
import styles from './styles.module.scss';

export type SizeType = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface Props {
  bodyClassName?: string;
  children: React.ReactNode;
  className?: string;
  footerClassName?: string;
  footerContent?: React.ReactNode;
  headerClassName?: string;
  onCloseButtonClick: () => void;
  opened: boolean;
  overlayClassName?: string;
  size?: SizeType;
  title?: React.ReactNode;
  withCloseButton?: boolean;
}

function Modal(props: Props) {
  const {
    bodyClassName,
    children,
    className,
    footerClassName,
    footerContent,
    headerClassName,
    onCloseButtonClick,
    opened,
    overlayClassName,
    size='xl',
    title,
    withCloseButton = true,
  } = props;

  const hasHeader = !!title || withCloseButton;
  const sizeStyle = styles[`size-${size}`];

  return (
    <>
      {opened && (
        <Portal>
          <BodyOverlay className={overlayClassName}>
            <FocusOn className={styles.focus}>
              <div className={_cs(styles.modal, sizeStyle, className)}>
                {hasHeader && (
                  <Header className={_cs(headerClassName, styles.modalHeader)}>
                    {title && (
                      title
                    )}
                    {withCloseButton && (
                      <Button
                        name={undefined}
                        onClick={onCloseButtonClick}
                        variant="action"
                      >
                        <IoClose />
                      </Button>
                    )}
                  </Header>
                )}
                <div className={_cs(styles.modalBody, bodyClassName)}>
                  {children}
                </div>
                <Footer className={_cs(styles.modalFooter, footerClassName)}>
                  {footerContent}
                </Footer>
              </div>
            </FocusOn>
          </BodyOverlay>
        </Portal>
      )
      }
    </>
  );
}

export default Modal;
