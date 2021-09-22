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

interface Props {
  countryId: number;
  className?: string;
}

function RiskWatch(props: Props) {
  const {
    className,
    countryId,
  } = props;

  const { strings } = useContext(languageContext);
  const [activeTab, setActiveTab] = React.useState<RiskTabTypes>('imminent');

  return (
    <>
      <Container className={className}>
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
            <ImminentEvents
              countryId={countryId}
            />
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
