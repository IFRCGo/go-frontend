import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import { Helmet } from 'react-helmet';

import BlockLoading from '#components/block-loading';
import { TimeLineChart } from '#components/Charts';

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
  getPersonnelByEvent,
  getAggrSurgeKeyFigures
} from '#actions';
import { useRequest } from '#utils/restRequest';
import { finishedFetch, datesAgo } from '#utils/utils';
import { mergeDeployData } from '#utils/mergeDeployData';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import { environment } from '#config';
import {
  commaSeparatedNumber as n,
//  nope
} from '#utils/format';

import App from './app';
import Progress from '#components/progress';
import PersonnelByEventTable from '#components/deployments/personnel-by-event-table';
import AlertsTable from '#components/connected/alerts-table';
// import PersonnelTable from '#components/connected/personnel-table';
import EruTable from '#components/connected/eru-table';
import { SFPComponent } from '#utils/extendables';
import DeploymentsMap from '#components/map/deployments-map';
import Readiness from '#components/deployments/readiness';
import BreadCrumb from '#components/breadcrumb';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import { countriesGeojsonSelector } from '../selectors';


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
    addFullscreenListener(this.onFullscreenChange);
    showGlobalLoading();
    this.props._getEruOwners();
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

  renderHeaderCharts (data, title) {
    const rows = 5;
    const max = Math.max.apply(Math, data.map(o => +o.items));
    const items = data.length > rows ? data.slice(0, rows) : data;
    return (
      <div>
        <figcaption>
          <h2 className='fold__title'>{title}</h2>
        </figcaption>
        <div className='emergencies__container spacing-2'>
          <ul className='emergencies__list'>
            {items.map(o => (
              <li key={o.name}
                className='emergencies__item'>
                <span className='key'>{o.name} ({o.items})</span>
                <span className='value'><Progress value={o.items} max={max}><span>100</span></Progress></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  renderHeaderStats () {
  //  const { data } = this.props.eruOwners;
  //  const { types } = this.props.activePersonnel;
  //  let fact = nope;
  //  if (types.fact || types.rr || types.rdrt) {
  //    fact = (types.fact || 0) + (types.rr || 0) + (types.rdrt || 0);
  //  }
  //  const heop = types.heop || nope;

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
                  <Translate className='sumstats__key' stringId='deploymentsDeployedRRP'/>
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
    const { data } = this.props.eruOwners;
    const { strings } = this.context;
    return (
      <div className=''>
        <div className='inner'>
          <div className='inpage__body-charts'>
            <div className='row display-flex flex-row'>
              <div className='col col-6-xs spacing-v display-flex'>
                <div className='chart box__content'>
                  {this.renderHeaderCharts(data.owners, strings.deploymentNumber)}
                </div>
              </div>
              <div className='col col-6-xs spacing-v display-flex'>
                <div className='chart box__content'>
                  <figure>
                    <figcaption>
                      <h2 className='fold__title'><Translate stringId='deployementsOverLastYear' /></h2>
                    </figcaption>
                  </figure>
                  <div className='spacing-2-t'>
                    <DeploymentsByMonth />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          <div className='container-lg'>
            {this.props.eru.fetched && this.props.activePersonnel.fetched ?
              <DeploymentsMap
                data={deployData}
                countriesGeojson={this.props.countriesGeojson}
              />
              : <BlockLoading />
            }
          </div>
          <div className='inpage__body container-lg'>
            <div className='inner'>
              {this.renderCharts()}
            </div>
          </div>
        </section>
        <div className='inpage__body'>
          <div className='inner margin-4-t'>
            <div>
              <AlertsTable
                title={strings.homeSurgeNotification}
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
    _getActivePersonnel: T.func,
    _getAllDeploymentERU: T.func,
    eruOwners: T.object,
    eru: T.object,
    activePersonnel: T.object,
    allEru: T.object,
    countriesGeojson: T.object
  };
}

const selector = (state) => ({
  eruOwners: state.eruOwners,
  eru: state.deployments.eru,
  activePersonnel: state.deployments.activePersonnel,
  allEru: state.deployments.allEru,
  countriesGeojson: countriesGeojsonSelector(state),
  personnelByEvent: state.personnelByEvent,
  aggregated: state.deployments.aggregated
});

const dispatcher = (dispatch) => ({
  _getEruOwners: () => dispatch(getEruOwners()),
  _getAllDeploymentERU: (...args) => dispatch(getAllDeploymentERU(...args)),
  _getActivePersonnel: (...args) => dispatch(getActivePersonnel(...args)),
  _getPersonnelByEvent: (...args) => dispatch(getPersonnelByEvent(...args)),
  _getAggrSurgeKeyFigures: () => dispatch(getAggrSurgeKeyFigures())
});

export default connect(selector, dispatcher)(Deployments);
