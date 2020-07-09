import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

import { environment } from '#config';
import { getEmergenciesList } from '#actions';
import {
  nope,
  commaSeparatedNumber as n,
  isoDate,
  recentInterval,
  intersperse
} from '#utils/format';
import {
  get,
  dTypeOptions,
  dateOptions,
  datesAgo,
  mostRecentReport
} from '#utils/utils';

import ExportButton from '../export-button-container';
import Fold from '../fold';
import BlockLoading from '../block-loading';
import DisplayTable, { SortHeader, FilterHeader } from '../display-table';
import { SFPComponent } from '#utils/extendables';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class EmergenciesTable extends SFPComponent {
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (newProps) {
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
    props._getEmergenciesList(this.state.table.page, this.getQs(props));
  }

  getQs (props) {
    let qs = { limit: this.state.table.limit };
    let state = this.state.table;
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-disaster_start_date';
    }

    if (state.filters.date !== 'all') {
      qs.disaster_start_date__gte = datesAgo[state.filters.date]();
    } else if (props.showRecent) {
      qs.disaster_start_date__gte = recentInterval;
    }

    // Add a condition for country pages
    // In a country page, the default ('anytime') shows the last 12 months
    if (state.filters.date === 'all' && props.showRecent && props.country) {
      qs.disaster_start_date__gte = datesAgo['year']();
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

    const { strings } = this.context;

    if (error) {
      return (
        <Fold title={this.props.title} id={this.props.id}>
          <p>
            <Translate stringId='emergenciesTableError' />
          </p>
        </Fold>
      );
    }

    if (fetched) {
      let headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title={strings.emergenciesTableDate} options={dateOptions} filter={this.state.table.filters.date} onSelect={this.handleFilterChange.bind(this, 'table', 'date')} />
        },
        {
          id: 'name',
          label: <SortHeader id='name' title={strings.emergenciesTableName} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'name')} />
        },
        {
          id: 'dtype',
          label: <FilterHeader id='dtype' title={strings.emergenciesTableDisasterType} options={dTypeOptions} filter={this.state.table.filters.dtype} onSelect={this.handleFilterChange.bind(this, 'table', 'dtype')} />
        },
        {
          id: 'glide',
          label: <SortHeader id='glide' title={strings.emergenciesTableGlide} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'glide')} />
        },
        {
          id: 'requested',
          label: <SortHeader id='amount_requested' title={strings.emergenciesTableRequestedAmt} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'amount_requested')} />,
          className: 'right-align'
        },
        {
          id: 'affected',
          label: <SortHeader id='num_affected' title={strings.emergenciesTableAffected} sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'num_affected')} />,
          className: 'right-align'
        }
      ];

      // If we're showing this on a country-specific page, don't show the country column
      if (isNaN(this.props.country)) {
        headings.push({ id: 'countries', label: strings.emergenciesTableCountry });
      }

      const rows = data.results.map(rowData => {
        const date = rowData.disaster_start_date ? isoDate(rowData.disaster_start_date) : nope;
        const affected = get(rowData, 'num_affected') || get(mostRecentReport(rowData.field_reports), 'num_affected') || nope;
        let row = {
          id: rowData.id,
          date: date,
          name: <Link className='link--table' to={`/emergencies/${rowData.id}`}>{get(rowData, 'name', nope)}</Link>,
          dtype: rowData.dtype ? rowData.dtype.name : nope,
          requested: {
            value: n(get(rowData, 'appeals.0.amount_requested')),
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
            <Link key={c.id} className='link--table' to={`/countries/${c.id}`}>{c.name}</Link>
          ));
          row.countries = countries.length ? intersperse(countries, ', ') : nope;
        }

        return row;
      });

      const {
        title,
        noPaginate
      } = this.props;

      const foldLink = this.props.viewAll ? (<Link className='fold__title__link' to={this.props.viewAll}>{this.props.viewAllText || strings.emergenciesTableViewAll}</Link>) : null;
      return (
        <Fold foldClass='fold__title--inline margin-reset' navLink={foldLink} title={`${title} (${n(data.count)})`} id={this.props.id}>
          {this.props.showExport ? (
            <ExportButton filename='emergencies'
              qs={this.getQs(this.props)}
              resource='api/v2/event'
            />
          ) : null}
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.table.limit}
            page={this.state.table.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'table')}
            noPaginate={noPaginate}
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
    list: T.object,

    limit: T.number,
    country: T.string,
    region: T.string,

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
  list: state.emergencies.list
});

const dispatcher = (dispatch) => ({
  _getEmergenciesList: (...args) => dispatch(getEmergenciesList(...args))
});
EmergenciesTable.contextType = LanguageContext;
export default connect(selector, dispatcher)(EmergenciesTable);
