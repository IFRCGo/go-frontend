'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { Sticky, StickyContainer } from 'react-sticky';
import c from 'classnames';
import { Helmet } from 'react-helmet';

import { environment } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { get, dateOptions, datesAgo, dTypeOptions } from '../utils/utils/';
import { getDtypeMeta } from '../utils/get-dtype-meta';
import {
  commaSeparatedNumber as n,
  commaSeparatedLargeNumber as bigN,
  days90,
  nope
} from '../utils/format';
import {
  getAdmAreaById,
  getAdmAreaFieldReports,
  getAdmAreaAppealsList,
  getAdmAreaAggregateAppeals,
  getAdmAreaKeyFigures,
  getAdmAreaSnippets,
  getCountryOperations,
  getPartnerDeployments
} from '../actions';
import { getFdrs } from '../actions/query-external';
import { getBoundingBox } from '../utils/country-bounding-box';

import App from './app';
import Fold from '../components/fold';
import Homemap from '../components/homemap';
import DisplayTable, { SortHeader, FilterHeader } from '../components/display-table';
import EmergenciesTable from '../components/connected/emergencies-table';
import BulletTable from '../components/bullet-table';
import {
  Snippets,
  KeyFigures,
  Contacts,
  Links
} from '../components/admin-area-elements';
import { SFPComponent } from '../utils/extendables';

class AdminArea extends SFPComponent {
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
      },
      fieldReports: {
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

  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.getData(nextProps);
      return this.getAdmArea(nextProps.type, nextProps.match.params.id);
    }

    if (this.props.adminArea.fetching && !nextProps.adminArea.fetching) {
      hideGlobalLoading();
      if (nextProps.adminArea.error) {
        this.props.history.push('/uhoh');
      }
    }
  }

  componentDidMount () {
    this.getData(this.props);
    this.getAdmArea(this.props.type, this.props.match.params.id);
  }

  getData (props) {
    // this.props._getAdmAreaFieldReports(props.type, props.match.params.id, 1, { ordering: '-created_at' });
    const type = 'country';
    const id = props.match.params.id;
    this.props._getAdmAreaAppealsList(type, id);
    this.props._getAdmAreaAggregateAppeals(type, id, DateTime.local().minus({years: 10}).startOf('month').toISODate(), 'year');
    this.props._getAdmAreaKeyFigures(type, id);
    this.props._getAdmAreaSnippets(type, id);
    this.props._getCountryOperations(type, id);
    this.props._getPartnerDeployments(type, id);
    this.props._getFdrs(id);
  }

  getAdmArea (type, id) {
    showGlobalLoading();
    this.props._getAdmAreaById(type, id);
  }

  computeFilters (what) {
    let state = this.state[what];
    let qs = {};

    switch (what) {
      case 'appeals':
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

        break;
      case 'fieldReports':
        qs.ordering = '-created_at';
        if (state.filters.date !== 'all') {
          qs.created_at__gte = datesAgo[state.filters.date]();
        }
        if (state.filters.dtype !== 'all') {
          qs.dtype = state.filters.dtype;
        }
        break;
    }
    return qs;
  }

  updateData (what) {
    let fn;
    switch (what) {
      case 'appeals':
        fn = this.props._getCountryOperations;
        break;
      case 'fieldReports':
        fn = this.props._getAdmAreaFieldReports;
        break;
    }

    fn(this.props.type, this.props.match.params.id, this.state[what].page, this.computeFilters(what));
  }

  renderAppeals () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.countryOperations;

    if (error || fetching) return null;

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
        { id: 'active', label: 'Active' }
      ];

      const rows = data.results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.start_date).toISODate(),
        name: o.name,
        event: o.event ? <Link to={`/emergencies/${o.event}`} className='link--primary' title='View Emergency'>Link</Link> : nope,
        dtype: getDtypeMeta(o.dtype).label,
        requestAmount: n(o.amount_requested),
        fundedAmount: n(o.amount_funded),
        active: (new Date(o.end_date)).getTime() > now ? 'Active' : 'Inactive'
      }));

      return (
        <DisplayTable
          headings={headings}
          rows={rows}
          onPageChange={this.handlePageChange.bind(this, 'appeals')}
          noPaginate={true}
        />
      );
    }
    return null;
  }

  renderStats () {
    const {
      fetched,
      error,
      data: { stats }
    } = this.props.appealStats;

    if (!fetched || error) {
      return null;
    }

    return (
      <div className='inpage__headline-stats'>
        <div className='header-stats'>
          <ul className='stats-list'>
            <li className='stats-list__item stats-people'>
              {n(stats.numBeneficiaries)}<small>Targeted people in ongoing operations</small>
            </li>
            <li className='stats-list__item stats-funding stat-borderless stat-double'>
              {n(stats.amountRequested)}<small>Requested Amount (CHF)</small>
            </li>
            <li className='stats-list__item stat-double'>
              {n(stats.amountFunded)}<small>Funding (CHF)</small>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  renderCountryProfile () {
    const {
      fetched,
      error,
      data
    } = this.props.fdrs;

    if (!fetched || error) {
      return null;
    }
    const population = get(data, 'Population.value');
    const gdp = get(data, 'GDP.value');
    const gdpCapita = isNaN(population) || isNaN(gdp) || +population === 0 ? null : +gdp / +population;
    const poverty = get(data, 'Poverty.value');

    // get unique years of data
    let years = {};
    Object.keys(data).map(d => data[d].year).forEach(year => {
      if (!years[year]) { years[year] = true; }
    });

    return (
      <div className='inpage__header-col'>
        <h3>Country Profile</h3>
        <div className='content-list-group'>
          <ul className='content-list'>
            <li>Population<span className='content-highlight'>{bigN(population)}</span></li>
            <li>GDP<span className='content-highlight'>{gdp ? '$' + bigN(gdp) : nope}</span></li>
            <li>GDP / Capita<span className='content-highlight'>{gdpCapita ? '$' + n(gdpCapita) : nope}</span></li>
            <li>Poverty (% pop)<span className='content-highlight'>{poverty ? poverty + '%' : nope}</span></li>
            <li>People reached<span className='content-highlight'>{n(get(data, 'KPI_ReachDRER_D_Tot.value'))}</span></li>
          </ul>
          <ul className='content-list'>
            <li>Income (CHF)<span className='content-highlight'>{bigN(get(data, 'KPI_IncomeLC_CHF.value'))}</span></li>
            <li>Expenditures (CHF)<span className='content-highlight'>{bigN(get(data, 'KPI_expenditureLC_CHF.value'))}</span></li>
            <li>Volunteers<span className='content-highlight'>{n(get(data, 'KPI_PeopleVol_Tot.value'))}</span></li>
            <li>People giving blood<span className='content-highlight'>{n(get(data, 'KPI_DonBlood_Tot.value'))}</span></li>
            <li>Trained in first aid<span className='content-highlight'>{n(get(data, 'KPI_TrainFA_Tot.value'))}</span></li>
          </ul>
        </div>
        <p>Reporting year(s): {Object.keys(years).sort().join(', ')}</p>
      </div>
    );
  }

  renderContent () {
    const {
      fetched,
      error,
      data
    } = this.props.adminArea;

    if (!fetched || error) return null;

    const bbox = getBoundingBox(data.iso);
    const mapContainerClass = 'country__map';
    const activeOperations = get(this.props.appealStats, 'data.results.length', false);

    const { partnerDeployments } = this.props;
    const bulletTables = [
      {title: 'Activities by PNS', rows: get(partnerDeployments, 'data.parentSocieties', [])},
      {title: 'Type of Activities by PNS', rows: get(partnerDeployments, 'data.activities', [])}
    ];

    return (
      <section className='inpage'>
        <Helmet>
          <title>IFRC Go - {get(data, 'name', 'Country')}</title>
        </Helmet>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{data.name}</h1>
              <div className='inpage__header-actions'>
                <a href='' className='button button--primary-bounded'>Edit Country</a>
              </div>
            </div>
            <div className='inpage__header-col'>
              {this.renderStats()}
            </div>
            {this.renderCountryProfile()}
          </div>
        </header>
        <StickyContainer>
          <Sticky>
            {({ style, isSticky }) => (
              <div style={style} className={c('inpage__nav', {'inpage__nav--sticky': isSticky})}>
                <div className='inner'>
                  <ul>
                    <li><a href='#key-figures' title='Go to Key Figures section'>Key Figures</a></li>
                    <li><a href='#operations-map' title='Go to Operations section'>Operations</a></li>
                    <li><a href='#graphics' title='Go to Graphics section'>Graphics</a></li>
                    <li><a href='#links' title='Go to Links section'>Links</a></li>
                    <li><a href='#contacts' title='Go to Contacts section'>Contacts</a></li>
                  </ul>
                </div>
              </div>
            )}
          </Sticky>
          <div className='inpage__body'>
            <div className='inner'>
              <KeyFigures data={this.props.keyFigures} />
              <Fold title='Statistics' headerClass='visually-hidden' id='operations'>
                <h2 className='fold__title'>{isNaN(activeOperations) ? nope : activeOperations + ' Active Operations'}</h2>
                <div className='operations__container'>
                  <BulletTable tables={bulletTables} title='PNS Activities' />
                  <div className={mapContainerClass}>
                    <Homemap operations={this.props.appealStats} bbox={bbox} deployments={this.props.partnerDeployments} noRenderEmergencies={true} />
                  </div>
                </div>
                {this.renderAppeals()}
              </Fold>
              <EmergenciesTable
                title='Emergencies in the past 90 days'
                limit={5}
                country={this.props.match.params.id}
                startDate={days90}
              />
              <Snippets data={this.props.snippets} />
              <Links data={data} />
              <Contacts data={data} />
            </div>
          </div>
        </StickyContainer>
      </section>
    );
  }

  render () {
    return (
      <App className={`page--${this.props.type}`}>
        <Helmet>
          <title>IFRC Go - Country</title>
        </Helmet>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  AdminArea.propTypes = {
    _getAdmAreaById: T.func,
    _getAdmAreaFieldReports: T.func,
    _getAdmAreaAppealsList: T.func,
    _getAdmAreaAggregateAppeals: T.func,
    _getCountryOperations: T.func,
    _getPartnerDeployments: T.func,
    type: T.string,
    match: T.object,
    history: T.object,
    adminArea: T.object,
    appeals: T.object,
    fieldReports: T.object,
    appealStats: T.object,
    aggregateYear: T.object,
    keyFigures: T.object,
    snippets: T.object,
    countryOperations: T.object,
    partnerDeployments: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  adminArea: get(state.adminArea.aaData, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  fieldReports: state.adminArea.fieldReports,
  appealStats: state.adminArea.appealStats,
  aggregateYear: get(state.adminArea.aggregate, 'year', {
    data: {},
    fetching: false,
    fetched: false
  }),
  keyFigures: state.adminArea.keyFigures,
  snippets: state.adminArea.snippets,
  countryOperations: state.adminArea.countryOperations,
  partnerDeployments: get(state.adminArea.partnerDeployments, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  fdrs: state.fdrs
});

const dispatcher = (dispatch) => ({
  _getAdmAreaById: (...args) => dispatch(getAdmAreaById(...args)),
  _getAdmAreaFieldReports: (...args) => dispatch(getAdmAreaFieldReports(...args)),
  _getAdmAreaAppealsList: (...args) => dispatch(getAdmAreaAppealsList(...args)),
  _getAdmAreaAggregateAppeals: (...args) => dispatch(getAdmAreaAggregateAppeals(...args)),
  _getAdmAreaKeyFigures: (...args) => dispatch(getAdmAreaKeyFigures(...args)),
  _getAdmAreaSnippets: (...args) => dispatch(getAdmAreaSnippets(...args)),
  _getCountryOperations: (...args) => dispatch(getCountryOperations(...args)),
  _getPartnerDeployments: (...args) => dispatch(getPartnerDeployments(...args)),
  _getFdrs: (...args) => dispatch(getFdrs(...args))
});

export default connect(selector, dispatcher)(AdminArea);
