
import React from 'react';
import {
  FormRadioGroup
} from '../../form-elements';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';
import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

class ExplanationBubble extends React.Component {
  render () {
    const { strings } = this.context;
    return (
      <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
        <div className='flex'>
          <form className='form'>
            <FormRadioGroup
              label={strings.explanationBubbleScalePoints}
              name='map-scale'
              classWrapper='map-scale-options'
              options={[
                {
                  label: strings.explanationBubblePopulationLabel,
                  value: 'population'
                },
                {
                  label: strings.explanationBubbleAmountLabel,
                  value: 'amount'
                }
              ]}
              inline={false}
              selectedOption={this.props.scaleBy}
              onChange={this.props.onFieldChange} />
          </form>
          <div className='key'>
            <label className='form__label'>
              <Translate stringId='explanationBubbleType'/>
            </label>
            <dl className='legend__dl legend__dl--colors'>
              <dt className='color color--map-red'>Red</dt>
              <dd>
                <Translate stringId='explanationBubbleEmergencyAppeal'/>
              </dd>
              <dt className='color color--map-red2'>Yellow</dt>
              <dd>
                <Translate stringId='explanationBubbleDref'/>
              </dd>
              <dt className='color color--grey'>Grey</dt>
              <dd>
                <Translate stringId='explanationBubbleMovement'/>
              </dd>
              <dt className='color color--map-yellow'>Grey</dt>
              <dd>
                <Translate stringId='explanationBubbleMultiple'/>
              </dd>
              <dt className='color color--map-darkblue'>DarkBlue</dt>
              <dd>
                <Translate stringId='explanationBubbleEAP'/>
              </dd>
            </dl>
          </div>
        </div>
        {this.props.deployments ? (
          <div className='legend__block'>
            <h3 className='legend__title'>{this.props.deploymentsKey || strings.explanationBubbleDeployments}</h3>
            <dl className='legend__grandient'>
              <dt style={{background: 'linear-gradient(to right, #F0C9E8, #861A70)'}}>Scale Gradient</dt>
              <dd>
                <span>0</span>
                <span>to</span>
                <span>5</span>
              </dd>
            </dl>
          </div>
        ) : null}
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
ExplanationBubble.contextType = LanguageContext;
export default ExplanationBubble;
