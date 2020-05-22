import React, {useContext} from 'react';
import _cs from 'classnames';
import Faram from '@togglecorp/faram';

import SelectInput from '#components/form-elements/select-input';
import {
  statusList,
  sectorList,
  secondarySectorList,
  programmeTypeList,
  operationTypeList,
} from '#utils/constants';
import LanguageContext from '#root/languageContext';

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

  const { strings } = useContext(LanguageContext);
  return (
    <Faram
      className={_cs('regional-movement-activity-filter', className)}
      schema={filterSchema}
      value={value}
      onChange={onChange}
    >
      <SelectInput
        faramElementName='operation_type'
        label={strings.movementFilterOperationType}
        placeholder={strings.movementFilterOperationPlaceholder}
        options={operationTypeOptions}
        className='select-input'
      />
      <SelectInput
        faramElementName='programme_type'
        label={strings.movementFilterProgrammeType}
        placeholder={strings.movementFilterProgrammePlaceholder}
        options={programmeTypeOptions}
        className='select-input'
      />
      <SelectInput
        faramElementName='primary_sector'
        label={strings.movementFilterSector}
        placeholder={strings.movementFilterSectorPlaceholder}
        options={sectorsOfActivityOptions}
        className='select-input'
      />
      <SelectInput
        faramElementName='secondary_sectors'
        label={strings.movementFilterTag}
        placeholder={strings.movementFilterTagPlaceholder}
        options={tagOptions}
        className='select-input'

      />
      <SelectInput
        faramElementName='status'
        label={strings.movementFilterStatus}
        placeholder={strings.movementFilterStatusPlaceholder}
        options={statusOptions}
        className='select-input'
      />
    </Faram>
  );
}

export default MovementActivitiesFilters;
