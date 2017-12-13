'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';
import { percent, shortenLargeNumber } from '../utils/format';
import BlockLoading from './block-loading';

export default class Homestats extends React.Component {
  renderLoading () {
    if (this.props.appealsList.fetching) {
      return <BlockLoading/>;
    }
  }

  renderError () {
    if (this.props.appealsList.error) {
      return <p>Oh no! An error ocurred getting the data.</p>;
    }
  }

  renderContent () {
    const {
      data: { stats },
      fetched
    } = this.props.appealsList;

    if (!fetched) { return null; }

    return (
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
    );
  }

  render () {
    return (
      <div className='stats-overall'>
        <h1 className='visually-hidden'>Overall stats</h1>
        {this.renderLoading()}
        {this.renderError()}
        {this.renderContent()}
      </div>
    );
  }
}

if (environment !== 'production') {
  Homestats.propTypes = {
    appealsList: T.object
  };
}
