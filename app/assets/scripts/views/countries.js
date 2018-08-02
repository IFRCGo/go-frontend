'use strict';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { Sticky, StickyContainer } from 'react-sticky';
import c from 'classnames';
import { Helmet } from 'react-helmet';
import url from 'url';

import { environment, api } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { get, dateOptions, datesAgo, dTypeOptions } from '../utils/utils/';
import { getDtypeMeta } from '../utils/get-dtype-meta';
import {
  commaSeparatedNumber as n,
  commaSeparatedLargeNumber as bigN,
  nope,
  round
} from '../utils/format';
import {
  getAdmAreaById,
  getAdmAreaAppealsList,
  getAdmAreaKeyFigures,
  getAdmAreaSnippets,
  getCountryOperations,
  getPartnerDeployments,
  setPartnerDeploymentFilter
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

const filterPaths = {
  ns: 'parent.name',
  type: 'activity.activity'
};

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
      mapFilters: {},
      persistentMapFilter: {}
    };
    this.setMapFilter = this.setMapFilter.bind(this);
    this.setPersistentMapFilter = this.setPersistentMapFilter.bind(this);
    this.removeMapFilter = this.removeMapFilter.bind(this);
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
    const type = 'country';
    const id = props.match.params.id;
    this.props._getAdmAreaAppealsList(type, id);
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
    }
    return qs;
  }

  updateData (what) {
    this.props._getCountryOperations(this.props.type, this.props.match.params.id, this.state[what].page, this.computeFilters(what));
  }

  setMapFilter (type, value) {
    let filters = Object.assign({}, this.state.mapFilters);
    filters[type] = value;
    this.setState({ mapFilters: filters }, this.syncMapFilters);
  }

  setPersistentMapFilter (type, value) {
    let filter = Object.assign({}, this.state.persistentMapFilter);
    if (filter.hasOwnProperty(type) && filter[type] === value) {
      delete filter[type];
    } else {
      filter[type] = value;
    }
    this.setState({ persistentMapFilter: filter }, this.syncMapFilters);
  }

  removeMapFilter (type) {
    let filters = Object.assign({}, this.state.mapFilters);
    delete filters[type];
    this.setState({ mapFilters: filters }, this.syncMapFilters);
  }

  syncMapFilters () {
    const { mapFilters, persistentMapFilter } = this.state;
    let filters = Object.assign({}, mapFilters, persistentMapFilter);
    filters = Object.keys(filters).map(key => {
      const path = filterPaths[key];
      return { path, value: filters[key] };
    });
    this.props._setPartnerDeploymentFilter(this.props.match.params.id, filters);
  }

  renderAppeals () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.countryOperations;

    if (error || fetching) return null;

    const { id, name } = this.props.adminArea.data;

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
        <React.Fragment>
          <DisplayTable
            headings={headings}
            rows={rows}
            onPageChange={this.handlePageChange.bind(this, 'appeals')}
            noPaginate={true}
          />
          <div className='fold__footer'>
            <Link className='link--primary export--link' to={'/appeals/all/?country=' + id}>View All Operations For {name}</Link>
          </div>
        </React.Fragment>
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
    const poverty = get(data, 'Poverty.value');
    const literacy = get(data, 'Literacy.value');
    const urbanPop = get(data, 'UrbPop.value');

    // get unique years of data
    let years = {};
    Object.keys(data).map(d => data[d].year).forEach(year => {
      if (!years[year]) { years[year] = true; }
    });

    return (
      <div className='inpage__header-col'>
        <div className='content-list-group'>
          <div className='content-list'>
            <h3>Country Statistics</h3>
            <ul>
              <li>Population<span className='content-highlight'>{bigN(population)}</span></li>
              <li>Urban Pop <span className='content-highlight'>{urbanPop ? urbanPop + '%' : nope}</span></li>
              <li>GDP<span className='content-highlight'>{gdp ? '$' + bigN(gdp) : nope}</span></li>
              <li>GNI / Capita<span className='content-highlight'>{n(get(data, 'GNIPC.value'))}</span></li>
              <li>Poverty (% pop)<span className='content-highlight'>{poverty ? poverty + '%' : nope}</span></li>
              <li>Life Expectancy <span className='content-highlight'>{n(get(data, 'LifeExp.value'))}</span></li>
              <li>Literacy <span className='content-highlight'>{literacy ? literacy + '%' : nope}</span></li>
            </ul>
          </div>
          <div className='content-list'>
            <h3>National Society</h3>
            <ul>
              <li>Income (CHF)<span className='content-highlight'>{bigN(get(data, 'KPI_IncomeLC_CHF.value'))}</span></li>
              <li>Expenditures (CHF)<span className='content-highlight'>{bigN(get(data, 'KPI_expenditureLC_CHF.value'))}</span></li>
              <li>Volunteers<span className='content-highlight'>{n(get(data, 'KPI_PeopleVol_Tot.value'))}</span></li>
              <li>People reached<span className='content-highlight'>{n(get(data, 'KPI_ReachDRER_D_Tot.value'))}</span></li>
              <li>People giving blood<span className='content-highlight'>{n(get(data, 'KPI_DonBlood_Tot.value'))}</span></li>
              <li>Trained in first aid<span className='content-highlight'>{n(get(data, 'KPI_TrainFA_Tot.value'))}</span></li>
            </ul>
          </div>
        </div>
        <p>Source: FDRS | Reporting year(s): {Object.keys(years).sort().join(', ')}</p>
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

    const { partnerDeployments } = this.props;
    return (
      <section className='inpage'>
        <Helmet>
          <title>IFRC Go - {get(data, 'name', 'Country')}</title>
        </Helmet>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{data.name}{data.inform_score ? <span className='inpage__title--inform'>Inform Score: <span className='inpage__title--inform--score'>{round(data.inform_score, 1)}</span></span> : null}</h1>
              <div className='inpage__header-actions'>
                <a href={url.resolve(api, `admin/api/country/${data.id}/change/`)}
                  className='button button--primary-bounded'>Edit Country</a>
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
                    {data.overview || data.key_priorities ? <li><a href='#overview' title='Go to Overview'>Overview</a></li> : null}
                    {get(this.props.keyFigures, 'data.results.length') ? <li><a href='#key-figures' title='Go to Key Figures section'>Key Figures</a></li> : null}
                    <li><a href='#operations-map' title='Go to Operations section'>Operations</a></li>
                    <li><a href='#emergencies' title='Go to Emergencies section'>Emergencies</a></li>
                    {get(this.props.snippets, 'data.results.length') ? <li><a href='#graphics' title='Go to Graphics section'>Graphics</a></li> : null}
                    {get(data, 'links.length') ? <li><a href='#links' title='Go to Links section'>Links</a></li> : null}
                    {get(data, 'contacts.length') ? <li><a href='#contacts' title='Go to Contacts section'>Contacts</a></li> : null}
                  </ul>
                </div>
              </div>
            )}
          </Sticky>
          <div className='inpage__body'>
            <div className='inner'>
              {data.overview || data.key_priorities ? (
                <Fold title='Overview' id='overview'>
                  {data.overview ? <ReactMarkdown source={data.overview} /> : null}
                  {data.key_priorities ? <ReactMarkdown source={data.key_priorities} /> : null}
                </Fold>
              ) : null}
              <KeyFigures data={this.props.keyFigures} />
              <Fold title='Statistics' headerClass='visually-hidden' id='operations'>
                <div className='operations__container'>
                  <div className='country__operations'>
                    <h2>Movement activities in support of NS</h2>
                    <BulletTable title='Activities'
                      onClick={this.setPersistentMapFilter.bind(this, 'ns')}
                      onMouseOver={this.setMapFilter.bind(this, 'ns')}
                      onMouseOut={this.removeMapFilter.bind(this, 'ns')}
                      rows={get(partnerDeployments, 'data.parentSocieties', [])} />
                    <BulletTable title='Type'
                      onClick={this.setPersistentMapFilter.bind(this, 'type')}
                      onMouseOver={this.setMapFilter.bind(this, 'type')}
                      onMouseOut={this.removeMapFilter.bind(this, 'type')}
                      rows={get(partnerDeployments, 'data.activities', [])} />
                  </div>
                  <div className={mapContainerClass}>
                    <Homemap operations={this.props.appealStats}
                      bbox={bbox}
                      deployments={this.props.partnerDeployments}
                      deploymentsKey='PNS Activities'
                      noRenderEmergencies={true}
                      noExport={true}
                    />
                  </div>
                </div>
                {this.renderAppeals()}
              </Fold>
              <EmergenciesTable
                id={'emergencies'}
                title='Recent Emergencies'
                limit={5}
                country={this.props.match.params.id}
                showRecent={true}
                viewAll={'/emergencies/all?country=' + data.id}
                viewAllText={`View All Emergencies For ${data.name}`}
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
    _getAdmAreaAppealsList: T.func,
    _getCountryOperations: T.func,
    _getPartnerDeployments: T.func,
    type: T.string,
    match: T.object,
    history: T.object,
    adminArea: T.object,
    appealStats: T.object,
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
  appealStats: state.adminArea.appealStats,
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
  _getAdmAreaAppealsList: (...args) => dispatch(getAdmAreaAppealsList(...args)),
  _getAdmAreaKeyFigures: (...args) => dispatch(getAdmAreaKeyFigures(...args)),
  _getAdmAreaSnippets: (...args) => dispatch(getAdmAreaSnippets(...args)),
  _getCountryOperations: (...args) => dispatch(getCountryOperations(...args)),
  _getPartnerDeployments: (...args) => dispatch(getPartnerDeployments(...args)),
  _setPartnerDeploymentFilter: (...args) => dispatch(setPartnerDeploymentFilter(...args)),
  _getFdrs: (...args) => dispatch(getFdrs(...args))
});

export default connect(selector, dispatcher)(AdminArea);
