'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import ReactPaginate from 'react-paginate';

import { environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { get } from '../utils/utils/';
import {
  commaSeparatedNumber as n
} from '../utils/format';
import {
  getRegionById,
  getRegionAppeals,
  getRegionDrefs,
  getRegionFieldReports
} from '../actions';

import App from './app';
import Fold from '../components/fold';
import BlockLoading from '../components/block-loading';

class Region extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      pageAppeals: 1,
      pageDrefs: 1,
      pageReports: 1
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.props._getRegionAppeals(nextProps.match.params.id);
      this.props._getRegionDrefs(nextProps.match.params.id);
      this.props._getRegionFieldReports(nextProps.match.params.id);
      return this.getRegion(nextProps.match.params.id);
    }

    if (this.props.region.fetching && !nextProps.region.fetching) {
      hideGlobalLoading();
      if (nextProps.region.error) {
        this.props.history.push('/uhoh');
      }
    }
  }

  componentDidMount () {
    this.props._getRegionAppeals(this.props.match.params.id);
    this.props._getRegionDrefs(this.props.match.params.id);
    this.props._getRegionFieldReports(this.props.match.params.id);
    this.getRegion(this.props.match.params.id);
  }

  getRegion (id) {
    showGlobalLoading();
    this.props._getRegionById(id);
  }

  handlePageChange (what, page) {
    let pageKey;
    let fn;
    switch (what) {
      case 'appeals':
        pageKey = 'pageAppeals';
        fn = this.props._getRegionAppeals;
        break;
      case 'drefs':
        pageKey = 'pageDrefs';
        fn = this.props._getRegionDrefs;
        break;
      case 'fieldReports':
        pageKey = 'pageReports';
        fn = this.props._getRegionFieldReports;
        break;
    }
    this.setState({ [pageKey]: page.selected + 1 }, () => {
      fn(this.props.match.params.id, this.state[pageKey]);
    });
  }

  renderAppeals () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.appeals;

    if (fetching) {
      return (
        <Fold title='Appeals'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Appeals'>
          <p>Oh no! An error ocurred getting the data.</p>
        </Fold>
      );
    }

    if (fetched) {
      const now = Date.now();
      if (data && data.objects.length) {
        const headings = [
          { id: 'date', label: 'Date' },
          { id: 'name', label: 'Name' },
          { id: 'event', label: 'Event' },
          { id: 'dtype', label: 'Disaster Type' },
          { id: 'requestAmount', label: 'Appeal Amount (CHF)' },
          { id: 'fundedAmount', label: 'Funding (CHF)' },
          { id: 'active', label: 'Active' }
        ];

        const rows = data.objects.map(o => ({
          id: o.id,
          date: DateTime.fromISO(o.created_at).toISODate(),
          name: o.name,
          event: <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link>,
          dtype: o.dtype.name,
          requestAmount: n(o.amount_requested),
          fundedAmount: n(o.amount_funded),
          active: (new Date(o.end_date)).getTime() > now ? 'Active' : 'Inactive'
        }));

        return (
          <Fold title={`Appeals (${data.meta.total_count})`}>
            <DisplayTable
              headings={headings}
              rows={rows}
              pageCount={data.meta.total_count / data.meta.limit}
              page={data.meta.offset / data.meta.limit}
              onPageChange={this.handlePageChange.bind(this, 'appeals')}
            />
          </Fold>
        );
      } else {
        return (
          <Fold title='Appeals'>
            <p>There are no Appeals to show</p>
          </Fold>
        );
      }
    }

    return null;
  }

  renderDrefs () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.drefs;

    if (fetching) {
      return (
        <Fold title='Drefs'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Drefs'>
          <p>Oh no! An error ocurred getting the data.</p>
        </Fold>
      );
    }

    if (fetched) {
      const now = Date.now();
      if (data && data.objects.length) {
        const headings = [
          { id: 'date', label: 'Date' },
          { id: 'name', label: 'Name' },
          { id: 'event', label: 'Event' },
          { id: 'dtype', label: 'Disaster Type' },
          { id: 'requestAmount', label: 'Appeal Amount (CHF)' },
          { id: 'fundedAmount', label: 'Funding (CHF)' },
          { id: 'active', label: 'Active' }
        ];

        const rows = data.objects.map(o => ({
          id: o.id,
          date: DateTime.fromISO(o.created_at).toISODate(),
          name: o.name,
          event: <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link>,
          dtype: o.dtype.name,
          requestAmount: n(o.amount_requested),
          fundedAmount: n(o.amount_funded),
          active: (new Date(o.end_date)).getTime() > now ? 'Active' : 'Inactive'
        }));

        return (
          <Fold title={`Drefs (${data.meta.total_count})`}>
            <DisplayTable
              headings={headings}
              rows={rows}
              pageCount={data.meta.total_count / data.meta.limit}
              page={data.meta.offset / data.meta.limit}
              onPageChange={this.handlePageChange.bind(this, 'drefs')}
            />
          </Fold>
        );
      } else {
        return (
          <Fold title='Drefs'>
            <p>There are no Drefs to show</p>
          </Fold>
        );
      }
    }

    return null;
  }

  renderFieldReports () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.fieldReports;

    if (fetching) {
      return (
        <Fold title='Field Reports'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Field Reports'>
          <p>Oh no! An error ocurred getting the data.</p>
        </Fold>
      );
    }

    if (fetched) {
      const now = Date.now();
      if (data && data.objects.length) {
        const headings = [
          { id: 'date', label: 'Date' },
          { id: 'name', label: 'Name' },
          { id: 'event', label: 'Event' },
          { id: 'dtype', label: 'Disaster Type' },
          { id: 'requestAmount', label: 'Appeal Amount (CHF)' },
          { id: 'fundedAmount', label: 'Funding (CHF)' },
          { id: 'active', label: 'Active' }
        ];

        const rows = data.objects.map(o => ({
          id: o.id,
          date: DateTime.fromISO(o.created_at).toISODate(),
          name: o.name,
          event: <Link to={`/emergencies/${o.event.id}`} className='link--primary' title='View Emergency'>{o.event.name}</Link>,
          dtype: o.dtype.name,
          requestAmount: n(o.amount_requested),
          fundedAmount: n(o.amount_funded),
          active: (new Date(o.end_date)).getTime() > now ? 'Active' : 'Inactive'
        }));

        return (
          <Fold title={`Field Reports (${data.meta.total_count})`}>
            <DisplayTable
              headings={headings}
              rows={rows}
              pageCount={data.meta.total_count / data.meta.limit}
              page={data.meta.offset / data.meta.limit}
              onPageChange={this.handlePageChange.bind(this, 'fieldReports')}
            />
          </Fold>
        );
      } else {
        return (
          <Fold title='Field Reports'>
            <p>There are no Field Reports to show</p>
          </Fold>
        );
      }
    }

    return null;
  }

  renderContent () {
    const {
      fetched,
      error,
      data
    } = this.props.region;

    if (!fetched || error) return null;

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{data.name} Region</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>
            {this.renderAppeals()}
            {this.renderDrefs()}
            {this.renderFieldReports()}
          </div>
        </div>
      </section>
    );
  }

  render () {
    return (
      <App className='page--region'>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  Region.propTypes = {
    _getRegionById: T.func,
    _getRegionAppeals: T.func,
    _getRegionDrefs: T.func,
    _getRegionFieldReports: T.func,
    match: T.object,
    history: T.object,
    region: T.object,
    appeals: T.object,
    drefs: T.object,
    fieldReports: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const getFromState = (state, key) => {
  return get(state, key, {
    data: {},
    fetching: false,
    fetched: false
  });
};

const selector = (state, ownProps) => ({
  region: getFromState(state.region, ownProps.match.params.id),
  appeals: getFromState(state.region, 'appeals'),
  drefs: getFromState(state.region, 'drefs'),
  fieldReports: getFromState(state.region, 'fieldReports')
});

const dispatcher = (dispatch) => ({
  _getRegionById: (...args) => dispatch(getRegionById(...args)),
  _getRegionAppeals: (...args) => dispatch(getRegionAppeals(...args)),
  _getRegionDrefs: (...args) => dispatch(getRegionDrefs(...args)),
  _getRegionFieldReports: (...args) => dispatch(getRegionFieldReports(...args))
});

export default connect(selector, dispatcher)(Region);

class DisplayTable extends React.Component {
  render () {
    return (
      <React.Fragment>
        <table className='table table--zebra'>
          <thead>
            <tr>
              {this.props.headings.map(h => <th key={h.id}>{h.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {this.props.rows.map(row => (
              <tr key={row.id}>
                {this.props.headings.map(h => <th key={`${row.id}-${h.id}`}>{row[h.id]}</th>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination-wrapper'>
          <ReactPaginate
            previousLabel={<span>previous</span>}
            nextLabel={<span>next</span>}
            breakLabel={<span className='pages__page'>...</span>}
            pageCount={Math.ceil(this.props.pageCount)}
            forcePage={this.props.page}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.props.onPageChange}
            containerClassName={'pagination'}
            subContainerClassName={'pages'}
            pageClassName={'pages__wrapper'}
            pageLinkClassName={'pages__page'}
            activeClassName={'active'} />
        </div>
      </React.Fragment>
    );
  }
}

if (environment !== 'production') {
  DisplayTable.propTypes = {
    onPageChange: T.func,
    headings: T.array,
    rows: T.array,
    pageCount: T.number,
    page: T.number
  };
}
