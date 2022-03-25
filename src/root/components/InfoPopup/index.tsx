import React from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

import DropdownMenu from '#components/dropdown-menu';
import Container from '#components/Container';

import styles from './styles.module.scss';

interface Props {
  infoLabel?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

function InfoPopup(props: Props) {
  const {
    className,
    infoLabel = <IoInformationCircleOutline />,
    title,
    description,
  } = props;

  return (
    <DropdownMenu
      label={infoLabel}
      persistant
      dropdownContainerClassName={styles.dropdownContainer}
      className={className}
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
