'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';
import { getAppealsList } from '../../actions';
import { percent, shortenLargeNumber } from '../../utils/format';

import { showGlobalLoading, hideGlobalLoading } from '../global-loading';

class Sumstats extends React.Component {
  componentDidMount () {
    showGlobalLoading();
    this.props._getAppealsList();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.appealsList.fetching && !nextProps.appealsList.fetching) {
      hideGlobalLoading();
    }
  }

  render () {
    const {
      data: { stats },
      fetched,
      error
    } = this.props.appealsList;

    if (!fetched) return null;

    return (
      <div className='stats-overall'>
        <h1 className='visually-hidden'>Overall stats</h1>
        {error ? (
          <p>Oh no! An error ocurred getting the stats.</p>
        ) : (
          <ul className='sumstats'>
            <li className='sumstats__item'>
              <span className='sumstats__value'>{stats.activeDrefs}</span>
              <span className='sumstats__key'>Active DREF Operations</span>
            </li>
            <li className='sumstats__item'>
              <span className='sumstats__value'>{stats.activeAppeals}</span>
              <span className='sumstats__key'>Active Emergency Appeals</span>
            </li>
            <li className='sumstats__item'>
              <span className='sumstats__value'>{percent(stats.fundedAppeals, stats.totalAppeals, 1)}%</span>
              <span className='sumstats__key'>Emergency Appeals Funded</span>
            </li>
            <li className='sumstats__item'>
              <span className='sumstats__value'>{shortenLargeNumber(stats.budget, 1)}</span>
              <span className='sumstats__key'>Budget for DREFs and Appeals</span>
            </li>
            <li className='sumstats__item'>
              <span className='sumstats__value'>{shortenLargeNumber(stats.targetPop, 1)}</span>
              <span className='sumstats__key'>Targeted Population</span>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

if (environment !== 'production') {
  Sumstats.propTypes = {
    _getAppealsList: T.func,
    appealsList: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  appealsList: state.overallStats.appealsList
});

const dispatcher = (dispatch) => ({
  _getAppealsList: (...args) => dispatch(getAppealsList(...args))
});

export default connect(selector, dispatcher)(Sumstats);
