import React, { useContext } from 'react';
// import c from 'classnames';
import { percent, shortenLargeNumber } from '#utils/format';
import BlockLoading from '#components/block-loading';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import Tooltip from '#components/common/tooltip';
import FullscreenHeader from '#components/common/fullscreen-header';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

// Provides titles to associate with incoming stats
// The explicit reference of these and the tooltip values could
// be avoided by adding this data as properties on the incoming appealsList
const keyFiguresList = ['activeDrefs', 'activeAppeals', 'budget', 'appealsFunding', 'targetPop'];

// const keyIcon = {
//   activeDrefs: 'collecticon-rc',
//   activeAppeals: 'collecticon-rc-appeals',
//   budget: 'collecticon-cash-notes',
//   appealsFunding: 'collecticon-cash-bag',
//   targetPop: 'collecticon-people-arrows'
// };

const keyIconSrc = {
  activeDrefs: '/assets/graphics/layout/logo-dref.svg',
  activeAppeals: '/assets/graphics/layout/logo-appeals.svg',
  budget: '/assets/graphics/layout/funding-requirements.svg',
  appealsFunding: '/assets/graphics/layout/funding-coverage.svg',
  targetPop: '/assets/graphics/layout/targeted-population.svg'
};

export default function KeyFiguresHeader (props) {
  const {
    data: {
      stats
    } = {},
    fetched,
    fetching,
    error
  } = props.appealsListStats;

  const {strings } = useContext(LanguageContext);

  const keyTitle = {
    activeDrefs: strings.keyFiguresActiveDrefs,
    activeAppeals: strings.keyFiguresActiveAppeals,
    budget: strings.keyFiguresBudget,
    appealsFunding: strings.keyFiguresAppealsFunding,
    targetPop: strings.keyFiguresTargetPop
  };
  // Lists two tooltip descriptions currently in use.
  const tooltipOptions = {
    activeDrefs: {
      title: strings.keyFiguresDrefTitle,
      description: strings.keyFiguresDrefDescription,
    },
    activeAppeals: {
      title: strings.keyFigureActiveAppealTitle,
      description: strings.keyFigureActiveAppealDescription,
    }
  };




  if (fetching) {
    return <BlockLoading/>;
  }

  if (error) {
    return <p>{strings.keyFiguresError}</p>;
  }

  if (!fetched || error) { return null; }

  /**
   * @return {Array} of key figures with edited numbers to fit format.
   */
  const filteredKeyFigures = () => {
    return Object.keys(stats).map(stat => {
      let value = stats[stat];
      // Applies common util to long numbers
      const statsToShorten = ['budget', 'targetPop', 'amountFunded', 'amountRequested', ''];
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
        icon: keyIconSrc[stat],
        // icon: keyIcon[stat],
        tooltip: tooltipOptions[stat] || null
      };
    }).filter(figure => keyFiguresList.includes(figure.id));
  };

  return (
    <div className='inner row'>
      {props.fullscreen ? (
        <FullscreenHeader title={strings.keyFiguresHeading}/>
      ) : null}
      <div className='stats-overall'>
        <h1 className='visually-hidden'>
          <Translate stringId='keyFiguresStatsOverall'/>
        </h1>
        <ul className='sumstats'>
          {filteredKeyFigures().map(keyFigure => (
            <li key={keyFigure.id} className='sumstats__item'>
              {/* <span className={c(`${keyFigure.icon}`, 'sumstats__icon')}></span> */}
              <span className='sumstats__icon_wrapper'>
                <img className='sumstats__icon_2020' src={keyFigure.icon} />
              </span>
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
    appealsListStats: T.object,
    data: T.object,
    fullscreen: T.bool
  };
}
