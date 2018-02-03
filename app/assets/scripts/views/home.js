'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import { environment } from '../config';
import { dateOptions, datesAgo, dTypeOptions } from '../utils/utils/';
import { getAppeals } from '../actions';
import { commaSeparatedNumber as n, nope } from '../utils/format';

import App from './app';
import Fold from '../components/fold';
import PresentationDash from '../components/connected/presentation-dash';
import BlockLoading from '../components/block-loading';
import DisplayTable, { SortHeader, FilterHeader } from '../components/display-table';
import { SFPComponent } from '../utils/extendables';

const appelasTypes = {
  0: 'DREF',
  1: 'Appeal',
  2: 'Movement'
};

class Home extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor (props) {
    super(props);
    this.state = {
      appeals: {
        page: 1,
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
    let qs = {};
    let state = this.state.appeals;
    if (state.sort.field) {
      qs.order_by = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.order_by = '-start_date';
    }

    if (state.filters.date !== 'all') {
      qs.start_date__gte = datesAgo[state.filters.date]();
    }
    if (state.filters.dtype !== 'all') {
      qs.dtype = state.filters.dtype;
    }

    this.props._getAppeals(this.state.appeals.page, qs);
  }

  updateData (what) {
    this.requestResults();
  }

  renderAppeals () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.appeals;

    const title = 'Operations Overview';

    if (fetching) {
      return (
        <Fold title={title}>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title={title}>
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

      const rows = data.objects.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.start_date).toISODate(),
        name: o.name,
        event: o.event ? <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link> : nope,
        dtype: o.dtype.name,
        requestAmount: {
          value: n(o.amount_requested),
          className: 'right-align'
        },
        fundedAmount: {
          value: n(o.amount_funded),
          className: 'right-align'
        },
        active: (new Date(o.end_date)).getTime() > now ? 'Active' : 'Inactive',
        type: appelasTypes[o.atype]
      }));

      return (
        <Fold title={`${title} (${data.meta.total_count})`}>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.meta.total_count / data.meta.limit}
            page={data.meta.offset / data.meta.limit}
            onPageChange={this.handlePageChange.bind(this, 'appeals')}
          />
        </Fold>
      );
    }

    return null;
  }

  render () {
    return (
      <App className='page--homepage'>
        <section className='inpage'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>IFRC Disaster Response and Preparedness</h1>
                <p className='inpage__introduction'>IFRC Go aims to make all disaster information universally accessible and useful to IFRC responders for better decision making.</p>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <PresentationDash />
            <div className='inner'>
              {this.renderAppeals()}
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  Home.propTypes = {
    _getAppeals: T.func,
    appeals: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  appeals: state.appeals
});

const dispatcher = (dispatch) => ({
  _getAppeals: (...args) => dispatch(getAppeals(...args))
});

export default connect(selector, dispatcher)(Home);
