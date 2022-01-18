import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import { Helmet } from 'react-helmet';
import {  withRouter, Route, Switch } from 'react-router-dom';
import BlockLoading from '#components/block-loading';
import { TimeLineChart } from '#components/Charts';
import { Link } from 'react-router-dom';
import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
  addFullscreenListener,
  removeFullscreenListener
} from '#utils/fullscreen';
import {
  getAllDeploymentERU,
  getActivePersonnel,
  getEruOwners,
  getNsRapidResponse,
  getPersonnelByEvent,
  getAggrSurgeKeyFigures
} from '#actions';
import { useRequest } from '#utils/restRequest';
import { finishedFetch, datesAgo } from '#utils/utils';
import { mergeDeployData } from '#utils/mergeDeployData';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import { environment } from '#config';
import { commaSeparatedNumber as n } from '#utils/format';

import App from './app';
import Progress from '#components/progress';
import PersonnelByEventTable from '#components/deployments/personnel-by-event-table';
import AlertsTable from '#components/connected/alerts-table';
import EruTable from '#components/connected/eru-table';
import { SFPComponent } from '#utils/extendables';
import DeploymentsMap from '#components/map/deployments-map';
import Readiness from '#components/deployments/readiness';
import BreadCrumb from '#components/breadcrumb';
import LanguageContext from '#root/languageContext';
import RouterTabs from '#components/RouterTabs';
import Translate from '#components/Translate';
import { countriesGeojsonSelector } from '../selectors';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TabContent from '#components/tab-content';
import OperationalTimeline from './Surge/operational-timeline';
import CatalogueOfSurgeServices from './Surge/catalogue-of-surge-services';


const DeploymentsByMonth = () => {
  const { pending, response } = useRequest({url: 'api/v2/deployment/aggregated_by_month/'});

  const formatData = useCallback((data) => {
    const keys = Object.keys(data).reverse();
    return keys.map((key) =>
      ({ timespan: new Date(key).toISOString(), count: data[key]} )
    );
  }, []);

  return (!pending && response)
    ? <TimeLineChart data={formatData(response)} />
    : <></>;
};


class Deployments extends SFPComponent {
  // Methods form SFPComponent:
  // handlePageChange (what, page)
  // handleFilterChange (what, field, value)
  // handleSortChange (what, field)

  constructor (props) {
    super(props);
    this.state = {
      fullscreen: false,
      eru: {
        limit: 5,
        page: 1
      }
    };
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
  }

  componentDidMount () {
    this.displayTabContent();
    addFullscreenListener(this.onFullscreenChange);
    showGlobalLoading();
    this.props._getEruOwners();
    this.props._getNsRapidResponse();
    this.props._getAllDeploymentERU();
    this.props._getActivePersonnel();
    this.props._getPersonnelByEvent();
    this.props._getAggrSurgeKeyFigures();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (finishedFetch(this.props, nextProps, 'eruOwners')) {
      hideGlobalLoading(0);
    }
  }

  componentWillUnmount () {
    removeFullscreenListener(this.onFullscreenChange);
  }

  onFullscreenChange () {
    this.setState({fullscreen: isFullscreen()});
  }

  toggleFullscreen () {
    if (isFullscreen()) {
      exitFullscreen();
      this.setState({fullscreen: false});
    } else {
      enterFullscreen(document.querySelector('#presentation'));
      this.setState({fullscreen: true});
    }
  }

  requestResults (what) {
    let state = this.state[what];
    let qs = { limit: state.limit };
    if (state.sort && state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else if (what !== 'eru') {
      qs.ordering = '-start_date';
    }

    if (state.filters && state.filters.startDate !== 'all') {
      qs.start_date__gte = datesAgo[state.filters.startDate]();
    }

    const fn = {
      eru: this.props._getDeploymentERU,
      fact: this.props._getDeploymentFACT,
      heop: this.props._getDeploymentHEOP,
      rdrt: this.props._getDeploymentRDRT
    };

    fn[what](state.page, qs);
  }

  updateData (what) {
    this.requestResults(what);
  }

  getTabDetails() {
    const { strings } = this.context;
    return [
      { title: strings.deploymentsSurgeOverViewTab, link: '/deployments/overview' },
      { title: strings.deploymentsOperationalToolboxTab, link: '/deployments/operational-toolbox' },
      { title: strings.deploymentsCatalogueOfSurgeServicesTab, link: '/deployments/catalogue' }
    ];
  }

  // Sets default tab if url param is blank or incorrect
  displayTabContent () {
    const tabHashArray = this.getTabDetails().map(({ hash }) => hash);
    if (!tabHashArray.find(hash => hash === this.props.location.hash)) {
      this.props.history.replace(`${this.props.location.pathname}${tabHashArray[0]}`);
    }
  }

  renderHeaderCharts (data, title) {
    const rows = 5;
    const max = Math.max.apply(Math, data.map(o => +o.deployments_count));
    const items = data.length > rows ? data.slice(0, rows) : data;
    return (
      <div>
        <figcaption>
          <h2 className='fold__title'>{title}</h2>
        </figcaption>
        <div className='emergencies__container spacing-2'>
          <ul className='emergencies__list'>
            {items.map(o => (
              <li key={o.society_name}
                className='emergencies__item'>
                <span className='key'>{o.society_name} ({o.deployments_count})</span>
                <span className='value'><Progress value={o.deployments_count} max={max}><span>100</span></Progress></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  renderHeaderStats () {
    return (
      <div>
        <div className='header-stats container-lg'>
          <div className='sumstats__wrap'>
            <ul className='sumstats'>
              <li className='sumstats__item__wrap'>
                <div className='sumstats__item'>
                  <img className='sumstats__icon_2020' src='/assets/graphics/layout/heops-brand.svg' />
                  <span className='sumstats__value'>
                    {n(this.props.aggregated.data.active_deployments)}
                  </span>
                  <Translate className='sumstats__key' stringId='deploymentsOngoingRR'/>
                </div>
              </li>
              <li className='sumstats__item__wrap'>
                <div className='sumstats__item'>
                  <img className='sumstats__icon_2020' src='/assets/graphics/layout/eru-brand.svg'/>
                  <span className='sumstats__value'>
                    {n(this.props.aggregated.data.active_erus)}
                  </span>
                  <Translate className='sumstats__key' stringId='deploymentsDeployedERU'/> &nbsp;
                </div>
              </li>
              <li className='sumstats__item__wrap'>
                <div className='sumstats__item'>
                  <img className='sumstats__icon_2020' src='/assets/graphics/layout/fact-brand.svg' />
                  <span className='sumstats__value'>
                    {n(this.props.aggregated.data.deployments_this_year)}
                  </span>
                  <Translate className='sumstats__key' stringId='deploymentsDeplThisYear'/> &nbsp;
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  renderCharts () {
    if (this.props.NsRapidResponse.fetched) {
      const {data} = this.props.NsRapidResponse;
      const {strings} = this.context;
      const year = new Date().getFullYear();
      return (
          <div className=''>
            <div className='inner'>
              <div className='inpage__body-charts'>
                <div className='row display-flex flex-row'>
                  <div className='col col-6-xs spacing-v display-flex'>
                    <div className='chart box__content'>
                      {this.renderHeaderCharts(data, strings.deploymentNumberTop5 + ' (' + year + ')')}
                    </div>
                  </div>
                  <div className='col col-6-xs spacing-v display-flex'>
                    <div className='chart box__content'>
                      <figure>
                        <figcaption>
                          <h2 className='fold__title'><Translate stringId='deployementsOverLastYear'/></h2>
                        </figcaption>
                      </figure>
                      <div className='spacing-2-t'>
                        <DeploymentsByMonth/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      );
    }
  }

  renderContent () {
    const {
      fetched,
      error
    } = this.props.eruOwners;
    const { strings } = this.context;
    if (!fetched || error) return null;
    let deployData = {type: 'FeatureCollection', features: []};

    if (this.props.eru.fetched && this.props.activePersonnel.fetched) {
      deployData = mergeDeployData(
        this.props.countriesGeojson,
        this.props.eru.data.results,
        this.props.activePersonnel.data.results
      );
    }

    const tabDetails = [...this.getTabDetails()];

    // const handleTabChange = index => {
    //   const tabHashArray = tabDetails.map(({ hash }) => hash);
    //   const url = this.props.location.pathname;
    //   this.props.history.replace(`${url}${tabHashArray[index]}`);
    // };
    // const hashes = tabDetails.map(t => t.hash);
    // const selectedIndex = hashes.indexOf(this.props.location.hash) !== -1 ? hashes.indexOf(this.props.location.hash) : 0;

    return (
      <section>
        <section className={c('inpage', {presenting: this.state.fullscreen})} id='presentation'>
          <header className='inpage__header'>
            <div className='inner'>
              <div className='inpage__headline'>
                <div className='inpage__headline-content'>
                  <h1 className='inpage__title'>
                    <Translate stringId="deploymentsPageTitleSurge" />
                  </h1>
                  { /* <div className='presentation__actions'>
                    <div className='inner'>
                      <button className='button button--base-plain button--fullscreen' onClick={this.toggleFullscreen} title='View in fullscreen'><span>FullScreen</span></button>
                    </div>
                  </div> */ }
                  {this.renderHeaderStats()}
                </div>
              </div>
            </div>
          </header>
          <div className='tab__wrap margin-2-t'>
            <RouterTabs
              tabs={tabDetails}
              currentUrl={this.props.location.pathname}
            />
            <div className="inpage__body">
              <Switch>
                <Route exact path="/deployments/overview">
                  <div>
                    <div className='container-lg'>
                      {this.props.eru.fetched && this.props.activePersonnel.fetched ?
                        <DeploymentsMap
                          data={deployData}
                          countriesGeojson={this.props.countriesGeojson}
                        /> : <BlockLoading />
                      }
                    </div>
                    <div className='inpage__body container-lg'>
                      <div className='inner'>
                        {this.renderCharts()}
                      </div>
                    </div>
                    <div className='inpage__body'>
                      <div className='inner margin-4-t'>
                        <div>
                          <AlertsTable
                            title={strings.homeSurgeAlerts}
                            limit={5}
                            isActive={true}
                            viewAll={'/alerts/all'}
                            showRecent={true}
                          />
                        </div>
                        <div className='table-deployed-personnel-block'>
                          <PersonnelByEventTable data={this.props.personnelByEvent} />
                        </div>
                        <div className='inner'>
                        <EruTable
                          limit={5}
                          viewAll={'/deployments/erus/all'}
                        />
                        </div>
                        <div className='readiness__container container-lg'>
                          <Readiness eruOwners={this.props.eruOwners} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Route>
                <Route exact path="/deployments/operational-toolbox">
                  <div className='container-lg margin-4-t'>
                    <OperationalTimeline />
                  </div>
                </Route>
                <Route path="/deployments/catalogue">
                  <div className='container-lg'>
                    <CatalogueOfSurgeServices history={this.props.history} />
                  </div>
                </Route>
                <Route path="/deployments/user/:userId"
                  children={({ match, ...rest }) => (
                    <div>
                      {match.params.userId}
                    </div>
                  )}
                />
              </Switch>
            </div>
          </div>
        </section>
      </section>
    );
  }

  render () {
    const { strings } = this.context;
    return (
      <App className='page--deployments'>
        <Helmet>
          <title>
            {strings.deploymentsTitle}
          </title>
        </Helmet>
        <BreadCrumb crumbs={[
          {link: this.props.location.pathname, name: strings.breadCrumbSurge},
          {link: '/', name: strings.breadCrumbHome}
        ]} />
        {this.renderContent()}
      </App>
    );
  }
}
Deployments.contextType = LanguageContext;
if (environment !== 'production') {
  Deployments.propTypes = {
    _getEruOwners: T.func,
    _getNsRapidResponse: T.func,
    _getActivePersonnel: T.func,
    _getAllDeploymentERU: T.func,
    eruOwners: T.object,
    NsRapidResponse: T.object,
    eru: T.object,
    activePersonnel: T.object,
    allEru: T.object,
    countriesGeojson: T.object,
    history: T.object
  };
}

const selector = (state) => ({
  eruOwners: state.eruOwners,
  NsRapidResponse: state.NsRapidResponse,
  eru: state.deployments.eru,
  activePersonnel: state.deployments.activePersonnel,
  allEru: state.deployments.allEru,
  countriesGeojson: countriesGeojsonSelector(state),
  personnelByEvent: state.personnelByEvent,
  aggregated: state.deployments.aggregated
});

const dispatcher = (dispatch) => ({
  _getEruOwners: () => dispatch(getEruOwners()),
  _getNsRapidResponse: () => dispatch(getNsRapidResponse()),
  _getAllDeploymentERU: (...args) => dispatch(getAllDeploymentERU(...args)),
  _getActivePersonnel: (...args) => dispatch(getActivePersonnel(...args)),
  _getPersonnelByEvent: (...args) => dispatch(getPersonnelByEvent(...args)),
  _getAggrSurgeKeyFigures: () => dispatch(getAggrSurgeKeyFigures())
});

export default withRouter(connect(selector, dispatcher)(Deployments));
