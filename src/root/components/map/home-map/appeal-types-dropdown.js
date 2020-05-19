
import React from 'react';
import { appealTypeOptions } from './../../../utils/appeal-type-constants';
import { PropTypes as T } from 'prop-types';
import { environment } from '../../../config';

class AppealTypesDropdown extends React.Component {
  render () {
    return (
      <figcaption className='map-vis__legend map-vis__legend--top-left legend'>
        <form>
          <select onChange={this.props.onAppealTypeChange} id='top-appeal-dropdown' className='form__control form__control--medium form__control--brand'>
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

if (environment !== 'production') {
  AppealTypesDropdown.propTypes = {
    onAppealTypeChange: T.func
  };
}

export default AppealTypesDropdown;
