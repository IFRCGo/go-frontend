import React from 'react';
import Header from '#components/Header';
import Alert from '#views/GoUI/components/Alert';

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
        children={<p>This is alert for Success message</p>}
      />
      <Header
        heading="DANGER ALERT WITH ERROR MESSAGE"
        headingSize="small"
      />
      <Alert
        variant="danger"
        name="Danger"
        children={<p>This is alert for Danger message</p>}
        debugMessage="Error message"
      />
      <Header
        heading="INFO ALERT"
        headingSize="small"
      />
      <Alert
        variant="info"
        name="Info"
        children={<p>This is alert for Info message</p>}
      />
      <Header
        heading="WARNING ALERT"
        headingSize="small"
      />
      <Alert
        variant="warning"
        name="Waring"
        children={<p>This is alert for Warning message</p>}
      />
    </div>
  );
}

export default Alerts;
