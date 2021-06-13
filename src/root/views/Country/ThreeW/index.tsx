import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Tabs from '#components/Tabs';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import TabList from '#components/Tabs/TabList';

/*
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
 */
import { Country } from '#types';

import InCountryProjects from './InCountryProjects';
import NSProjects from './NSProjects';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  country: Country | undefined;
}

function ThreeW(props: Props) {
  const {
    className,
    country,
  } = props;

  /*
  const {
    pending: fetchingUserDetails,
    response: userDetails,
  } = useRequest<User>({
    url: 'api/v2/user/me/',
  });
   */

  const [activeTab, setActiveTab] = React.useState<'projectsIn' | 'nsProjects'>('projectsIn');

  return (
    <div className={_cs(styles.threeW, className)}>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant="secondary"
      >
        <TabList className={styles.tabList}>
          <Tab name="projectsIn">
            Projects in {country?.name}
          </Tab>
          <Tab name="nsProjects">
            {country?.society_name} projects
          </Tab>
        </TabList>
        <TabPanel name="projectsIn">
          <InCountryProjects country={country} />
        </TabPanel>
        <TabPanel name="nsProjects">
          <NSProjects country={country} />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default ThreeW;
