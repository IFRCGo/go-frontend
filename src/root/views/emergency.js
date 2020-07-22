import * as url from 'url';
import React from 'react';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import { Link, withRouter } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import _toNumber from 'lodash.tonumber';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Helmet } from 'react-helmet';

import { api, environment } from '#config';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import Translate from '#components/Translate';
import BreadCrumb from '#components/breadcrumb';
import { withLanguage } from '#root/languageContext';
import { resolveToString } from '#utils/lang';
import {
  getEventById,
  getEventSnippets,
  getSitrepsByEventId,
  getSitrepTypes,
  getAppealDocsByAppealIds,
  addSubscriptions,
  delSubscription,
  getUserProfile
} from '#actions';
import {
  commaSeparatedNumber as n,
  separateUppercaseWords as separate,
  nope,
  isoDate,
  timestamp,
  noSummary
} from '#utils/format';
import {
  get,
  mostRecentReport,
  getRecordsByType
} from '#utils/utils';

import { getRegionById } from '#utils/region-constants';
import App from '#views/app';
import Fold from '#components/fold';
import TabContent from '#components/tab-content';
import ErrorPanel from '#components/error-panel';
import Expandable from '#components/expandable';
import Snippets from '#components/emergencies/snippets';
import SurgeAlertsTable from '#components/connected/alerts-table';
import PersonnelTable from '#components/connected/personnel-table';
import EruTable from '#components/connected/eru-table';
import EmergencyMap from '#components/map/emergency-map';
import { NO_DATA } from '#utils/constants';
import { epiSources } from '#utils/field-report-constants';
import ProjectFormModal from '#views/ThreeW/project-form-modal';

class Emergency extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showProjectForm: false,
      selectedAppeal: null,
      sitrepFilters: {
        date: 'all',
        type: 'all',
      },
      subscribed: false,
      tabs: [{ title: 'Emergency Details', hash: '#details' }],
    };
    this.addSubscription = this.addSubscription.bind(this);
    this.delSubscription = this.delSubscription.bind(this);
    this.isSubscribed = this.isSubscribed.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.location.hash !== nextProps.location.hash) {
      const top =
        window.pageYOffset !== undefined
          ? window.pageYOffset
          : window.scrollTop;
      window.scrollTo(0, top - 90);
    }

    if (this.props.match.params.id !== nextProps.match.params.id) {
      return this.getEvent(nextProps.match.params.id);
    }

    if (this.props.event.fetching && !nextProps.event.fetching) {
      hideGlobalLoading();

      // Redirect if it's a merged Emergency
      if (
        nextProps.event.fetched &&
        nextProps.event.data &&
        nextProps.event.data.parent_event
      ) {
        this.props.history.push(
          `/emergencies/${nextProps.event.data.parent_event}#details`
        );
      }

      this.getAppealDocuments(nextProps.event);

      // setup tabs
      const { data } = nextProps.event;
      // check if there are additional tabs
      let tabs = [...this.state.tabs];
      const tabLabels = ['tab_one_title', 'tab_two_title', 'tab_three_title'];
      tabLabels.forEach((key) => {
        if (data && data[key]) {
          const title = data[key];
          const hash = `#${title.toLowerCase().split(' ').join('-')}`;
          tabs.push({
            title: title,
            hash: hash,
          });
        }
      });
      this.setState({ tabs: tabs });
      setTimeout(() => {
        this.displayTabContent();
      }, 0);
    }

    if (!this.props.profile.fetched && nextProps.profile.fetched) {
      this.setState({ subscribed: this.isSubscribed(nextProps) });
    }

    const newProjectAdded =
      this.props.projectForm.fetching === true &&
      nextProps.projectForm.fetching === false &&
      nextProps.projectForm.error === null;

    if (newProjectAdded) {
      this.setState({ showProjectForm: false });
    }
  }

  componentDidMount () {
    this.getEvent(this.props.match.params.id);
    this.props._getSitrepTypes();
    if (this.props.isLogged) {
      this.props._getUserProfile(this.props.user.data.username);
    }

    // FIXME - we might need a different strategy for this
    // this.displayTabContent();
  }

  // Sets default tab if url param is blank or incorrect
  displayTabContent () {
    const tabHashArray = this.state.tabs.map(({ hash }) => hash);
    if (!tabHashArray.find((hash) => hash === this.props.location.hash)) {
      this.props.history.replace(
        `${this.props.location.pathname}${tabHashArray[0]}`
      );
    }
  }

  getEvent (id) {
    showGlobalLoading();
    this.props._getEventById(id);
    this.props._getSitrepsByEventId(id);
  }

  getAppealDocuments (event) {
    const appealIds = get(event, 'data.appeals', []).map((o) => o.id);
    if (appealIds.length) {
      this.props._getAppealDocsByAppealIds(appealIds, event.data.id);
    }
  }

  onAppealClick (id, e) {
    e.preventDefault();
    this.setState({ selectedAppeal: id });
  }

  isSubscribed (nextProps) {
    if (nextProps.profile.fetched && !nextProps.profile.error) {
      const filtered = nextProps.profile.data.subscription.filter(
        (subscription) =>
          subscription.event === parseInt(this.props.match.params.id)
      );
      if (filtered.length > 0) {
        return true;
      }
    }
    return false;
  }

  renderFieldReportStatsEW (report) {
    const numPotentiallyAffected =
      parseInt(get(report, 'num_potentially_affected')) ||
      parseInt(get(report, 'gov_num_potentially_affected')) ||
      parseInt(get(report, 'other_num_potentially_affected'));
    const numHighestRisk =
      parseInt(get(report, 'num_highest_risk')) ||
      parseInt(get(report, 'gov_num_highest_risk')) ||
      parseInt(get(report, 'other_num_highest_risk'));
    const affectedPopCentres =
      get(report, 'affected_pop_centres') ||
      get(report, 'gov_affected_pop_centres') ||
      get(report, 'other_affected_pop_centres');
    return (
      <div className="inpage__header-col">
        <h3 className="global-spacing-2-t clear">
          <Translate stringId="emergencyTopOverviewSectionTitle" />
        </h3>
        <div className="content-list-group">
          <ul className="content-list">
            <li>
              <Translate stringId="emergencyPotentiallyAffectedLabel" />
              <span className="content-highlight">
                {n(numPotentiallyAffected)}
              </span>
            </li>
            <li>
              <Translate stringId="emergencyHighestRiskLabel" />
              <span className="content-highlight">{n(numHighestRisk)}</span>
            </li>
            <li>
              <Translate stringId="emergencyAffectedPopulationCentresLabel" />
              <span className="content-highlight">{affectedPopCentres}</span>
            </li>
          </ul>
          <ul className="content-list">
            <li>
              <Translate stringId="emergencyAssistedByGovernmentLabel" />
              <span className="content-highlight">
                {n(get(report, 'gov_num_assisted'))}
              </span>
            </li>
            <li>
              <Translate stringId="emergencyAssistedByRCRCLabel" />
              <span className="content-highlight">
                {n(get(report, 'num_assisted'))}
              </span>
            </li>
          </ul>
        </div>
        <p className="emergency__source">
          Source:{' '}
          <Link to={`/reports/${report.id}`}>
            {report.summary},{' '}
            {timestamp(report.updated_at || report.created_at)}
          </Link>
        </p>
      </div>
    );
  }

  renderFieldReportStatsEvent (report, isEPI, isCOVID) {
    const { strings } = this.props;
    const numAffected = parseInt(get(report, 'num_affected')) || parseInt(get(report, 'gov_num_affected')) || parseInt(get(report, 'other_num_affected'));
    const numInjured = parseInt(get(report, 'num_injured')) || parseInt(get(report, 'gov_num_injured')) || parseInt(get(report, 'other_num_injured'));
    const numDead = parseInt(get(report, 'num_dead')) || parseInt(get(report, 'gov_num_dead')) || parseInt(get(report, 'other_num_dead'));
    const numMissing = parseInt(get(report, 'num_missing')) || parseInt(get(report, 'gov_num_missing')) || parseInt(get(report, 'other_num_missing'));
    const numDisplaced = parseInt(get(report, 'num_displaced')) || parseInt(get(report, 'gov_num_displaced')) || parseInt(get(report, 'other_num_displaced'));
    const numAssisted = parseInt(get(report, 'num_assisted')) || parseInt(get(report, 'gov_num_assisted')) || parseInt(get(report, 'other_num_assisted'));
    const epiFiguresSource = epiSources.find(source => source.value === `${report.epi_figures_source}`);
    return (
      <div className='inpage__header-col'>
        <h3 className='fold__title spacing-2-t spacing-b'>Emergency Overview</h3>
        <div className='content-list-group row flex-xs'>
          { isEPI
            ? (
              <div className='col col-6-xs flex'>
                <ul className='content-list box__global spacing-v spacing-2-h'>
                  <li>{strings.emergencyCasesLabel}<span className='content-highlight'>{n(get(report, 'epi_cases'))}</span></li>
                  { !isCOVID
                    ? (
                      <React.Fragment>
                        <li className='pl-small'>{strings.emergencySuspectedCasesLabel}<span className='content-highlight'>{n(get(report, 'epi_suspected_cases'))}</span></li>
                        <li className='pl-small'>{strings.emergencyProbableCasesLabel}<span className='content-highlight'>{n(get(report, 'epi_probable_cases'))}</span></li>
                        <li className='pl-small'>{strings.emergencyConfirmedCasesLabel}<span className='content-highlight'>{n(get(report, 'epi_confirmed_cases'))}</span></li>
                      </React.Fragment>
                    )
                    : null
                  }
                  <li>{strings.emergencyDeadLabel}<span className='content-highlight'>{n(get(report, 'epi_num_dead'))}</span></li>
                  <li>
                    <p className='emergency__source'>Source:
                      { isEPI
                        ? (
                          <React.Fragment>
                            <strong>{epiFiguresSource ? ` ${epiFiguresSource.label}` : ' --' }</strong>
                          </React.Fragment>
                        )
                        : (
                          <Link to={`/reports/${report.id}`}>{report.summary}, {timestamp(report.updated_at || report.created_at)}</Link>
                        )
                      }
                    </p>
                  </li>
                </ul>
              </div>
            )
            : (
              <div className='col col-6-xs flex'>
                <ul className='content-list box__global spacing-v spacing-2-h'>
                  <li>{strings.emergencyAffectedLabel}<span className='content-highlight'>{n(numAffected)}</span></li>
                  <li>{strings.emergencyInjuredLabel}<span className='content-highlight'>{n(numInjured)}</span></li>
                  <li>{strings.emergencyDeadLabel}<span className='content-highlight'>{n(numDead)}</span></li>
                  <li>{strings.emergencyMissingLabel}<span className='content-highlight'>{n(numMissing)}</span></li>
                  <li>{strings.emergencyDisplacedLabel}<span className='content-highlight'>{n(numDisplaced)}</span></li>
                </ul>
              </div>
            )
          }
          <div className='col col-6-xs flex'>
            <ul className='content-list box__global spacing-v spacing-2-h'>
              <li>{strings.emergencyAssistedLabel}<span className='content-highlight'>{n(numAssisted)}</span></li>
              <li>{strings.emergencyLocalStaffLabel}<span className='content-highlight'>{n(get(report, 'num_localstaff'))}</span></li>
              <li>{strings.emergencyVolunteersLabel}<span className='content-highlight'>{n(get(report, 'num_volunteers'))}</span></li>
              { !isCOVID
                ? (
                  <li>{strings.emergencyDelegatesLabel}<span className='content-highlight'>{n(get(report, 'num_expats_delegates'))}</span></li>
                )
                : null
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }

  renderFieldReportStats () {
    const report = mostRecentReport(
      get(this.props, 'event.data.field_reports')
    );
    const hideIt = get(this.props, 'event.data.hide_attached_field_reports');
    if (!report || hideIt) return null;
    const status = report.status === 8 ? 'EW' : 'EVT';
    const isEPI = get(this.props, 'event.data.dtype') === 1;
    const isCOVID = report.is_covid_report;
    if (status === 'EW') {
      return this.renderFieldReportStatsEW(report);
    } else {
      return this.renderFieldReportStatsEvent(report, isEPI, isCOVID);
    }
  }

  renderHeaderStats () {
    const { appeals } = this.props.event.data;
    const selected = this.state.selectedAppeal;

    let stats = {
      beneficiaries: 0,
      funded: 0,
      requested: 0,
    };
    stats = appeals
      .filter((o) => {
        return selected ? o.id === selected : true;
      })
      .reduce((acc, o) => {
        acc.beneficiaries += _toNumber(o.num_beneficiaries);
        acc.funded += _toNumber(o.amount_funded);
        acc.requested += _toNumber(o.amount_requested);
        return acc;
      }, stats);
    const displayHeadlineStats =
      stats.beneficiaries || stats.requested || stats.funded;
    return (
      <div className="spacing-2-b">
        <div className="inpage__header-col">
          {displayHeadlineStats ? (
            <div className="inpage__headline-stats spacing-3-t">
              <div className='sumstats__wrap'>
                <ul className="sumstats">
                  {stats.beneficiaries > 0 ? (
                    <li className="sumstats__item__wrap">
                      <div className='sumstats__item'>
                        <span className="collecticon-people-arrows sumstats__icon"></span>
                        <span className="sumstats__value">
                          {n(stats.beneficiaries)}
                        </span>
                        <Translate
                          className="sumstats__key"
                          stringId="emergencyPeopleTargetedLabel"
                        />
                      </div>
                    </li>
                  ) : null}

                  {stats.requested > 0 ? (
                    <li className="sumstats__item__wrap">
                      <div className='sumstats__item'>                  
                        <span className='sumstats__icon_wrapper'>
                          <img className='sumstats__icon_2020' src="/assets/graphics/layout/funding-requirements.svg" />
                        </span>
                        <span className="sumstats__value">
                          {n(stats.requested)}
                        </span>
                        <span
                          className="sumstats__key"
                          stringId="emergencyFundingRequirementsLabel"
                        />
                      </div>
                    </li>
                  ) : null}
                  {stats.funded > 0 ? (
                    <li className="sumstats__item__wrap">
                      <div className='sumstats__item'>
                        <span className='sumstats__icon_wrapper'>
                          <img className='sumstats__icon_2020' src="/assets/graphics/layout/funding-coverage.svg" />
                        </span>
                        <span className="sumstats__value">{n(stats.funded)}</span>
                        <Translate
                          className="sumstats__key"
                          stringId="emergencyFundingLabel"
                        />
                      </div>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
        {this.renderFieldReportStats()}
        <div className="funding-chart"></div>
      </div>
    );
  }

  userHasPerms (fieldReport) {
    const userIsAnon = !this.props.isLogged;
    const userIsSuperuser = this.props.profile.fetched && this.props.profile.data.is_superuser;
    const visibility = fieldReport.visibility;

    // superusers can see all reports
    if (userIsSuperuser) {
      return true;
    }

    // anonymous users can only see public reports
    if (userIsAnon) {
      return visibility === 3;
    }

    // logged in users can see all reports not restricted to IFRC
    return visibility !== 2;
  }

  renderFieldReports () {
    const {
      strings,
      event: {
        data,
      },
    } = this.props;
    const fieldReports = data.field_reports ? data.field_reports.filter(fr => this.userHasPerms(fr)) : [];
    if (fieldReports.length) {
      return (
        <Fold
          id="field-reports"
          title={resolveToString(strings.emergencyFieldReportsWithCountTitle, { count: data.field_reports.length })}
          foldWrapperClass="event-field-reports fold--main">
          <table className="table table--border-bottom">
            <thead>
              <tr>
                <th>{strings.emergencyFieldReportTableHeaderDate}</th>
                <th>{strings.emergencyFieldReportTableHeaderName}</th>
                <th>{strings.emergencyFieldReportTableHeaderCountries}</th>
                <th>{strings.emergencyFieldReportTableHeaderRegions}</th>
              </tr>
            </thead>
            <tbody>
              {fieldReports.map(o => (
                <tr key={o.id}>
                  <td>{isoDate(o.created_at)}</td>
                  <td>
                    <Link
                      to={{
                        pathname: `/reports/${o.id}`,
                        state: this.props.location.pathname
                      }}
                      className="link--table"
                      title={strings.emergencyFieldReportLinkTitle}
                    >
                      {o.summary || noSummary}
                    </Link>
                  </td>
                  <td>
                    {Array.isArray(o.countries)
                      ? o.countries.map((c) => (
                        <Link
                          to={`/countries/${c.id}`}
                          key={c.id}
                          className="link--table"
                        >
                          {c.name}{' '}
                        </Link>
                      ))
                      : nope}
                  </td>
                  <td>
                    {Array.isArray(o.countries) ? o.countries.map(c => c.region).reduce((acc, curr) => {
                      if (curr !== null && acc.indexOf(curr) === -1) {
                        acc.push(curr);
                      }
                      return acc;
                    }, []).map(region => {
                      return (<Link to={`/regions/${region}`}
                        key={region}
                        className="link--table"
                      >
                        {getRegionById(region.toString()).name}
                      </Link>);
                    }) : nope }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fold>
      );
    }
    return null;
  }

  renderReports (className, reportTypes) {
    return (
      <div className="response__doc__block">
        <div className="clearfix">
          {Object.keys(reportTypes).map((reportTypeId) => {
            return (
              <div
                className="response__doc__col"
                key={`response-type-${reportTypeId}`}
              >
                <div className="response__doc__each">
                  <div className="response__doc__title">
                    {reportTypes[reportTypeId].title}
                  </div>
                  <div className="response__doc__inner scrollbar__custom">
                    {reportTypes[reportTypeId].hasOwnProperty('items') &&
                      reportTypes[reportTypeId].items.length > 0 ? (
                        reportTypes[reportTypeId].items.map((item) => {
                          return (
                            <div
                              className="response__doc__item"
                              key={`item-${item.id}`}
                            >
                              {item.name}
                              <a
                                className="collecticon-download response__doc__item__link"
                                target="_blank"
                                href={item.document || item.document_url}
                              ></a>
                            </div>
                          );
                        })
                      ) : (
                        <div className="response__doc__item">
                          <Translate stringId="emergencyNoDocumentsMessage" />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderResponseDocuments () {
    const data = get(this.props.situationReports, 'data.results', []);
    const { date, type } = this.state.sitrepFilters;
    // return empty when no data, only on default filters.
    if (!data.length && date === 'all' && type === 'all') return null;
    const { id } = this.props.match.params;
    const addReportLink = url.resolve(api, `api/event/${id}/change`);
    const types = this.props.situationReportTypes;
    if (!types.fetched) {
      return null;
    }
    const reportsByType = getRecordsByType(types, data);
    return (
      <Fold
        id="response-documents"
        header={() => (
          <div className="fold__headline">
            <div className="fold__actions">
              <a
                className="button button--primary-bounded button--small"
                href={addReportLink}
                target="_blank"
              >
                Add a Report
              </a>
            </div>
            <h2 className="fold__title">Response Documents</h2>
          </div>
        )}
      >
        <div>{this.renderReports('situation-reports-list', reportsByType)}</div>
      </Fold>
    );
  }

  renderAppealReports (className, reports) {
    return (
      <ul className={className}>
        {reports.map((o) => {
          let href = o['document'] || o['document_url'] || null;
          if (!href) {
            return null;
          }
          return (
            <li key={o.id} className='col col-6-xs'>
              <a className="link-underline" href={href} target="_blank">
                {o.name}, {isoDate(o.created_at)}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  renderAppealDocuments () {
    const { strings } = this.props;
    const data = get(this.props.appealDocuments, 'data.results', []);
    if (!data.length) return null;
    return (
      <Fold id="documents" title={strings.emergencyAppealDocumentsTitle} foldWrapperClass='fold--main'>
        {this.renderAppealReports('public-docs-list row flex-xs', data)}
      </Fold>
    );
  }

  hasKeyFigures () {
    const { data } = this.props.event;
    const kf = get(data, 'key_figures');
    if (!Array.isArray(kf) || !kf.length) {
      return false;
    } else {
      return true;
    }
  }

  renderKeyFigures () {
    const { strings } = this.props;
    const { data } = this.props.event;
    const kf = get(data, 'key_figures');
    if (!this.hasKeyFigures()) return null;

    return (
      <Fold title={strings.emergencyKeyFiguresTitle} foldWrapperClass="key-figures">
        <ul className="sumstats">
          {kf.map((o) => (
            <li key={o.deck} className='sumstats__item__wrap'>
              <div className='sumstats__item'>
                <h3 className='sumstats__value margin-reset'>{isNaN(o.number) ? o.number : n(o.number)}</h3>
                <p className="sumstats__key">{o.deck}</p>
                <p className="key-figure-source emergency__source">
                  <Translate
                    stringId="emergencySourceFigure"
                    params={{
                      source: o.source,
                    }}
                  />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Fold>
    );
  }

  addSubscription () {
    this.props._addSubscriptions(this.props.match.params.id);
    this.setState({ subscribed: true });
  }

  delSubscription () {
    this.props._delSubscription(this.props.match.params.id);
    this.setState({ subscribed: false });
  }

  renderAdditionalTabPanels () {
    const additionalTabs = this.state.tabs.slice(1);
    if (additionalTabs.length) {
      return (
        <React.Fragment>
          {additionalTabs.map((tab, index) => {
            return (
              <TabPanel key={tab.title}>
                <Snippets
                  eventId={get(this.props.event, 'data.id')}
                  tab={index + 1}
                />
              </TabPanel>
            );
          })}
        </React.Fragment>
      );
    }
  }

  syncLoadingAnimation = memoize((projectForm = {}) => {
    const shouldShowLoadingAnimation = projectForm.fetching;

    if (shouldShowLoadingAnimation) {
      this.loading = true;
      showGlobalLoading();
    } else {
      if (this.loading) {
        hideGlobalLoading();
        this.loading = false;
      }
    }
  });

  renderContent () {
    const { fetched, error, data } = this.props.event;

    if (!fetched || error) return null;
    const report =
      mostRecentReport(get(this.props, 'event.data.field_reports')) || {};
    const summary = data.summary || report.description || null;

    const contacts =
      Array.isArray(data.contacts) && data.contacts.length
        ? data.contacts
        : Array.isArray(report.contacts) && report.contacts.length
          ? report.contacts
          : null;
    const subscribeButton = () =>
      this.state.subscribed ? (
        <React.Fragment>
          <div className='col-sm spacing-half-v'>
            <button
              className="button button--primary-bounded button--xsmall"
              onClick={this.delSubscription}
            >
              <Translate stringId="emergencyActionUnsubscribeLabel" />
            </button>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className='col-sm spacing-half-v'>
            <button
              className="button button--primary-filled button--xsmall"
              onClick={this.addSubscription}
            >
              <Translate stringId="emergencyActionSubscribeLabel" />
            </button>
          </div>
        </React.Fragment>
      );

    const showExportMap = () => {
      // Show the export map if exactly one country is selected, and at least 1 district is selected.
      if (
        data.countries.length === 1 &&
        data.countries[0].record_type === 1 &&
        data.districts.length > 0
      ) {
        return (
          <EmergencyMap
            countries={data.countries}
            districts={data.districts}
            name={data.name}
            date={data.updated_at}
            disasterTypeCode={data.dtype}
          />
        );
      } else {
        return null;
      }
    };

    const handleTabChange = (index) => {
      const tabHashArray = this.state.tabs.map(({ hash }) => hash);
      const url = this.props.location.pathname;
      this.props.history.replace(`${url}${tabHashArray[index]}`);
    };
    const hashes = this.state.tabs.map((t) => t.hash);
    const selectedIndex =
      hashes.indexOf(this.props.location.hash) !== -1
        ? hashes.indexOf(this.props.location.hash)
        : 0;

    const { strings } = this.props;
    const countryLink = `/countries/${this.props.event.data.countries[0].id}`;
    const countryName = data.countries[0].name;
    const regionId = this.props.event.data.countries[0].region;
    const regionLink = `/regions/${regionId}`;
    const regionName = getRegionById(regionId.toString()).name;

    return (
      <section className="inpage">
        <Helmet>
          <title>
            { resolveToString(strings.emergencyPageTitle, { name: get(data, 'name', 'Emergency') }) }
          </title>
        </Helmet>

        <div className='container-lg'>
          <div className='row flex-sm'>
            <div className='col col-6-sm col-7-mid'>
              <BreadCrumb
                breadcrumbContainerClass='padding-reset'
                crumbs={[
                  {
                    link: `/emergency/${get(data, 'id')}`,
                    name: get(data, 'name', strings.breadCrumbEmergency)
                  },
                  { link: countryLink, name: countryName },

                  { link: '/emergencies', name: strings.breadCrumbEmergencies},
                  { link: '/', name: strings.breadCrumbHome},
                ]}
              />
            </div>

            <div className='col col-6-sm col-5-mid spacing-half-t'>
              <div className='row-sm flex flex-justify-flex-end'>
                {this.props.isLogged ? subscribeButton() : null}
                <div className='col-sm spacing-half-v flex'>
                  <a
                    href={url.resolve(api, `api/event/${data.id}/change/`)}
                    className="button button--xsmall button--primary-bounded button button--edit-action"
                  >
                    <span className='collecticon-pencil margin-half-r'></span>
                    <Translate
                      stringId="emergencyActionEditEventLabel"
                    />
                  </a>
                </div>
                <div className='col-sm spacing-half-v flex'>
                  {this.props.isLogged && (
                    <button
                      onClick={() => {
                        this.setState({
                          showProjectForm: true,
                        });
                      }}
                      className="button button--xsmall button--primary-bounded"
                    >
                        <Translate
                          stringId="emergencyActionCreateThreeWActivityLabel"
                        />
                    </button>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>
          {this.state.showProjectForm && (
            <ProjectFormModal
              onCloseButtonClick={() => {
                this.setState({ showProjectForm: false });
              }}
            />
          )}
        <header className="inpage__header">
          <div className="container-lg">
            <div className="inpage__headline-content">
              <div className="inpage__headline-content">
                <h1 className="inpage__title">{data.name}</h1>
                <div className="inpage__headline-actions row flex flex-justify-center">
                  <div className='col spacing-half-v flex'>
                    <Link to={regionLink}
                      className="link link--with-icon"
                    >
                      <span className='link--with-icon-text'>
                        {regionName}
                      </span>
                      <span className='collecticon-chevron-right link--with-icon-inner'></span>
                    </Link>
                  </div>
                  <div className='col spacing-half-v flex'>
                    <Link to={countryLink}
                      className="link link--with-icon"
                    >
                      <span className='link--with-icon-text'>
                        {countryName}
                      </span>
                      <span className='collecticon-chevron-right link--with-icon-inner'></span>
                    </Link>
                  </div>
                </div>
                {this.renderHeaderStats()}
              </div>
            </div>
          </div>
        </header>
        <div className='tab__wrap'>
          <Tabs
            selectedIndex={selectedIndex}
            onSelect={(index) => handleTabChange(index)}
          >
            <TabList>
              {this.state.tabs.map((tab) => (
                <Tab key={tab.title}>{tab.title}</Tab>
              ))}
            </TabList>

            <div className="inpage__body">
              <div className="inner">
                <TabPanel>
                  <TabContent isError={!this.hasKeyFigures()} title={strings.emergencyKeyFiguresTitle}>
                    {this.renderKeyFigures()}
                  </TabContent>
                  <div className='container-lg'>
                    {showExportMap()}
                  </div>
                  <TabContent
                    isError={!summary}
                    errorMessage={NO_DATA}
                    title={strings.emergencyOverviewTitle}
                  >
                    <Fold
                      id="overview"
                      title={strings.emergencySituationalOverviewTitle}
                      foldWrapperClass="situational-overview fold--main"
                    >
                      <Expandable
                        sectionClass="rich-text-section"
                        limit={2048}
                        text={summary}
                      />
                    </Fold>
                  </TabContent>
                  <TabContent title={strings.emergencyAlertsTitle}>
                    <SurgeAlertsTable
                      id="alerts"
                      title={strings.emergencyAlertsTitle}
                      emergency={this.props.match.params.id}
                      returnNullForEmpty={true}
                    />
                  </TabContent>
                  <TabContent
                    isError={!get(this.props.eru, 'data.results.length')}
                    errorMessage={NO_DATA}
                    title={strings.emergencyERUTitle}
                  >
                    <EruTable id="erus" emergency={this.props.match.params.id} />
                  </TabContent>
                  <TabContent title={strings.emergencyPersonnelTitle}>
                    <PersonnelTable
                      id="personnel"
                      emergency={this.props.match.params.id}
                    />
                  </TabContent>
                  <TabContent
                    isError={!get(this.props.event, 'data.field_reports.length')}
                    errorMessage={NO_DATA}
                    title={strings.emergencyFieldReportsTitle}
                  >
                    {this.renderFieldReports()}
                  </TabContent>
                  <TabContent
                    isError={
                      !get(this.props.appealDocuments, 'data.results.length')
                    }
                    errorMessage={NO_DATA}
                    title={strings.emergencyAppealDocumentsTitle}
                  >
                    {this.renderAppealDocuments()}
                  </TabContent>
                  <TabContent
                    isError={
                      !get(this.props.situationReports, 'data.results.length')
                    }
                    errorMessage={NO_DATA}
                    title={strings.emergencyResponseDocumentsTitle}
                  >
                    {this.renderResponseDocuments()}
                  </TabContent>

                  {contacts && contacts.length ? (
                    <div className='container-lg margin-2-v'>
                      <Fold id="contacts" title={strings.emergencyContactsTitle} foldWrapperClass="contacts fold--main" foldContainerClass='container-lg--padding-reset'>
                        <table className="table table--border-bottom">
                          <thead className="visually-hidden">
                            <tr>
                              <th>{strings.emergencyContactsTableHeaderName}</th>
                              <th>{strings.emergencyContactsTableHeaderTitle}</th>
                              <th>{strings.emergencyContactsTableHeaderType}</th>
                              <th>{strings.emergencyContactsTableHeaderContact}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {contacts.map((o) => (
                              <tr key={o.id}>
                                <td>{o.name}</td>
                                <td>{o.title}</td>
                                <td>{separate(o.ctype)}</td>
                                <td>
                                  {o.email.indexOf('@') !== -1 ? (
                                    <a
                                      className="button button--small button--grey-cement-bounded"
                                      href={`mailto:${o.email}`}
                                      title={strings.emergencyContactTitle}
                                    >
                                      {o.email}
                                    </a>
                                  ) : (
                                    <a
                                      className="button button--small button--grey-cement-bounded"
                                      href={`tel:${o.email}`}
                                      title={strings.emergencyContactTitle}
                                    >
                                      {o.email}
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Fold>
                    </div>
                  ) : (
                    <div className='container-lg margin-2-v'>
                      <ErrorPanel
                        title={strings.emergencyContactsTitle}
                        errorMessage={strings.emergencyContactEmptyMessage}
                      />
                    </div>
                  )}
                </TabPanel>

                {this.renderAdditionalTabPanels()}
              </div>
            </div>
          </Tabs>
        </div>
      </section>
    );
  }

  render () {
    this.syncLoadingAnimation(this.props.projectForm);
    const { strings } = this.props;

    return (
      <App className="page--emergency">
        <Helmet>
          <title>{strings.emergencyPageTitleStatic}</title>
        </Helmet>
        {this.renderContent()}
      </App>
    );
  }
}

if (environment !== 'production') {
  Emergency.propTypes = {
    _getEventById: T.func,
    _getEventSnippets: T.func,
    _getSitrepsByEventId: T.func,
    _getSitrepTypes: T.func,
    _getAppealDocsByAppealIds: T.func,
    _addSubscriptions: T.func,
    _delSubscription: T.func,
    _getUserProfile: T.func,
    snippets: T.object,
    match: T.object,
    location: T.object,
    history: T.object,
    event: T.object,
    situationReports: T.object,
    situationReportTypes: T.object,
    appealDocuments: T.object,
    surgeAlerts: T.object,
    eru: T.object,
    personnel: T.object,
    isLogged: T.bool,
    profile: T.object,
    user: T.object,
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  projectForm: state.projectForm,
  event: get(state.event.event, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false,
  }),
  snippets: get(state.event.snippets, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false,
  }),
  situationReports: get(
    state.situationReports,
    ['reports', ownProps.match.params.id],
    {
      data: {},
      fetching: false,
      fetched: false,
    }
  ),
  situationReportTypes: state.situationReports.types,
  appealDocuments: get(state.appealDocuments, ownProps.match.params.id, {
    data: {},
    fetching: false,
    fetched: false,
  }),
  surgeAlerts: state.surgeAlerts,
  eru: state.deployments.eru,
  personnel: state.deployments.personnel,
  isLogged: !!state.user.data.token,
  user: state.user,
  profile: state.profile,
});

const dispatcher = (dispatch) => ({
  _getEventById: (...args) => dispatch(getEventById(...args)),
  _getEventSnippets: (...args) => dispatch(getEventSnippets(...args)),
  _getSitrepsByEventId: (...args) => dispatch(getSitrepsByEventId(...args)),
  _getSitrepTypes: (...args) => dispatch(getSitrepTypes(...args)),
  _getAppealDocsByAppealIds: (...args) =>
    dispatch(getAppealDocsByAppealIds(...args)),
  _addSubscriptions: (...args) => dispatch(addSubscriptions(...args)),
  _delSubscription: (...args) => dispatch(delSubscription(...args)),
  _getUserProfile: (...args) => dispatch(getUserProfile(...args)),
});

export default withLanguage(withRouter(connect(selector, dispatcher)(Emergency)));
