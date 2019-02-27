'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { DateTime } from 'luxon';
import c from 'classnames';

import { environment } from '../../config';
import { getAppealsList, getAggregateAppeals } from '../../actions';
import {
  enterFullscreen,
  exitFullscreen,
  isFullscreen,
  addFullscreenListener,
  removeFullscreenListener
} from '../../utils/fullscreen';

import Homestats from '../homestats-container';
import HomeMap from '../map/home-map';
import HomeCharts from '../homecharts';

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
    const lastYear = DateTime.local().minus({months: 11}).startOf('day').toISODate();
    const lastDecade = DateTime.local().minus({years: 10}).startOf('day').toISODate();

    this.props._getAggregateAppeals(lastYear, 'month', 'drefs');
    this.props._getAggregateAppeals(lastYear, 'month', 'appeals');
    this.props._getAggregateAppeals(lastDecade, 'year', 'drefs');
    this.props._getAggregateAppeals(lastDecade, 'year', 'appeals');
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
    const {
      appealsList,
      aggregate
    } = this.props;

    return (
      <section className={c('fold--stats', {presenting: this.state.fullscreen})} id='presentation'>
        <Homestats appealsList={appealsList} fullscreen={this.state.fullscreen} toggleFullscreen={this.toggleFullscreen} />
        <HomeMap operations={appealsList} noExport={true} noRenderEmergencies={true} />
        <HomeCharts aggregate={aggregate} />
      </section>
    );
  }
}

if (environment !== 'production') {
  PresentationDash.propTypes = {
    _getAppealsList: T.func,
    _getAggregateAppeals: T.func,
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
  _getAggregateAppeals: (...args) => dispatch(getAggregateAppeals(...args))
});

export default connect(selector, dispatcher)(PresentationDash);
