import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '#config';
import { commaSeparatedNumber as n } from '#utils/format';
import Translate from '#components/Translate';

export default class EmergenciesStats extends React.Component {
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
            {n(data.count)}
            <small>
              <Translate stringId='emergenciesStatsTitle'/>
            </small>
          </li>
          <li className='stats-list__item stats-people'>
            {n(data.numAffected)}
            <small>
              <Translate stringId='emergenciesStatsAffected'/>
            </small>
          </li>
          <li className='stats-list__item stats-funding stat-borderless stat-double'>
            {n(data.totalAppeals)}
            <small>
              <Translate stringId='emergenciesStatsRequested'/>
            </small>
          </li>
          <li className='stats-list__item stat-double'>
            {n(data.totalAppealsFunding)}
            <small>
              <Translate stringId='emergenciesStatsFunding'/>
            </small>
          </li>
        </ul>
      </div>
    );
  }
}

if (environment !== 'production') {
  EmergenciesStats.propTypes = {
    lastMonth: T.object
  };
}
