'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { environment, api } from '../config';

import App from './app';
import EmergenciesTable from '../components/connected/emergencies-table';
import FieldReportsTable from '../components/connected/field-reports-table';
import AppealsTable from '../components/connected/appeals-table';

const displayTypes = {
  report: 'Field Reports',
  appeal: 'Operations',
  emergency: 'Emergencies'
};

class Table extends React.Component {
  getExportLink () {
    let route = api;
    switch (this.props.type) {
      case 'emergency':
        route += 'api/v2/event/?limit=100';
        break;
      case 'report':
        route += 'api/v2/field_report/?limit=100';
        break;
      case 'appeal':
        route += 'api/v2/appeal/?limit=100';
        break;
    }
    return route;
  }

  renderContent () {
    switch (this.props.type) {
      case 'emergency':
        return <EmergenciesTable title='All Emergencies' limit={50} exportLink={this.getExportLink()}/>;
      case 'report':
        return <FieldReportsTable title='All Field Reports' limit={50} exportLink={this.getExportLink()}/>;
      case 'appeal':
        return <AppealsTable title='All Operations' limit={50} exportLink={this.getExportLink()}/>;
    }
  }

  render () {
    return (
      <App>
        <Helmet>
          <title>IFRC Go - {displayTypes[this.props.type]}</title>
        </Helmet>
        <div className='inpage__body'>
          <div className='inner table__container'>
            {this.renderContent()}
          </div>
        </div>
      </App>
    );
  }
}

if (environment !== 'production') {
  Table.propTypes = {
    type: T.string
  };
}

const selector = (state) => ({
});

const dispatcher = {};

export default connect(selector, dispatcher)(Table);
