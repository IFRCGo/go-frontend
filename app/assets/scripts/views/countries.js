'use strict';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import memoize from 'memoize-one';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

import { Helmet } from 'react-helmet';
import url from 'url';

import { countries } from '../utils/field-report-constants';
import { environment, api } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import { get, dateOptions, datesAgo, dTypeOptions } from '../utils/utils/';
import { commaSeparatedNumber as n, commaSeparatedLargeNumber as bigN, nope, round } from '../utils/format';
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
import ErrorPanel from '../components/error-panel';
import Homemap from '../components/homemap';
import DisplayTable, { SortHeader, FilterHeader } from '../components/display-table';
import EmergenciesTable from '../components/connected/emergencies-table';
import BulletTable from '../components/bullet-table';
import { Snippets, KeyFigures, Contacts, Links } from '../components/admin-area-elements';
import { SFPComponent } from '../utils/extendables';

const TAB_DETAILS = [
  { title: 'Overview', hash: '#overview' },
  { title: 'Key Figures', hash: '#key-figures' },
  { title: 'Operations', hash: '#operations-map' },
  { title: 'Emergencies', hash: '#emergencies' },
  { title: 'Graphics', hash: '#graphics' },
  { title: 'Links', hash: '#links' },
  { title: 'Contacts', hash: '#contacts' }
];

const filterPaths = {
  ns: 'parent.name',
  type: 'activity.activity'
};

const getCountryId = memoize(idOrName => {
  // If country name
  if (isNaN(idOrName)) {
    const countryMeta = countries.find(d => d.label.toLowerCase() === decodeURI(idOrName.toLowerCase()));
    return countryMeta !== undefined ? countryMeta.value : idOrName;
  }
  return idOrName;
});

class AdminArea extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor(props) {
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

  componentWillReceiveProps(nextProps) {
    if (getCountryId(this.props.match.params.id) !== getCountryId(nextProps.match.params.id)) {
      this.getData(nextProps);
      return this.getAdmArea(nextProps.type, getCountryId(nextProps.match.params.id));
    }

    if (this.props.adminArea.fetching && !nextProps.adminArea.fetching) {
      hideGlobalLoading();
      if (nextProps.adminArea.error) {
        this.props.history.push('/uhoh');
      }
    }
  }

  componentDidMount() {
    this.getData(this.props);
    this.getAdmArea(this.props.type, getCountryId(this.props.match.params.id));
    this.displayTabContent();
  }

  // Sets default tab if url param is blank or incorrect
  displayTabContent() {
    const tabHashArray = TAB_DETAILS.map(({ hash }) => hash);
    if (!tabHashArray.find(hash => hash === this.props.location.hash)) {
      this.props.history.replace(`${this.props.location.pathname}${tabHashArray[0]}`);
    }
  }

  getData(props) {
    const type = 'country';
    const id = getCountryId(props.match.params.id);
    this.props._getAdmAreaAppealsList(type, id);
    this.props._getAdmAreaKeyFigures(type, id);
    this.props._getAdmAreaSnippets(type, id);
    this.props._getCountryOperations(type, id);
    this.props._getPartnerDeployments(type, id);
    this.props._getFdrs(id);
  }

  getAdmArea(type, id) {
    showGlobalLoading();
    this.props._getAdmAreaById(type, id);
  }

  computeFilters(what) {
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

  updateData(what) {
    this.props._getCountryOperations(
      this.props.type,
      getCountryId(this.props.match.params.id),
      this.state[what].page,
      this.computeFilters(what)
    );
  }

  setMapFilter(type, value) {
    let filters = Object.assign({}, this.state.mapFilters);
    filters[type] = value;
    this.setState({ mapFilters: filters }, this.syncMapFilters);
  }

  setPersistentMapFilter(type, value) {
    let filter = Object.assign({}, this.state.persistentMapFilter);
    if (filter.hasOwnProperty(type) && filter[type] === value) {
      delete filter[type];
    } else {
      filter[type] = value;
    }
    this.setState({ persistentMapFilter: filter }, this.syncMapFilters);
  }

  removeMapFilter(type) {
    let filters = Object.assign({}, this.state.mapFilters);
    delete filters[type];
    this.setState({ mapFilters: filters }, this.syncMapFilters);
  }

  syncMapFilters() {
    const { mapFilters, persistentMapFilter } = this.state;
    let filters = Object.assign({}, mapFilters, persistentMapFilter);
    filters = Object.keys(filters).map(key => {
      const path = filterPaths[key];
      return { path, value: filters[key] };
    });
    this.props._setPartnerDeploymentFilter(getCountryId(this.props.match.params.id), filters);
  }

  renderAppeals() {
    const { fetched, fetching, error, data } = this.props.countryOperations;

    if (error || fetching) return null;

    const { id, name } = this.props.adminArea.data;

    if (fetched) {
      const now = Date.now();
      const headings = [
        {
          id: 'date',
          label: (
            <FilterHeader
              id="date"
              title="Start Date"
              options={dateOptions}
              filter={this.state.appeals.filters.date}
              onSelect={this.handleFilterChange.bind(this, 'appeals', 'date')}
            />
          )
        },
        {
          id: 'name',
          label: (
            <SortHeader
              id="name"
              title="Name"
              sort={this.state.appeals.sort}
              onClick={this.handleSortChange.bind(this, 'appeals', 'name')}
            />
          )
        },
        { id: 'event', label: 'Emergency' },
        {
          id: 'dtype',
          label: (
            <FilterHeader
              id="dtype"
              title="Disaster Type"
              options={dTypeOptions}
              filter={this.state.appeals.filters.dtype}
              onSelect={this.handleFilterChange.bind(this, 'appeals', 'dtype')}
            />
          )
        },
        {
          id: 'requestAmount',
          label: (
            <SortHeader
              id="amount_requested"
              title="Requested Amount (CHF)"
              sort={this.state.appeals.sort}
              onClick={this.handleSortChange.bind(this, 'appeals', 'amount_requested')}
            />
          )
        },
        {
          id: 'fundedAmount',
          label: (
            <SortHeader
              id="amount_funded"
              title="Funding (CHF)"
              sort={this.state.appeals.sort}
              onClick={this.handleSortChange.bind(this, 'appeals', 'amount_funded')}
            />
          )
        },
        { id: 'active', label: 'Active' }
      ];

      const rows = data.results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.start_date).toISODate(),
        name: o.name,
        event: o.event ? (
          <Link to={`/emergencies/${o.event}`} className="link--primary" title="View Emergency">
            Link
          </Link>
        ) : (
            nope
          ),
        dtype: o.dtype,
        requestAmount: n(o.amount_requested),
        fundedAmount: n(o.amount_funded),
        active: new Date(o.end_date).getTime() > now ? 'Active' : 'Inactive'
      }));

      return (
        <React.Fragment>
          <DisplayTable
            headings={headings}
            rows={rows}
            onPageChange={this.handlePageChange.bind(this, 'appeals')}
            noPaginate={true}
          />
          <div className="fold__footer">
            <Link className="link--primary export--link" to={'/appeals/all/?country=' + id}>
              View All Operations For {name}
            </Link>
          </div>
        </React.Fragment>
      );
    }
    return null;
  }

  renderStats() {
    const {
      fetched,
      error,
      data: { stats }
    } = this.props.appealStats;

    if (!fetched || error) {
      return null;
    }

    return (
      <div className="inpage__headline-stats">
        <div className="header-stats">
          <ul className="stats-list">
            <li className="stats-list__item stats-people">
              {n(stats.numBeneficiaries)}
              <small>Targeted people in ongoing operations</small>
            </li>
            <li className="stats-list__item stats-funding stat-borderless stat-double">
              {n(stats.amountRequested)}
              <small>Requested Amount (CHF)</small>
            </li>
            <li className="stats-list__item stat-double">
              {n(stats.amountFunded)}
              <small>Funding (CHF)</small>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  renderCountryProfile() {
    const { fetched, data } = this.props.fdrs;
    if (!fetched) {
      return null;
    }
    const population = get(data, 'Population.value');
    const gdp = get(data, 'GDP.value');
    const poverty = get(data, 'Poverty.value');
    const literacy = get(data, 'Literacy.value');
    const urbanPop = get(data, 'UrbPop.value');

    // get unique years of data
    let years = {};
    Object.keys(data)
      .map(d => data[d].year)
      .forEach(year => {
        if (!years[year]) {
          years[year] = true;
        }
      });

    return (
      <div className="inpage__header-col">
        <div className="content-list-group">
          <div className="content-list">
            <h3>Country Statistics</h3>
            <ul>
              <li>
                Population
                <span className="content-highlight">{bigN(population)}</span>
              </li>
              <li>
                Urban Pop <span className="content-highlight">{urbanPop ? urbanPop + '%' : nope}</span>
              </li>
              <li>
                GDP
                <span className="content-highlight">{gdp ? '$' + bigN(gdp) : nope}</span>
              </li>
              <li>
                GNI / Capita
                <span className="content-highlight">{n(get(data, 'GNIPC.value'))}</span>
              </li>
              <li>
                Poverty (% pop)
                <span className="content-highlight">{poverty ? poverty + '%' : nope}</span>
              </li>
              <li>
                Life Expectancy <span className="content-highlight">{n(get(data, 'LifeExp.value'))}</span>
              </li>
              <li>
                Literacy <span className="content-highlight">{literacy ? literacy + '%' : nope}</span>
              </li>
            </ul>
          </div>
          <div className="content-list">
            <h3>National Society</h3>
            <ul>
              <li>
                Income (CHF)
                <span className="content-highlight">{bigN(get(data, 'KPI_IncomeLC_CHF.value'))}</span>
              </li>
              <li>
                Expenditures (CHF)
                <span className="content-highlight">{bigN(get(data, 'KPI_expenditureLC_CHF.value'))}</span>
              </li>
              <li>
                Volunteers
                <span className="content-highlight">{n(get(data, 'KPI_PeopleVol_Tot.value'))}</span>
              </li>
              <li>
                Trained in first aid
                <span className="content-highlight">{n(get(data, 'KPI_TrainFA_Tot.value'))}</span>
              </li>
            </ul>
          </div>
        </div>
        <p>
          Source:{' '}
          <a href="http://data.ifrc.org/fdrs/" target="_blank">
            FDRS
          </a>{' '}
          | Reporting year(s):{' '}
          {Object.keys(years)
            .sort()
            .join(', ')}
        </p>
      </div>
    );
  }

  renderContent() {
    const { fetched, error, data } = this.props.adminArea;

    if (!fetched || error) return null;

    const bbox = getBoundingBox(data.iso);
    const mapContainerClass = 'country__map';

    const handleTabChange = index => {
      const tabHashArray = TAB_DETAILS.map(({ hash }) => hash);
      const url = this.props.location.pathname;
      this.props.history.replace(`${url}${tabHashArray[index]}`);
    };

    const { partnerDeployments } = this.props;
    return (
      <section className="inpage">
        <Helmet>
          <title>IFRC Go - {get(data, 'name', 'Country')}</title>
        </Helmet>
        <header className="inpage__header">
          <div className="inner">
            <div className="inpage__headline">
              <h1 className="inpage__title">
                {data.name}
                {data.inform_score ? (
                  <span className="inpage__title--inform">
                    Inform Score: <span className="inpage__title--inform--score">{round(data.inform_score, 1)}</span>
                  </span>
                ) : null}
              </h1>
              <div className="inpage__header-actions">
                <a
                  href={url.resolve(api, `admin/api/country/${data.id}/change/`)}
                  className="button button--primary-bounded"
                >
                  Edit Country
                </a>
              </div>
            </div>
            <div className="inpage__header-col">{this.renderStats()}</div>
            {this.renderCountryProfile()}
          </div>
        </header>
        <Tabs
          selectedIndex={TAB_DETAILS.map(({ hash }) => hash).indexOf(this.props.location.hash)}
          onSelect={index => handleTabChange(index)}
        >
          <TabList>
            {TAB_DETAILS.map(tab => (
              <Tab key={tab.title}>{tab.title}</Tab>
            ))}
          </TabList>

          <div className="inpage__body">
            <div className="inner">
              <TabPanel>
                {data.overview || data.key_priorities ? (
                  <Fold title="Overview" id="overview">
                    {data.overview ? <ReactMarkdown source={data.overview} /> : null}
                    {data.key_priorities ? <ReactMarkdown source={data.key_priorities} /> : null}
                  </Fold>
                ) : (
                    <ErrorPanel title="Overview" errorMessage="Overview coming soon" />
                  )}
              </TabPanel>
              <TabPanel>
                {get(this.props.keyFigures, 'data.results.length') ? (
                  <KeyFigures data={this.props.keyFigures} />
                ) : (
                    <ErrorPanel title="Key Figures" errorMessage="Key figures coming soon" />
                  )}
              </TabPanel>
              <TabPanel>
                <Fold title="Statistics" headerClass="visually-hidden" id="operations">
                  <div className="operations__container">
                    <div className="country__operations">
                      <h2>Movement activities in support of NS</h2>
                      <BulletTable
                        title="Activities"
                        onClick={this.setPersistentMapFilter.bind(this, 'ns')}
                        onMouseOver={this.setMapFilter.bind(this, 'ns')}
                        onMouseOut={this.removeMapFilter.bind(this, 'ns')}
                        rows={get(partnerDeployments, 'data.parentSocieties', [])}
                      />
                      <BulletTable
                        title="Type"
                        onClick={this.setPersistentMapFilter.bind(this, 'type')}
                        onMouseOver={this.setMapFilter.bind(this, 'type')}
                        onMouseOut={this.removeMapFilter.bind(this, 'type')}
                        rows={get(partnerDeployments, 'data.activities', [])}
                      />
                    </div>
                    <div className={mapContainerClass}>
                      <Homemap
                        operations={this.props.appealStats}
                        bbox={bbox}
                        deployments={this.props.partnerDeployments}
                        deploymentsKey="Additional Response Activities" // From Elsa instead of 'PNS Activities'
                        noRenderEmergencies={true}
                        noExport={true}
                      />
                    </div>
                  </div>
                  {this.renderAppeals()}
                </Fold>
              </TabPanel>
              <TabPanel>
                <EmergenciesTable
                  id={'emergencies'}
                  title="Recent Emergencies"
                  limit={5}
                  country={getCountryId(this.props.match.params.id)}
                  showRecent={true}
                  viewAll={'/emergencies/all?country=' + data.id}
                  viewAllText={`View All Emergencies For ${data.name}`}
                />
              </TabPanel>
              <TabPanel>
                {get(this.props.snippets, 'data.results.length') ? (
                  <Snippets data={this.props.snippets} />
                ) : (
                    <ErrorPanel title="Graphics" errorMessage="Graphics coming soon" />
                  )}
              </TabPanel>
              <TabPanel>
                {get(data, 'links.length') ? (
                  <Links data={data} />
                ) : (
                    <ErrorPanel title="Links" errorMessage="Links coming soon" />
                  )}
              </TabPanel>
              <TabPanel>
                {get(data, 'contacts.length') ? (
                  <Contacts data={data} />
                ) : (
                    <ErrorPanel title="Contacts" errorMessage="Contacts coming soon" />
                  )}
              </TabPanel>
            </div>
          </div>
        </Tabs>
      </section>
    );
  }

  render() {
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
  adminArea: get(state.adminArea.aaData, getCountryId(ownProps.match.params.id), {
    data: {},
    fetching: false,
    fetched: false
  }),
  appealStats: state.adminArea.appealStats,
  keyFigures: state.adminArea.keyFigures,
  snippets: state.adminArea.snippets,
  countryOperations: state.adminArea.countryOperations,
  partnerDeployments: get(state.adminArea.partnerDeployments, getCountryId(ownProps.match.params.id), {
    data: {},
    fetching: false,
    fetched: false
  }),
  fdrs: state.fdrs
});

const dispatcher = dispatch => ({
  _getAdmAreaById: (...args) => dispatch(getAdmAreaById(...args)),
  _getAdmAreaAppealsList: (...args) => dispatch(getAdmAreaAppealsList(...args)),
  _getAdmAreaKeyFigures: (...args) => dispatch(getAdmAreaKeyFigures(...args)),
  _getAdmAreaSnippets: (...args) => dispatch(getAdmAreaSnippets(...args)),
  _getCountryOperations: (...args) => dispatch(getCountryOperations(...args)),
  _getPartnerDeployments: (...args) => dispatch(getPartnerDeployments(...args)),
  _setPartnerDeploymentFilter: (...args) => dispatch(setPartnerDeploymentFilter(...args)),
  _getFdrs: (...args) => dispatch(getFdrs(...args))
});

export default connect(
  selector,
  dispatcher
)(AdminArea);
