import React, { useContext, useEffect, useMemo, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
  MdSearch,
  MdEdit,
} from 'react-icons/md';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import BlockLoading from '#components/block-loading';
import Translate from '#components/Translate';
import Pager from '#components/Pager';
import Container from '#components/Container';
import DropdownMenuItem from '#components/DropdownMenuItem';
import Table from '#components/Table';
import { createActionColumn } from '#components/Table/predefinedColumns';
import LanguageContext from '#root/languageContext';
import { InformalUpdateTableFields, tableKeySelector } from '#views/InformalUpdateApplicationForm/common';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import {
  Project,
  Strings,
} from '#types';
import { getBaseColumns } from './informalUpdateTableColumns';
import { useButtonFeatures } from '#components/Button';
import ExportProjectsButton from '#components/ExportProjectsButton';

import styles from './styles.module.scss';


interface Props {
  className?: string;
  title: string;
  showExport: boolean;
  ITEM_PER_PAGE: number;
}

function TableLists(props: Props) {
  const {
    className,
    ITEM_PER_PAGE,
    showExport
  } = props;

  const { strings } = useContext(LanguageContext);
  const [activePage, setActivePage] = useState(1);

  const viewAllProjectLinkProps = useButtonFeatures({
    variant: 'tertiary',
    actions: <IoChevronForward />,
    children: strings.informalUpdateReportsTableViewAllReports,
  });

  const {
    pending,
    response,
  } = useRequest<ListResponse<Project>>({
    url: '',
    query: {
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (activePage - 1),
    },
  });

  const tableData = useMemo(() => [
    {
      id: 1,
      last_date: '2020-09-18',
      report: '5.7 Earthquake in Pakistan (Flash Update #1)',
      hazard_type: 'Earthquake',
      country: 'Pakistan'
    },
    {
      id: 2,
      last_date: '2020-09-18',
      report: '5.7 Earthquake in Pakistan (Flash Update #1)',
      hazard_type: 'Earthquake',
      country: 'Pakistan'
    },
    {
      id: 3,
      last_date: '2020-09-18',
      report: '5.7 Earthquake in Pakistan (Flash Update #1)',
      hazard_type: 'Earthquake',
      country: 'Pakistan'
    },
  ]
    , []);

  const columns = useMemo(() => {
    const actionsColumn = createActionColumn(
      'actions',
      (rowKey: number | string, prj: InformalUpdateTableFields) => ({
        extraActions: (
          <>
            <DropdownMenuItem
              href={`/informal-update-report/${prj.id}/`}
              label={strings.projectListTableViewDetails}
              icon={<MdSearch />}
            />
            <DropdownMenuItem
              href={`/three-w/${prj.id}/edit/`}
              icon={<MdEdit />}
              label={strings.projectListTableEdit}
            />
          </>
        ),
      }),
    );

    return [
      ...getBaseColumns(strings),
      actionsColumn,
    ];
  }, [strings]);

  const headingStringId: keyof Strings = useMemo(() => {
    if (pending) {
      return 'allFlashUpdatePageHeading';
    }
    return 'allFlashUpdatePageHeading';
  }, [pending]);

  return (

    <div className={_cs(styles.allInformalUpdates, className)}>

      <Container
        className={styles.mainContent}
        heading={(
          <Translate
            stringId={headingStringId}
          />
        )}
        actions={(
          <>
            {showExport && (
              <ExportProjectsButton
                apiUrl=''
                fileNameSuffix=''
              />
            )}
            {!showExport && (
              <Link
                to={`/informal-updates/all/`}
                {...viewAllProjectLinkProps}
              />
            )}

          </>
        )}
      >
        {pending ? (
          <BlockLoading />
        ) : (
          <>
            <Table
              className={styles.projectsTable}
              data={tableData}
              columns={columns}
              keySelector={tableKeySelector}
              variant="large"
            />
            {/*{response && (*/}
            <div className={styles.footer}>
              <Pager
                activePage={activePage}
                onActivePageChange={setActivePage}
                itemsCount={20}
                maxItemsPerPage={ITEM_PER_PAGE}
              />
            </div>
            {/*)}*/}
          </>
        )}
      </Container>

    </div>
  );
}

export default TableLists;
