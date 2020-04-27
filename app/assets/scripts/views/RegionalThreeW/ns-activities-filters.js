import React from 'react';
import Faram from '@togglecorp/faram';

import SelectInput from '../../components/form-elements/select-input';

const filterSchema = {
  fields: {
    reporting_ns: [],
    country: [],
    primary_sector: [],
  }
};

const emptyData = {
  nodes: [],
};

function toLabelValue (d) {
  return {
    label: d.name,
    value: d.id,
  };
}

function NSActivitiesFilters (p) {
  const {
    value,
    onChange,
    data = emptyData,
  } = p;

  const [
    supportingNSOptions,
    activityOptions,
    receivingNSOptions,
  ] = React.useMemo(() => [
    (data.nodes || []).filter(d => d.type === 'supporting_ns').map(toLabelValue),
    (data.nodes || []).filter(d => d.type === 'sector').map(toLabelValue),
    (data.nodes || []).filter(d => d.type === 'receiving_ns').map(d => ({
      label: d.name,
      value: d.iso,
    })),
  ], [data]);

  return (
    <Faram
      className='regional-ns-activity-filter'
      schema={filterSchema}
      value={value}
      onChange={onChange}
    >
      <SelectInput
        faramElementName='reporting_ns'
        label='Supporting NS'
        placeholder='All'
        options={supportingNSOptions}
        className='select-input'
        multi
      />
      <SelectInput
        faramElementName='primary_sector'
        label='Activity'
        placeholder='All'
        options={activityOptions}
        className='select-input'
        multi
      />
      <SelectInput
        faramElementName='country'
        label='Receiving NS'
        placeholder='All'
        options={receivingNSOptions}
        className='select-input'
        multi
      />
    </Faram>
  );
}

export default NSActivitiesFilters;
