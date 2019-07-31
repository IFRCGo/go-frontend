'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';
import {
    Tabs,
    TabList as ReachTabList,
    Tab,
    TabPanels,
    TabPanel as ReachTabPanel
} from "@reach/tabs";
import ErrorPanel from './error-panel';


function TabList({ tablist, ...rest }) {
    return (
        <ReachTabList {...rest} >
            {
                tablist.map(tab => (
                    <Tab key={tab.title}>{tab.title}</Tab>
                ))
            }
        </ReachTabList>
    )

}

function TabPanel({ isError, errorMessage, title, children, ...rest }) {
    console.log('isError', isError)
    console.log('children', children)
    return (
        <ReachTabPanel {...rest}>
            {isError ? (
                <ErrorPanel title={title} errorMessage={errorMessage} />
            ) : (
                    children
                )}
        </ReachTabPanel>
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
    // TabPanel.propTypes = {
    //     isError: T.boolean,
    //     errorMessage: T.string,
    //     children: T.object,
    //     rest: T.object
    // };
}


export { Tabs, Tab, TabList, TabPanels, TabPanel };



