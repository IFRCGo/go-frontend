import React, { useContext, useMemo } from 'react';
import DisplayTable from '#components/display-table';
import Fold from '#components/fold';
import languageContext from '#root/languageContext';

import styles from './styles.module.scss';
import { Link, withRouter } from 'react-router-dom';
import Translate from '#components/Translate';
import useExportButton from '#hooks/useExportButton';

interface Props {
  viewAll: string;
  title: string;
  showExport: boolean;
}
function InformalUpdateReportsTable(props: Props) {
  const { strings } = useContext(languageContext);

  const {
    viewAll,
    title,
    showExport
  } = props;

  const rows = useMemo(() => [
    {
      id: '1',
      lastUpdate: '2020-09-18',
      report: <Link to={`/informal-update-report/1`} className='link--table'>5.7 Earthquake in Pakistan (Flash Update #1)</Link>,
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
    <Fold
      foldHeaderClass={styles.foldHeader}
      foldWrapperClass='fold--main'
      title={title}
      foldActions={showExport && (
        <ExportAllFieldReportsButton
          className={styles.exportButton}
          disabled
        />
      )}
      navLink={viewAll ? (
        <Link className='fold__title__link export--link' to={viewAll}>{strings.informalUpdateReportsTableViewAllReports}</Link>
      ) : null}
    >
      <DisplayTable
        headings={headings}
        rows={rows}
        className='table table--border-bottom'
      />

    </Fold>
  );
}

function ExportAllFieldReportsButton(className: any) {
  const component = useExportButton('api/v2/field_report/', 'field-reports', className);

  return component;
}

export default withRouter(InformalUpdateReportsTable);



