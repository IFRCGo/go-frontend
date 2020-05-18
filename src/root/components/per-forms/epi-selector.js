
import React from 'react';
import c from 'classnames';
import { environment } from '#root/config';
import { PropTypes as T } from 'prop-types';
import RequestFactory from './factory/request-factory';
const requestFactory = new RequestFactory();

const EpiSelector = ({areaTitle, areaQuestion, view, areaOptions, changeEpiComponentState}) => {
  return (
    <div className='containera1'>
      <div className='per_form_area'>{areaTitle}</div><br />
      <div className='form__group'>
        <div className='label-secondary'>{areaQuestion}</div>
        <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
          <input type='radio' name='a1' disabled={view} value={requestFactory.stringAnswerToNum(areaOptions[0])} onClick={changeEpiComponentState} />
          <span className='form__option__ui'></span>
          <span className='form__option__text'>{areaOptions[0]}</span>
        </label>
        <label className={c(`form__option form__option--custom-radio`, {'form__option--inline': 'inline'})}>
          <input type='radio' name='a1' disabled={view} value={requestFactory.stringAnswerToNum(areaOptions[1])} onClick={changeEpiComponentState} />
          <span className='form__option__ui'></span>
          <span className='form__option__text'>{areaOptions[1]}</span>
        </label>
      </div>
    </div>
  );
};

export default EpiSelector;

if (environment !== 'production') {
  EpiSelector.propTypes = {
    areaTitle: T.string,
    areaQuestion: T.string,
    changeEpiComponentState: T.func,
    areaOptions: T.array,
    view: T.bool
  };
}
