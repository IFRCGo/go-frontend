import React from 'react';
import Select from 'react-select';
import _cs from 'classnames';
import { FaramInputElement } from '@togglecorp/faram';

const emptyList = [];

class SelectInput extends React.PureComponent {
  handleChange = (selectedItem) => {
    const {
      onChange,
      multi,
    } = this.props;

    if (!onChange) {
      return;
    }

    if (selectedItem) {
      if (multi) {
        onChange(selectedItem.map(d => d.value));
      } else {
        onChange(selectedItem.value);
      }
    } else {
      onChange(multi ? emptyList : undefined);
    }
  }

  render () {
    const {
      label,
      className,
      onChange, // capturing
      value: valueFromProp,
      options,
      multi,
      error,
      ...otherProps
    } = this.props;

    let value = valueFromProp;

    if (multi) {
      value = options.filter(d => (valueFromProp || []).indexOf(d.value) !== -1);
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
          multi={multi}
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
