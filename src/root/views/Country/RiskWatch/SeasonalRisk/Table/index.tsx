import React, { useContext, useMemo } from 'react';
import { _cs } from '@togglecorp/fujs';
import DisplayTable, { FilterHeader, SortHeader } from '#components/display-table';
import Fold from '#components/fold';
import styles from './styles.module.scss';
import { PeriodFilters } from '../Filter';
import { FilterValue, Filters } from '../Filter';
import ExportProjectsButton from '#components/ExportProjectsButton';
import RawButton from '#components/RawButton';

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
    irs: '5.5',
    pe: '15,000',
    prd: '5000'
  },
  {
    id: 1,
    ht: 'Flood',
    irs: '3',
    pe: '15,000',
    prd: '5000'
  },
  {
    id: 2,
    ht: 'Food Insecurity',
    irs: '-',
    pe: '15,000',
    prd: '-'
  },
  {
    id: 3,
    ht: 'Drough',
    irs: '3',
    pe: '15,000',
    prd: '5000'
  },
  {
    id: 4,
    ht: 'Land Slide',
    irs: '4',
    pe: '2,000',
    prd: '5000'
  }
];
const row02 = [
  {
    id: 1,
    rp: '1-in-5-year event',
    pe: '10,000',
    prd: '10,000',
    bd: '15 million',
    ei: '100,000',
    hi: '50,000'
  },
  {
    id: 2,
    rp: '1-in-50-year event',
    pe: '100,000',
    prd: '100,000',
    bd: '300 million',
    ei: '4 million',
    hi: '2 million'
  },
  {
    id: 3,
    rp: '1-in-100-year event',
    pe: '200,000',
    prd: '1 million',
    bd: '400 million',
    ei: '6 million',
    hi: '3 million'
  },
  {
    id: 4,
    rp: '1-in-500-year event',
    pe: '100 million',
    prd: '100 million',
    bd: '1 billion',
    ei: '100 million',
    hi: '100 million'
  },
];

function RiskTable() {
  return (
    <DisplayTable
      headings={headings}
      rows={row}
      pageCount={1}
      page={1}
      noPaginate={false}
      className='table table--border-bottom table--box-shadow'
    />
  );
}

function ReturnPeriodTable() {
  const [filters, setFilters] = React.useState<FilterValue>({
    reporting_ns: [],
    programme_type: [],
    primary_sector: [],
    secondary_sectors: [],
  });

  return (
    <Fold
      foldHeaderClass={styles.foldHeader}
      foldWrapperClass='fold--main'
      foldTitleClass='fold__title--inline margin-reset'
      title="EXPECTED RETURN PERIOD"
      showHeader={true}
    >
      <div className={styles.riskButton}>
        <div className={styles.filterButton}>
          <PeriodFilters
            disabled={false}
            value={filters}
            onChange={setFilters} />
          <RawButton
            name='clear'
            onClick={() => {
              setFilters({
                reporting_ns: [],
                programme_type: [],
                primary_sector: [],
                secondary_sectors: [],
              });
            }}
          >
            Clear Filters
        </RawButton>
        </div>
        <ExportProjectsButton
          fileNameSuffix="All Period Table"
        />
      </div>
      <DisplayTable
        headings={headings02}
        rows={row02}
        pageCount={1}
        page={1}
        noPaginate={true}
        className='table table--border-bottom table--box-shadow'
      />
    </Fold>
  );
}

export { RiskTable, ReturnPeriodTable };
