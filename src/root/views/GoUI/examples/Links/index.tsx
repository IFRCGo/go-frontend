import React from 'react';
import Link from '#goui/components/Link';
import Header from '#components/Header';
import Heading from '#goui/components/Heading';
import styles from './styles.module.scss';
import { IoChevronForward, IoOpenOutline } from 'react-icons/io5';

function Links() {
  return (
    <div className={styles.linkCollection}>
      <Header
        heading="LINK COLLECTION"
        headingSize="medium"
      />
      <div className={styles.linksContainer}>
        <Header
          heading="VIEW LINK"
          headingSize="ultraSmall"
        />
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
        <Header
          heading="TITLE LINK"
          headingSize="ultraSmall"
        />
        <Heading level={2}>
          <Link
            to="/deployments/overview"
            underline
            actions={<IoChevronForward />}
          >
            Surge
          </Link>
        </Heading>
      </div>
      <div className={styles.linksContainer}>
        <Header
          heading="TEXT LINK"
          headingSize="ultraSmall"
        />
        <Link
          to="/disaster-preparedness"
          underline
        >
          Preparedness
        </Link>
      </div>
      <div className={styles.linksContainer}>
        <Header
          heading="EXTERNAL LINK"
          headingSize="ultraSmall"
        />
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
      </div>
    </div >
  );
}

export default Links;
