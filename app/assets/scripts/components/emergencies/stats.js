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
    } = this.props.lastMonth;

    if (!fetched) return null;

    return (
      <div className='header-stats'>
        <ul className='stats-list'>
          <li className='stats-list__item stats-emergencies'>
            {n(data.count)}<small>Emergencies in the last 30 Days</small>
          </li>
          <li className='stats-list__item stats-people'>
            {n(data.numAffected)}<small>Affected People in the last 30 days</small>
          </li>
          <li className='stats-list__item stats-funding stat-borderless stat-double'>
            {n(data.totalAppeals)}<small>Appeal Amount (CHF)</small>
          </li>
          <li className='stats-list__item stat-double'>
            {n(data.totalAppealsFunding)}<small>Funding (CHF)</small>
          </li>
        </ul>
      </div>
    );
  }
}

if (environment !== 'production') {
  Homestats.propTypes = {
    lastMonth: T.object
  };
}
