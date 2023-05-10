import React from 'react';
import Link from '#goui/components/Link';
import Heading from '#goui/components/Heading';
import Header from '#goui/components/Header';
import styles from './styles.module.scss';
import { IoChevronForward, IoOpenOutline } from 'react-icons/io5';

function Links() {
  return (
    <div className={styles.linkCollection}>
      <div className={styles.linksContainer}>
        <Header>
          VIEW LINK
        </Header>
        <Link
          to={{
            pathname: '/emergencies',
          }}
          actions={<IoChevronForward />}
        >
          Emergencies
        </Link>
      </div>
      <div className={styles.linksContainer}>
        <Header>
          TITLE LINK
        </Header>
        <Heading level={2}>
          <Link
            to="/deployments/overview"
            underline
            actions={<IoChevronForward />}
          >
            Surge
          </Link>
        </Heading>
      </div >
      <div className={styles.linksContainer}>
        <Header>
          TEXT LINK
        </Header>
        <Link
          to="/disaster-preparedness"
          underline
        >
          Preparedness
        </Link>
      </div>
      <div className={styles.linksContainer}>
        <Header>
          SECONDARY LINK
        </Header>
        <Link
          to="www.gooogle.com"
          target="_blank"
        >
          im@ifrc.org
        </Link>
      </div>
      <div className={styles.linksContainer}>
        <Header>
          EXTERNAL LINK
        </Header>
        <Link
          to="https://www.gooogle.com"
          external
          actions={<IoOpenOutline />}
        >
          Google
        </Link>
        <Link
          to="https://www.gooogle.com"
          external
          disabled
          actions={<IoOpenOutline />}
        >
          Google
        </Link>
      </div >
    </div >
  );
}

export default Links;
