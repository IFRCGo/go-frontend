import React from 'react';
import memoize from 'memoize-one';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Helmet } from 'react-helmet';
import _cs from 'classnames';
import url from 'url';

import { countries } from '../utils/field-report-constants';
import { environment, api } from '../config';
import { showGlobalLoading, hideGlobalLoading } from '../components/global-loading';
import BasicTable from '../components/common/table-basic';
import { get, dateOptions, datesAgo, dTypeOptions } from '../utils/utils/';
import { commaSeparatedNumber as n, commaSeparatedLargeNumber as bigN, nope, round } from '../utils/format';
import {
  getAdmAreaById,
  getAdmAreaAppealsList,
  getAdmAreaKeyFigures,
  getAdmAreaSnippets,
  getCountryOperations,
  getPartnerDeployments,
  setPartnerDeploymentFilter,
  getPerNsPhase,
  getPerOverviewForm,
  getPerWorkPlan,
  getPerDocument,
  getPerDocuments,
  getPerUploadedDocuments,
  getPerMission,
  getProjects,
  getAppealsListStats
} from '../actions';
import { getFdrs } from '../actions/query-external';
// import { getBoundingBox } from '../utils/country-bounding-box';

import App from './app';
import ErrorPanel from '../components/error-panel';
import TabContent from '../components/tab-content';
import Fold from '../components/fold';
import DisplayTable, { SortHeader, FilterHeader } from '../components/display-table';
import EmergenciesTable from '../components/connected/emergencies-table';

// import BulletTable from '../components/bullet-table';
import Pills from '../components/pills';
import {
  Snippets,
  // KeyFigures,
  Contacts,
  Links
} from '../components/admin-area-elements';
import PreparednessOverview from '../components/country/preparedness-overview';
import PreparednessSummary from '../components/country/preparedness-summary';
import PreparednessWorkPlan from '../components/country/preparedness-work-plan';
import PreparednessPhaseOutcomes from '../components/country/preparedness-phase-outcomes';
import PreparednessColumnBar from '../components/country/preparedness-column-graph';
import KeyFiguresHeader from '../components/common/key-figures-header';
import { SFPComponent } from '../utils/extendables';
import { NO_DATA } from '../utils/constants';
import { getRegionSlug } from '../utils/region-constants';
import { getISO3 } from '../utils/country-iso';

import ThreeW from './ThreeW';
import CountryOverview from './CountryOverview';
import ProjectForm from './ThreeW/project-form';

const emptyList = [];
const emptyObject = {};

const TAB_DETAILS = [
  { title: 'Operations', hash: '#operations' },
  { title: '3w', hash: '#3w' },
  { title: 'Country Overview', hash: '#overview' },
  { title: 'Preparedness', hash: '#preparedness' },
  { title: 'Additional Information', hash: '#additional' }
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
      persistentMapFilter: {},
      showProjectForm: false,
    };
    this.setMapFilter = this.setMapFilter.bind(this);
    this.setPersistentMapFilter = this.setPersistentMapFilter.bind(this);
    this.removeMapFilter = this.removeMapFilter.bind(this);
    this.componentIsLoading = true;
    this.threeWFilters = {};
  }

  componentWillReceiveProps (nextProps) {
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

    if (this.props.projectForm.fetching === true &&
      nextProps.projectForm.fetching === false &&
      nextProps.projectForm.error === null
    ) {
      // new project was successfully added
      this.props._getProjects(this.props.match.params.id, this.threeWFilters);
      this.setState({ showProjectForm: false });
    }
  }

  componentDidMount () {
    this.componentIsLoading = true;
    this.displayTabContent();
    this.getData(this.props);
    this.getAdmArea(this.props.type, getCountryId(this.props.match.params.id));
    this.props._getPerNsPhase(this.props.match.params.id);
    this.props._getPerOverviewForm(this.props.match.params.id);
    this.props._getPerWorkPlan(this.props.match.params.id);
    this.props._getPerDocuments();
    this.props._getPerDocument(null, this.props.match.params.id);
    this.props._getPerUploadedDocuments(this.props.match.params.id);
    this.props._getProjects(this.props.match.params.id, this.threeWFilters);
    if (typeof this.props.user.username !== 'undefined' && this.props.user.username !== null) {
      this.props._getPerMission();
    }
  }
  // Sets default tab if url param is blank or incorrect
  displayTabContent () {
    const tabHashArray = TAB_DETAILS.map(({ hash }) => hash);
    if (!tabHashArray.find(hash => hash === this.props.location.hash)) {
      this.props.history.replace(`${this.props.location.pathname}${tabHashArray[0]}`);
    }
  }

  getProjectList = memoize((projects) => {
    if (!projects || !projects.fetched) {
      return emptyList;
    }

    if (!projects.data || !projects.data.results || !projects.data.results.length) {
      return emptyList;
    }

    const projectList = projects.data.results;
    return projectList;
  });

  getData (props) {
    const type = 'country';
    const id = getCountryId(props.match.params.id);
    this.props._getAdmAreaAppealsList(type, id);
    this.props._getAdmAreaKeyFigures(type, id);
    this.props._getAdmAreaSnippets(type, id);
    this.props._getCountryOperations(type, id);
    this.props._getPartnerDeployments(type, id);
    this.props._getFdrs(id);
    this.props._getAppealsListStats({countryId: id});
  }

  getAdmArea (type, id) {
    // showGlobalLoading();
    this.props._getAdmAreaById(type, id);
  }

  syncLoadingAnimation = memoize((
    projects = emptyObject,
    projectForm = emptyObject,
    adminArea = emptyObject,
    fdrs = emptyObject,
    perForm = emptyObject,
    user = emptyObject,
  ) => {
    const shouldShowLoadingAnimation = projects.fetching ||
      projectForm.fetching ||
      adminArea.fetching ||
      fdrs.fetching ||
      perForm.fetching ||
      user.fetching;

    if (shouldShowLoadingAnimation && !this.loading) {
      showGlobalLoading();
      this.loading = true;
    } else {
      if (this.loading) {
        hideGlobalLoading();
      }

      this.loading = false;
    }
  })

  // gets links to display in the pills at bottom of the tabs
  getLinks () {
    const { adminArea } = this.props;
    if (!adminArea.fetched) return false;
    const iso2 = adminArea.data.iso;
    const iso3 = getISO3(iso2);
    const homepage = adminArea.data.society_url;
    const regionSlug = getRegionSlug(adminArea.data.region);
    const countryLower = adminArea.data.name.toLowerCase();
    const links = [];

    if (regionSlug) {
      const ifrcLink = {
        'text': `${adminArea.data.name} on IFRC.org`,
        'url': `https://www.ifrc.org/en/news-and-media/news-stories/${regionSlug}/${countryLower}/`
      };
      links.push(ifrcLink);
    }

    if (iso3) {
      const reliefWebLink = {
        'text': `${adminArea.data.name} on reliefweb.int`,
        'url': `https://reliefweb.int/country/${iso3}`
      };
      links.push(reliefWebLink);
    }

    if (homepage) {
      const homepageLink = {
        'text': `${adminArea.data.name} RC Homepage`,
        'url': homepage
      };
      links.push(homepageLink);
    }

    return links;
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
    this.props._getCountryOperations(
      this.props.type,
      getCountryId(this.props.match.params.id),
      this.state[what].page,
      this.computeFilters(what)
    );
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
    this.props._setPartnerDeploymentFilter(getCountryId(this.props.match.params.id), filters);
  }

  handleThreeWFilterChange = (filterValues) => {
    this.threeWFilters = filterValues;
    this.props._getProjects(this.props.match.params.id, filterValues);
  }

  handleProjectAddButtonClick = () => {
    this.setState({
      showProjectForm: true,
      projectToEdit: undefined,
    });
  }

  handleProjectEditButtonClick = (project) => {
    this.setState({
      showProjectForm: true,
      projectToEdit: project,
    });
    // console.warn(project);
  }

  renderAppeals () {
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
              id='date'
              title='Start Date'
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
              id='name'
              title='Name'
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
              id='dtype'
              title='Disaster Type'
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
              id='amount_requested'
              title='Requested Amount (CHF)'
              sort={this.state.appeals.sort}
              onClick={this.handleSortChange.bind(this, 'appeals', 'amount_requested')}
            />
          )
        },
        {
          id: 'fundedAmount',
          label: (
            <SortHeader
              id='amount_funded'
              title='Funding (CHF)'
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
          <Link to={`/emergencies/${o.event}`} className='link--primary' title='View Emergency'>
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
          <div className='fold__footer'>
            <Link className='link--primary export--link' to={'/appeals/all/?country=' + id}>
              View All Operations For {name}
            </Link>
          </div>
        </React.Fragment>
      );
    }
    return null;
  }

  isPerPermission () {
    return (typeof this.props.user.username !== 'undefined' && this.props.user.username !== null) &&
      (typeof this.props.getPerMission !== 'undefined' && this.props.getPerMission.fetched && this.props.getPerMission.data.count > 0);
  }

  getCountryProfileData = () => {
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

    const statistics = {
      countryStatistics: [
        {
          title: 'Population',
          value: bigN(population)
        },
        {
          title: 'Urban Pop',
          value: urbanPop ? urbanPop + '%' : nope
        },
        {
          title: 'GDP',
          value: gdp ? '$' + bigN(gdp) : nope
        },
        {
          title: 'GNI / Capita',
          value: n(get(data, 'GNIPC.value'))
        },
        {
          title: 'Poverty (% pop)',
          value: poverty ? poverty + '%' : nope
        },
        {
          title: 'Life Expectancy',
          value: n(get(data, 'LifeExp.value'))
        },
        {
          title: 'Literacy',
          value: literacy ? literacy + '%' : nope
        }
      ],
      nationalSociety: [
        {
          title: 'Income (CHF)',
          value: bigN(get(data, 'KPI_IncomeLC_CHF.value'))
        },
        {
          title: 'Expenditures (CHF)',
          value: bigN(get(data, 'KPI_expenditureLC_CHF.value'))
        },
        {
          title: 'Volunteers',
          value: n(get(data, 'KPI_PeopleVol_Tot.value'))
        },
        {
          title: 'Trained in first aid',
          value: n(get(data, 'KPI_TrainFA_Tot.value'))
        }
      ],
      source: {
        url: 'http://data.ifrc.org/fdrs/',
        title: 'FDRS',
        reportingYears: years
      }
    };

    return statistics;
  }

  renderCountryProfile = () => {
    const data = this.getCountryProfileData();

    if (!data) {
      return null;
    }

    return (
      <React.Fragment>
        <div className='table__basic-grid'>
          <BasicTable tableContents={data.countryStatistics} tableTitle='Country Statistics' />
          <BasicTable tableContents={data.nationalSociety} tableTitle='National Society' />
        </div>
        <div className='table__basic-footer'>
          <p>
            <a href='http://data.ifrc.org/fdrs/' target='_blank'>
              Source: {data.source ? data.source.title : '-'}
            </a>
          </p>
          <p className='table__basic-footer-line'>
           | Reporting year(s): {Object.keys((data.source || {}).reportingYears || []).sort().join(', ') || 'N/A'}
          </p>
        </div>
      </React.Fragment>
    );
  }

  renderContent () {
    const {
      fetched,
      error,
      data
    } = this.props.adminArea;
    const countryLinks = this.getLinks();
    if (!fetched || error) return null;

    // const bbox = getBoundingBox(data.iso);
    // const mapContainerClass = 'country__map';

    // const { partnerDeployments } = this.props;

    const handleTabChange = index => {
      const tabHashArray = TAB_DETAILS.map(({ hash }) => hash);
      const url = this.props.location.pathname;
      this.props.history.replace(`${url}${tabHashArray[index]}`);
    };

    return (
      <section className='inpage'>
        <Helmet>
          <title>IFRC Go - {get(data, 'name', 'Country')}</title>
        </Helmet>
        <header className='inpage__header'>
          <div className='inner'>
            <h1 className='inpage__title'>
              {data.name}
              {data.inform_score ? (
                <span className='inpage__title--inform'>
                    Inform Score: <span className='inpage__title--inform--score'>{round(data.inform_score, 1)}</span>
                </span>
              ) : null}
            </h1>
            <div className='inpage__header-actions'>
              <a
                href={url.resolve(api, `api/country/${data.id}/change/`)}
                className='button button--primary-bounded'
              >
                  Edit Country
              </a>
            </div>
          </div>
        </header>
        <section className='inpage__body'>
          <div className='inner'>
            <KeyFiguresHeader appealsListStats={this.props.appealsListStats}/>
          </div>
        </section>
        <Tabs
          selectedIndex={TAB_DETAILS.map(({ hash }) => hash).indexOf(this.props.location.hash)}
          onSelect={index => handleTabChange(index)}
        >
          <TabList>
            {TAB_DETAILS.map(tab => (
              <Tab key={tab.title}>{tab.title}</Tab>
            ))}
          </TabList>
          <div className='inpage__body'>
            <div className='inner'>
              <TabPanel>
                <TabContent>
                  <Fold title='Statistics' headerClass='visually-hidden' id='operations'>
                    {/*
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
                        <CountryMap operations={this.props.appealStats}
                          bbox={bbox}
                          deployments={this.props.partnerDeployments}
                          deploymentsKey='Additional Response Activities' // From Elsa instead of 'PNS Activities'
                          noRenderEmergencies={true}
                          noExport={true}
                        />
                      </div>
                    </div>
                    */}
                    {this.renderAppeals()}
                  </Fold>
                </TabContent>
                <TabContent>
                  <EmergenciesTable
                    id={'emergencies'}
                    title='Recent Emergencies'
                    limit={5}
                    country={getCountryId(this.props.match.params.id)}
                    showRecent={true}
                    viewAll={'/emergencies/all?country=' + data.id}
                    viewAllText={`View All Emergencies For ${data.name}`}
                  />
                </TabContent>
              </TabPanel>
              <TabPanel>
                <TabContent>
                  <ThreeW
                    disabled={this.loading}
                    projectList={this.getProjectList(this.props.projects)}
                    countryId={getCountryId(this.props.match.params.id)}
                    onFilterChange={this.handleThreeWFilterChange}
                    onAddButtonClick={this.handleProjectAddButtonClick}
                    user={this.props.user}
                    onEditButtonClick={this.handleProjectEditButtonClick}
                  />
                </TabContent>
              </TabPanel>
              <TabPanel>
                <TabContent title='Overview'>
                  <CountryOverview countryId={getCountryId(this.props.match.params.id)} />
                  {/*
                  <Fold title='Overview' id='overview'>
                    { this.renderCountryProfile() }
                  </Fold>
                  */}
                </TabContent>
                {/*
                <TabContent isError={!data.overview || data.key_priorities} errorMessage={ NO_DATA } title="Overview">
                  <Fold title="Overview" id="overview">
                    {data.overview ? <ReactMarkdown source={data.overview} /> : null}
                    {data.key_priorities ? <ReactMarkdown source={data.key_priorities} /> : null}
                  </Fold>
                </TabContent>
                <TabContent showError={true} isError={!get(this.props.keyFigures, 'data.results.length')} errorMessage={ NO_DATA } title='Key Figures'>
                  <KeyFigures data={this.props.keyFigures} />
                </TabContent>
                */}
              </TabPanel>
              <TabPanel>
                <TabContent showError={true} isError={!this.isPerPermission()} errorMessage='Please log in' title='Preparedness'>
                  {this.props.getPerNsPhase.fetched && this.props.perOverviewForm.fetched ? (
                    <PreparednessOverview getPerNsPhase={this.props.getPerNsPhase} perOverviewForm={this.props.perOverviewForm} />)
                    : <ErrorPanel title='Preparedness Overciew' errorMessage={ NO_DATA } />}
                  {this.props.getPerDocument.fetched && this.props.getPerDocuments.fetched ? (
                    <PreparednessSummary getPerDocument={this.props.getPerDocument} getPerDocuments={this.props.getPerDocuments} />)
                    : <ErrorPanel title='Preparedness Summary' errorMessage={ NO_DATA } />}
                  {this.props.getPerDocument.fetched && this.props.getPerDocuments.fetched ? (
                    <PreparednessColumnBar getPerDocument={this.props.getPerDocument} getPerDocuments={this.props.getPerDocuments} />)
                    : <ErrorPanel title='Preparedness Column Bar' errorMessage={ NO_DATA } />}
                  {this.props.getPerWorkPlan.fetched ? (
                    <PreparednessWorkPlan getPerWorkPlan={this.props.getPerWorkPlan} />)
                    : <ErrorPanel title='Preparedness Work Plan' errorMessage={ NO_DATA } />}
                  {this.props.getPerUploadedDocuments.fetched ? (
                    <PreparednessPhaseOutcomes getPerUploadedDocuments={this.props.getPerUploadedDocuments} countryId={this.props.match.params.id} />)
                    : <ErrorPanel title='Preparedness Phase Outcomes' errorMessage={ NO_DATA } />}
                </TabContent>
              </TabPanel>
              <TabPanel>
                <TabContent isError={!get(this.props.snippets, 'data.results.length')} errorMessage={ NO_DATA } title='Graphics'>
                  <Snippets data={this.props.snippets} />
                </TabContent>
                <TabContent showError={true} isError={!get(data, 'contacts.length')} errorMessage={ NO_DATA } title='Contacts'>
                  <Contacts data={data} />
                </TabContent>
                <TabContent isError={!get(data, 'links.length')} errorMessage={ NO_DATA } title='Links'>
                  <Links data={data} />
                </TabContent>
              </TabPanel>
            </div>
          </div>
        </Tabs>
        <div className='inpage__body'>
          <div className='inner'>
            { countryLinks ? <Pills links={countryLinks} /> : null }
          </div>
        </div>
      </section>
    );
  }

  syncBodyOverflow = (shouldOverflow) => {
    if (shouldOverflow) {
      document.getElementsByTagName('html')[0].style.overflow = 'hidden';
    } else {
      document.getElementsByTagName('html')[0].style.overflow = 'auto';
    }
  }

  render () {
    const {
      showProjectForm,
    } = this.state;

    const {
      projects,
      projectForm,
      adminArea,
      fdrs,
      perForm,
      user,
    } = this.props;

    this.syncBodyOverflow(showProjectForm);
    this.syncLoadingAnimation(
      projects,
      projectForm,
      adminArea,
      fdrs,
      perForm,
      user,
    );

    return (
      <App className={`page--${this.props.type}`}>
        <Helmet>
          <title>IFRC Go - Country</title>
        </Helmet>
        { this.renderContent() }
        { showProjectForm && (
          <div className='project-form-modal'>
            <header>
              <h2>
                Movement activities in support of NS
              </h2>
              <button
                className={
                  _cs(
                    'button button--secondary-bounded',
                    this.loading && 'disabled',
                  )
                }
                onClick={() => {
                  this.setState({ showProjectForm: false });
                }}
                disabled={this.loading}
              >
                Close
              </button>
            </header>
            <ProjectForm
              projectData={this.state.projectToEdit}
              countryId={getCountryId(this.props.match.params.id)}
            />
          </div>
        )}
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
    _getPerDocument: T.func,
    _getPerDocuments: T.func,
    _getPeruploadedDocuments: T.func,
    _getAppealsListStats: T.func,
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
  projects: state.projects,
  projectForm: state.projectForm,
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
  fdrs: state.fdrs,
  getPerNsPhase: state.perForm.getPerNsPhase,
  perOverviewForm: state.perForm.getPerOverviewForm,
  getPerWorkPlan: state.perForm.getPerWorkPlan,
  getPerDocument: state.perForm.getPerDocument,
  getPerDocuments: state.perForm.getPerDocuments,
  getPerUploadedDocuments: state.perForm.getPerUploadedDocuments,
  getPerMission: state.perForm.getPerMission,
  user: state.user.data,
  appealsListStats: state.overallStats.appealsListStats
});

const dispatcher = dispatch => ({
  _getAdmAreaById: (...args) => dispatch(getAdmAreaById(...args)),
  _getAdmAreaAppealsList: (...args) => dispatch(getAdmAreaAppealsList(...args)),
  _getAdmAreaKeyFigures: (...args) => dispatch(getAdmAreaKeyFigures(...args)),
  _getAdmAreaSnippets: (...args) => dispatch(getAdmAreaSnippets(...args)),
  _getCountryOperations: (...args) => dispatch(getCountryOperations(...args)),
  _getPartnerDeployments: (...args) => dispatch(getPartnerDeployments(...args)),
  _setPartnerDeploymentFilter: (...args) => dispatch(setPartnerDeploymentFilter(...args)),
  _getFdrs: (...args) => dispatch(getFdrs(...args)),
  _getPerNsPhase: (...args) => dispatch(getPerNsPhase(...args)),
  _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args)),
  _getPerWorkPlan: (...args) => dispatch(getPerWorkPlan(...args)),
  _getPerDocument: (...args) => dispatch(getPerDocument(...args)),
  _getPerDocuments: (...args) => dispatch(getPerDocuments(...args)),
  _getPerUploadedDocuments: (...args) => dispatch(getPerUploadedDocuments(...args)),
  _getPerMission: (...args) => dispatch(getPerMission(...args)),
  _getProjects: (...args) => dispatch(getProjects(...args)),
  _getAppealsListStats: (...args) => dispatch(getAppealsListStats(...args)),
});

export default connect(
  selector,
  dispatcher
)(AdminArea);
