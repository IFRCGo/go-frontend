import React, { useContext, useMemo } from 'react';
import { _cs } from '@togglecorp/fujs';
import DisplayTable, { FilterHeader, SortHeader } from '#components/display-table';
import Fold from '#components/fold';
import styles from './styles.module.scss';

const headings = [
  {
    id: 'ht',
    label: 'Hazard Type'
  },
  {
    id: 'irs',
    label: 'Inform Risk score'
  },
  {
    id: 'pe',
    label: 'People Exposed'
  },
  {
    id: 'prd',
    label: 'People at Risk of Displacement'
  }
];
const headings02 = [
  {
    id: 'rp',
    label: 'Return Period'
  },
  {
    id: 'pe',
    label: 'People Exposed'
  },
  {
    id: 'prd',
    label: 'People at Risk of Displacement'
  },
  {
    id: 'bd',
    label: 'Building Damage'
  },
  {
    id: 'ei',
    label: 'Education Impact'
  },
  {
    id: 'hi',
    label: 'Health Impact'
  },
];

const row = [
  {
    id: 0,
    ht: 'Cyclone',
    irs: '12345',
    pe: '1.22',
    prd: '12546'
  }
];

function RiskTable() {
  return (
    <DisplayTable
      headings={headings}
      rows={row}
      pageCount={1}
      page={1}
      noPaginate={true}
      className='table table--border-bottom table--box-shadow'
    />
  );
}

function ReturnPeriodTable() {

  return (
    <Fold
      foldHeaderClass={styles.foldHeader}
      foldWrapperClass='fold--main'
      foldTitleClass='fold__title--inline margin-reset'
      navLink="Inform Indicator"
      title="EXPECTED RETURN PERIOD"
      showHeader={true}
    >
      <DisplayTable
        headings={headings02}
        rows={[]}
        pageCount={1}
        page={1}
        noPaginate={true}
        className='table table--border-bottom table--box-shadow'
      />
    </Fold>
  );
}

export { RiskTable, ReturnPeriodTable };