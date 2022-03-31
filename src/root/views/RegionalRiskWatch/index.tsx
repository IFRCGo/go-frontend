import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Tabs from '#components/Tabs';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import useInputState from '#hooks/useInputState';

import ImminentEvents from './ImminentEvents';
import SeasonalRisk from './SeasonalRisk';

import styles from './styles.module.scss';

type TabTypes = 'seasonal' | 'imminent';

interface Props {
  regionId: number;
  className?: string;
  pending?: boolean;
}

function RegionalRiskWatch(props: Props) {
  const {
    className,
    regionId,
  } = props;

  const [activeTab, setActiveTab] = useInputState<TabTypes>('imminent');

  return (
    <div className={_cs(styles.regionalRiskWatch, className)}>
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
          <ImminentEvents
            regionId={regionId}
          />
        </TabPanel>
        <TabPanel name="seasonal">
          <SeasonalRisk
            regionId={regionId}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default RegionalRiskWatch;
