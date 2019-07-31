'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';


import { Tabs, TabList, Tab as ReactTab, TabPanel } from 'react-tabs';


function Tabs = ({ tablist }) => {

}

export { Tabs, TabList, Tab, TabPanel }

if (environment !== 'production') {
    Tab.propTypes = {
        tablist: T.array
    };
}