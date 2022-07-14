import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Card from '#components/Card';
import Heading from '#components/Heading';
import { useButtonFeatures } from '#components/Button';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';

function PreparednessCard() {
  const { strings } = useContext(LanguageContext);

  const viewEapDetails = useButtonFeatures({
    variant: 'primary',
    children: 'View Eap Details',
  });

  return (
    <div className={styles.preparednessCard}>
      <Card>
        <div className={styles.eapTab}>
          <Heading>EAP-Typhoons</Heading>
          <Link
            to="/country-preparedness/new"
            {...viewEapDetails}
          />
        </div>
        <div>
          Last Updated: oct 1.2018
        </div>
        <div className={styles.eapApproveTab}>
          <div>
            <Heading>
              APPROVED
            </Heading>
            {strings.eapsFormStatus}
          </div>
          <div>
            <Heading>
              APR 2019
            </Heading>
            {strings.eapsFormDateofApproval}
          </div>
        </div>
        <div className={styles.eapTab}>
          <Heading>
            1
          </Heading>
        </div>
        <div className={styles.eapActivationTab}>
          <div>Activation</div>
          <div className={styles.link}>
            Philippines - Typhoon 022022
          </div>
        </div>
      </Card>
      <Card>
        <div className={styles.eapTab}>
          <Heading>EAP-Floods</Heading>
          <Link
            to="/country-preparedness/new"
            {...viewEapDetails}
          />
        </div>
        <div>
          Last Updated: oct 1.2018
        </div>
        <div className={styles.eapApproveTab}>
          <div>
            <Heading>
              In Process
            </Heading>
            Status
          </div>
          <div>
            <Heading>
              APR 2019
            </Heading>
            Date of Approval
          </div>
        </div>
        <div className={styles.eapTab}>
          <Heading>
            0
          </Heading>
        </div>
        <div className={styles.eapActivationTab}>
          <div>Activation</div>
        </div>
      </Card>
    </div>
  );
}

export default PreparednessCard;
