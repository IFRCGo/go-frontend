import React from 'react';
import Header from '#components/Header';
import Alert from '#goui/components/Alert';

import styles from './styles.module.scss';

function Alerts() {
  return (
    <div className={styles.alertCollection}>
      <Header
        heading="ALERTS COLLECTION"
        headingSize="medium"
      />
      <Header
        heading="SUCCESS ALERT"
        headingSize="small"
      />
      <Alert
        variant="success"
        name="Success"
        children="This is alert for Success message"
      />
      <Header
        heading="DANGER ALERT WITH ERROR MESSAGE"
        headingSize="small"
      />
      <Alert
        variant="danger"
        name="Danger"
        children="This is alert for Danger message"
        debugMessage="Error message"
      />
      <Header
        heading="INFO ALERT"
        headingSize="small"
      />
      <Alert
        variant="info"
        name="Info"
        children="This is alert for Info message"
      />
      <Header
        heading="WARNING ALERT"
        headingSize="small"
      />
      <Alert
        variant="warning"
        name="Waring"
        children="This is alert for Warning message"
      />
    </div>
  );
}

export default Alerts;
