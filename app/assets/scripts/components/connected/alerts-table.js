'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getSurgeAlerts } from '../../actions';

import Fold from '../fold';
import { showGlobalLoading, hideGlobalLoading } from '../global-loading';

const alertTypes = {
  0: 'FACT',
  1: 'SIMS',
  2: 'ERU',
  3: 'DHEOps',
  4: 'HEOps',
  5: 'SURGE'
};

class AlertsTable extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      page: 1
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount () {
    showGlobalLoading();
    this.requestResults();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.surgeAlerts.fetching && !nextProps.surgeAlerts.fetching) {
      hideGlobalLoading();
    }
  }

  requestResults () {
    this.props._getSurgeAlerts(this.state.page);
  }

  handlePageChange (page) {
    this.setState({ page: page.selected + 1 }, () => {
      showGlobalLoading();
      this.requestResults();
    });
  }

  renderRow (rowData, idx, all) {
    const isLast = idx === all.length - 1;

    const date = DateTime.fromISO(rowData.created_at);

    return (
      <React.Fragment key={rowData.id}>
        <tr>
          <td data-heading='Date'>{date.toISODate()}</td>
          <td data-heading='Emergency'><Link to='' title='View Emergency page'>{rowData.operation}</Link></td>
          <td data-heading='Alert Message'>{rowData.message}</td>
          <td data-heading='Type'>{alertTypes[rowData.atype]}</td>
        </tr>

        {!isLast && (
          <tr role='presentation'>
            <td colSpan='4'></td>
          </tr>
        )}
      </React.Fragment>
    );
  }

  render () {
    const {
      data,
      fetched,
      receivedAt,
      error
    } = this.props.surgeAlerts;

    if (!receivedAt && !fetched) return null;

    if (error) {
      return (
        <Fold title='Latest Alerts'>
          <p>Oh no! An error ocurred getting the stats.</p>
        </Fold>
      );
    }

    if (!data.objects.length) {
      return (
        <Fold title='Latest Alerts'>
          <p>There are no results to show.</p>
        </Fold>
      );
    }

    return (
      <Fold title='Latest Alerts'>
        <table className='responsive-table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Emergency</th>
              <th>Alert Message</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {data.objects.map(this.renderRow)}
          </tbody>
        </table>

        {data.objects.length !== 0 && (
          <div className='pagination-wrapper'>
            <ReactPaginate
              previousLabel={<span>previous</span>}
              nextLabel={<span>next</span>}
              breakLabel={<span className='pages__page'>...</span>}
              pageCount={Math.ceil(data.meta.total_count / data.meta.limit)}
              forcePage={data.meta.offset / data.meta.limit}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageChange}
              containerClassName={'pagination'}
              subContainerClassName={'pages'}
              pageClassName={'pages__wrapper'}
              pageLinkClassName={'pages__page'}
              activeClassName={'active'} />
          </div>
        )}
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
