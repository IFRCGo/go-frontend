import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';

import LanguageContext from '#root/languageContext';

class PerPhaseDropdown extends React.Component {
  constructor(props, context) {
    super(props);
    const { strings } = context;
    this.perPhases = [
      {id: -1, name: strings.perPhaseDropdownAllPerPhases},
      {id: 1, name: strings.perPhaseDropdownOrientation},
      {id: 2, name: strings.perPhaseDropdownAssessment},
      {id: 3, name: strings.perPhaseDropdownPrioritization},
      {id: 4, name: strings.perPhaseDropdownPlan},
      {id: 5, name: strings.perPhaseDropdownAction},
    ];
  }
  render () {
    return (
      <figcaption className='map-vis__legend map-vis__legend--top-left legend'>
        <form>
          <select onChange={this.props.onPerPhaseChange} id='top-appeal-dropdown' className='form__control form__control--medium'>
            {
              this.perPhases.map(phase => {
                return (<option key={phase.id} value={phase.id}>{phase.name}</option>);
              })
            }
          </select>
        </form>
      </figcaption>
    );
  }
}
PerPhaseDropdown.contextType = LanguageContext;
if (environment !== 'production') {
  PerPhaseDropdown.propTypes = {
    onPerPhaseChange: T.func
  };
}

export default PerPhaseDropdown;
