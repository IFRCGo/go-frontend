'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';
import { commaSeparatedNumber as n } from '../../utils/format';

export default class Homestats extends React.Component {
  render () {
    const {
      data,
      fetched
    } = this.props.list;

    if (!fetched) return null;

    return (
      <div className='header-stats'>
        <div className='stat-group stats-group--single'>
          <div className='stat-icon'>
            <img src="/assets/graphics/layout/emergency.svg" alt="Targeted Benficiaries"/>
          </div>
          <ul>
            <li>{n(data.count)}<small>Emergencies in the last 30 Days</small></li>
          </ul>
        </div>
        <div className='stat-group stats-group--single'>
          <div className='stat-icon'>
            <img src="/assets/graphics/layout/people.svg" alt="Targeted Benficiaries"/>
          </div>
          <ul>
            <li>{n(data.numAffected)}<small>Affected People in the last 30 days</small></li>
          </ul>
        </div>
        <hr/>
        <div className='stat-group'>
          <div className='stat-icon'>
            <img src="/assets/graphics/layout/funding.svg" alt="Funding"/>
          </div>
          <ul>
            <li>{n(data.totalAppeals)}<small>Appeal Amount (CHF)</small></li>
            <li>{n(data.totalAppealsFunding)}<small>Funding (CHF)</small></li>
          </ul>
        </div>
      </div>
    );
  }
}

if (environment !== 'production') {
  Homestats.propTypes = {
    list: T.object
  };
}
