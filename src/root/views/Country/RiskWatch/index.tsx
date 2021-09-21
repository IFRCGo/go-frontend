import React, { useContext } from 'react';

import Container from '#components/Container';
import Tab from '#components/Tabs/Tab';
import TabList from '#components/Tabs/TabList';
import TabPanel from '#components/Tabs/TabPanel';
import Tabs from '#components/Tabs';
import languageContext from '#root/languageContext';

import ImminentEvents from './ImminentEvents';
import SeasonalRisk from './SeasonalRisk';

type RiskTabTypes = 'seasonal' | 'imminent';

function RiskWatch() {
  const [activeTab, setActiveTab] = React.useState<RiskTabTypes>('imminent');

  return (
    <>
      <Container>
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="secondary"
        >
          <TabList>
            <Tab name="imminent">
              Imminent
            </Tab>
            <Tab name="seasonal">
              Seasonal
            </Tab>
          </TabList>
          <TabPanel name="imminent">
            <ImminentEvents />
          </TabPanel>
          <TabPanel name="seasonal">
            <SeasonalRisk />
          </TabPanel>
        </Tabs>
      </Container>
    </>
  );
}

export default RiskWatch;
