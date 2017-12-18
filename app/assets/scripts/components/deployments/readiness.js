'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import eruTypes from '../../utils/eru-types';
import { environment } from '../../config';

import CheckboxGroup from '../form-elements/checkbox-group';

const eruOptions = Object.keys(eruTypes).map(key => ({
  value: key,
  label: eruTypes[key]
}));

const initialFilterState = Object.keys(eruTypes).map(key => ({
  value: key,
  checked: false
}));

class Readiness extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      filters: initialFilterState
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange (filters) {
    this.setState({filters});
  }

  render () {
    return (
      <div>
        <CheckboxGroup
          label={'Ready ERU\'s'}
          description={null}
          name={'ready-erus'}
          classWrapper='action-checkboxes'
          options={eruOptions}
          values={this.state.filters}
          onChange={this.onChange} />
      </div>
    );
  }
}

if (environment !== 'production') {
  Readiness.propTypes = {
    eruOwners: T.object
  };
}

export default Readiness;
