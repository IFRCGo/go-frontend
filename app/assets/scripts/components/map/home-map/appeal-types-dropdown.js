'use strict';

import React from 'react';

class AppealTypesDropdown extends React.Component {
  constructor () {
    super();
  }

  render () {
    console.log('gomba');
    return (
      <figcaption className='map-vis__legend map-vis__legend--appeal-dropdown legend'>
        <form>
          <select>
            <option value='0'>All Appeal Types</option>
          </select>
        </form>
      </figcaption>
    );
  }
}

export default AppealTypesDropdown;