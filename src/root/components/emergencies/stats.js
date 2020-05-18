import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '#config';
import { commaSeparatedNumber as n } from '#utils/format';

export default class EmergenciesStats extends React.Component {
  render () {
    const {
      data,
      fetched
    } = this.props.lastMonth;

    if (!fetched) return null;

    return (
      <div className='header-stats header-stats--emergencies'>
        <ul className='sumstats'>
          <li className='sumstats__item stats-emergencies'>
            <span className='sumstats__icon_wrapper'>
              <img className='sumstats__icon_2020' src='/assets/graphics/layout/emergency-brand.svg' />
            </span>
            <div className='sumstats__value'>{n(data.count)}</div>
            <div className='sumstats__key'>Emergencies</div>
          </li>
          <li className='sumstats__item stats-people'>
            <span className='sumstats__icon_wrapper'>
              <img className='sumstats__icon_2020' src='/assets/graphics/layout/heops-brand.svg' />
            </span>
            <div className='sumstats__value'>{n(data.numAffected)}</div>
            <div className='sumstats__key'>Affected People</div>
          </li>
          <li className='sumstats__item stats-funding stat-borderless stat-double'>
            <span className='sumstats__icon_wrapper'>
              <img className='sumstats__icon_2020' src='/assets/graphics/layout/funding-coverage.svg' />
            </span>
            <div className='sumstats__value'>{n(data.totalAppeals)}</div>
            <div className='sumstats__key'>Requested Amount (CHF)</div>
          </li>
          <li className='sumstats__item stat-double'>
            <span className='sumstats__icon_wrapper'>
              <img className='sumstats__icon_2020' src='/assets/graphics/layout/funding-requirements.svg' />
            </span>
            <div className='sumstats__value'>{n(data.totalAppealsFunding)}</div>
            <div className='sumstats__key'>Funding (CHF)</div>
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
