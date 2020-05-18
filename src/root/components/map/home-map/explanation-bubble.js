
import React from 'react';
import {
  FormRadioGroup
} from '../../form-elements';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';

class ExplanationBubble extends React.Component {
  render () {
    return (
      <figcaption className='map-vis__legend map-vis__legend--bottom-right legend'>
        <form className='form'>
          <FormRadioGroup
            label='Scale points by'
            name='map-scale'
            classWrapper='map-scale-options'
            options={[
              {
                label: '# of people targeted',
                value: 'population'
              },
              {
                label: 'IFRC financial requirements',
                value: 'amount'
              }
            ]}
            inline={false}
            selectedOption={this.props.scaleBy}
            onChange={this.props.onFieldChange} />
        </form>
        <div className='key'>
          <label className='form__label'>Type</label>
          <dl className='legend__dl legend__dl--colors'>
            <dt className='color color--red'>Red</dt>
            <dd>Emergency appeal</dd>
            <dt className='color color--yellow'>Yellow</dt>
            <dd>DREF</dd>
            <dt className='color color--grey'>Grey</dt>
            <dd>Movement response</dd>
            <dt className='color color--blue'>Grey</dt>
            <dd>Multiple types</dd>
          </dl>
        </div>
        {this.props.deployments ? (
          <div className='legend__block'>
            <h3 className='legend__title'>{this.props.deploymentsKey || 'Deployments'}</h3>
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

export default ExplanationBubble;
