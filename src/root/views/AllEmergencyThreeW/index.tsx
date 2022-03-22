import React from 'react';
import { _cs } from '@togglecorp/fujs';
import type { Location } from 'history';

import { getColumns } from '#views/Emergency/Activities/projectTableColumns';
import BlockLoading from '#components/block-loading';
import Page from '#components/Page';
import Pager from '#components/Pager';
import BreadCrumb from '#components/breadcrumb';
import Container from '#components/Container';
import Table from '#components/Table';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import { EmergencyProjectResponse } from '#types';

import styles from './styles.module.scss';

const ITEM_PER_PAGE = 15;

interface Props {
  className?: string;
  location: Location;
}

function AllThreeW(props: Props) {
  const {
    className,
    location,
  } = props;

  const crumbs = React.useMemo(() => [
    {link: location?.pathname, name: 'All Emergency 3W'},
    {link: '/', name: 'Home'},
  ], [location]);

  const [activePage, setActivePage] = React.useState(1);

  const {
    pending,
    response: projectResponse,
  } = useRequest<ListResponse<EmergencyProjectResponse>>({
    url: 'api/v2/emergency-project/',
    query: {
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (activePage - 1),
    },
  });

  const columns = React.useMemo(
    () => getColumns(),
    [],
  );


  return (
    <Page
      className={_cs(styles.allEmergencyThreeW, className)}
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container
        className={styles.mainContent}
        heading={`All Emergency 3W (${projectResponse?.count ?? '--'})`}
        footerActions={
          projectResponse && (
            <Pager
              activePage={activePage}
              onActivePageChange={setActivePage}
              itemsCount={projectResponse.count}
              maxItemsPerPage={ITEM_PER_PAGE}
            />
          )
        }
      >
        {pending ? (
          <BlockLoading />
        ) : (
          <>
            <Table
              className={styles.projectsTable}
              data={projectResponse?.results}
              columns={columns}
              keySelector={d => d.id}
              variant="large"
            />
          </>
        )}
      </Container>
    </Page>
  );
}

export default AllThreeW;
