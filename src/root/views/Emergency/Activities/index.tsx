import React from 'react';
import {
  _cs,
  isNotDefined,
} from '@togglecorp/fujs';
import {
  IoPencil,
  IoCopy,
  IoOpenOutline,
} from 'react-icons/io5';

import Table from '#components/Table';
import Pager from '#components/Pager';
import Container from '#components/Container';
import DropdownMenuItem from '#components/DropdownMenuItem';
import { createActionColumn } from '#components/Table/predefinedColumns';
import { EmergencyProjectResponse } from '#types';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';

import ActivityMap from './ActivityMap';
import { getColumns } from './projectTableColumns';
import styles from './styles.module.scss';

const ITEM_PER_PAGE = 10;

const idSelector = (d: {id: number}) => d.id;

interface Props {
  className?: string;
  emergencyId: number;
  eventCountryIdList: number[];
}

function Activities(props: Props) {
  const {
    className,
    emergencyId,
    eventCountryIdList,
  } = props;

  const [activePage, setActivePage] = React.useState(1);
  const {
    response: projectListResponse,
  } = useRequest<ListResponse<EmergencyProjectResponse>>({
    skip: isNotDefined(emergencyId),
    url: 'api/v2/emergency-project/',
    query: {
      event: emergencyId,
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (activePage - 1),
    },
  });

  const projectCountByDistrict = React.useMemo(() => {
    const districtList = projectListResponse?.results.map((c) => c.districts).flat(1) ?? [];
    return districtList.reduce((acc, val) => {
      const newAcc = {...acc};
      if (!newAcc[val]) {
        newAcc[val] = 0;
      }

      newAcc[val] += 1;
      return newAcc;
    }, {} as Record<number, number>);
  }, [projectListResponse]);

  const columns = React.useMemo(
    () => [
      ...getColumns(),
      createActionColumn(
        'project_actions',
        (rowKey: number | string, p: EmergencyProjectResponse) => ({
          extraActions: (
            <>
              <DropdownMenuItem
                href={`/emergency-three-w/${rowKey}/`}
                icon={<IoOpenOutline />}
                label="View Details"
              />
              <DropdownMenuItem
                href={`/emergency-three-w/${rowKey}/edit/`}
                icon={<IoPencil />}
                label="Edit"
              />
              <DropdownMenuItem
                href={`/three-w/new/`}
                icon={<IoCopy />}
                label="Duplicate"
                state={{
                  initialValue: p,
                  operationType: 'emergency_response',
                }}
              />
            </>
          ),
        })
      ),
    ],
    []
  );

  return (
    <Container
      className={_cs(styles.activities, className)}
      footerActions={projectListResponse && (
        <Pager
          activePage={activePage}
          onActivePageChange={setActivePage}
          itemsCount={projectListResponse.count}
          maxItemsPerPage={ITEM_PER_PAGE}
        />
      )}
      contentClassName={styles.content}
    >
      <ActivityMap
        projectCountByDistrict={projectCountByDistrict}
        countryIdList={eventCountryIdList}
      />
      <Table
        className={styles.projectsTable}
        data={projectListResponse?.results}
        columns={columns}
        keySelector={idSelector}
        variant="large"
      />
    </Container>
  );
}

export default Activities;
