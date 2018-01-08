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
import BlockLoading from '../block-loading';

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

  requestResults () {
    this.props._getEmergenciesList(this.state.page);
  }

  handlePageChange (page) {
    this.setState({ page: page.selected + 1 }, () => {
      this.requestResults();
    });
  }

  renderRow (rowData, idx, all) {
    const disasterDate = rowData.disaster_start_date ||
      rowData.start_date ||
      rowData.created_at;

    const date = disasterDate
      ? DateTime.fromISO(disasterDate).toISODate() : nope;

    const beneficiaries = get(rowData, 'appeals', []).reduce((acc, next) => {
      return acc + next.num_beneficiaries;
    }, 0);

    const countries = get(rowData, 'countries', []).map(c => (
      <Link className='link--primary' key={`c.iso`} to={`/country/${c.id}`}>{c.name}</Link>
    ));

    return (
      <tr key={rowData.id}>
        <td data-heading='Date'>{date}</td>
        <td data-heading='Name'><Link className='link--primary' to={`/emergencies/${rowData.id}`}>{get(rowData, 'name', nope)}</Link></td>
        <td data-heading='Disaster Type'>{get(rowData, 'dtype.name', nope)}</td>
        <td className='right-align' data-heading='Total Affected'>{n(get(rowData, 'num_affected'))}</td>
        <td className='right-align' data-heading='Beneficiaries'>{n(beneficiaries)}</td>
        <td data-heading='Countries'>{countries.length ? countries : nope}</td>
      </tr>
    );
  }

  render () {
    const {
      data,
      fetched,
      receivedAt,
      error
    } = this.props.list;

    if (!receivedAt && !fetched && !error) return <BlockLoading />;

    if (error) {
      return (
        <Fold title='Latest Emergencies'>
          <p>Oh no! An error ocurred getting the stats.</p>
        </Fold>
      );
    }

    if (!data.objects.length) {
      return (
        <Fold title='Latest Emergencies'>
          <p>There are no results to show.</p>
        </Fold>
      );
    }

    return (
      <Fold title={`Latest Emergencies (${n(data.meta.total_count)})`}>
        <table className='table table--zebra responsive-table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Disaster Type</th>
              <th className='right-align'>Total Affected</th>
              <th className='right-align'>Benficiaries</th>
              <th>Countries</th>
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
