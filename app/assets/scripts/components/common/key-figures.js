import React from 'react';
import { percent, shortenLargeNumber } from '../../utils/format';
import BlockLoading from '../block-loading';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';
import Tooltip from './tooltip';

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

export default function KeyFigures (props) {
  const {
    data: { stats },
    fetched,
    fetching,
    error
  } = props.appealsList;

  console.log('data', props.appealsList);

  if (fetching) {
    return <BlockLoading/>;
  }

  if (error) {
    return <p>Data not available.</p>;
  }

  if (!fetched || error) { return null; }

  const statsToShorten = ['budget', 'targetPop', 'amountFunded', 'amountRequested', 'numBeneficiaries'];
  // const regionKeyFigures = ['numBeneficiaries', 'amountRequested', 'amountFunded'];

  const filteredKeyFigures = () => {
    return Object.keys(stats).map(stat => {
      let value = stats[stat];
      if (statsToShorten.includes(stat)) {
        value = shortenLargeNumber(value, 1);
      }
      if (stat === 'appealsFunding' && stats.appealsBudget) {
        value = `${percent(stats.appealsFunding, stats.appealsBudget, 1)}%`;
      }
      return {
        id: stat,
        title: keyTitle[stat],
        value,
        tooltip: tooltipOptions[stat] || null
      };
    }).filter(figure => props.keyFiguresList.includes(figure.id));
  };

  return (
    <div className='inner'>
      {props.fullscreen ? (<div className='flex'><div style={{width: '375px', height: '56px', position: 'absolute'}}><img src="/assets/graphics/layout/logo.png" alt="IFRC GO logo" style={{width: '375px', height: '56px'}} /></div><h1 className='inpage__title inpage__title--map-fullscreen'>IFRC Disaster Response and Preparedness</h1></div>) : null}
      <div className='stats-overall'>
        <h1 className='visually-hidden'>Overall stats</h1>
        <ul className='sumstats'>
          {filteredKeyFigures().map(keyFigure => (
            <li key={keyFigure.id} className='sumstats__item'>
              <span className='collecticon-rc sumstats__icon'></span>
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
  KeyFigures.propTypes = {
    appealsList: T.object,
    keyFiguresList: T.array,
    data: T.object,
    fullscreen: T.bool
  };
}
