'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import { environment } from '../config';
import { get, dateOptions, datesAgo, dTypeOptions } from '../utils/utils/';
import { getAppeals } from '../actions';
import { commaSeparatedNumber as n, nope } from '../utils/format';
import { getDtypeMeta } from '../utils/get-dtype-meta';

import App from './app';
import Fold from '../components/fold';
import PresentationDash from '../components/connected/presentation-dash';
import AlertsTable from '../components/connected/alerts-table';
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
        limit: 5,
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
    let qs = { limit: this.state.appeals.limit };
    let state = this.state.appeals;
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
        type: appelasTypes[o.atype]
      }));

      return (
        <Fold title={`${title} (${n(data.count)})`}>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.appeals.limit}
            page={this.state.appeals.page - 1}
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
              <div className='fold'>
                <div className='inner'>
                  <h2 className='fold__title'>Active Emergencies</h2>
                  <ul className='key-emergencies-list'>
                    <li className='key-emergencies-item'>
                      <a href=''>
                        <h2 className='card__title'>Papua New Guinea - Volanic Activity</h2>
                        <p className='card__date'>Start Date: June 8, 2018</p>
                        <ul className='card__stat-list'>
                          <li className='card__stat stats-people'>5,544<small>Targeted Ben</small></li>
                          <li className='card__stat stats-funding'> 52%<small>Funded</small></li>
                        </ul>
                      </a>
                    </li>
                    <li className='key-emergencies-item'>
                      <a href=''>
                        <h2 className='card__title'>Papua New Guinea - Volanic Activity</h2>
                        <p className='card__date'>Start Date: June 8, 2018</p>
                        <ul className='card__stat-list'>
                          <li className='card__stat stats-people'>5,544<small>Targeted Ben</small></li>
                          <li className='card__stat stats-funding'> 52%<small>Funded</small></li>
                        </ul>
                      </a>
                    </li>
                    <li className='key-emergencies-item'>
                      <a href=''>
                        <h2 className='card__title'>Papua New Guinea - Volanic Activity</h2>
                        <p className='card__date'>Start Date: June 8, 2018</p>
                        <ul className='card__stat-list'>
                          <li className='card__stat stats-people'>5,544<small>Targeted Ben</small></li>
                          <li className='card__stat stats-funding'> 52%<small>Funded</small></li>
                        </ul>
                      </a>
                    </li>
                  </ul>
                  <a href='' className='link--primary'>View All Emergencies</a>
                </div>
              </div>
            </div>
            <div className='inner'>
              {this.renderAppeals()}
            </div>
            <div className='inner'>
              <AlertsTable />
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
