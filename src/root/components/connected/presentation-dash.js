import React from 'react';
import { connect } from 'react-redux';
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

import KeyFiguresHeader from '#components/common/key-figures-header';
import HighlightedOperations from '#components/highlighted-operations';

import TimelineCharts from '#components/timeline-charts';
import AppealsTable from '#components/connected/appeals-table';
import LanguageContext from '#root/languageContext';

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

    this.props._getAppealsList();
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
    return (
      <section className={c('fold--stats', {presenting: this.state.fullscreen})} id='presentation'>
        <KeyFiguresHeader
          appealsListStats={appealsList}
          fullscreen={this.state.fullscreen}
          toggleFullscreen={this.toggleFullscreen}
        />
        { !this.state.fullscreen ? (<HighlightedOperations opsType='all'/>) : null }
        <div className={c('inner', {'appeals--fullscreen': this.state.fullscreen})}>
          <AppealsTable
            showActive={true}
            showHomeMap={true}
            title={strings.presentationDashAppealsTitle}
            limit={5}
            viewAll={'/appeals/all'}
            fullscreen={this.state.fullscreen}
            toggleFullscreen={this.toggleFullscreen}
          />
        </div>
        {this.state.fullscreen ? null : <TimelineCharts /> }
      </section>
    );
  }
}

if (environment !== 'production') {
  PresentationDash.propTypes = {
    _getAppealsList: T.func,
    appealsList: T.object,
    aggregate: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  appealsList: state.overallStats.appealsList,
  aggregate: state.overallStats.aggregate
});

const dispatcher = (dispatch) => ({
  _getAppealsList: (...args) => dispatch(getAppealsList(...args)),
});

PresentationDash.contextType = LanguageContext;
export default connect(selector, dispatcher)(PresentationDash);
