import React from 'react';
import c from 'classnames';

const Status = ({view, componentIndex}) => {
  return (
    <div key={'container' + componentIndex + 'epi'} id={'container' + componentIndex + 'epi'}>
      <div className='per_form_ns'>Epidemic preparedness</div>
      <div>
          Please take into consideration the following aspects:<br />
          - NS has epidemics preparedness and response mandate reflected in its policy, strategy, plans and procedures.<br />
          - NS mandate in epidemics is recognized by national public health authorities.<br /><br />
      </div>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={view} name={'c' + componentIndex + 'epi'} value='2' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>Not Reviewed</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={view} name={'c' + componentIndex + 'epi'} value='3' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>Does not exist</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={view} name={'c' + componentIndex + 'epi'} value='4' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>Partially exists</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={view} name={'c' + componentIndex + 'epi'} value='5' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>Need improvements</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={view} name={'c' + componentIndex + 'epi'} value='6' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>Exists, could be strengthened</span>
      </label>
      <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
        <input type='radio' disabled={view} name={'c' + componentIndex + 'epi'} value='7' />
        <span className='form__option__ui'></span>
        <span className='form__option__text'>High performance</span>
      </label><br /><br />
    </div>
  );
};

export default Status;
