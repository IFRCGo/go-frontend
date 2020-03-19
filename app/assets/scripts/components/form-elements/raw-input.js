'use strict';
import React from 'react';
import _cs from 'classnames';

// TODO: PropTypes and default props
class RawInput extends React.PureComponent {
  handleChange = (event) => {
    const { value } = event.target;
    const { onChange } = this.props;

    if (onChange) {
      if (value === '') {
        onChange(undefined);
      } else {
        onChange(value);
      }
    }
  }

  render () {
    const {
      label,
      className,
      placeholder,
      value = '',
      type,
      error,
    } = this.props;

    return (
      <div className={_cs(className, 'tc-raw-input')}>
        { label && (
          <div className='tc-raw-input-label'>
            { label }
          </div>
        )}
        <input
          type={type}
          onChange={this.handleChange}
          placeholder={placeholder || 'Enter text'}
          value={value}
        />
        { error && (
          <div className='tc-raw-input-error'>
            { error }
          </div>
        )}
      </div>
    );
  }
}

export default RawInput;
