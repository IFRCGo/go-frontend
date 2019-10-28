import React from 'react';
import c from 'classnames';
import { percent, shortenLargeNumber } from '../../utils/format';
import BlockLoading from '../block-loading';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import Tooltip from './tooltip';
import FullscreenHeader from './fullscreen-header';

// Provides titles to associate with incoming stats
// The explicit reference of these and the tooltip values could
// be avoided by adding this data as properties on the incoming appealsList
const keyTitle = {
  activeDrefs: 'Active DREF Operations',
  activeAppeals: 'Active Emergency Appeals',
  budget: 'Funding requirements (CHF)',
  appealsFunding: 'Funding coverage',
  targetPop: 'Targeted population',
  numBeneficiaries: 'Affected People (last 30 days)',
  amountRequested: 'Requested Amount (CHF)',
  amountFunded: 'Funding (CHF)'
};

const keyIcon = {
  activeDrefs: 'collecticon-rc',
  activeAppeals: 'collecticon-rc-appeals',
  budget: 'collecticon-cash-notes',
  appealsFunding: 'collecticon-cash-bag',
  targetPop: 'collecticon-people-arrows',
  numBeneficiaries: 'collecticon-people-arrows',
  amountRequested: 'collecticon-cash-notes',
  amountFunded: 'collecticon-cash-bag'
};
// Lists two tooltip descriptions currently in use.
const tooltipOptions = {
  activeDrefs: {
    title: 'DREF',
    description: 'These are small to medium scale emergency operations funded through the Disaster Relief Emergency Fund (DREF).The DREF provides immediate financial support to National Red Cross and Red Crescent Societies, enabling them to carry out their unique role as first responders after a disaster.'
  },
  activeAppeals: {
    title: 'Emergency Appeal',
    description: 'These are medium to large scale emergency operations funded through a public appeal for funds.'
  }
};

export default function KeyFiguresHeader (props) {
  const {
    data: { stats },
    fetched,
    fetching,
    error
  } = props.appealsList;

  if (fetching) {
    return <BlockLoading/>;
  }

  if (error) {
    return <p>Data not available.</p>;
  }

  if (!fetched || error) { return null; }

  /**
   * @return {Array} of key figures with edited numbers to fit format.
   */
  const filteredKeyFigures = () => {
    return Object.keys(stats).map(stat => {
      let value = stats[stat];
      // Applies common util to long numbers
      const statsToShorten = ['budget', 'targetPop', 'amountFunded', 'amountRequested', 'numBeneficiaries'];
      if (statsToShorten.includes(stat)) {
        value = shortenLargeNumber(value, 1);
      }
      // Applies common util to create percent
      if (stat === 'appealsFunding' && stats.appealsBudget) {
        value = `${percent(stats.appealsFunding, stats.appealsBudget, 1)}%`;
      }
      return {
        id: stat,
        title: keyTitle[stat],
        value,
        icon: keyIcon[stat],
        tooltip: tooltipOptions[stat] || null
      };
    }).filter(figure => props.keyFiguresList.includes(figure.id));
  };

  return (
    <div className='inner'>
      {props.fullscreen ? (
        <FullscreenHeader title='IFRC Disaster Response and Preparedness'/>
      ) : null}
      <div className='stats-overall'>
        <h1 className='visually-hidden'>Overall stats</h1>
        <ul className='sumstats'>
          {filteredKeyFigures().map(keyFigure => (
            <li key={keyFigure.id} className='sumstats__item'>
              <span className={c(`${keyFigure.icon}`, 'sumstats__icon')}></span>
              <span className='sumstats__value'>{keyFigure.value}</span>
              <span className='sumstats__key'>
                {keyFigure.title}
                {keyFigure.tooltip ? <Tooltip title={keyFigure.tooltip.title} description={keyFigure.tooltip.description}/> : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

if (environment !== 'production') {
  KeyFiguresHeader.propTypes = {
    appealsList: T.object,
    keyFiguresList: T.array,
    data: T.object,
    fullscreen: T.bool
  };
}
