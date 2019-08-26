'use strict';

import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../../config';

class EmergencyTypesDropdown extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      lastEmergencyType: 0
    };
    this.filterByEmergencyType = this.filterByEmergencyType.bind(this);
  }

  filterByEmergencyType (e) {
    const emergencyType = e.target.value !== 0 ? e.target.value : this.state.lastEmergencyType;

    if (e.target.value !== 0) {
      this.setState({lastEmergencyType: e.target.value});
    }

    this.props.onDtypeClick(emergencyType);
  }

  render () {
    const emergenciesByType = this.props.emergenciesByType;
    return (
      <figcaption className='map-vis__legend map-vis__legend--top-left legend'>
        <form>
          <select onChange={this.filterByEmergencyType} id='top-emergency-dropdown' className='form__control form__control--medium form__control--brand'>
            <option value='0'>All Emergency Types</option>
            {emergenciesByType.map(emergency => (
              <option key={emergency.id} value={emergency.id}>{emergency.name} ({emergency.items.length})</option>
            ))}
          </select>
        </form>
      </figcaption>
    );
  }
}

if (environment !== 'production') {
  EmergencyTypesDropdown.propTypes = {
    onDtypeClick: T.func,
    emergenciesByType: T.array
  };
}

export default EmergencyTypesDropdown;
