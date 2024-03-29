import React from 'react';
import memoize from 'memoize-one'; import { PropTypes as T } from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Helmet } from 'react-helmet';
import url from 'url';

import { environment, adminUrl } from '#config';
import NewGlobalLoading from '#components/NewGlobalLoading';
import { resolveToString } from '#utils/lang';
// import BasicTable from '#components/common/table-basic';
import { get, dateOptions, datesAgo } from '#utils/utils';
import {
  commaSeparatedNumber as n,
  // commaSeparatedLargeNumber as bigN,
  nope
} from '#utils/format';
import {
  getAdmAreaById,
  getAdmAreaAppealsList,
  getAdmAreaKeyFigures,
  getAdmAreaSnippets,
  getCountryOperations,
  getPartnerDeployments,
  setPartnerDeploymentFilter,
  getPerNsPhase,
  getPerOverviews,
  getPerWorkPlan,
  getPerForm,
  getPerForms,
  getPerUploadedDocuments,
  getPerMission,
  getAppealsListStats,
} from '#actions';

import { getFdrs } from '#actions/query-external';
// import { getBoundingBox } from '#utils/country-bounding-box';

import App from '#views/app';
import ErrorPanel from '#components/error-panel';
import TabContent from '#components/tab-content';
import Fold from '#components/fold';
import BreadCrumb from '#components/breadcrumb';
import DisplayTable, { SortHeader, FilterHeader } from '#components/display-table';
import EmergenciesTable from '#components/connected/emergencies-table';
import Translate from '#components/Translate';
import LanguageContext from '#root/languageContext';

// import BulletTable from '#components/bullet-table';
import Pills from '#components/pills';
import {
  Snippets,
  // KeyFigures,
  Contacts,
  Links
} from '#components/admin-area-elements';
import PreparednessOverview from '#components/country/preparedness-overview';
// import PreparednessSummary from '#components/country/preparedness-summary';
// import PreparednessWorkPlan from '#components/country/preparedness-work-plan';
// import PreparednessPhaseOutcomes from '#components/country/preparedness-phase-outcomes';
// import PreparednessColumnBar from '#components/country/preparedness-column-graph';
import KeyFiguresHeader from '#components/common/key-figures-header';
import { SFPComponent } from '#utils/extendables';

import RiskWatch from './RiskWatch';
import ThreeW from './ThreeW';
import CountryPlan from './CountryPlan';

// import CountryProfile from './CountryProfile';

import { countryByIdOrNameSelector, regionsByIdSelector, disasterTypesSelectSelector } from '#selectors';

const emptyObject = {};

const filterPaths = {
  ns: 'parent.name',
  type: 'activity.activity'
};

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
      persistentMapFilter: {},
      projectToEdit: undefined,
      projectToShowDetails: undefined,
    };
    this.setMapFilter = this.setMapFilter.bind(this);
    this.setPersistentMapFilter = this.setPersistentMapFilter.bind(this);
    this.removeMapFilter = this.removeMapFilter.bind(this);
    this.componentIsLoading = true;
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const newCountryId = nextProps.country.id; // getCountryId(nextProps.match.params.id, this.props.countries);
    const oldCountryId = this.props.country.id; // getCountryId(this.props.match.params.id, this.props.countries);
    if (oldCountryId !== newCountryId) {
      // this.getData(nextProps);
      this.loadCountry(nextProps, newCountryId);
    }

    if (this.props.adminArea.fetching && !nextProps.adminArea.fetching) {
      if (nextProps.adminArea.error) {
        console.error(nextProps.adminArea.error);
        // removed because redirect is highly misleading
        // this.props.history.push('/uhoh');
      }
    }
  }

  loadCountry(props, countryId) {
    this.getData(props, countryId);
    this.getAdmArea(props.type, countryId);
    this.props._getPerNsPhase(countryId);
    this.props._getPerOverviews(countryId);
    this.props._getPerWorkPlan(countryId);
    this.props._getPerForms();
    this.props._getPerForm(null, countryId);
    this.props._getPerUploadedDocuments(countryId);
    if (typeof props.user.username !== 'undefined' && props.user.username !== null) {
      this.props._getPerMission();
    }
    // setting the default tab needs to happen in the "next tick"
    setTimeout(() => { this.displayTabContent(); }, 0);
  }

  componentDidMount() {
    this.componentIsLoading = true;
    const countryId = this.props.country.id;
    this.loadCountry(this.props, countryId);
  }

  getTabDetails = (strings) => {
    const additionalTabName = get(this.props.adminArea, 'data.additional_tab_name') || strings.countryAdditionalInfoTab;
    const tabDetails = [
      {
        title: strings.countryOperationsTab,
        hash: '#operations'
      },
      {
        title: strings.country3WTab,
        hash: '#3w'
      },
      {
        title: 'Risk Watch',
        hash: '#risk',
      },
      /*
      {
        title: strings.countryOverviewTab,
        hash: '#profile',
      },
      */
      {
        title: strings.countryPreparednessTab,
        hash: '#preparedness'
      },
      {
        title: strings.countryCountryPlanTab,
        hash: '#country-plan'
      },
      {
        title: additionalTabName,
        hash: '#additional'
      },
    ];

    return tabDetails;
  }
  // Sets default tab if url param is blank or incorrect
  displayTabContent() {
    const { strings } = this.context;
    const tabDetails = this.getTabDetails(strings);

    const tabHashArray = tabDetails.map(({ hash }) => hash);
    if (!tabHashArray.find(hash => hash === this.props.location.hash)) {
      this.props.history.replace(`${this.props.location.pathname}${tabHashArray[0]}`);
    }
  }

  getData(props, countryId) {
    const type = 'country';
    this.props._getAdmAreaAppealsList(type, countryId);
    this.props._getAdmAreaKeyFigures(type, countryId);
    this.props._getAdmAreaSnippets(type, countryId);
    this.props._getCountryOperations(type, countryId);
    this.props._getPartnerDeployments(type, countryId);
    this.props._getFdrs(countryId);
    this.props._getAppealsListStats({ countryId: countryId });
  }

  getAdmArea(type, id) {
    this.props._getAdmAreaById(type, id);
  }

  isPending = memoize((
    adminArea = emptyObject,
    fdrs = emptyObject,
    perForm = emptyObject,
    user = emptyObject,
  ) => (
    adminArea.fetching ||
    fdrs.fetching ||
    perForm.fetching ||
    user.fetching
  ))

  // gets links to display in the pills at bottom of the tabs
  getLinks(strings) {
    const { adminArea, country } = this.props;
    if (!adminArea.fetched) return false;
    const iso3 = country.iso3;
    const fdrs = country.fdrs;
    const homepage = adminArea.data.society_url;
    const homepageIfrc = adminArea.data.url_ifrc;
    // const regionSlug = getRegionSlug(adminArea.data.region);
    // const countryLower = adminArea.data.name.toLowerCase();
    const links = [];
    const countryName = adminArea.data.name;

    if (fdrs) {
      const fdrsLink = {
        text: resolveToString(strings.fdrsLinkText),
        url: `https://data.ifrc.org/FDRS/national-society/${fdrs}`
      };
      links.push(fdrsLink);
    }

    if (homepageIfrc) {
      const ifrcLink = {
        text: resolveToString(strings.ifrcLinkText, { countryName }),
        url: homepageIfrc,
      };
      links.push(ifrcLink);
    }

    if (iso3) {
      const reliefWebLink = {
        text: resolveToString(strings.reliefWebLinkText, { countryName }),
        url: `https://reliefweb.int/country/${iso3}`
      };
      links.push(reliefWebLink);
    }

    if (homepage) {
      const homepageLink = {
        text: resolveToString(strings.homePageLinkText, { countryName }),
        url: homepage,
      };
      links.push(homepageLink);
    }

    return links;
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
      this.props.country.id,
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
    this.props._setPartnerDeploymentFilter(this.props.country.id, filters);
  }

  renderAppeals() {
    const { fetched, fetching, error, data } = this.props.countryOperations;
    const { strings } = this.context;

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
              title={strings.countryTableDate}
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
              title={strings.countryTableName}
              sort={this.state.appeals.sort}
              onClick={this.handleSortChange.bind(this, 'appeals', 'name')}
            />
          )
        },
        {
          id: 'event',
          label: strings.countryTableEmergency,
        },
        {
          id: 'dtype',
          label: (
            <FilterHeader
              id='dtype'
              title={strings.countryTableDisasterType}
              options={[{ value: 'all', label: 'All Types' }, ...this.props.disasterTypesSelect]}
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
              title={strings.countryTableRequestAmount}
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
              title={strings.countryTableFundedAmount}
              sort={this.state.appeals.sort}
              onClick={this.handleSortChange.bind(this, 'appeals', 'amount_funded')}
            />
          )
        },
        {
          id: 'active',
          label: strings.countryTableActive,
        }
      ];

      const rows = data.results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.start_date).toISODate(),
        name: o.name,
        event: o.event ? (
          <Link to={`/emergencies/${o.event}`} className='link--table' title={strings.countriesEmergencyLinkTooltip}>
            Link
          </Link>
        ) : (
          nope
        ),
        dtype: o.dtype.name,
        requestAmount: n(o.amount_requested),
        fundedAmount: n(o.amount_funded),
        active: new Date(o.end_date).getTime() > now ? strings.countriesActiveLabel : strings.countriesInactiveLabel,
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
            <Link className='link-underline export--link' to={'/appeals/all/?country=' + id}>
              <Translate
                stringId="countriesAllOperationExportLink"
                params={{ name }}
              />
            </Link>
          </div>
        </React.Fragment>
      );
    }
    return null;
  }

  isPerPermission() {
    return (typeof this.props.user.username !== 'undefined' && this.props.user.username !== null) &&
      (typeof this.props.getPerMission !== 'undefined' && this.props.getPerMission.fetched && this.props.getPerMission.data.count > 0);
  }

  /*
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
  */

  renderContent() {
    const {
      fetched,
      error,
      data
    } = this.props.adminArea;
    if (!fetched || error) return null;

    const countryRegionMapping = {
      '282': '1', // Americas
      '283': '2', // Asia
      '285': '0', // Africa
      '286': '3', // Europe
      '287': '4', // MENA
    };

    if (this.props.country.id in countryRegionMapping) {
      return (<Redirect to={'/regions/' + countryRegionMapping[this.props.country.id]} />);
    }

    if (this.props.country.id === 200 && this.props.location.hash === '#3w') {  // Az. exception, DELETEME if map question is arranged.
      // this.props.location.hash = '#operations';
      return (<Redirect to={'/countries/200#operations'} />);
    }

    // const bbox = getBoundingBox(data.iso);
    // const mapContainerClass = 'country__map';

    // const { partnerDeployments } = this.props;
    const { strings } = this.context;
    const countryLinks = this.getLinks(strings);
    const tabDetails = this.getTabDetails(strings);

    const handleTabChange = index => {
      const tabHashArray = tabDetails.map(({ hash }) => hash);
      const url = this.props.location.pathname;
      this.props.history.replace(`${url}${tabHashArray[index]}`);
    };

    const countryName = get(data, 'name', 'Country');

    // add region to the breadcrumb only if country has a region defined
    const region = this.props.regionsById[data.region] ? this.props.regionsById[data.region][0] : undefined;
    const crumbs = [
      { link: this.props.location.pathname, name: countryName },
      { link: '/', name: strings.breadCrumbHome }
    ];
    if (region) {
      crumbs.splice(1, 0, {
        link: `/regions/${data.region}`, name: region.label
      });
    }

    const title = resolveToString(strings.countryPageTitle, { countryName });

    return (
      <section className='inpage'>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div className='container-lg'>
          <div className='row flex-sm'>
            <div className='col col-6-sm col-7-mid'>
              <BreadCrumb breadcrumbContainerClass='padding-reset' crumbs={crumbs} />
            </div>
            <div className='col col-6-sm col-5-mid spacing-half-t'>
              <div className='row-sm flex flex-justify-flex-end'>
                <div className='col-sm spacing-half-v'>
                  <a
                    href={url.resolve(adminUrl, `api/country/${data.id}/change/`)}
                    className='button button--xsmall button--primary-bounded button--edit-action'
                  >
                    <span className='f-icon-pencil margin-half-r'></span>
                    <Translate stringId='countryEditCountry' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <header className='inpage__header inpage__header--action container-lg'>
          <div className='inner'>
            <h1 className='inpage__title'>
              {data.name}
            </h1>
            {region && (
              <div className='inpage__header-actions text-center'>
                <div className='spacing-half-v'>
                  <Link to={`/regions/${data.region}`}
                    className='link link--with-icon flex-justify-center'
                  >
                    <span className='link--with-icon-text'>{region.label}</span>
                    <span className='collecticon-chevron-right link--with-icon-inner'></span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>
        <section className='inpage__body'>
          <div className='inner'>
            <KeyFiguresHeader
              appealsListStats={this.props.appealsListStats}
              countryPlans={this.props.adminArea?.data?.has_country_plan ? 1 : 0}
            />
          </div>
        </section>
        <div className='tab__wrap'>
          <Tabs
            selectedIndex={tabDetails.map(({ hash }) => hash).indexOf(this.props.location.hash)}
            onSelect={index => handleTabChange(index)}
          >
            <TabList>
              {tabDetails.map(tab => (
                <Tab key={tab.title}>{tab.title}</Tab>
              ))}
            </TabList>
            <div className='inpage__body'>
              <div className='inner'>
                <TabPanel>
                  <TabContent>
                    <div className='container-lg'>
                      <Fold title={strings.countriesStatisticsTitle} foldHeaderClass='visually-hidden' id='operations' foldWrapperClass='fold--main' foldContainerClass='container--padding-reset'>
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
                    </div>
                  </TabContent>
                  <TabContent>
                    <div>
                      <EmergenciesTable
                        id={'emergencies'}
                        title={strings.emergenciesTableRecentEmergencies}
                        limit={5}
                        country={this.props.country.id}
                        showRecent={true}
                        viewAll={'/emergencies/all?country=' + data.id}
                        viewAllText={`${strings.emergenciesRecentViewAll} ${data.name}`}
                      />
                    </div>
                  </TabContent>
                </TabPanel>
                <TabPanel>
                  <div className='container-lg'>
                    <TabContent title={strings.region3WTitle}>
                      <ThreeW country={this.props.country} />
                    </TabContent>
                  </div>
                </TabPanel>

                <TabPanel>
                  <TabContent>
                    <RiskWatch countryId={this.props.country?.id} />
                  </TabContent>
                </TabPanel>
                {/*
                <TabPanel>
                  <TabContent title='Overview'>
                    <div className='container-full'>
                      <CountryProfile
                        countryId={this.props.country.id}
                        user={this.props.user}
                      />
                    </div>
                  </TabContent>
                </TabPanel>
                */}
                <TabPanel>
                  <TabContent showError={true} isError={!this.isPerPermission()} errorMessage={strings.accountPerPermission} title={strings.countryPreparednessTitle}>
                    <React.Fragment>
                      {this.props.getPerNsPhase.fetched && this.props.perOverviewForm.fetched ? (
                        <PreparednessOverview getPerNsPhase={this.props.getPerNsPhase} perOverviewForm={this.props.perOverviewForm} />)
                        : <ErrorPanel title={strings.preparednessOverview} errorMessage={strings.noDataMessage} />}
                      {/* {this.props.getPerForm.fetched && this.props.getPerForms.fetched ? (
                        <PreparednessSummary getPerForm={this.props.getPerForm} getPerForms={this.props.getPerForms} />)
                        : <ErrorPanel title={strings.preparednessSummary} errorMessage={ strings.noDataMessage } />}
                      {this.props.getPerForm.fetched && this.props.getPerForms.fetched ? (
                        <PreparednessColumnBar getPerForm={this.props.getPerForm} getPerForms={this.props.getPerForms} />)
                        : <ErrorPanel title={strings.preparednessColumnBar} errorMessage={ strings.noDataMessage } />}
                      {this.props.getPerWorkPlan.fetched ? (
                        <PreparednessWorkPlan getPerWorkPlan={this.props.getPerWorkPlan} />)
                        : <ErrorPanel title={strings.preparednessWorkPlan} errorMessage={ strings.noDataMessage } />}
                      {this.props.getPerUploadedDocuments.fetched ? (
                        <PreparednessPhaseOutcomes getPerUploadedDocuments={this.props.getPerUploadedDocuments} countryId={this.props.country.id} />)
                        : <ErrorPanel title={strings.countryPreparednessPhaseOutcomes} errorMessage={ strings.noDataMessage } />} */}
                    </React.Fragment>
                  </TabContent>
                </TabPanel>
                <TabPanel>
                  <div className='container-lg'>
                    <TabContent title={strings.countryCountryPlanTab}>
                      <CountryPlan
                        countryDetails={this.props.country}
                        hasCountryPlan={this.props.adminArea?.data?.has_country_plan}
                      />
                    </TabContent>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className='container-lg'>
                    <TabContent isError={!get(this.props.snippets, 'data.results.length')} errorMessage={strings.noDataMessage} title={strings.regionGraphiccs}>
                      <Snippets data={this.props.snippets} hideHeader={true} />
                    </TabContent>
                    <TabContent showError={true} isError={!get(data, 'contacts.length')} errorMessage={strings.noDataMessage} title={strings.regionContacts}>
                      <Contacts data={data} />
                    </TabContent>
                    <TabContent isError={!get(data, 'links.length')} errorMessage={strings.noDataMessage} title={strings.regionLinks}>
                      <Links data={data} />
                    </TabContent>
                  </div>
                </TabPanel>
              </div>
            </div>
          </Tabs>
        </div>
        <div className='inpage__body'>
          <div className='inner'>
            {countryLinks ? <Pills links={countryLinks} /> : null}
          </div>
        </div>
      </section>
    );
  }

  render() {
    const {
      adminArea,
      fdrs,
      perForm,
      user,
    } = this.props;

    const pending = this.isPending(
      adminArea,
      fdrs,
      perForm,
      user,
    );

    const { strings } = this.context;
    return (
      <App className={`page--${this.props.type}`}>
        {pending && <NewGlobalLoading />}
        <Helmet>
          <title>
            {strings.countryTitle}
          </title>
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
    _getPerForm: T.func,
    _getPerForms: T.func,
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

AdminArea.contextType = LanguageContext;

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  adminArea: get(state.adminArea.aaData, countryByIdOrNameSelector(state, ownProps.match.params.id).id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  appealStats: state.adminArea.appealStats,
  keyFigures: state.adminArea.keyFigures,
  snippets: state.adminArea.snippets,
  countryOperations: state.adminArea.countryOperations,
  partnerDeployments: get(state.adminArea.partnerDeployments, countryByIdOrNameSelector(state, ownProps.match.params.id).id, {
    data: {},
    fetching: false,
    fetched: false
  }),
  fdrs: state.fdrs,
  getPerNsPhase: state.perForm.getPerNsPhase,
  perOverviewForm: state.perForm.getPerOverviewForm,
  getPerWorkPlan: state.perForm.getPerWorkPlan,
  getPerForm: state.perForm.getPerForm,
  getPerForms: state.perForm.getPerForms,
  getPerUploadedDocuments: state.perForm.getPerUploadedDocuments,
  getPerMission: state.perForm.getPerMission,
  user: state.user.data,
  appealsListStats: state.overallStats.appealsListStats,
  country: countryByIdOrNameSelector(state, ownProps.match.params.id),
  regionsById: regionsByIdSelector(state),
  disasterTypesSelect: disasterTypesSelectSelector(state)
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
  _getPerOverviews: (...args) => dispatch(getPerOverviews(...args)),
  _getPerWorkPlan: (...args) => dispatch(getPerWorkPlan(...args)),
  _getPerForm: (...args) => dispatch(getPerForm(...args)),
  _getPerForms: (...args) => dispatch(getPerForms(...args)),
  _getPerUploadedDocuments: (...args) => dispatch(getPerUploadedDocuments(...args)),
  _getPerMission: (...args) => dispatch(getPerMission(...args)),
  _getAppealsListStats: (...args) => dispatch(getAppealsListStats(...args)),
});

export default connect(
  selector,
  dispatcher
)(AdminArea);
