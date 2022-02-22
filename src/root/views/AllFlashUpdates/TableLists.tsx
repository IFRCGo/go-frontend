import React, { useContext, useMemo, useState } from 'react';
import { _cs } from '@togglecorp/fujs';
import {
  MdSearch,
  MdEdit,
} from 'react-icons/md';

import BlockLoading from '#components/block-loading';
import Pager from '#components/Pager';
import Container from '#components/Container';
import DropdownMenuItem from '#components/DropdownMenuItem';
import Table from '#components/Table';
import { createActionColumn } from '#components/Table/predefinedColumns';
import LanguageContext from '#root/languageContext';
import {
  FlashUpdateTableFields,
  tableKeySelector,
} from '#views/FlashUpdateApplicationForm/common';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import { getBaseColumns } from './flashUpdateTableColumns';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  title: string;
  showExport: boolean;
  itemPerPage: number;
  actions?: React.ReactNode;
}

function TableLists(props: Props) {
  const {
    className,
    itemPerPage,
    actions,
  } = props;

  const { strings } = useContext(LanguageContext);
  const [activePage, setActivePage] = useState(1);

  const {
    pending,
    response,
  } = useRequest<ListResponse<FlashUpdateTableFields>>({
    // FIXME: update URL
    url: 'api/v2/informal-update/',
    query: {
      limit: itemPerPage,
      offset: itemPerPage * (activePage - 1),
    },
  });

  const columns = useMemo(() => {
    const actionsColumn = createActionColumn(
      'actions',
      (rowKey: number | string, infrl: FlashUpdateTableFields) => ({
        extraActions: (
          <>
            <DropdownMenuItem
              href={`/informal-update/${infrl.id}/`}
              label={strings.projectListTableViewDetails}
              icon={<MdSearch />}
            />
            <DropdownMenuItem
              href={`/informal-update/${infrl.id}/edit/`}
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

  return (

    <div className={_cs(styles.allFlashUpdates, className)}>

      <Container
        className={styles.mainContent}
        heading={strings.flashUpdateAllFlashUpdatePageHeading}
        actions={actions}
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
            {response && (
              <div className={styles.footer}>
                <Pager
                  activePage={activePage}
                  onActivePageChange={setActivePage}
                  itemsCount={response.count}
                  maxItemsPerPage={itemPerPage}
                />
              </div>
            )}
          </>
        )}
      </Container>

    </div>
  );
}

export default TableLists;
