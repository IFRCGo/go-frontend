import React, { useContext } from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import Tab from '#components/Tabs/Tab';
import TabList from '#components/Tabs/TabList';
import TabPanel from '#components/Tabs/TabPanel';
import Tabs from '#components/Tabs';
import languageContext from '#root/languageContext';

import ImminentEvents from './ImminentEvents';
import SeasonalRisk from './SeasonalRisk';

import styles from './styles.module.scss';

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
      <Container className={_cs(styles.riskWatch, className)}>
        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          variant="secondary"
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
              countryId={countryId}
            />
          </TabPanel>
          <TabPanel name="seasonal">
            <SeasonalRisk
              countryId={countryId}
            />
          </TabPanel>
        </Tabs>
      </Container>
    </>
  );
}

export default RiskWatch;
