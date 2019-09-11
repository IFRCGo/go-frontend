'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { _cs } from '@togglecorp/fujs';
import { FaramInputElement } from '@togglecorp/faram';

class SelectInput extends React.PureComponent {
  handleChange = (selectedItem) => {
    const {
      onChange,
    } = this.props;

    if (!onChange) {
      return;
    }

    if (selectedItem) {
      onChange(selectedItem.value);
    } else {
      onChange(undefined);
    }
  }

  render () {
    const {
      label,
      className,
      onChange, // capturing
      value,
      ...otherProps
    } = this.props;
    return (
      <div className={_cs(className, 'tc-select')}>
        <div className='tc-select-label'>
          { label }
        </div>
        <Select
          {...otherProps}
          className='tc-select-input'
          value={value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

SelectInput.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string
};

export default FaramInputElement(SelectInput);
