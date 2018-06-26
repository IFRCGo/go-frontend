'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getSurgeAlerts } from '../../actions';
import { get, dateOptions, datesAgo, isLoggedIn } from '../../utils/utils/';
import { nope, privateSurgeAlert, recentInterval } from '../../utils/format';

import { SFPComponent } from '../../utils/extendables';
import DisplayTable, { FilterHeader } from '../display-table';
import BlockLoading from '../block-loading';
import Fold from '../fold';
import Expandable from '../expandable';

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
        limit: isNaN(this.props.limit) ? 5 : this.props.limit,
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
    let state = this.state.alerts;
    let qs = { limit: state.limit };
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    }
    if (state.filters.date !== 'all') {
      qs.created_at__gte = datesAgo[state.filters.date]();
    } else if (this.props.showRecent) {
      qs.created_at__gte = recentInterval;
    }
    this.props._getSurgeAlerts(this.state.alerts.page, qs);
  }

  updateData (what) {
    this.requestResults();
  }

  render () {
    const {
      data,
      fetched,
      fetching,
      error
    } = this.props.surgeAlerts;

    const title = this.props.title || 'Latest Alerts';

    if (fetching || !fetched) {
      return <Fold title={title} id={this.props.id}><BlockLoading/></Fold>;
    } else if (error) {
      return <Fold title={title} id={this.props.id}><p>Surge alerts not available.</p></Fold>;
    }

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

        msg: isLoggedIn(this.props.user) ? <Expandable limit={128} text={rowData.message} /> : privateSurgeAlert,
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
      <Fold title={`${title} (${data.count})`} id={this.props.id}>
        {this.props.exportLink ? (
          <div className='fold__actions'>
            <a href={this.props.exportLink} className='button button--primary-bounded'>Export Table</a>
          </div>
        ) : null}
        <DisplayTable
          className='responsive-table alerts-table'
          headings={headings}
          rows={rows}
          pageCount={data.count / this.state.alerts.limit}
          page={this.state.alerts.page - 1}
          onPageChange={this.handlePageChange.bind(this, 'alerts')}
          noPaginate={this.props.noPaginate}
        />
        {this.props.viewAll ? (
          <div className='fold__footer'>
            <Link className='link--primary export--link' to={this.props.viewAll}>{this.props.viewAllText || 'View All Alerts'}</Link>
          </div>
        ) : null}
      </Fold>
    );
  }
}

if (environment !== 'production') {
  AlertsTable.propTypes = {
    _getSurgeAlerts: T.func,
    surgeAlerts: T.object,

    limit: T.number,

    noPaginate: T.bool,
    exportLink: T.string,
    title: T.string,

    showRecent: T.bool,
    viewAll: T.string,
    viewAllText: T.string,
    id: T.string
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  surgeAlerts: state.surgeAlerts,
  user: state.user
});

const dispatcher = (dispatch) => ({
  _getSurgeAlerts: (...args) => dispatch(getSurgeAlerts(...args))
});

export default connect(selector, dispatcher)(AlertsTable);
