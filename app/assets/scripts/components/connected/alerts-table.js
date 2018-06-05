'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getSurgeAlerts } from '../../actions';
import { get, dateOptions, datesAgo } from '../../utils/utils/';
import { nope } from '../../utils/format';

import { SFPComponent } from '../../utils/extendables';
import DisplayTable, { FilterHeader } from '../display-table';
import BlockLoading from '../block-loading';
import Fold from '../fold';

const alertTypes = {
  0: 'FACT',
  1: 'SIMS',
  2: 'ERU',
  3: 'DHEOps',
  4: 'HEOps',
  5: 'SURGE'
};

const alertCategories = {
  0: 'Info',
  1: 'Deployment',
  2: 'Alert',
  3: 'Shelter',
  4: 'Stand down'
};

class AlertsTable extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor (props) {
    super(props);
    this.state = {
      alerts: {
        page: 1,
        limit: 5,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          date: 'all'
        }
      }
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount () {
    this.requestResults();
  }

  requestResults () {
    let qs = { limit: this.state.alerts.limit };
    let state = this.state.alerts;
    if (state.sort.field) {
      qs.order_by = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    }

    if (state.filters.date !== 'all') {
      qs.created_at__gte = datesAgo[state.filters.date]();
    }

    this.props._getSurgeAlerts(this.state.alerts.page, qs);
  }

  updateData (what) {
    this.requestResults();
  }

  renderLoading () {
    if (this.props.surgeAlerts.fetching) {
      return <BlockLoading/>;
    }
  }

  renderError () {
    if (this.props.surgeAlerts.error) {
      return <p>Surge alerts not available.</p>;
    }
  }

  renderContent () {
    const {
      data,
      fetched,
      fetching,
      error
    } = this.props.surgeAlerts;

    if (!fetched || fetching || error) { return null; }

    const headings = [
      {
        id: 'date',
        label: <FilterHeader id='date' title='Date' options={dateOptions} filter={this.state.alerts.filters.date} onSelect={this.handleFilterChange.bind(this, 'alerts', 'date')} />
      },
      { id: 'category', label: 'Alert Type' },
      { id: 'emergency', label: 'Emergency' },
      { id: 'msg', label: 'Alert Message' },
      { id: 'type', label: 'Type' }
    ];

    const rows = data.results.reduce((acc, rowData, idx, all) => {
      const isLast = idx === all.length - 1;
      const date = DateTime.fromISO(rowData.created_at);
      const event = get(rowData, 'event.id');
      acc.push({
        id: rowData.id,
        date: date.toISODate(),
        emergency: event ? <Link className='link--primary' to={`/emergencies/${event}`} title='View Emergency page'>{rowData.operation}</Link> : rowData.operation || nope,

        msg: rowData.message,
        type: alertTypes[rowData.atype],
        category: alertCategories[rowData.category]
      });

      if (!isLast) {
        acc.push({
          rowOverride: <tr role='presentation' key={`${rowData.id}-empty`}><td colSpan='4'></td></tr>
        });
      }

      return acc;
    }, []);

    return (
      <DisplayTable
        className='responsive-table alerts-table'
        headings={headings}
        rows={rows}
        pageCount={data.count / this.state.alerts.limit}
        page={this.state.alerts.page}
        onPageChange={this.handlePageChange.bind(this, 'alerts')}
      />
    );
  }

  render () {
    return (
      <Fold title='Latest Alerts'>
        {this.renderLoading()}
        {this.renderError()}
        {this.renderContent()}
      </Fold>
    );
  }
}

if (environment !== 'production') {
  AlertsTable.propTypes = {
    _getSurgeAlerts: T.func,
    surgeAlerts: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  surgeAlerts: state.surgeAlerts
});

const dispatcher = (dispatch) => ({
  _getSurgeAlerts: (...args) => dispatch(getSurgeAlerts(...args))
});

export default connect(selector, dispatcher)(AlertsTable);
