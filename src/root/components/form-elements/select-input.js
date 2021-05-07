import React from 'react';
import Select from 'react-select';
import _cs from 'classnames';
import { FaramInputElement } from '@togglecorp/faram';

const emptyList = [];

class SelectInput extends React.PureComponent {
  handleChange = (selectedItem) => {
    const {
      onChange,
      isMulti,
      name,
    } = this.props;

    if (!onChange) {
      return;
    }

    if (selectedItem) {
      if (isMulti) {
        onChange(selectedItem.map(d => d.value), name);
      } else {
        onChange(selectedItem.value, name);
      }
    } else {
      onChange(isMulti ? emptyList : undefined, name);
    }
  }

  render () {
    const {
      label,
      className,
      onChange, // capturing
      name,     // capturing
      value: valueFromProp,
      options,
      isMulti,
      error,
      disabled,
      ...otherProps
    } = this.props;

    let value = valueFromProp;

    if (isMulti) {
      value = options.filter(
        o => (valueFromProp || []).findIndex(
          v => String(v) === String(o.value)
        ) !== -1
    );
    } else {
      value = (options.filter(d => String(valueFromProp) === String(d.value)) || [])[0];
    }

    return (
      <div className={_cs(className, 'tc-select')}>
        { label && (
          <div className='tc-select-label'>
            { label }
          </div>
        )}
        <Select
          {...otherProps}
          isMulti={isMulti}
          defaultValue={value}
          isDisabled={disabled}
          options={options}
          className='tc-select-input'
          value={value}
          onChange={this.handleChange}
        />
        { error && (
          <div className='tc-select-input-error'>
            { error }
          </div>
        )}
      </div>
    );
  }
}

export default FaramInputElement(SelectInput);
