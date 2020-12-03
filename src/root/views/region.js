import React from 'react';
import c from 'classnames';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Helmet } from 'react-helmet';
import CountryList from '#components/country-list';
import BlockLoading from '#components/block-loading';
import { environment } from '#config';
import { showGlobalLoading, hideGlobalLoading } from '#components/global-loading';
import { get } from '#utils/utils';
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
  getAppealsListStats
} from '#actions';
import { commaSeparatedNumber as n } from '#utils/format';
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
  TitledSnippets,
  KeyFigures,
  Contacts,
  Links
} from '#components/admin-area-elements';
import { SFPComponent } from '#utils/extendables';
import RegionalThreeW from './RegionalThreeW';
import MainMap from '#components/map/main-map';

import LanguageContext from '#root/languageContext';
import { resolveToString } from '#utils/lang';

import { countriesSelector, countriesByRegionSelector, regionsByIdSelector, regionByIdOrNameSelector, countriesGeojsonSelector } from '../selectors';
import turfBbox from '@turf/bbox';

class AdminArea extends SFPComponent {
  constructor (props, context) {
    super(props);

    this.state = {
      maskLayer: this.getMaskLayer(this.props.thisRegion.id),
      regionAdditionalInfoTabIframe: null,
      fullscreen: false,
      showCountriesSidebar: false

    };

    this.toggleCountriesSidebar = this.toggleCountriesSidebar.bind(this);

    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
    this.onAdditionalLinkClickAction = this.onAdditionalLinkClickAction.bind(this);
    this.TAB_DETAILS = [
      { title: context.strings.regionOperationsTab, hash: '#operations' },
      { title: context.strings.region3WTab, hash: '#3w' },
      { title: context.strings.regionProfileTab, hash: '#regional-profile' },
      // { title: context.strings.regionPreparednessTab, hash: '#preparedness' },
      // { title: context.strings.regionAdditionalInfoTab, hash: '#additional-info' }
    ];



  }

  toggleCountriesSidebar () {
    this.setState({showCountriesSidebar: !this.state.showCountriesSidebar});
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.thisRegion.id !== nextProps.thisRegion.id) {
      this.getData(nextProps);
      this.setState({ maskLayer: this.getMaskLayer(nextProps.thisRegion.id) });
      return this.getAdmArea(nextProps.type, nextProps.thisRegion.id);
    }

    if (this.props.adminArea.fetching && !nextProps.adminArea.fetching) {
      hideGlobalLoading(0);
      if (nextProps.adminArea.error) {
        console.error(nextProps.adminArea.error);
        // removed because redirect is highly misleading
        // this.props.history.push('/uhoh');
      }
    }
  }

  componentDidMount () {
    this.getData(this.props);
    this.getAdmArea(this.props.type, this.props.thisRegion.id);
    this.displayTabContent();
    addFullscreenListener(this.onFullscreenChange);
  }

  componentWillUnmount () {
    removeFullscreenListener(this.onFullscreenChange);
  }

  onFullscreenChange () {
    this.setState({fullscreen: isFullscreen()});
  }

  addClickHandler (data, clickHandler) {
    if (data.links && data.links.length) {
      data.links = data.links.map(link => {
        if (link.show_in_go) {
          return Object.assign({}, link, { onClick: clickHandler });
        } else {
          return link;
        }
      });
    }
    return data;
  }

  onAdditionalLinkClickAction (linkObject) {
    this.setState({
      regionAdditionalInfoTabIframe: linkObject.url
    });
  }

  onIframeBackClick () {
    this.setState({
      regionAdditionalInfoTabIframe: false
    });
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
    const id = props.thisRegion.id;
    this.props._getAdmAreaAppealsList(props.type, id);
    this.props._getAdmAreaAggregateAppeals(props.type, id, DateTime.local().minus({ years: 10 }).startOf('month').toISODate(), 'year');
    this.props._getRegionPersonnel(id);
    this.props._getAdmAreaKeyFigures(props.type, id);
    this.props._getAdmAreaSnippets(props.type, id);
    // this.props._getCountries(id);
    this.props._getAppealsListStats({regionId: id});
  }

  getMaskLayer (regionId) {
    const countries = this.props.countriesByRegion[regionId.toString()];
    const isoCodes = countries.map(country => {
      return country.iso.toUpperCase();
    });

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

  renderContent () {
    const {
      fetched,
      error,
      data
    } = this.props.adminArea;
    const regionId = data.id;
    const { regions, thisRegion } = this.props;

    if (!fetched || error) return null;
    const { strings } = this.context;

    const additionalTabName = data.additional_tab_name ? data.additional_tab_name : strings.regionAdditionalInfoTab;
    
    const tabDetails = [...this.TAB_DETAILS];
    // Add Preparedness Tab only if Preparedness Snippets exist
    if (data.preparedness_snippets.length > 0) {
      tabDetails.push({
        title: strings.regionPreparednessTab,
        hash: '#preparedness'
      });
    }

    // Add Additional Tab with custom name, FIXME: dont add if no data
    tabDetails.push({
      title: additionalTabName,
      hash: '#additional-info'
    });

    const presentationClass = c({
      'presenting fold--stats': this.state.fullscreen,
      'fold--r': !this.state.fullscreen
    });

    const mapBoundingBox = turfBbox(regions[data.id][0].bbox);
    const regionName = thisRegion.label;
    const activeOperations = get(this.props.appealStats, 'data.results.length', false);

    const handleTabChange = index => {
      const tabHashArray = tabDetails.map(({ hash }) => hash);
      const url = this.props.location.pathname;
      this.props.history.replace(`${url}${tabHashArray[index]}`);
    };
    const hashes = tabDetails.map(t => t.hash);
    const selectedIndex = hashes.indexOf(this.props.location.hash) !== -1 ? hashes.indexOf(this.props.location.hash) : 0;

    const foldLink = (
      <Link className='fold__title__link' to={'/appeals/all?region=' + data.id}>{resolveToString(strings.regionAppealsTableViewAllText, { regionName: regionName })}</Link>
    );

    // const tabDetails = this.TAB_DETAILS.map(d => {
    //   d.title = d.hash === '#additional-info' ? additionalTabName : d.title;
    //   return d;
    // });
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
          <div className='btn-region-countries-container'>
            <div className={`btn-region-countries-trigger link link--with-icon ${this.state.showCountriesSidebar ? 'btn-region-countries-trigger--active' : ''}`} onClick={this.toggleCountriesSidebar}>
              <span className='btn-region-countries-icon link--with-icon-inner'>
                <span className={this.state.showCountriesSidebar ? 'collecticon-sm-chevron-right' : 'collecticon-sm-chevron-left'}></span>
                <span className={this.state.showCountriesSidebar ? 'collecticon-sm-chevron-right' : 'collecticon-sm-chevron-left'}></span>
              </span>
              <span className='link--with-icon-text'>All countries</span>
            </div>

            <CountryList
              showCountriesSidebar={this.state.showCountriesSidebar}
              countries={this.props.countriesByRegion[regionId]}
              appealStats={this.props.appealStats}
            />
          </div>
          <Tabs
            selectedIndex={ selectedIndex }
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
                            countriesGeojson={this.props.countriesGeojson}
                            // layers={this.state.maskLayer}
                          />
                          <AppealsTable
                            foldLink={foldLink}
                            region={thisRegion.id}
                            showActive={true}
                            id={'appeals'}
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
                    <EmergenciesTable
                      id='emergencies'
                      title={strings.regionRecentEmergencies}
                      limit={5}
                      region={thisRegion.id}
                      showRecent={true}
                      viewAll={'/emergencies/all?region=' + data.id}
                      viewAllText={resolveToString(strings.regionEmergenciesTableViewAllText, { regionName })}
                    />
                    <TitledSnippets snippets={data.emergency_snippets} />
                  </TabContent>
                </TabPanel>
                <TabPanel>
                  <TabContent title={strings.region3WTitle}>
                    <RegionalThreeW
                      disabled={this.loading}
                      regionId={thisRegion.id}
                    />
                  </TabContent>
                </TabPanel>
                <TabPanel>
                  {
                    this.state.regionAdditionalInfoTabIframe 
                    ? 
                    (<TabContent>
                      <div className='container-lg'>
                        <button onClick={this.onIframeBackClick.bind(this)} className='regional-profile-back'><span className='collecticon-chevron-left font-size-xxs spacing-half-r'></span>{strings.regionIframeBackLink}</button>
                      </div>
                      <iframe src={this.state.regionAdditionalInfoTabIframe} frameBorder='0' width='100%' height='800px'></iframe>
                    </TabContent>)
                    :
                  (<React.Fragment>
                    <TabContent>
                      <div className='container-mid margin-2-v spacing-2-h'>
                        <div className='row-lg flex flex-justify-center'>
                          <div className='col-lg col-12 col-6-xs margin-v'>
                            <div className='regional-profile-key'>
                              <div className='row flex regional-profile-key-block'>
                                <div className='col'>
                                  <div className='sumstats__value'>{data.national_society_count}</div>
                                </div>
                                <div className='col'>
                                  <div className='regional-profile-subtitle'>{resolveToString(strings.regionalTabBox1, { regionName })}</div>
                                </div>
                              </div>
                              <div className='row flex regional-profile-icon-block'>
                                <div className='col'>
                                  <div className='regional-profile-source'>{strings.regionalTabBoxSource}</div>
                                </div>
                                <div className='col regional-profile-icon-col'>
                                  <img src='/assets/graphics/content/2020/IFRC-icons-colour_Cross-ns.svg' />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/*<div className='col-lg col-12 col-6-xs margin-v'>
                            <div className='sumstat__item regional-profile-key'>
                              <div className='row flex regional-profile-key-block'>
                                <div className='col'>
                                  <div className='sumstats__value'>{data.country_cluster_count}</div>
                                </div>
                                <div className='col'>
                                  <div className='regional-profile-subtitle'>{strings.regionalTabBox2}</div>
                                </div>
                              </div>
                              <div className='row flex regional-profile-icon-block'>
                                <div className='col'>
                                  <div className='regional-profile-source'>{strings.regionalTabBoxSource}</div>
                                </div>
                                <div className='col regional-profile-icon-col'>
                                  <img src='/assets/graphics/content/2020/IFRC-icons-colour_Cross-ns.svg' />
                                </div>
                              </div>
                            </div>
                          </div>*/}
                        </div>
                      </div>
                    </TabContent>
                    <TitledSnippets snippets={data.profile_snippets} />
                    <TabContent isError={!get(data, 'links.length')} title={strings.regionLinks} showError={false}>
                        <Links data={this.addClickHandler(data, this.onAdditionalLinkClickAction)} />    
                    </TabContent>
                    <TabContent showError={false} isError={!get(data, 'contacts.length')} title={strings.regionContacts}>
                      <Contacts data={data} />
                    </TabContent>
                  </React.Fragment>)
                }
                </TabPanel>
                { data.preparedness_snippets.length > 0 ?
                (<TabPanel>
                  <TabContent>
                    <TitledSnippets snippets={data.preparedness_snippets} />
                  </TabContent>
                </TabPanel>) : null }

                <TabPanel>
                  {/*
                  <TabContent isError={!get(this.props.keyFigures, 'data.results.length')} errorMessage={ strings.noDataMessage } title={strings.regionKeyFigures}>
                    <KeyFigures data={this.props.keyFigures} />
                  </TabContent>
                  */}
                  <TabContent isError={!get(this.props.snippets, 'data.results.length')} errorMessage={ strings.noDataMessage } title={strings.regionGraphics}>
                    <Snippets data={this.props.snippets} title={strings.regionSnippets} />
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
    countries: T.array
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  adminArea: get(state.adminArea.aaData, regionByIdOrNameSelector(state, ownProps.match.params.id).id, {
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
  countries: countriesSelector(state),
  appealsListStats: state.overallStats.appealsListStats,
  countriesByRegion: countriesByRegionSelector(state),
  regions: regionsByIdSelector(state),
  thisRegion: regionByIdOrNameSelector(state, ownProps.match.params.id),
  countriesGeojson: countriesGeojsonSelector(state)
});

const dispatcher = (dispatch) => ({
  _getAdmAreaById: (...args) => dispatch(getAdmAreaById(...args)),
  _getAdmAreaAppealsList: (...args) => dispatch(getAdmAreaAppealsList(...args)),
  _getAdmAreaAggregateAppeals: (...args) => dispatch(getAdmAreaAggregateAppeals(...args)),
  _getRegionPersonnel: (...args) => dispatch(getRegionPersonnel(...args)),
  _getAdmAreaKeyFigures: (...args) => dispatch(getAdmAreaKeyFigures(...args)),
  _getAdmAreaSnippets: (...args) => dispatch(getAdmAreaSnippets(...args)),
  // _getCountries: (...args) => dispatch(getCountries(...args)),
  _getAppealsListStats: (...args) => dispatch(getAppealsListStats(...args)),
});

AdminArea.contextType = LanguageContext;
export default connect(selector, dispatcher)(AdminArea);
