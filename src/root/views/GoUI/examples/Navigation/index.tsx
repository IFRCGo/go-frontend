import React from 'react';
import Header from '#components/Header';

import styles from './styles.module.scss';
import Tabs from '#views/GoUI/components/Tabs';
import Tab from '#views/GoUI/components/Tabs/Tab';
import TabList from '#views/GoUI/components/Tabs/TabList';
import TabPanel from '#views/GoUI/components/Tabs/TabPanel';

function Navigation() {
  const [activeTab, setActiveTab] = React.useState<'tab1' | 'tab2'>('tab1');
  console.log(activeTab);
  return (
    <div className={styles.navigationCollection}>
      <Header
        heading="NAVIGATION COLLECTION"
        headingSize="medium"
      />
      <div className={styles.navigationContainer}>
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="primary"
        >
          <TabList>
            <Tab name="tab1">
              Tab1
            </Tab>
            <Tab name="tab2">
              Tab2
            </Tab>
          </TabList>
          <TabPanel name="tab1">
            This is tab for Tab 1
          </TabPanel>
          <TabPanel name="tab2">
            This is tab for Tab 2
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );

}

export default Navigation;
