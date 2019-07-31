'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';


import { Tabs, TabList as ReactTabList, Tab, TabPanel } from 'react-tabs';


function TabList({ tablist, ..rest }) => {
    return (
        <ReactTabList  {...rest}>
            {
                tablist.map(tab => (
                    <Tab key={tab.title}>{tab.title}</Tab>
                ))
            }
        </ReactTabList>
    )

}

export { Tabs, TabList, Tab, TabPanel }

if (environment !== 'production') {
    Tab.propTypes = {
        tablist: T.array
    };
}

