'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import qs from 'qs';

import { environment } from '../config';
import { regions } from '../utils/region-constants';
import { getCountryMeta } from '../utils/get-country-meta';
import { get } from '../utils/utils';

import App from './app';
import EmergenciesTable from '../components/connected/emergencies-table';
import FieldReportsTable from '../components/connected/field-reports-table';
import AppealsTable from '../components/connected/appeals-table';
import AlertsTable from '../components/connected/alerts-table';

const displayTypes = {
  report: 'Field Reports',
  appeal: 'Operations',
  emergency: 'Emergencies',
  alert: 'Surge Alerts'
};

class Table extends React.Component {
  getQueryParams () {
    const { search } = this.props.location;
    const query = search ? qs.parse(search.slice(1, search.length)) : {};
    return query;
  }

  renderContent () {
    const { type } = this.props;
    let props = {
      limit: 50,
      exportLink: true
    };

    const query = this.getQueryParams();
    let titleArea = '';
    if (query.hasOwnProperty('region')) {
      titleArea = get(regions, [query.region.toString(), 'name']);
      props.region = titleArea ? query.region : null;
    } else if (query.hasOwnProperty('country')) {
      titleArea = getCountryMeta(query.country);
      titleArea = titleArea ? titleArea.label : null;
      props.country = titleArea ? query.country : null;
    }

    if (query.record && !isNaN(query.record)) {
      props.record = query.record;
    }

    if (query.atype && type === 'appeal' && (query.atype.toLowerCase() === 'dref' || query.atype.toLowerCase() === 'appeal')) {
      props.atype = query.atype.toLowerCase();
    }
    if (titleArea) titleArea += ' ';
    switch (this.props.type) {
      case 'emergency':
        return <EmergenciesTable title={`All ${titleArea}Emergencies`} {...props} />;
      case 'report':
        return <FieldReportsTable title={`All ${titleArea}Field Reports`} {...props} />;
      case 'appeal':
        let noun = 'Operations';
        if (props.atype) {
          noun = props.atype === 'dref' ? 'DREFs' : 'Appeals';
        }
        const title = props.hasOwnProperty('record') ? 'Operation without Emergency Page' : `All ${titleArea}${noun}`;
        return <AppealsTable title={title} {...props} />;
      case 'alert':
        return <AlertsTable title={`All Surge Alerts`} {...props} />;
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
    type: T.string,
    location: T.object
  };
}

const selector = (state) => ({
});

const dispatcher = {};

export default connect(selector, dispatcher)(Table);
