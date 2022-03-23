import React from 'react';
import { _cs } from '@togglecorp/fujs';

import {
  MdSearch,
  MdEdit,
} from 'react-icons/md';

import { createActionColumn } from '#components/Table/predefinedColumns';
import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import Pager from '#components/Pager';
import BlockLoading from '#components/block-loading';
import Table from '#components/Table';
import DropdownMenuItem from '#components/DropdownMenuItem';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import {
  EmergencyProjectResponse,
  Project,
} from '#types';
import { getAllProjectColumns } from '#views/Country/ThreeW/projectTableColumns';
import { getColumns as getActivityColumns } from '#views/Emergency/Activities/projectTableColumns';
import { projectKeySelector } from '#views/Country/ThreeW/common';

import styles from './styles.module.scss';

const ITEM_PER_PAGE = 5;

interface Props {
  className?: string;
}

function ThreeWList(props: Props) {
  const {
    className,
  } = props;
  const { strings } = React.useContext(LanguageContext);

  const [projectActivePage, setProjectActivePage] = React.useState(1);
  const [activityActivePage, setActivityActivePage] = React.useState(1);

  const {
    pending: projectPending,
    response: projectResponse,
  } = useRequest<ListResponse<Project>>({
    url: 'api/v2/project/',
    query: {
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (projectActivePage - 1),
    },
  });

  const {
    pending: activityPending,
    response: activityResponse,
  } = useRequest<ListResponse<EmergencyProjectResponse>>({
    url: 'api/v2/emergency-project/',
    query: {
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (activityActivePage - 1),
    },
  });

  const projectColumns = React.useMemo(() => {
    const actionsColumn = createActionColumn(
      'actions',
      (rowKey: number | string, prj: Project) => ({
        extraActions: (
          <>
            <DropdownMenuItem
              href={`/three-w/${prj.id}/`}
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
      ...getAllProjectColumns(strings),
      actionsColumn,
    ];
  }, [strings]);

  const activityColumns = React.useMemo(
    () => getActivityColumns(),
    [],
  );

  const pending = projectPending || activityPending;

  return (
    <Container
      className={_cs(styles.threeWList, className)}
      contentClassName={styles.mainContent}
    >
      {pending && <BlockLoading />}
      {!pending && projectResponse && (
        <Container
          heading="3W Projects"
          footerActions={(
            <Pager
              activePage={projectActivePage}
              onActivePageChange={setProjectActivePage}
              itemsCount={projectResponse.count}
              maxItemsPerPage={ITEM_PER_PAGE}
            />
          )}
          sub
        >
          <Table
            className={styles.projectTable}
            data={projectResponse.results}
            columns={projectColumns}
            keySelector={projectKeySelector}
            variant="large"
          />
        </Container>
      )}
      {!pending && activityResponse && (
        <Container
          heading="Emergency Response 3W Activities"
          footerActions={(
            <Pager
              activePage={activityActivePage}
              onActivePageChange={setActivityActivePage}
              itemsCount={activityResponse.count}
              maxItemsPerPage={ITEM_PER_PAGE}
            />
          )}
          sub
        >
          <Table
            className={styles.activityTable}
            data={activityResponse.results}
            columns={activityColumns}
            keySelector={d => d.id}
            variant="large"
          />
        </Container>
      )}
    </Container>
  );
}

export default ThreeWList;
