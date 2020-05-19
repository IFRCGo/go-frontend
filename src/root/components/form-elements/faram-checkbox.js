import React from 'react';
import { randomString } from '@togglecorp/fujs';
import { FaramInputElement } from '@togglecorp/faram';

class FaramCheckbox extends React.PureComponent {
  inputId = randomString(8);

  handleChange = (e) => {
    const {
      onChange,
      value,
    } = this.props;

    if (onChange) {
      onChange(!value);
    }
  }

  render () {
    const {
      value,
      label,
    } = this.props;

    return (
      <label
        htmlFor={this.inputId}
        className='tc-faram-checkbox'
      >
        <input
          id={this.inputId}
          className='tc-faram-checkbox-input'
          type="checkbox"
          onChange={this.handleChange}
          checked={value}
        />
        <div className='tc-faram-checkbox-label'>
          { label }
        </div>
      </label>
    );
  }
}

export default FaramInputElement(FaramCheckbox);
