'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getEmergenciesList } from '../../actions';
import { nope, commaSeparatedNumber as n } from '../../utils/format';
import { get, dTypeOptions, dateOptions, datesAgo } from '../../utils/utils';
import { getDtypeMeta } from '../../utils/get-dtype-meta';

import Fold from '../fold';
import BlockLoading from '../block-loading';
import DisplayTable, { SortHeader, FilterHeader } from '../display-table';
import { SFPComponent } from '../../utils/extendables';

class EmergenciesTable extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor (props) {
    super(props);
    this.state = {
      emerg: {
        page: 1,
        limit: 10,
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
    let qs = { limit: this.state.emerg.limit };
    let state = this.state.emerg;
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-disaster_start_date';
    }

    if (state.filters.date !== 'all') {
      qs.disaster_start_date__gte = datesAgo[state.filters.date]();
    }

    if (state.filters.dtype !== 'all') {
      qs.dtype = state.filters.dtype;
    }

    this.props._getEmergenciesList(this.state.emerg.page, qs);
  }

  updateData (what) {
    this.requestResults();
  }

  render () {
    const {
      data,
      fetching,
      fetched,
      error
    } = this.props.list;

    if (fetching) {
      return (
        <Fold title='Latest Emergencies'>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title='Latest Emergencies'>
          <p>Latest emergencies not available.</p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Start Date' options={dateOptions} filter={this.state.emerg.filters.date} onSelect={this.handleFilterChange.bind(this, 'emerg', 'date')} />
        },
        {
          id: 'name',
          label: <SortHeader id='name' title='Name' sort={this.state.emerg.sort} onClick={this.handleSortChange.bind(this, 'emerg', 'name')} />
        },
        {
          id: 'dtype',
          label: <FilterHeader id='dtype' title='Disaster Type' options={dTypeOptions} filter={this.state.emerg.filters.dtype} onSelect={this.handleFilterChange.bind(this, 'emerg', 'dtype')} />
        },
        {
          id: 'totalAffected',
          label: <SortHeader id='num_affected' title='Requested Amount (CHF)' sort={this.state.emerg.sort} onClick={this.handleSortChange.bind(this, 'emerg', 'num_affected')} />,
          className: 'right-align'
        },
        {
          id: 'beneficiaries',
          label: 'Beneficiaries',
          className: 'right-align'
        },
        { id: 'countries', label: 'Countries' }
      ];

      const rows = data.results.map(rowData => {
        const date = rowData.disaster_start_date
          ? DateTime.fromISO(rowData.disaster_start_date).toISODate() : nope;

        const beneficiaries = get(rowData, 'appeals', []).reduce((acc, next) => {
          return acc + next.num_beneficiaries;
        }, 0);

        const countries = get(rowData, 'countries', []).map(c => (
          <Link className='link--primary' key={c.iso} to={`/countries/${c.id}`}>{c.name}</Link>
        ));

        return {
          id: rowData.id,
          date: date,
          name: <Link className='link--primary' to={`/emergencies/${rowData.id}`}>{get(rowData, 'name', nope)}</Link>,
          dtype: rowData.dtype ? getDtypeMeta(rowData.dtype).label : nope,
          totalAffected: {
            value: n(get(rowData, 'num_affected')),
            className: 'right-align'
          },
          beneficiaries: {
            value: n(beneficiaries),
            className: 'right-align'
          },
          countries: countries.length ? countries : nope
        };
      });

      return (
        <Fold title={`Latest Emergencies (${n(data.count)})`}>
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.emerg.limit}
            page={this.state.emerg.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'emerg')}
          />
        </Fold>
      );
    }

    return null;
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
