import React from 'react';
import Pager from '#goui/components/Pager';

import styles from './styles.module.scss';
import Heading from '#views/GoUI/components/Heading';

function PagerExample() {
  const [activePage, setActivePage] = React.useState(1);
  return (
    <div className={styles.pager}>
      <Heading>
        Pager
      </Heading>
      <Heading level={3}>
        Active
      </Heading>
      <Pager
        activePage={activePage}
        onActivePageChange={setActivePage}
        itemsCount={48}
        maxItemsPerPage={6}
      />
      <Heading level={3}>
        Disabled
      </Heading>
      <Pager
        activePage={activePage}
        onActivePageChange={setActivePage}
        itemsCount={48}
        maxItemsPerPage={6}
        disabled
      />
    </div>
  );
}

export default PagerExample;
