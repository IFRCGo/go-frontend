import React, { useContext, useMemo } from 'react';
import DisplayTable from '#components/display-table';
import Fold from '#components/fold';
import languageContext from '#root/languageContext';

import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

function InformalUpdateReportsTable() {
  const { strings } = useContext(languageContext);

  const rows = useMemo(() => [
    {
      id: '1',
      lastUpdate: '2020-09-18',
      report: <Link to={`/informal-update-report/1`} className='link--table' title={strings.fieldReportsTableViewAll}>5.7 Earthquake in Pakistan (Flash Update #1)</Link>,
      disasterType: 'Earthquake',
      country: 'Pakistan'
    },
    {
      id: '2',
      lastUpdate: '2020-09-17',
      report: 'Costa Rica: Typhoon (Flash Update#2)',
      disasterType: 'Typhoon',
      country: 'Costa Rica'
    },
    {
      id: '3',
      lastUpdate: '2020-09-17',
      report: 'Costa Rica: Typhoon (Flash Update#2)',
      disasterType: 'Typhoon',
      country: 'Costa Rica'
    }]
    , []);

  const headings = useMemo(() => [
    {
      id: 'lastUpdate',
      label: 'Last Update'
    },
    {
      id: 'report',
      label: 'Report'
    },
    {
      id: 'disasterType',
      label: 'Disaster Type'
    },
    {
      id: 'country',
      label: 'Country'
    },
  ], []);

  return (
    <Fold foldHeaderClass={styles.foldHeader}
      title={strings.informalUpdateReportsTableTitle}
      foldWrapperClass='fold--main'
    >
      <DisplayTable
        headings={headings}
        rows={rows}
        className='table table--border-bottom'
      />
    </Fold>
  );
}

export default InformalUpdateReportsTable;

