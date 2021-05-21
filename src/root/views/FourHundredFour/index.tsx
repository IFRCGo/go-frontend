import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from 'react-router-dom';
import {
  BiSearchAlt,
  BiDotsHorizontalRounded
} from 'react-icons/bi';

import Heading from '#components/draft/Heading';
import Description from '#components/draft/Description';
import Page from '#components/draft/Page';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import styles from './styles.module.scss';

export interface Props {
  className?: string;
}

function UhOh(props: Props) {
  const { className } = props;
  const { strings } = React.useContext(LanguageContext);

  return (
    <Page
      className={_cs(className, styles.fourHundredFour)}
      title={strings.uhohPageNotFoundTitle}
      mainSectionClassName={styles.main}
    >
      <div className={styles.topSection}>
        <Heading
          size="extraLarge"
          className={styles.heading}
        >
          <div className={styles.icons}>
            <BiSearchAlt className={styles.searchIcon} />
            <div className={styles.errorCodeContainer}>
              <div className={styles.errorCode}>
                404
              </div>
              <BiDotsHorizontalRounded className={styles.dotsIcon} />
            </div>
          </div>
          <Translate stringId='uhohPageNotFound'/>
        </Heading>
        <div className={styles.description}>
          <Translate stringId='uhohPageDescription'/>
        </div>
      </div>
      <div className={styles.bottomSection}>
        <Description className={styles.description}>
          <div className={styles.text}>
            Are you sure the URL is correct?
          </div>
          <div className={styles.text}>
            <a
              href="mailto:im@ifrc.org"
              className={styles.contactLink}
            >
              Get in touch
            </a>
            &nbsp;
            with the platform team.
          </div>
        </Description>
        <Link
          className="button button--primary-filled"
          to='/'
        >
          Explore our Homepage
        </Link>
      </div>
    </Page>
  );
}

export default UhOh;
