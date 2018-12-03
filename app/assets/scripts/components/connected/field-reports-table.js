'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getFieldReportsList } from '../../actions';
import {
  recentInterval,
  nope,
  commaSeparatedNumber as n,
  intersperse
} from '../../utils/format';
import { get, dTypeOptions, dateOptions, datesAgo } from '../../utils/utils';
import { getDtypeMeta } from '../../utils/get-dtype-meta';

import ExportButton from '../export-button';
import Fold from '../fold';
import BlockLoading from '../block-loading';
import DisplayTable, { FilterHeader, SortHeader } from '../display-table';
import { SFPComponent } from '../../utils/extendables';

class FieldReportsTable extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor (props) {
    super(props);
    this.state = {
      table: {
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
    this.requestResults(this.props);
  }

  componentWillReceiveProps (newProps) {
    let shouldMakeNewRequest = false;
    ['limit', 'country', 'region'].forEach(prop => {
      if (newProps[prop] !== this.props[prop]) {
        shouldMakeNewRequest = true;
      }
    });
    if (shouldMakeNewRequest) {
      this.requestResults(newProps);
    }
  }

  requestResults (props) {
    props._getFieldReportsList(this.state.table.page, this.getQs(props));
  }

  getQs (props) {
    let state = this.state.table;
    let qs = { limit: state.limit };
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-created_at';
    }

    if (state.filters.date !== 'all') {
      qs.created_at__gte = datesAgo[state.filters.date]();
    } else if (props.showRecent) {
      qs.created_at__gte = recentInterval;
    }

    if (state.filters.dtype !== 'all') {
      qs.dtype = state.filters.dtype;
    }

    if (!isNaN(props.country)) {
      qs.countries__in = props.country;
    } else if (!isNaN(props.region)) {
      qs.regions__in = props.region;
    }
    return qs;
  }

  updateData (what) {
    this.requestResults(this.props);
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
        <Fold title={this.props.title} id={this.props.id}>
          <BlockLoading/>
        </Fold>
      );
    }

    const results = get(data, 'results', []);
    if (error || (fetched && !results.length && !this.props.isAuthenticated)) {
      return (
        <Fold title={this.props.title} id={this.props.id}>
          <p>You must be logged in to view field reports. <Link key='login' to={{pathname: '/login', state: {from: this.props.location}}} className='link--primary' title='Login'>Login</Link></p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Created At' options={dateOptions} filter={this.state.table.filters.date} onSelect={this.handleFilterChange.bind(this, 'table', 'date')} />
        },
        {
          id: 'name',
          label: <SortHeader id='name' title='Name' sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'summary')} />
        },
        { id: 'event', label: 'Emergency' },
        {
          id: 'dtype',
          label: <FilterHeader id='dtype' title='Disaster Type' options={dTypeOptions} filter={this.state.table.filters.dtype} onSelect={this.handleFilterChange.bind(this, 'table', 'dtype')} />
        },
        { id: 'countries', label: 'Countries' }
      ];

      const rows = results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.created_at).toISODate(),
        name: <Link to={`/reports/${o.id}`} className='link--primary' title='View Field Report'>{o.summary || nope}</Link>,
        event: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : nope,
        dtype: get(getDtypeMeta(o.dtype.id), 'label', nope),
        countries: intersperse(o.countries.map(c => <Link key={c.id} to={`/countries/${c.id}`} className='link--primary' title='View Country'>{c.name}</Link>), ', ')
      }));

      return (
        <Fold title={`${title} (${n(data.count)})`} id={this.props.id}>
          {this.props.showExport ? (
            <ExportButton filename='field-reports'
              qs={this.getQs(this.props)}
              resource='api/v2/field_report'
            />
          ) : null}
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.table.limit}
            page={this.state.table.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'table')}
            noPaginate={this.props.noPaginate}
          />
          {this.props.viewAll ? (
            <div className='fold__footer'>
              View all field reports in <Link className='link--primary export--link' to={this.props.viewAll + '?region=0'}>{this.props.viewAllText || ' Africa'}</Link> /&nbsp;
              <Link className='link--primary export--link' to={this.props.viewAll + '?region=1'}>{this.props.viewAllText || 'America'}</Link> /&nbsp;
              <Link className='link--primary export--link' to={this.props.viewAll + '?region=2'}>{this.props.viewAllText || 'Asia'}</Link> /&nbsp;
              <Link className='link--primary export--link' to={this.props.viewAll + '?region=3'}>{this.props.viewAllText || 'Europe'}</Link> /&nbsp;
              <Link className='link--primary export--link' to={this.props.viewAll + '?region=4'}>{this.props.viewAllText || 'the Middle East'}</Link><br/>
              <Link className='link--primary export--link' to={this.props.viewAll}>{this.props.viewAllText || 'View all field reports'}</Link> <i>(Performance problems with Export Table)</i>
            </div>
          ) : null}
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
    isAuthenticated: T.bool,

    limit: T.number,
    country: T.number,
    region: T.number,

    noPaginate: T.bool,
    showExport: T.bool,
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
  list: state.fieldReports,
  isAuthenticated: !!state.user.data.token
});

const dispatcher = (dispatch) => ({
  _getFieldReportsList: (...args) => dispatch(getFieldReportsList(...args))
});

export default withRouter(connect(selector, dispatcher)(FieldReportsTable));
