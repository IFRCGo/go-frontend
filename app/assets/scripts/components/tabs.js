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
    console.log('rest', ...rest)
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
    console.log('isError', isError)
    console.log('children', children)
    return (
        <ReactTabPanel {...rest}>
            {isError ? (
                <ErrorPanel title={title} errorMessage={errorMessage} />
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
    TabPanel.propTypes = {
        isError: T.boolean,
        errorMessage: T.string,
        children: T.object,
        rest: T.object
    };
}


export { Tabs, Tab, TabList, TabPanel };



