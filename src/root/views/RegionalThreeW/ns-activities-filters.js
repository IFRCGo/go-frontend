import React from 'react';
import Faram from '@togglecorp/faram';

import SelectInput from '../../components/form-elements/select-input';
import { countryNameMapByIso } from '../../utils/field-report-constants';

const filterSchema = {
  fields: {
    reporting_ns: [],
    project_country: [],
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

const compareString = (a, b) => (a.label || '').localeCompare(b.label);

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
    (data.nodes || []).filter(d => d.type === 'supporting_ns').map(d => ({
      label: d.name,
      value: d.id,
      countryName: countryNameMapByIso[d.iso] || '',
    })).sort((a, b) => a.countryName.localeCompare(b.countryName)),
    (data.nodes || []).filter(d => d.type === 'sector').map(toLabelValue).sort(compareString),
    (data.nodes || []).filter(d => d.type === 'receiving_ns').map(toLabelValue).sort(compareString),
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
        placeholder='Select Who (Reporting NS)'
        options={supportingNSOptions}
        className='select-input'
        multi
      />
      <SelectInput
        faramElementName='primary_sector'
        label='Activity'
        placeholder='Select What (Sector)'
        options={activityOptions}
        className='select-input'
        multi
      />
      <SelectInput
        faramElementName='project_country'
        label='Receiving NS'
        placeholder='Select Where (Country)'
        options={receivingNSOptions}
        className='select-input'
        multi
      />
    </Faram>
  );
}

export default NSActivitiesFilters;
