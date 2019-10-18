'use strict';

import React from 'react';
import { percent, shortenLargeNumber } from '../utils/format';
import BlockLoading from './block-loading';
import { environment } from '../config';
import { PropTypes as T } from 'prop-types';

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
    console.log('props', props)
    const {title, description} = props.chooseContent(props);
    const popupType = props.fullscreen
      ? 'mapboxgl-popup mapboxgl-popup-anchor-top'
      : 'mapboxgl-popup mapboxgl-popup-anchor-bottom';

    return (
      <div className={popupType}
        id='budget-tooltip-box'
        style={{
          position: 'absolute',
          left: props.data.positionLeft + 'px',
          top: props.data.positionTop + 'px',
          visibility: props.data.showBudgetTooltip ? null : 'hidden'}}>

        <div className='mapboxgl-popup-tip'></div>
        <div className='mapboxgl-popup-content'>
          <article className='popover'>
            <div className='popover__contents__noscroll'>
              <header className='popover__header'>
                <div className='popover__headline__bold'>{title}</div>
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
                  <li dangerouslySetInnerHTML={{__html: description}} />
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
          <span className='collecticon-rc sumstats__icon'></span>
          <span className='sumstats__value'>{stats.activeDrefs}</span>
          <span className='sumstats__key'>
            Active DREF Operations
            <div className='tooltip-button' id='tooltip-button-dref' onClick={props.openTooltip}></div>
          </span>
        </li>
        <li className='sumstats__item'>
          <span className='collecticon-rc-appeals sumstats__icon'></span>
          <span className='sumstats__value'>{stats.activeAppeals}</span>
          <span className='sumstats__key'>Active Emergency Appeals <div className='tooltip-button' id='tooltip-button-appeal' onClick={props.openTooltip}></div></span>
        </li>
        <li className='sumstats__item'>
          <span className='collecticon-cash-notes sumstats__icon'></span>
          <span className='sumstats__value'>{shortenLargeNumber(stats.budget, 1)}</span>
          <span className='sumstats__key'>
            Funding requirements (CHF)
            { renderTooltipBox(props) }
          </span>
        </li>
        <li className='sumstats__item'>
          <span className='collecticon-cash-bag sumstats__icon'></span>
          <span className='sumstats__value'>{percent(stats.appealsFunding, stats.appealsBudget, 1)}%</span>
          <span className='sumstats__key'>Funding coverage</span>
        </li>
        <li className='sumstats__item'>
          <span className='collecticon-people-arrows sumstats__icon'></span>
          <span className='sumstats__value'>{shortenLargeNumber(stats.targetPop, 1)}</span>
          <span className='sumstats__key'>Targeted population</span>
        </li>
      </ul>
    );
  };

  return (
    <div className='inner'>
      {props.fullscreen ? (<div className='flex'><div style={{width: '375px', height: '56px', position: 'absolute'}}><img src="/assets/graphics/layout/logo.png" alt="IFRC GO logo" style={{width: '375px', height: '56px'}} /></div><h1 className='inpage__title inpage__title--map-fullscreen'>IFRC Disaster Response and Preparedness</h1></div>) : null}
      <div className='stats-overall'>
        <h1 className='visually-hidden'>Overall stats</h1>
        {renderLoading(props)}
        {renderError(props)}
        {renderContent(props)}
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
