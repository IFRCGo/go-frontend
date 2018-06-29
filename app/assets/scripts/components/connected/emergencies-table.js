'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

import { environment } from '../../config';
import { getEmergenciesList } from '../../actions';
import {
  nope,
  commaSeparatedNumber as n,
  isoDate,
  recentInterval
} from '../../utils/format';
import {
  get,
  dTypeOptions,
  dateOptions,
  datesAgo,
  mostRecentReport
} from '../../utils/utils';
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
    let qs = { limit: this.state.emerg.limit };
    let state = this.state.emerg;
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-disaster_start_date';
    }

    if (state.filters.date !== 'all') {
      qs.disaster_start_date__gte = datesAgo[state.filters.date]();
    } else if (this.props.showRecent) {
      qs.disaster_start_date__gte = recentInterval;
    }

    if (state.filters.dtype !== 'all') {
      qs.dtype = state.filters.dtype;
    }

    if (!isNaN(this.props.country)) {
      qs.countries__in = this.props.country;
    } else if (!isNaN(this.props.region)) {
      qs.regions__in = this.props.region;
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
        <Fold title={this.props.title} id={this.props.id}>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title={this.props.title} id={this.props.id}>
          <p>Latest emergencies not available.</p>
        </Fold>
      );
    }

    if (fetched) {
      let headings = [
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
          id: 'glide',
          label: 'Glide'
        },
        {
          id: 'totalAffected',
          label: <SortHeader id='num_affected' title='Requested Amount (CHF)' sort={this.state.emerg.sort} onClick={this.handleSortChange.bind(this, 'emerg', 'num_affected')} />,
          className: 'right-align'
        },
        {
          id: 'affected',
          label: '# Affected',
          className: 'right-align'
        }
      ];

      // If we're showing this on a country-specific page, don't show the country column
      if (isNaN(this.props.country)) {
        headings.push({ id: 'countries', label: 'Countries' });
      }

      const rows = data.results.map(rowData => {
        const date = rowData.disaster_start_date ? isoDate(rowData.disaster_start_date) : nope;
        const report = mostRecentReport(rowData['field_reports']);
        const affected = get(report, 'num_affected', nope);
        let row = {
          id: rowData.id,
          date: date,
          name: <Link className='link--primary' to={`/emergencies/${rowData.id}`}>{get(rowData, 'name', nope)}</Link>,
          dtype: rowData.dtype ? getDtypeMeta(rowData.dtype).label : nope,
          totalAffected: {
            value: n(get(rowData, 'num_affected')),
            className: 'right-align'
          },
          affected: {
            value: n(affected),
            className: 'right-align'
          },
          glide: rowData.glide || nope
        };

        if (isNaN(this.props.country)) {
          const countries = get(rowData, 'countries', []).map(c => (
            <React.Fragment key={c.iso}>
              <Link className='link--primary' to={`/countries/${c.id}`}>{c.name}</Link>&nbsp;
            </React.Fragment>
          ));
          row.countries = countries.length ? countries : nope;
        }

        return row;
      });

      const {
        title,
        noPaginate
      } = this.props;

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
            pageCount={data.count / this.state.emerg.limit}
            page={this.state.emerg.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'emerg')}
            noPaginate={noPaginate}
          />
          {this.props.viewAll ? (
            <div className='fold__footer'>
              <Link className='link--primary export--link' to={this.props.viewAll}>{this.props.viewAllText || 'View All Emergencies'}</Link>
            </div>
          ) : null}
        </Fold>
      );
    }

    return null;
  }
}

if (environment !== 'production') {
  EmergenciesTable.propTypes = {
    _getEmergenciesList: T.func,
    list: T.object,

    limit: T.number,
    country: T.number,
    region: T.number,

    noPaginate: T.bool,
    exportLink: T.string,
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
  list: state.emergencies.list
});

const dispatcher = (dispatch) => ({
  _getEmergenciesList: (...args) => dispatch(getEmergenciesList(...args))
});

export default connect(selector, dispatcher)(EmergenciesTable);
