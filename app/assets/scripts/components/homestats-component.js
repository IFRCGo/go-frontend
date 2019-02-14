'use strict';

import React from 'react';
import { percent, shortenLargeNumber } from '../utils/format';
import BlockLoading from './block-loading';
import { Link } from 'react-router-dom';

export default function HomestatsComponent (props) {

  let renderLoading = (props) => {
    if (props.appealsList.fetching) {
      return <BlockLoading/>;
    }
  };

  let renderError = (props) => {
    if (props.appealsList.error) {
      return <p>Data not available.</p>;
    }
  };

  let renderTooltipBox = (props) => {
    return (
      <div className='mapboxgl-popup mapboxgl-popup-anchor-bottom' 
        id='budget-tooltip-box' 
        style={{
          position: 'absolute', 
          left: props.data.positionLeft + 'px', 
          top: props.data.positionTop + 'px', 
          visibility: props.data.showBudgetTooltip ? null : 'hidden'}}>

        <div className='mapboxgl-popup-tip'></div>
        <div className='mapboxgl-popup-content'>
          <article className='popover'>
            <div className='popover__contents'>
              <header className='popover__header'>
                <div className='popover__headline'><a className='link--primary'>Appeal types</a></div>
                <div className='popover__actions actions'>
                  <ul className='actions__menu'>
                    <li>
                      <button type='button' 
                        className='actions__menu-item poa-xmark' 
                        title='Close popover' 
                        onClick={props.closeTooltip}>
                        
                        <span>Dismiss</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </header>
              <div className='popover__body'>
                <ul className='popover__details'>
                  <br />
                  <li><span>DREF: </span>The Disaster Relief Emergency Fund ensures rapid and effective response to emergencies and crises. <a className='link--primary' href='https://media.ifrc.org/ifrc/dref' target='_blank'>More info &gt;&gt;</a></li>
                  <br />
                  <li><span>Appeal: </span>Next phase. The request is usually coming from outside of IFRC.</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  };

  let renderContent = (props) => {
    const {
      data: { stats },
      fetched,
      error
    } = props.appealsList;

    if (!fetched || error) { return null; }

    return (
      <ul className='sumstats'>
        <li className='sumstats__item'>
          <span className='sumstats__value'>{stats.activeDrefs}</span>
          <span className='sumstats__key'>
            Active DREF Operations<br />
            (In the last 30 days) 
            <div className='tooltip-button' id='tooltip-button-dref' onClick={props.openTooltip}></div>
          </span>
        </li>
        <li className='sumstats__item'>
          <span className='sumstats__value'>{stats.activeAppeals}</span>
          <span className='sumstats__key'>Active Emergency <br /> Appeals <div className='tooltip-button' id='tooltip-button-appeal' onClick={props.openTooltip}></div></span>
        </li>
        <li className='sumstats__item'>
          <span className='sumstats__value'>{shortenLargeNumber(stats.budget, 1)}</span>
          <span className='sumstats__key'>
            Budget for DREFs and Appeals (CHF) 
            <div className='tooltip-button' id='tooltip-button-budget' onClick={props.openTooltip}></div>

            { renderTooltipBox(props) }
          </span>
        </li>
        <li className='sumstats__item'>
          <span className='sumstats__value'>{percent(stats.appealsFunding, stats.appealsBudget, 1)}%</span>
          <span className='sumstats__key'>Emergency Appeals Funded</span>
        </li>
        <li className='sumstats__item'>
          <span className='sumstats__value'>{shortenLargeNumber(stats.targetPop, 1)}</span>
          <span className='sumstats__key'>Affected population</span>
        </li>
      </ul>
    );
  };

  return (
    <div className='stats-overall'>
        <h1 className='visually-hidden'>Overall stats</h1>
        {renderLoading(props)}
        {renderError(props)}
        {renderContent(props)}
      </div>
  );
}