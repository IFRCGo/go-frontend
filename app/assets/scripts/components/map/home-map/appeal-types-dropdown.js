'use strict';

import React from 'react';
import { appealTypeOptions } from './../../../utils/appeal-type-constants';

class AppealTypesDropdown extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <figcaption className='map-vis__legend map-vis__legend--appeal-dropdown legend'>
        <form>
          <select onChange={this.props.onAppealTypeChange} id='top-appeal-dropdown' className='form__control form__control--medium'>
            {
              appealTypeOptions.map(appeal => {
                return (<option key={appeal.value} value={appeal.value}>{appeal.label}</option>);
              })
            }
          </select>
        </form>
      </figcaption>
    );
  }
}

export default AppealTypesDropdown;