import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { Link } from 'react-router-dom';

function RouterTab({ tab, isActive }) {
  return (
    <li className={_cs(
      'react-tabs__tab',
      isActive && 'react-tabs__tab--selected'
    )}>
      <Link to={ tab.link }>
        { tab.title }
      </Link>
    </li>
  );
}

function RouterTabs({ tabs, currentUrl }) {
  return (
    <div className="react-tabs">
      <ul className="react-tabs__tab-list">
        {
          tabs.map(tab => (
            <RouterTab
              tab={tab}
              isActive={currentUrl.startsWith(tab.link)}
            />
          ))
        }
      </ul>
    </div>    
  );
}

export default RouterTabs;