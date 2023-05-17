import React from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { _cs } from '@togglecorp/fujs';

import DropdownMenu from '#components/dropdown-menu';
import Container from '#components/Container';

import styles from './styles.module.scss';

interface Props {
  icon?: React.ReactNode;
  hideIcon?: boolean;
  infoLabel?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

function InfoPopup(props: Props) {
  const {
    className,
    icon = <IoInformationCircleOutline />,
    infoLabel,
    title,
    description,
    hideIcon,
  } = props;

  return (
    <DropdownMenu
      label={(
        <>
          {infoLabel}
          {!hideIcon && icon && (
            <div className={styles.icon}>
              {icon}
            </div>
          )}
        </>
      )}
      persistant
      dropdownContainerClassName={styles.dropdownContainer}
      className={_cs(styles.infoPopup, className)}
    >
      <Container
        heading={title}
        contentClassName={styles.content}
        hideHeaderBorder
        sub
      >
        {description}
      </Container>
    </DropdownMenu>
  );
}

export default InfoPopup;
