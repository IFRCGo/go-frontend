import React, { useContext, useMemo, useState } from 'react';
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
import { Strings } from '#types';
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
  } = useRequest<ListResponse<InformalUpdateTableFields>>({
    url: 'api/v2/informal-update/',
    query: {
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (activePage - 1),
    },
  });

  const columns = useMemo(() => {
    const actionsColumn = createActionColumn(
      'actions',
      (rowKey: number | string, infrl: InformalUpdateTableFields) => ({
        extraActions: (
          <>
            <DropdownMenuItem
              href={`/informal-update-report/${infrl.id}/`}
              label={strings.projectListTableViewDetails}
              icon={<MdSearch />}
            />
            <DropdownMenuItem
              // href={`/three-w/${infrl.id}/edit/`}
              href=''
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
              data={response && response?.results}
              columns={columns}
              keySelector={tableKeySelector}
              variant="large"
            />
            {/*{response && (*/}
            <div className={styles.footer}>
              <Pager
                activePage={activePage}
                onActivePageChange={setActivePage}
                itemsCount={ITEM_PER_PAGE}
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
