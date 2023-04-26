import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import useInputState from '#hooks/useInputState';
import Container from '#components/Container';
import Page from '#components/Page';

import ImminentEvents from './ImminentEvents';
import SeasonalRisk from './SeasonalRisk';

import styles from './styles.module.scss';

type TabTypes = 'seasonal' | 'imminent';

interface Props {
  className?: string;
  pending?: boolean;
}

function GlobalRiskWatch(props: Props) {
  const {
    className,
  } = props;

  const [activeTab, setActiveTab] = useInputState<TabTypes>('seasonal');

  return (
    <Page
      title="Global Risk Watch"
      heading="Global Risk Watch"
    >
      <Container
        className={_cs(styles.regionalRiskWatch, className)}
        contentClassName={styles.content}
        hideHeaderBorder
      >
        <Tabs
          variant="secondary"
          value={activeTab}
          onChange={setActiveTab}
        >
          <TabList className={styles.tabList}>
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
    </Page>
  );
}

export default GlobalRiskWatch;
