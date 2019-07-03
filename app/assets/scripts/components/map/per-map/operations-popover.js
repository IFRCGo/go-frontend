'use strict';

import { environment } from '../../../config';
import { PropTypes as T } from 'prop-types';
// import { commaSeparatedNumber as n } from '../../../utils/format';
// import { DateTime } from 'luxon';
// import { get } from '../../../utils/utils';
import React from 'react';

class OperationsPopover extends React.Component {
  render () {
    const { pageId, navigate, title, onCloseClick, deployments } = this.props;
    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <div className='popover__headline'>
              {deployments ? title : <a className='link--primary' onClick={e => { e.preventDefault(); navigate(`/countries/${pageId}`); }}>{title}</a>}
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
            <div style={{width: '50%', float: 'left'}}>
              current per process phase
            </div>
            <div style={{width: '50%', float: 'left'}}>
              current per process type
            </div>
            <div style={{width: '50%', float: 'left'}}>
              *** PHASE ****
            </div>
            <div style={{width: '50%', float: 'left'}}>
              *** TYPE ***
            </div>
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
