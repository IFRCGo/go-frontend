'use strict';
import React from 'react';
import { PropTypes } from 'prop-types';
import Faram from '@togglecorp/faram';
import { unique } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import SelectInput from '../../components/new/select-input';
import {
  statusList,
  sectorList,
  programmeTypeList,
} from '../../utils/constants';

const programmeTypeOptions = programmeTypeList.map(p => ({
  value: p.title,
  label: p.title,
}));

const sectorsOfActivityOptions = sectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
}));

const statusOptions = statusList.map(p => ({
  value: p.title,
  label: p.title,
}));

export default class ThreeWFilter extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      filterValues: {
        reporting_ns: undefined,
        programme_type: undefined,
        primary_sector: undefined,
        status: undefined,
      }
    };

    this.schema = {
      fields: {
        reporting_ns: [],
        programme_type: [],
        primary_sector: [],
        status: []
      }
    };

  }

  getNationalSocietiesOptions = memoize((projectList) => {
    const nationalSocietiesOptions = unique(projectList.map(p => ({
      value: p.reporting_ns,
      label: p.reporting_ns_detail.society_name,
    })), p => p.value);

    return nationalSocietiesOptions;
  })

  handleFaramChange = (filterValues) => {
    const { onFilterChange } = this.props;
    this.setState({ filterValues });

    if (onFilterChange) {
      onFilterChange(filterValues);
    }
  }

  render () {
    const {
      className,
      projectList,
    } = this.props;

    const { filterValues } = this.state;

    return (
      <Faram
        className={className}
        schema={this.schema}
        value={filterValues}
        onChange={this.handleFaramChange}
      >
        <SelectInput
          faramElementName='reporting_ns'
          label='National societies'
          placeholder='All'
          options={this.getNationalSocietiesOptions(projectList)}
          className='select-input'
        />
        <SelectInput
          faramElementName='programme_type'
          label='Programme type'
          placeholder='All'
          options={programmeTypeOptions}
          className='select-input'
        />
        <SelectInput
          faramElementName='primary_sector'
          label='Sectors of Activity'
          placeholder='All'
          options={sectorsOfActivityOptions}
          className='select-input'
        />
        <SelectInput
          faramElementName='status'
          label='Status'
          placeholder='All'
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
