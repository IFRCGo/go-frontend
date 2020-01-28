'use strict';

import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../../config';

class ExplanationBubble extends React.Component {
  render () {
    return (
      <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
        <div>
          <label className='form__label'>Last submitted phase</label>
          <dl className='legend__dl legend__dl--colors'>
            <dt className='color color--orientation'>Green</dt>ß
            <dd>Orientation</dd>
            <dt className='color color--assessment'>Red</dt>
            <dd>Assessment</dd>
            <dt className='color color--prioritization'>Blue</dt>
            <dd>Prioritization & Analysis</dd>
            <dt className='color color--work'>Purple</dt>
            <dd>Work Plan</dd>
            <dt className='color color--action'>Orange</dt>
            <dd>Action & Accountability</dd>
            <dt className='color color--grey'>Grey</dt>
            <dd>Incomplete</dd>
          </dl>
        </div>
      </figcaption>
    );
  }
}

if (environment !== 'production') {
  ExplanationBubble.propTypes = {
    scaleBy: T.string,
    onFieldChange: T.func,
    deployments: T.object,
    deploymentsKey: T.string
  };
}

export default ExplanationBubble;
