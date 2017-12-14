'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getEmergenciesList } from '../../actions';
import { nope, commaSeparatedNumber as n } from '../../utils/format';
import { get } from '../../utils/utils';

import Fold from '../fold';
import { showGlobalLoading, hideGlobalLoading } from '../global-loading';

class EmergenciesTable extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      page: 1
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount () {
    this.requestResults();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.list.fetching && !nextProps.list.fetching) {
      hideGlobalLoading();
    }
  }

  requestResults () {
    showGlobalLoading();
    this.props._getEmergenciesList(this.state.page);
  }

  handlePageChange (page) {
    this.setState({ page: page.selected + 1 }, () => {
      this.requestResults();
    });
  }

  renderRow (rowData, idx, all) {
    const isLast = idx === all.length - 1;

    const disasterDate = rowData.disaster_start_date ||
      rowData.start_date ||
      rowData.created_at;

    const date = disasterDate
      ? DateTime.fromISO(disasterDate).toISODate() : nope;

    const beneficiaries = get(rowData, 'appeals', []).reduce((acc, next) => {
      return acc + next.num_beneficiaries;
    }, 0);

    const countries = get(rowData, 'countries', []).map(c => (
      <Link key={`c.iso`} to={`/country/${c.id}`}>{c.name}</Link>
    ));

    return (
      <React.Fragment key={rowData.id}>
        <tr>
          <td data-heading='Date'>{date}</td>
          <td data-heading='Name'>{get(rowData, 'name', nope)}</td>
          <td data-heading='Disaster Type'>{get(rowData, 'dtype.name', nope)}</td>
          <td data-heading='Total Affected'>{n(get(rowData, 'num_affected'))}</td>
          <td data-heading='Beneficiaries'>{n(beneficiaries)}</td>
          <td data-heading='Countries'>{countries.length ? countries : nope}</td>
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
    } = this.props.list;

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
      <Fold title={`Latest Emergencies (${n(data.meta.total_count)})`}>
        <div className='table-scroll'>
          <div className='table-wrap'>
            <table className='table table--zebra responsive-table'>
              <thead>
                <tr>
                  <th className='fixed-col'>Date</th>
                  <th>Name</th>
                  <th>Disaster Type</th>
                  <th>Total Affected</th>
                  <th>Benficiaries</th>
                  <th>Countries</th>
                </tr>
              </thead>
              <tbody>
                {data.objects.map(this.renderRow)}
              </tbody>
            </table>
          </div>
        </div>

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
  EmergenciesTable.propTypes = {
    _getEmergenciesList: T.func,
    list: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  list: state.emergencies.list
});

const dispatcher = (dispatch) => ({
  _getEmergenciesList: (...args) => dispatch(getEmergenciesList(...args))
});

export default connect(selector, dispatcher)(EmergenciesTable);
