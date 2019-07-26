'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../../config';

import {
  FormTextarea,
  FormCheckboxGroup
} from '../../components/form-elements/';

export default class ActionsCheckboxes extends React.Component {
  constructor (props) {
    super(props);
    this.onChecksChange = this.onChecksChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }

  onChecksChange (checkValues) {
    const { values, onChange } = this.props;
    onChange(Object.assign({}, values, {options: checkValues}));
  }

  onDescriptionChange (e) {
    const { values, onChange } = this.props;
    const newVals = Object.assign({}, values, {description: e.target.value});
    onChange(newVals);
  }

  render () {
    const {
      label,
      name,
      description,
      placeholder,
      options,
      values
    } = this.props;

    return (
      <FormCheckboxGroup
        label={label}
        description={description}
        name={`${name}[options]`}
        classWrapper='action-checkboxes action-checkboxes--textarea'
        options={options}
        values={values.options}
        onChange={this.onChecksChange} >
        <FormTextarea
          label='Description'
          placeholder={placeholder}
          name={`${name}[description]`}
          id={`${name}-description`}
          classLabel='label-secondary'
          value={values.description}
          onChange={this.onDescriptionChange} />
      </FormCheckboxGroup>
    );
  }
}

if (environment !== 'production') {
  ActionsCheckboxes.propTypes = {
    label: T.string,
    name: T.string,
    description: T.string,
    placeholder: T.string,
    options: T.array,
    values: T.shape({
      options: T.array,
      description: T.string
    }),
    onChange: T.func
  };
}
