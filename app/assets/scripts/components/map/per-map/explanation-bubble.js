'use strict';

import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../../config';

class ExplanationBubble extends React.Component {
  render () {
    return (
      <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
        <div>
          <label className='form__label'>Last submitted form</label>
          <dl className='legend__dl legend__dl--colors'>
            <dt className='color color--a1-form'>Light blue</dt>
            <dd>Area 1: Policy and Standards</dd>
            <dt className='color color--a2-form'>Yellow</dt>
            <dd>Area 2: Analysis and Planning</dd>
            <dt className='color color--a3-form'>Grey</dt>
            <dd>Area 3: Operation capacity</dd>
            <dt className='color color--a32-form'>Grey</dt>
            <dd>Area 3: Operational capacity 2</dd>
            <dt className='color color--a4-form'>Grey</dt>
            <dd>Area 4: Coordination</dd>
            <dt className='color color--a5-form'>Grey</dt>
            <dd>Area 5: Operations support</dd>
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
