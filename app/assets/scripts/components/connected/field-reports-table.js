'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getFieldReportsList } from '../../actions';
import { nope, commaSeparatedNumber as n } from '../../utils/format';
import { get, dTypeOptions, dateOptions, datesAgo } from '../../utils/utils';
import { getDtypeMeta } from '../../utils/get-dtype-meta';

import Fold from '../fold';
import BlockLoading from '../block-loading';
import DisplayTable, { FilterHeader } from '../display-table';
import { SFPComponent } from '../../utils/extendables';

class FieldReportsTable extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor (props) {
    super(props);
    this.state = {
      fieldReports: {
        page: 1,
        limit: isNaN(props.limit) ? 10 : props.limit,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          date: 'all',
          dtype: 'all'
        }
      }
    };
  }

  componentDidMount () {
    this.requestResults();
  }

  requestResults () {
    let state = this.state.fieldReports;
    let qs = { limit: state.limit };
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-created_at';
    }

    if (state.filters.date !== 'all') {
      qs.disaster_start_date__gte = datesAgo[state.filters.date]();
    }

    if (state.filters.dtype !== 'all') {
      qs.dtype = state.filters.dtype;
    }

    this.props._getFieldReportsList(this.state.fieldReports.page, qs);
  }

  updateData (what) {
    this.requestResults();
  }

  render () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.list;
    const title = this.props.title || 'Field Reports';

    if (fetching) {
      return (
        <Fold title={this.props.title}>
          <BlockLoading/>
        </Fold>
      );
    }

    const results = get(data, 'results', []);
    if (error || (fetched && !results.length)) {
      return (
        <Fold title={this.props.title}>
          <p>You must be logged in to view field reports. <Link key='login' to={{pathname: '/login', state: {from: this.props.location}}} className='link--primary' title='Login'>Login</Link></p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Created At' options={dateOptions} filter={this.state.fieldReports.filters.date} onSelect={this.handleFilterChange.bind(this, 'fieldReports', 'date')} />
        },
        { id: 'name', label: 'Name' },
        { id: 'event', label: 'Emergency' },
        {
          id: 'dtype',
          label: <FilterHeader id='dtype' title='Disaster Type' options={dTypeOptions} filter={this.state.fieldReports.filters.dtype} onSelect={this.handleFilterChange.bind(this, 'fieldReports', 'dtype')} />
        },
        { id: 'countries', label: 'Countries' }
      ];

      const rows = results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.created_at).toISODate(),
        name: <Link to={`/reports/${o.id}`} className='link--primary' title='View Field Report'>{o.summary || nope}</Link>,
        event: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : nope,
        dtype: get(getDtypeMeta(o.dtype), 'label', nope),
        countries: <ul>{o.countries.map(country => <li key={country.id}><Link to={`/countries/${country.id}`} className='link--primary' title='View Country'>{country.name}</Link></li>)}</ul>
      }));

      return (
        <Fold title={`${title} (${n(data.count)})`}>
          {this.props.exportLink ? (
            <div className='fold__actions'>
              <a href={this.props.exportLink} className='button button--primary-bounded'>Export Table</a>
            </div>
          ) : null}
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.fieldReports.limit}
            page={this.state.fieldReports.page}
            onPageChange={this.handlePageChange.bind(this, 'fieldReports')}
          />
        </Fold>
      );
    }

    return null;
  }
}

if (environment !== 'production') {
  FieldReportsTable.propTypes = {
    _getFieldReportsList: T.func,
    list: T.object,
    limit: T.number,
    exportLink: T.string,
    title: T.string
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  list: state.fieldReports
});

const dispatcher = (dispatch) => ({
  _getFieldReportsList: (...args) => dispatch(getFieldReportsList(...args))
});

export default withRouter(connect(selector, dispatcher)(FieldReportsTable));
