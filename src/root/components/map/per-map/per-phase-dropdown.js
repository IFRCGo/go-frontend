'use strict';

import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../../config';

const perPhases = [
  {id: -1, name: 'All PER Phases'},
  {id: 1, name: 'Orientation'},
  {id: 2, name: 'Assessment'},
  {id: 3, name: 'Prioritization'},
  {id: 4, name: 'Plan of action'},
  {id: 5, name: 'Action & accountability'}
];

class PerPhaseDropdown extends React.Component {
  render () {
    return (
      <figcaption className='map-vis__legend map-vis__legend--top-left legend'>
        <form>
          <select onChange={this.props.onPerPhaseChange} id='top-appeal-dropdown' className='form__control form__control--medium'>
            {
              perPhases.map(phase => {
                return (<option key={phase.id} value={phase.id}>{phase.name}</option>);
              })
            }
          </select>
        </form>
      </figcaption>
    );
  }
}

if (environment !== 'production') {
  PerPhaseDropdown.propTypes = {
    onPerPhaseChange: T.func
  };
}

export default PerPhaseDropdown;
