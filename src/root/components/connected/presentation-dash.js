import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

import { environment } from '#config';
import { getAppealsList } from '#actions';
import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
  addFullscreenListener,
  removeFullscreenListener
} from '#utils/fullscreen';
import { get } from '#utils/utils';

import Fold from '#components/fold';
import { commaSeparatedNumber as n } from '#utils/format';
import KeyFiguresHeader from '#components/common/key-figures-header';
import HighlightedOperations from '#components/highlighted-operations';

import TimelineCharts from '#components/timeline-charts';
import AppealsTable from '#components/connected/appeals-table';
import MainMap from '#components/map/main-map';
import LanguageContext from '#root/languageContext';
import { countriesGeojsonSelector, countriesSelector } from '#selectors';
class PresentationDash extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      fullscreen: false
    };

    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
  }

  componentDidMount () {
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

  render () {
    const { strings } = this.context;
    const { appealsList } = this.props;

    const foldLink = (
      <Link className='fold__title__link' to={'/appeals/all'}>{this.props.viewAllText || strings.viewAllOperations}</Link>
    );

    return (
      <section className={c('fold--stats', {presenting: this.state.fullscreen})} id='presentation'>
        <KeyFiguresHeader
          appealsListStats={appealsList}
          fullscreen={this.state.fullscreen}
          toggleFullscreen={this.toggleFullscreen}
        />
        { !this.state.fullscreen ? (<HighlightedOperations opsType='all'/>) : null }
        <div className={c('inner', {'appeals--fullscreen': this.state.fullscreen})}>
          <Fold
            showHeader={!this.state.fullscreen}
            title={`${strings.presentationDashAppealsTitle} (${n(this.props.appeals.data.count)})`}
            id={this.props.id}
            navLink={foldLink}
            foldTitleClass='fold__title--inline'
            foldWrapperClass='fold--main fold--appeals-table'
          >
            { appealsList.fetched ?
              (
                <MainMap
                  operations={appealsList}
                  noExport={true}
                  noRenderEmergencies={true}
                  fullscreen={this.state.fullscreen}
                  toggleFullscreen={this.toggleFullscreen}
                  countriesGeojson={this.props.countriesGeojson}
                  countries={this.props.countries}
                />
              )
              : null
            }

            <AppealsTable
              showActive={true}
              showHomeMap={true}
              foldLink={foldLink}
              limit={5}
              viewAll={'/appeals/all'}
              fullscreen={this.state.fullscreen}
              toggleFullscreen={this.toggleFullscreen}
            />
          </Fold>
        </div>
        <div className='container-lg'>
          {this.state.fullscreen ? null : <TimelineCharts /> }
        </div>
      </section>
    );
  }
}

if (environment !== 'production') {
  PresentationDash.propTypes = {
    _getAppealsList: T.func,
    appealsList: T.object,
    aggregate: T.object,
    appeals: T.object,
    countriesGeojson: T.object,
    countries: T.array
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, props) => ({
  appeals: props.statePath ? get(state, props.statePath) : state.appeals,
  appealsList: state.overallStats.appealsList,
  aggregate: state.overallStats.aggregate,
  countriesGeojson: countriesGeojsonSelector(state),
  countries: countriesSelector(state)
});

const dispatcher = (dispatch) => ({
  _getAppealsList: (...args) => dispatch(getAppealsList(...args)),
});

PresentationDash.contextType = LanguageContext;
export default connect(selector, dispatcher)(PresentationDash);
