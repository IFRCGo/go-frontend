'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';
import {
    Tabs,
    TabList as ReactTabList,
    Tab,
    TabPanel as ReactTabPanel
} from 'react-tabs';
import ErrorPanel from './error-panel';


function TabList({ tablist, ...rest }) {
    return (
        <ReactTabList {...rest} >
            {
                tablist.map(tab => (
                    <Tab key={tab.title}>{tab.title}</Tab>
                ))
            }
        </ReactTabList>
    )

}

function TabPanel({ isError, errorMessage, title, children, ...rest }) {
    return (
        <ReactTabPanel {...rest}>
            {isError ? (
                <ErrorPanel title="Overview" errorMessage="Overview coming soon" />
            ) : (
                    children
                )}
        </ReactTabPanel>
    );
}

TabPanel.defaultProps = {
    isError: false,
    errorMessage: "coming soon",
    title: "Error"
};

if (environment !== "production") {
    TabList.propTypes = {
        tablist: T.array,
        rest: T.object
    };
    Tabs.propTypes = {
        isError: T.boolean,
        errorMessage: T.string,
        children: T.object,
        rest: T.object
    };
}

export { Tabs, TabList, Tab, TabPanel }



