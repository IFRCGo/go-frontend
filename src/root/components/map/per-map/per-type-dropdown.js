
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';
import { processType } from '#utils/get-per-process-type';
import LanguageContext from '#root/languageContext';
const localProcessType = JSON.parse(JSON.stringify(processType));

class PerTypeDropdown extends React.Component {
  render () {
    const { strings } = this.context;
    return (
      <figcaption className='map-vis__legend map-vis__legend--top-left legend'>
        <form>
          <select onChange={this.props.onPerTypeChange} id='top-type-dropdown' className='form__control form__control--medium'>
            <option value={'-1'}>{strings.perTypeDropdownAllPerType}</option>
            {
              Object.keys(localProcessType).map(typeKey => {
                return (<option key={'pertypedropdown' + typeKey} value={typeKey}>{localProcessType[typeKey]}</option>);
              })
            }
          </select>
        </form>
      </figcaption>
    );
  }
}

PerTypeDropdown.contextType = LanguageContext;
if (environment !== 'production') {
  PerTypeDropdown.propTypes = {
    onPerTypeChange: T.func
  };
}

export default PerTypeDropdown;
