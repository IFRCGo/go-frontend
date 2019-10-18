'use strict';

import React from 'react';
import { percent, shortenLargeNumber } from '../utils/format';
import BlockLoading from './block-loading';
import { environment } from '../config';
import { PropTypes as T } from 'prop-types';
import Tooltip from './common/tooltip';

export default function HomestatsComponent (props) {
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

  const keyFigures = [
    {
      id: 'activeDrefs',
      title: 'Active DREF Operations',
      value: stats.activeDrefs,
      tooltip: 'dref'
    },
    {
      id: 'activeAppeals',
      title: 'Active Emergency Appeals',
      value: stats.activeAppeals,
      tooltip: 'appeals'
    },
    {
      id: 'budget',
      title: 'Funding requirements (CHF)',
      value: shortenLargeNumber(stats.budget, 1)
    },
    {
      id: 'appealsFunding',
      title: 'Funding coverage',
      value: percent(stats.appealsFunding, stats.appealsBudget, 1)
    },
    {
      id: 'targetPop',
      title: 'Targeted population',
      value: shortenLargeNumber(stats.targetPop, 1)
    }
  ];

  return (
    <div className='inner'>
      {props.fullscreen ? (<div className='flex'><div style={{width: '375px', height: '56px', position: 'absolute'}}><img src="/assets/graphics/layout/logo.png" alt="IFRC GO logo" style={{width: '375px', height: '56px'}} /></div><h1 className='inpage__title inpage__title--map-fullscreen'>IFRC Disaster Response and Preparedness</h1></div>) : null}
      <div className='stats-overall'>
        <h1 className='visually-hidden'>Overall stats</h1>
        <ul className='sumstats'>
          {keyFigures.map(keyFigure => (
            <li key={keyFigure.id} className='sumstats__item'>
              <span className='collecticon-rc sumstats__icon'></span>
              <span className='sumstats__value'>{keyFigure.value}</span>
              <span className='sumstats__key'>
                {keyFigure.title}
                {keyFigure.tooltip ? <Tooltip /> : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

if (environment !== 'production') {
  HomestatsComponent.propTypes = {
    appealsList: T.object,
    data: T.object,
    closeTooltip: T.func,
    openTooltip: T.func,
    chooseContent: T.func,
    fullscreen: T.bool
  };
}
