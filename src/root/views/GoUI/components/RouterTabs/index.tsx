import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

interface Props {
  tabs: {
    title: string;
    link: string;
  }[]
  currentUrl: string;
}

interface RouterProps {
  tab: {
    title: string;
    link: string;
  }
  isActive: boolean;
}

function RouterTab(props: RouterProps) {
  const { tab, isActive } = props;
  return (
    <li className={_cs(
      styles.routerTab,
      isActive && styles.routerTabActive
    )}>
      <Link to={tab.link}>
        {tab.title}
      </Link>
    </li>
  );
}

function RouterTabs(props: Props) {
  const { tabs, currentUrl } = props;
  return (
    <div className={styles.routerTabs}>
      <ul className={styles.routerTabLists}>
        {
          tabs.map(tab => (
            <RouterTab
              tab={tab}
              isActive={currentUrl.startsWith(tab.link)}
              key={tab.link}
            />
          ))
        }
      </ul>
    </div>
  );
}

export default RouterTabs;