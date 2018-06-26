'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getAppeals } from '../../actions';
import { commaSeparatedNumber as n, nope } from '../../utils/format';
import { getDtypeMeta } from '../../utils/get-dtype-meta';
import { get, dateOptions, datesAgo, dTypeOptions } from '../../utils/utils/';

import Fold from '../fold';
import BlockLoading from '../block-loading';
import DisplayTable, { SortHeader, FilterHeader } from '../display-table';
import { SFPComponent } from '../../utils/extendables';

const appealsType = {
  0: 'DREF',
  1: 'Appeal',
  2: 'Movement'
};

class AppealsTable extends SFPComponent {
  constructor (props) {
    super(props);
    this.state = {
      appeals: {
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
    let state = this.state.appeals;
    let qs = { limit: state.limit };
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-start_date';
    }

    if (state.filters.date !== 'all') {
      qs.start_date__gte = datesAgo[state.filters.date]();
    }
    if (state.filters.dtype !== 'all') {
      qs.dtype = state.filters.dtype;
    }

    if (this.props.showActive) {
      qs.end_date__gt = DateTime.utc().toISO();
    }

    if (!isNaN(this.props.country)) {
      qs.country = this.props.country;
    } else if (!isNaN(this.props.region)) {
      qs.region = this.props.region;
    }

    if (this.props.atype) {
      qs.atype = this.props.atype === 'appeal' ? '1'
        : this.props.atype === 'dref' ? '0' : null;
    }

    this.props._getAppeals(this.state.appeals.page, qs, this.props.action);
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
    } = this.props.appeals;

    const title = this.props.title || 'Operations Overview';

    if (fetching) {
      return (
        <Fold title={title} id={this.props.id}>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title={title} id={this.props.id}>
          <p>Operations data not available.</p>
        </Fold>
      );
    }

    if (fetched) {
      const now = Date.now();
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Start Date' options={dateOptions} filter={this.state.appeals.filters.date} onSelect={this.handleFilterChange.bind(this, 'appeals', 'date')} />
        },
        {
          id: 'name',
          label: <SortHeader id='name' title='Name' sort={this.state.appeals.sort} onClick={this.handleSortChange.bind(this, 'appeals', 'name')} />
        },
        { id: 'event', label: 'Emergency' },
        {
          id: 'dtype',
          label: <FilterHeader id='dtype' title='Disaster Type' options={dTypeOptions} filter={this.state.appeals.filters.dtype} onSelect={this.handleFilterChange.bind(this, 'appeals', 'dtype')} />
        },
        {
          id: 'requestAmount',
          label: <SortHeader id='amount_requested' title='Requested Amount (CHF)' sort={this.state.appeals.sort} onClick={this.handleSortChange.bind(this, 'appeals', 'amount_requested')} />
        },
        {
          id: 'fundedAmount',
          label: <SortHeader id='amount_funded' title='Funding (CHF)' sort={this.state.appeals.sort} onClick={this.handleSortChange.bind(this, 'appeals', 'amount_funded')} />
        },
        { id: 'active', label: 'Active' },
        { id: 'type', label: 'Type' }
      ];

      const rows = data.results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.start_date).toISODate(),
        name: o.name,
        event: o.event ? <Link to={`/emergencies/${o.event}`} className='link--primary' title='View Emergency'>Link</Link> : nope,
        dtype: get(getDtypeMeta(o.dtype), 'label', nope),
        requestAmount: {
          value: n(o.amount_requested),
          className: 'right-align'
        },
        fundedAmount: {
          value: n(o.amount_funded),
          className: 'right-align'
        },
        active: (new Date(o.end_date)).getTime() > now ? 'Active' : 'Inactive',
        type: appealsType[o.atype]
      }));

      return (
        <Fold title={`${title} (${n(data.count)})`} id={this.props.id}>
          {this.props.exportLink ? (
            <div className='fold__actions'>
              <a href={this.props.exportLink} className='button button--primary-bounded'>Export Table</a>
            </div>
          ) : null}
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.appeals.limit}
            page={this.state.appeals.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'appeals')}
            noPaginate={this.props.noPaginate}
          />
          {this.props.viewAll ? (
            <div className='fold__footer'>
              <Link className='link--primary export--link' to={this.props.viewAll}>{this.props.viewAllText || 'View All Appeals'}</Link>
            </div>
          ) : null}
        </Fold>
      );
    }
    return null;
  }
}

if (environment !== 'production') {
  AppealsTable.propTypes = {
    _getAppeals: T.func,
    appeals: T.object,

    limit: T.number,
    country: T.number,
    region: T.number,
    atype: T.string,

    noPaginate: T.bool,
    exportLink: T.string,
    title: T.string,

    showActive: T.bool,
    viewAll: T.string,
    viewAllText: T.string,
    id: T.string,

    action: T.string,
    statePath: T.string
  };
}

const selector = (state, props) => ({
  appeals: props.statePath ? get(state, props.statePath) : state.appeals
});

const dispatcher = (dispatch) => ({
  _getAppeals: (...args) => dispatch(getAppeals(...args))
});

export default connect(selector, dispatcher)(AppealsTable);
