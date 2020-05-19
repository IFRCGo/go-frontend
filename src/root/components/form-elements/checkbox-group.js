import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import _cloneDeep from 'lodash.clonedeep';
import _get from 'lodash.get';

import { FormDescription } from './misc';
import FormCheckbox from './checkbox';

export default class FormCheckboxGroup extends React.Component {
  onCheckChange (opValue) {
    const { values, onChange } = this.props;
    const prevState = _get(values, [opValue, 'checked'], false);
    let newVals = _cloneDeep(values);

    newVals[opValue].checked = !prevState;
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      description,
      options,
      values,
      classWrapper,
      classLabel,
      children
    } = this.props;

    return (
      <div className={c('form__group', classWrapper)}>
        <div className='form__inner-header'>
          <div className='form__inner-headline'>
            <label className={c('form__label', classLabel)}>{label}</label>
            <FormDescription value={description} />
          </div>
        </div>
        <div className='form__inner-body'>
          <div className='form__options-group'>
            {options.map((o, opValue) => (
              <FormCheckbox
                key={o.value}
                label={o.label}
                name={`${name}[]`}
                id={`${name.replace(/(\[|\])/g, '-')}-${o.value}`}
                value={o.value}
                checked={_get(values, [opValue, 'checked'], false)}
                onChange={this.onCheckChange.bind(this, opValue)}
                description={o.description} />
            ))}
          </div>
          {children || null}
        </div>
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  FormCheckboxGroup.propTypes = {
    label: T.string,
    name: T.string,
    description: T.oneOfType([
      T.node,
      T.object
    ]),
    options: T.array,
    values: T.array,
    classWrapper: T.string,
    classLabel: T.string,
    checked: T.bool,
    children: T.node,
    onChange: T.func
  };
}
