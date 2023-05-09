import React from 'react';
import {
    IoChevronForward,
} from 'react-icons/io5';
import Header from '#components/Header';
import Button from '#goui/Button';
import styles from './styles.module.scss';

function Buttons() {
  return (
    <div className={styles.buttonCollection}>
      <Header
        heading="BUTTON COLLECTION"
        headingSize="medium"
      />
      <div className={styles.buttonsContainer}>
        <Header
          heading="Primary Button"
          headingSize="ultraSmall"
        />
        <Button
          name="primary-button"
          variant="primary"
        >
          Emergencies
        </Button>
        <Button
          name="primary-button"
          variant="primary"
          actions={<IoChevronForward />}
        >
          Countries on ifrc-go
        </Button>
        <Button
          name="primary-button"
          variant="primary"
          disabled
          actions={<IoChevronForward />}
        >
          Countries on ifrc-go
        </Button>
      </div>
      <div className={styles.buttonsContainer}>
        <Header
          heading="Secondary Button"
          headingSize="ultraSmall"
        />
        <Button
          name="secondary-button"
          variant="secondary"
        >
          Secondary
        </Button>
        <Button
          name="secondary-button"
          variant="secondary"
          actions={<IoChevronForward />}
        >
          Secondary
        </Button>
        <Button
          name="secondary-button"
          variant="secondary"
          disabled
          actions={<IoChevronForward />}
        >
          Secondary
        </Button>
      </div>
      <div className={styles.buttonsContainer}>
        <Header
          heading="Tertiary Button"
          headingSize="ultraSmall"
        />
        <Button
          name="tertiary-button"
          variant="tertiary"
        >
          Tertiary
        </Button>
        <Button
          name="tertiary-button"
          variant="tertiary"
          actions={<IoChevronForward />}
        >
          Tertiary
        </Button>
        <Button
          name="tertiary-button"
          variant="tertiary"
          disabled
          actions={<IoChevronForward />}
        >
          Tertiary
        </Button>
      </div>
    </div >
  );
}

export default Buttons;
