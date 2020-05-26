
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';

import Translate from '#components/Translate';

class ExplanationBubble extends React.Component {
  render () {
    return (
      <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
        <div>
          <label className='form__label'>
            <Translate stringId='explanationBubbleCurrentPerPhase'/>
          </label>
          <dl className='legend__dl legend__dl--colors'>
            <dt className='color color--orientation'>Green</dt>
            <dd>
              <Translate stringId='explanationBubbleOrientation'/>
            </dd>
            <dt className='color color--assessment'>Red</dt>
            <dd>
              <Translate stringId='explanationBubbleAssessment'/>
            </dd>
            <dt className='color color--prioritization'>Blue</dt>
            <dd>
              <Translate stringId='explanationBubblePrioritization'/>
            </dd>
            <dt className='color color--work'>Purple</dt>
            <dd>
              <Translate stringId='explanationBubbleWorkPlan'/>
            </dd>
            <dt className='color color--action'>Orange</dt>
            <dd>
              <Translate stringId='explanationBubbleAction'/>
            </dd>
            <dt className='color color--grey'>Grey</dt>
            <dd>
              <Translate stringId='explanationBubbleIncomplete'/>
            </dd>
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
