import React from 'react';
import _cs from 'classnames';
import Faram from '@togglecorp/faram';

import SelectInput from '../../components/form-elements/select-input';
import {
  statusList,
  sectorList,
  secondarySectorList,
  programmeTypeList,
  operationTypeList,
} from '../../utils/constants';

const compareString = (a, b) => a.label.localeCompare(b.label);

const programmeTypeOptions = programmeTypeList.map(p => ({
  value: p.key,
  label: p.title,
})).sort(compareString);

const sectorsOfActivityOptions = sectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
})).sort(compareString);

const tagOptions = secondarySectorList.map(p => ({
  value: p.inputValue,
  label: p.title,
})).sort(compareString);

const statusOptions = statusList.map(p => ({
  value: p.key,
  label: p.title,
})).sort(compareString);

const operationTypeOptions = operationTypeList.map(o => ({
  value: o.value,
  label: o.label,
})).sort(compareString);

const filterSchema = {
  fields: {
    operation_type: [],
    programme_type: [],
    primary_sector: [],
    status: []
  }
};

function MovementActivitiesFilters (p) {
  const {
    className,
    value,
    onChange,
  } = p;

  return (
    <Faram
      className={_cs('regional-movement-activity-filter', className)}
      schema={filterSchema}
      value={value}
      onChange={onChange}
    >
      <SelectInput
        faramElementName='operation_type'
        label='Operation type'
        placeholder='All Operation Types'
        options={operationTypeOptions}
        className='select-input'
      />
      <SelectInput
        faramElementName='programme_type'
        label='Programme type'
        placeholder='All Programme Types'
        options={programmeTypeOptions}
        className='select-input'
      />
      <SelectInput
        faramElementName='primary_sector'
        label='Sectors of Activity'
        placeholder='All Sectors'
        options={sectorsOfActivityOptions}
        className='select-input'
      />
      <SelectInput
        faramElementName='primary_sector'
        label='Tag'
        placeholder='All Tags'
        options={tagOptions}
        className='select-input'
      />
      <SelectInput
        faramElementName='status'
        label='Status'
        placeholder='All-Status'
        options={statusOptions}
        className='select-input'
      />
    </Faram>
  );
}

export default MovementActivitiesFilters;
