import React from 'react';
import Faram from '@togglecorp/faram';
import _cs from 'classnames';

import SelectInput from '../../components/form-elements/select-input';
import connect from 'react-redux/lib/connect/connect';
import { countriesByIso } from '#selectors';

import styles from './styles.module.scss';

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

const compareString = (a, b) => (a.label || '').localeCompare(b.label);

function NSActivitiesFilters (p) {
  const {
    value,
    onChange,
    data = emptyData,
    className,
    countriesByIso,
  } = p;

  const [
    supportingNSOptions,
    activityOptions,
    receivingNSOptions,
  ] = React.useMemo(() => [
    (data.nodes || []).filter(d => d.type === 'supporting_ns').map(d => ({
      label: d.name,
      value: d.id,
      countryName: countriesByIso[d.iso].name || '',
    })).sort((a, b) => a.countryName.localeCompare(b.countryName)),
    (data.nodes || []).filter(d => d.type === 'sector').map(toLabelValue).sort(compareString),
    (data.nodes || [])
      .filter(d => d.type === 'receiving_ns')
      .map(d => ({ label: d.name, value: d.iso }))
      .sort(compareString),
  ], [data]);

  return (
    <Faram
      className={_cs(className, styles.filters)}
      schema={filterSchema}
      value={value}
      onChange={onChange}
    >
      <SelectInput
        faramElementName='reporting_ns'
        label='Supporting NS'
        placeholder='Select Who (Reporting NS)'
        options={supportingNSOptions}
        className={styles.input}
        multi
      />
      <SelectInput
        faramElementName='primary_sector'
        label='Activity'
        placeholder='Select What (Sector)'
        options={activityOptions}
        className={styles.input}
        multi
      />
      <SelectInput
        faramElementName='country'
        label='Receiving NS'
        placeholder='Select Where (Country)'
        options={receivingNSOptions}
        className={styles.input}
        multi
      />
    </Faram>
  );
}

const selector = (state, ownProps) => ({
  countriesByIso: countriesByIso(state)
});

const dispatcher = (dispatch) => ({});
export default connect(selector, dispatcher)(NSActivitiesFilters);
