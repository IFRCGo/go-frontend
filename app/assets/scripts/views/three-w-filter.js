'use strict';
import React from 'react';
import { PropTypes } from 'prop-types';
import Faram from '@togglecorp/faram';

import Select from '../components/form-elements/new-components/select';

const nationalSocietiesOptions = [
  { value: 'all', label: 'All' },
  { value: 'none', label: 'None' }
];

const supportTypeOptions = [
  { value: 'all', label: 'All' },
  { value: 'none', label: 'None' }
];

const sectorsOfActivityOptions = [
  { value: 'all', label: 'All' },
  { value: 'none', label: 'None' }
];

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'none', label: 'None' }
];

export default class ThreeWFilter extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      filterValues: {
        nationalSocieties: 'all',
        supportType: 'all',
        sectorsOfActivity: 'all',
        status: 'all'
      }
    };

    this.schema = {
      fields: {
        nationalSocieties: [],
        supportType: [],
        sectorsOfActivity: [],
        status: []
      }
    };
  }

  handleFaramChange = (filterValues) => {
    this.setState({ filterValues });
  }

  render () {
    const { className } = this.props;
    const { filterValues } = this.state;

    return (
      <Faram
        className={className}
        schema={this.schema}
        value={filterValues}
        onChange={this.handleFaramChange}
      >
        <Select
          faramElementName='nationalSocieties'
          label='National societies'
          placeholder='National societies'
          options={nationalSocietiesOptions}
          className='select-input'
        />
        <Select
          faramElementName='supportType'
          label='Support type'
          placeholder='Support type'
          options={supportTypeOptions}
          className='select-input'
        />
        <Select
          faramElementName='sectorsOfActivity'
          label='Sectors of Activity'
          placeholder='Sectors of Activity'
          options={sectorsOfActivityOptions}
          className='select-input'
        />
        <Select
          faramElementName='status'
          label='Status'
          placeholder='Status'
          options={statusOptions}
          className='select-input'
        />
      </Faram>
    );
  }
}

ThreeWFilter.propTypes = {
  className: PropTypes.string
};
