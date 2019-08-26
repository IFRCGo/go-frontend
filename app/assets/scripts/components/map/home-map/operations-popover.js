'use strict';

import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';
import { commaSeparatedNumber as n } from '../../../utils/format';
import { DateTime } from 'luxon';
import { get } from '../../../utils/utils';
import React from 'react';

class OperationsPopover extends React.Component {
  render () {
    const { pageId, navigate, title, onCloseClick, operations, deployments } = this.props;
    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <div className='popover__headline'>
              {deployments ? title : <a className='link--primary' onClick={e => { e.preventDefault(); navigate(`/countries/${pageId}`); }}>{title} <span className='popover__headline__icon collecticon-chevron-right'></span></a>}
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li>
                  <button type='button' className='actions__menu-item poa-xmark' title='Close popover' onClick={onCloseClick}><span>Dismiss</span></button>
                </li>
              </ul>
            </div>
          </header>
          <div className='popover__body'>
            {Array.isArray(operations) ? operations.map(d => (
              <React.Fragment key={d.id}>
                <h3 className='popover__subtitle'>
                  {d.event ? (
                    <a className='' onClick={e => { e.preventDefault(); navigate(`/emergencies/${d.event}`); }}>{d.name}</a>
                  ) : d.name}
                </h3>
                <ul className='popover__details'>
                  <li>{n(d.num_beneficiaries)} People Affected</li>
                  <li>{n(d.amount_requested)} Amount Requested (CHF)</li>
                  <li>{n(d.amount_funded)} Amount Funded (CHF)</li>
                </ul>
              </React.Fragment>
            )) : null}
            {Array.isArray(deployments) ? deployments.map((d, i) => (
              <React.Fragment key={i}>
                <h3 className='popover__subtitle'>{get(d.parent, 'society_name', d.parent.name)}</h3>
                <ul className='popover__details'>
                  <li>Activity: {d.activity.activity}</li>
                  <li>Start: {DateTime.fromISO(d.start).toISODate()}</li>
                  <li>End: {DateTime.fromISO(d.end).toISODate()}</li>
                </ul>
              </React.Fragment>
            )) : null}
          </div>
        </div>
      </article>
    );
  }
}

if (environment !== 'production') {
  OperationsPopover.propTypes = {
    onCloseClick: T.func,
    title: T.string,
    pageId: T.number,
    operations: T.array,
    deployments: T.array,
    navigate: T.func
  };
}

export default OperationsPopover;
