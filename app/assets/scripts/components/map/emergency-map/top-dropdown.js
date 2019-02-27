'use strict';

import React from 'react';

class TopDropdown extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      lastEmergencyType: 0
    }
    this.filterByEmergencyType = this.filterByEmergencyType.bind(this);
  }

  filterByEmergencyType (e) {
    const emergencyType = e.target.value != 0 ? e.target.value : this.state.lastEmergencyType;

    if (e.target.value != 0) {
      this.setState({lastEmergencyType: e.target.value});
    }

    this.props.onDtypeClick(emergencyType);
  }

  render () {
    const emergenciesByType = this.props.emergenciesByType;
    return (
      <figcaption className='map-vis__legend map-vis__legend--top-left legend'>
        <form>
          <select onChange={this.filterByEmergencyType}>
            <option value='0'>All Emergency Types</option>
            {emergenciesByType.map(emergency => (
              <option key={emergency.id} value={emergency.id}>{emergency.name}</option>
            ))}
          </select>
        </form>
      </figcaption>
    );
  }
}

export default TopDropdown;