import React from 'react';
import {
  _cs,
  isNotDefined,
} from '@togglecorp/fujs';
import { IoPencil } from 'react-icons/io5';

import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';

import {
  EmergencyProjectResponse,
} from '#types';
import Table from '#components/Table';
// import Pager from '#components/Pager';
import Container from '#components/Container';
import { createActionColumn } from '#components/Table/predefinedColumns';
import DropdownMenuItem from '#components/DropdownMenuItem';

import { getColumns } from './projectTableColumns';
import styles from './styles.module.scss';

// const ITEM_PER_PAGE = 10;

interface Props {
  className?: string;
  emergencyId: number;
}

function Activities(props: Props) {
  const {
    className,
    emergencyId,
  } = props;

  // const [activePage, setActivePage] = React.useState(1);

  const {
    response: projectListResponse,
  } = useRequest<ListResponse<EmergencyProjectResponse>>({
    skip: isNotDefined(emergencyId),
    url: 'api/v2/emergency-project/',
    query: {
      // event: emergencyId,
      // limit: ITEM_PER_PAGE,
      // offset: ITEM_PER_PAGE * (activePage - 1),
    },
  });

  const columns = React.useMemo(
    () => [
      ...getColumns(),
      createActionColumn(
        'project_actions',
        (rowKey: number | string, p: EmergencyProjectResponse) => ({
          extraActions: (
            <>
              <DropdownMenuItem
                href={`/emergency-three-w/${rowKey}/edit/`}
                icon={<IoPencil />}
                label="Edit"
              />
            </>
          ),
        })
      ),
    ],
    []
  );

  const projectList = React.useMemo(() => {
    return projectListResponse
      ?.results
      ?.filter(d => String(d.event) === String(emergencyId)) ?? [];
  }, [projectListResponse, emergencyId]);

  return (
    <Container
      className={_cs(styles.activities, className)}
      /*
      footerActions={projectListResponse && (
        <Pager
          activePage={activePage}
          onActivePageChange={setActivePage}
          itemsCount={projectListResponse.count}
          maxItemsPerPage={ITEM_PER_PAGE}
        />
      )}
      */
    >
      <Table
        className={styles.projectsTable}
        data={projectList}
        columns={columns}
        keySelector={d => d.id}
        variant="large"
      />
    </Container>
  );
}

export default Activities;
