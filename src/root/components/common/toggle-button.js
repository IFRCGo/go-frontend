import React from 'react';
import ToggleButton from 'react-toggle-button';
import { PropTypes as T } from 'prop-types';
import { environment } from '#root/config';

const ToggleButtonComponent = ({ description, value, toggle }) => (
  <label className='toggle-button-group--horizontal'>
    <span className='toggle-button-description'>
      {description}
    </span>
    <ToggleButton
      value={value}
      onToggle={toggle}
      aria-label='Toggle display of only active operations'
      colors={{
        activeThumb: {
          base: '#f5333f',
        },
        active: {
          base: '#666666'
        }
      }}
    />
  </label>
);

export default ToggleButtonComponent;

if (environment !== 'production') {
  ToggleButtonComponent.propTypes = {
    description: T.string,
    value: T.bool,
    toggle: T.func
  };
}
