
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { commaSeparatedNumber as n } from '#utils/format';
import { DateTime } from 'luxon';
import { get } from '#utils/utils';
import React from 'react';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class OperationsPopover extends React.Component {
  render () {
    const { pageId, navigate, title, onCloseClick, operations, deployments } = this.props;
    const { strings } = this.context;
    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <div className='popover__headline'>
              {deployments ? title : <a className='link--primary link--with-icon' onClick={e => { e.preventDefault(); navigate(`/countries/${pageId}`); }}><span className='link--with-icon-text'>{title}</span> <span className='popover__headline__icon collecticon-chevron-right'></span></a>}
            </div>
            <div className='popover__actions actions'>
              <ul className='actions__menu'>
                <li>
                  <button type='button' className='actions__menu-item poa-xmark' title={strings.operationPopoverClose} onClick={onCloseClick}>
                    <span>
                      <Translate stringId='operationPopoverDismiss'/>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </header>
          <div className='popover__body scrollbar__custom'>
            {Array.isArray(operations) && operations.length > 0 ? operations.map(d => (
              <React.Fragment key={d.id}>
                <h3 className='popover__subtitle'>
                  {d.event ? (
                    <a className='' onClick={e => { e.preventDefault(); navigate(`/emergencies/${d.event}`); }}>{d.name}</a>
                  ) : d.name}
                </h3>
                <ul className='popover__details popover__details--list'>
                  <li>
                    <span>{n(d.num_beneficiaries)} </span> 
                    <Translate stringId='operationPopoverPeopleAffected'/>
                  </li>
                  <li>
                    <span>{n(d.amount_requested)} </span>
                    <Translate stringId='operationPopoverAmountRequested'/>
                  </li>
                  <li>
                    <span>{n(d.amount_funded)} </span>
                    <Translate stringId='operationPopoverAmountFunded'/>
                  </li>
                </ul>
              </React.Fragment>
            )) : (
              <React.Fragment>
                No Current Operations
              </React.Fragment>
            )}
            {Array.isArray(deployments) ? deployments.map((d, i) => (
              <React.Fragment key={i}>
                <h3 className='popover__subtitle'>{get(d.parent, 'society_name', d.parent.name)}</h3>
                <ul className='popover__details'>
                  <li>
                    <Translate
                      stringId='operationPopoverActivity'
                      params={{
                        activity: d.activity.activity,
                      }}
                    />
                  </li>
                  <li>
                    <Translate
                      stringId='operationPopoverStart'
                      params={{
                        start: DateTime.fromISO(d.start).toISODate(),
                      }}
                    />
                  </li>
                  <li>
                    <Translate
                      stringId='operationPopoverEnd'
                      params={{
                        end: DateTime.fromISO(d.end).toISODate(),
                      }}
                    />
                  </li>
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
OperationsPopover.contextType = LanguageContext;
export default OperationsPopover;
