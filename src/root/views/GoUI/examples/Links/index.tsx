import React from 'react';
import Link from '#goui/components/Link';
import Header from '#components/Header';
import styles from './styles.module.scss';

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
          target="_blank"
          variant="regular"
        >
          Emergencies
        </Link>
      </div>
      <div className={styles.linksContainer}>
        <Header
          heading="TITLE LINK"
          headingSize="ultraSmall"
        />
        <Link
          to="/deployments/overview"
          target="_blank"
          variant="title"
        >
          Surge
        </Link>
      </div>
      <div className={styles.linksContainer}>
        <Header
          heading="TEXT LINK"
          headingSize="ultraSmall"
        />
        <Link
          to="/disaster-preparedness"
          target="_blank"
          variant="text"
        >
          Preparedness
        </Link>
      </div>
      <div className={styles.linksContainer}>
        <Header
          heading="SECONDARY LINK"
          headingSize="ultraSmall"
        />
        <Link
          to="www.gooogle.com"
          target="_blank"
          variant="secondary"
        >
          im@ifrc.org
        </Link>
      </div>
      <div className={styles.linksContainer}>
        <Header
          heading="EXTERNAL LINK"
          headingSize="ultraSmall"
        />
        <Link
          to="www.gooogle.com"
          target="_blank"
          variant="external"
        >
          Google
        </Link>
      </div>
    </div >
  );
}

export default Links;
