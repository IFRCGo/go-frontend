import React from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

import DropdownMenu from '#components/dropdown-menu';
import Container from '#components/Container';

import styles from './styles.module.scss';

interface Props {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

function InfoPopup(props: Props) {
  const {
    title,
    description,
  } = props;

  return (
    <DropdownMenu
      label={<IoInformationCircleOutline />}
      persistant
      dropdownContainerClassName={styles.dropdownContainer}
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
