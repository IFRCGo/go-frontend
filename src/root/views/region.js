import React from 'react';
import c from 'classnames';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import memoize from 'memoize-one';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Helmet } from 'react-helmet';
import CountryList from '#components/country-list';
import BlockLoading from '#components/block-loading';
import { environment } from '#config';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import { get } from '#utils/utils';
import { nope } from '#utils/format';
import BreadCrumb from '#components/breadcrumb';
import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
  addFullscreenListener,
  removeFullscreenListener
} from '#utils/fullscreen';
import {
  getAdmAreaById,
  getAdmAreaAppealsList,
  getAdmAreaAggregateAppeals,
  getRegionPersonnel,
  getAdmAreaKeyFigures,
  getAdmAreaSnippets,
  getCountries,
  getAppealsListStats
} from '#actions';
import { getRegionBoundingBox } from '#utils/region-bounding-box';
import { commaSeparatedNumber as n } from '#utils/format';
import {
  countriesByRegion,
  getRegionId,
  regions as regionMeta
} from '#utils/region-constants';
import { getCountryMeta } from '#utils/get-country-meta';

import App from './app';
import Fold from '#components/fold';
import TabContent from '#components/tab-content';
import EmergenciesTable from '#components/connected/emergencies-table';
import HighlightedOperations from '#components/highlighted-operations';
import AppealsTable from '#components/connected/appeals-table';
import TimelineCharts from '#components/timeline-charts';
import KeyFiguresHeader from '#components/common/key-figures-header';
import {
  Snippets,
  KeyFigures,
  Contacts,
  Links
} from '#components/admin-area-elements';
import { SFPComponent } from '#utils/extendables';
import { NO_DATA } from '#utils/constants';
import RegionalThreeW from './RegionalThreeW';
import MainMap from '#components/map/main-map';

import LanguageContext from '#root/languageContext';
import { resolveToString } from '#utils/lang';

class AdminArea extends SFPComponent {
  constructor (props, context) {
    super(props);

    this.state = {
      maskLayer: this.getMaskLayer(getRegionId(props.match.params.id)),
      fullscreen: false
    };

    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
    this.TAB_DETAILS = [
      { title: context.strings.regionOperationsTab, hash: '#operations' },
      { title: context.strings.region3WTab, hash: '#3w' },
      { title: context.strings.regionAdditionalInfoTab, hash: '#additional-info' }
    ];

  }



  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (getRegionId(this.props.match.params.id) !== getRegionId(nextProps.match.params.id)) {
      this.getData(nextProps);
      this.setState({ maskLayer: this.getMaskLayer(getRegionId(nextProps.match.params.id)) });
      return this.getAdmArea(nextProps.type, getRegionId(nextProps.match.params.id));
    }

    if (this.props.adminArea.fetching && !nextProps.adminArea.fetching) {
      hideGlobalLoading();
      if (nextProps.adminArea.error) {
        console.error(nextProps.adminArea.error);
        // removed because redirect is highly misleading
        // this.props.history.push('/uhoh');
      }
    }
  }

  componentDidMount () {
    this.getData(this.props);
    this.getAdmArea(this.props.type, getRegionId(this.props.match.params.id));
    this.displayTabContent();
    addFullscreenListener(this.onFullscreenChange);
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

  // Sets default tab if url param is blank or incorrect
  displayTabContent () {
    const tabHashArray = this.TAB_DETAILS.map(({ hash }) => hash);
    if (!tabHashArray.find(hash => hash === this.props.location.hash)) {
      this.props.history.replace(`${this.props.location.pathname}${tabHashArray[0]}`);
    }
  }

  getData (props) {
    const id = getRegionId(props.match.params.id);
    this.props._getAdmAreaAppealsList(props.type, id);
    this.props._getAdmAreaAggregateAppeals(props.type, id, DateTime.local().minus({ years: 10 }).startOf('month').toISODate(), 'year');
    this.props._getRegionPersonnel(id);
    this.props._getAdmAreaKeyFigures(props.type, id);
    this.props._getAdmAreaSnippets(props.type, id);
    this.props._getCountries(id);
    this.props._getAppealsListStats({regionId: id});
  }

  getMaskLayer (regionId) {
    const countries = countriesByRegion[regionId.toString()];
    const isoCodes = countries.map(getCountryMeta)
      .filter(Boolean)
      .map(d => d.iso.toUpperCase());
    return {
      id: 'country-mask',
      type: 'fill',
      source: 'ifrc',
      'source-layer': 'country',
      paint: {
        'fill-color': 'rgba(33, 33, 33, 0.7)'
      },
      filter: [
        '!in',
        'ISO2'
      ].concat(isoCodes)
    };
  }

  getAdmArea (type, id) {
    showGlobalLoading();
    this.props._getAdmAreaById(type, id);
  }

  getRegionId = memoize((regionIdFromProps) => {
    return getRegionId(regionIdFromProps);
  })

  renderContent () {
    const {
      fetched,
      error,
      data
    } = this.props.adminArea;

    if (!fetched || error) return null;

    const presentationClass = c({
      'presenting fold--stats': this.state.fullscreen,
      'fold--r': !this.state.fullscreen
    });

    const mapBoundingBox = getRegionBoundingBox(data.id);
    const regionName = get(regionMeta, [data.id, 'name'], nope);
    const activeOperations = get(this.props.appealStats, 'data.results.length', false);

    const handleTabChange = index => {
      const tabHashArray = this.TAB_DETAILS.map(({ hash }) => hash);
      const url = this.props.location.pathname;
      this.props.history.replace(`${url}${tabHashArray[index]}`);
    };
    const hashes = this.TAB_DETAILS.map(t => t.hash);
    const selectedIndex = hashes.indexOf(this.props.location.hash) !== -1 ? hashes.indexOf(this.props.location.hash) : 0;
    const { strings } = this.context;

    const foldLink = (
      <Link className='fold__title__link' to={'/appeals/all?region=' + data.id}>{resolveToString(strings.regionAppealsTableViewAllText, { regionName: regionName })}</Link>
    );

    return (
      <section className='inpage'>
        <Helmet>
          <title>
            {resolveToString(strings.regionTitleSelected, { regionName: regionName})}
          </title>
        </Helmet>
        <BreadCrumb crumbs={[
          {link: this.props.location.pathname, name: regionName},
          {link: '/', name: strings.breadCrumbHome}
        ]} />
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{regionName}</h1>
            </div>
          </div>
        </header>
        <section className='inpage__body'>
          <div className='inner'>
            {this.props.appealsListStats.data ? (
              <KeyFiguresHeader appealsListStats={this.props.appealsListStats} />
            ) : <BlockLoading/>}
          </div>
        </section>

        <div className='tab__wrap tab__wrap--3W'>
          <Tabs
            selectedIndex={ selectedIndex }
            onSelect={index => handleTabChange(index)}
          >
            <TabList>
              {this.TAB_DETAILS.map(tab => (
                <Tab key={tab.title}>{tab.title}</Tab>
              ))}
            </TabList>

            <div className='inpage__body'>
              <div className='inner'>
                <TabPanel>
                  <TabContent>
                    <HighlightedOperations opsType='region' opsId={data.id}/>
                    <section className={presentationClass} id='presentation'>
                      {this.state.fullscreen ? (
                        <KeyFiguresHeader fullscreen={this.state.fullscreen} appealsListStats={this.props.appealsListStats} />
                      ) : null}
                      <div className={c('inner', {'appeals--fullscreen': this.state.fullscreen})}>
                        <Fold
                          showHeader={!this.state.fullscreen}
                          title={`${strings.regionAppealsTableTitle} (${n(activeOperations)})`}
                          id={'appeals'}
                          navLink={foldLink}
                          foldTitleClass='fold__title--inline'
                          foldWrapperClass='fold--main fold--appeals-table'
                        >
                          <MainMap
                            operations={this.props.appealStats}
                            noExport={true}
                            noRenderEmergencies={true}
                            fullscreen={this.state.fullscreen}
                            toggleFullscreen={this.toggleFullscreen}
                            mapBoundingBox={mapBoundingBox}
                          />
                          <AppealsTable
                            foldLink={foldLink}
                            region={getRegionId(this.props.match.params.id)}
                            regionOperations={this.props.appealStats}
                            showActive={true}
                            id={'appeals'}
                            showRegionMap={true}
                            fullscreen={this.state.fullscreen}
                            toggleFullscreen={this.toggleFullscreen}
                          />
                        </Fold>
                      </div>
                    </section>
                    <Fold title={strings.regionStatistics} foldHeaderClass='visually-hidden' id='stats'>
                      <div className='stats-chart'>
                        <TimelineCharts region={data.id} />
                      </div>
                    </Fold>
                    <CountryList
                      countries={this.props.countries}
                      appealStats={this.props.appealStats}
                    />
                    <EmergenciesTable
                      id='emergencies'
                      title={strings.regionRecentEmergencies}
                      limit={5}
                      region={getRegionId(this.props.match.params.id)}
                      showRecent={true}
                      viewAll={'/emergencies/all?region=' + data.id}
                      viewAllText={resolveToString(strings.regionEmergenciesTableViewAllText, { regionName: regionName })}
                    />

                  </TabContent>
                </TabPanel>
                <TabPanel>
                  <TabContent title={strings.region3WTitle}>
                    <RegionalThreeW
                      disabled={this.loading}
                      regionId={this.getRegionId(this.props.match.params.id)}
                    />
                  </TabContent>
                </TabPanel>
                <TabPanel>
                  <TabContent isError={!get(this.props.keyFigures, 'data.results.length')} errorMessage={ NO_DATA } title={strings.regionKeyFigures}>
                    <KeyFigures data={this.props.keyFigures} />
                  </TabContent>
                  <TabContent isError={!get(this.props.snippets, 'data.results.length')} errorMessage={ NO_DATA } title={strings.regionGraphics}>
                    <Snippets data={this.props.snippets} />
                  </TabContent>
                  <TabContent isError={!get(data, 'links.length')} errorMessage={ NO_DATA } title={strings.regionLinks}>
                    <Links data={data} />
                  </TabContent>
                  <TabContent showError={true} isError={!get(data, 'contacts.length')} errorMessage={ NO_DATA } title={strings.regionContacts}>
                    <Contacts data={data} />
                  </TabContent>
                </TabPanel>
              </div>
            </div>
          </Tabs>
        </div>
      </section>
    );
  }

  render () {
    const { strings } = this.context;

    return (
      <App className={`page--${this.props.type}`}>
        <Helmet>
          <title>{strings.regionTitle}</title>
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
    _getAdmAreaAggregateAppeals: T.func,
    _getRegionPersonnel: T.func,
    _getCountries: T.func,
    _getAppealsListStats: T.func,
    type: T.string,
    match: T.object,
    history: T.object,
    adminArea: T.object,
    appealStats: T.object,
    aggregateYear: T.object,
    personnel: T.object,
    keyFigures: T.object,
    snippets: T.object,
    countries: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  adminArea: get(state.adminArea.aaData, getRegionId(ownProps.match.params.id), {
    data: {},
    fetching: false,
    fetched: false
  }),
  appeals: state.adminArea.appeals,
  drefs: state.adminArea.drefs,
  appealStats: state.adminArea.appealStats,
  aggregateYear: get(state.adminArea.aggregate, 'year', {
    data: {},
    fetching: false,
    fetched: false
  }),
  personnel: state.adminArea.personnel,
  keyFigures: state.adminArea.keyFigures,
  snippets: state.adminArea.snippets,
  countries: state.countries,
  appealsListStats: state.overallStats.appealsListStats
});

const dispatcher = (dispatch) => ({
  _getAdmAreaById: (...args) => dispatch(getAdmAreaById(...args)),
  _getAdmAreaAppealsList: (...args) => dispatch(getAdmAreaAppealsList(...args)),
  _getAdmAreaAggregateAppeals: (...args) => dispatch(getAdmAreaAggregateAppeals(...args)),
  _getRegionPersonnel: (...args) => dispatch(getRegionPersonnel(...args)),
  _getAdmAreaKeyFigures: (...args) => dispatch(getAdmAreaKeyFigures(...args)),
  _getAdmAreaSnippets: (...args) => dispatch(getAdmAreaSnippets(...args)),
  _getCountries: (...args) => dispatch(getCountries(...args)),
  _getAppealsListStats: (...args) => dispatch(getAppealsListStats(...args)),
});

AdminArea.contextType = LanguageContext;
export default connect(selector, dispatcher)(AdminArea);
