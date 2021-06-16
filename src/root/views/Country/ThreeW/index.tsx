import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';

import Button from '#components/Button';
import Tabs from '#components/Tabs';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import TabList from '#components/Tabs/TabList';

import {
  Country,
  User,
} from '#types';
import useReduxState, { ReduxResponse } from '#hooks/useReduxState';

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

  const { data: userDetails } = useReduxState('me') as ReduxResponse<User>;
  const [activeTab, setActiveTab] = React.useState<'projectsIn' | 'nsProjects'>('projectsIn');

  return (
    <div className={_cs(styles.threeW, className)}>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant="secondary"
      >
        { isDefined(userDetails?.id) && (
          <div className={styles.headerActions}>
            <Button disabled>
              Add 3W Activity
            </Button>
          </div>
        )}
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
