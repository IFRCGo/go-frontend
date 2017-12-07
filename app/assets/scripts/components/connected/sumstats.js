'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';
import { getSumstats } from '../../actions';

import { showGlobalLoading, hideGlobalLoading } from '../global-loading';

class Sumstats extends React.Component {
  componentDidMount () {
    showGlobalLoading();
    this.props._getSumstats();
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.sumstats.fetching && !nextProps.sumstats.fetching) {
      hideGlobalLoading();
    }
  }

  render () {
    const {
      data,
      fetched
    } = this.props.sumstats;

    if (!fetched) return null;

    return (
      <div className='stats-overall'>
        <h1 className='visually-hidden'>Overall stats</h1>
        <ul className='sumstats'>
          <li className='sumstats__item'>
            <span className='sumstats__value'>38</span>
            <span className='sumstats__key'>Active DREF Operations</span>
          </li>
          <li className='sumstats__item'>
            <span className='sumstats__value'>38</span>
            <span className='sumstats__key'>Active Emergency Appeals</span>
          </li>
          <li className='sumstats__item'>
            <span className='sumstats__value'>69%</span>
            <span className='sumstats__key'>Emergency Appeals Funded</span>
          </li>
          <li className='sumstats__item'>
            <span className='sumstats__value'>623.8M</span>
            <span className='sumstats__key'>Budget for DREFs and Appeals</span>
          </li>
          <li className='sumstats__item'>
            <span className='sumstats__value'>19.2M</span>
            <span className='sumstats__key'>Targeted Population</span>
          </li>
        </ul>
      </div>
    );
  }
}

if (environment !== 'production') {
  Sumstats.propTypes = {
    _getSumstats: T.func,
    sumstats: T.object
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state) => ({
  sumstats: state.overallStats.sumstats
});

const dispatcher = (dispatch) => ({
  _getSumstats: (...args) => dispatch(getSumstats(...args))
});

export default connect(selector, dispatcher)(Sumstats);
