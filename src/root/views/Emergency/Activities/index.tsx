import React from 'react';
import {
  _cs,
  isNotDefined,
} from '@togglecorp/fujs';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import BlockLoading from '#components/block-loading';
import EmptyMessage from '#components/EmptyMessage';
import Table from '#components/Table';
import Pager from '#components/Pager';
import Container from '#components/Container';
import Card from '#components/Card';
import KeyFigure from '#components/KeyFigure';
import ThreeWSankey from '#components/ThreeWSankey';
import { useButtonFeatures } from '#components/Button';
import { EmergencyProjectResponse } from '#types';
import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';

import useProjectStats from './useProjectStats';
import StatsPie from './StatsPie';
import ActivityMap from './ActivityMap';
import { getColumns } from './projectTableColumns';
import Filters from './Filters';
import styles from './styles.module.scss';
import ExportButton from "#components/export-button-container";

const ITEM_PER_PAGE = 5;

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

  const linkProps = useButtonFeatures({ variant: 'primary' });

  const [activePage, setActivePage] = React.useState(1);
  const {
    pending: projectListPending,
    response: projectListResponse,
  } = useRequest<ListResponse<EmergencyProjectResponse>>({
    skip: isNotDefined(emergencyId),
    url: 'api/v2/emergency-project/',
    query: {
      event: emergencyId,
      // TODO: paginate and calculate stats in server side
      limit: 100,
      // limit: ITEM_PER_PAGE,
      // offset: ITEM_PER_PAGE * (activePage - 1),
    },
  });

  const [filteredProjectList, setFilteredProjectList] = React.useState<EmergencyProjectResponse[]>([]);

  const {
    projectCountByDistrict,
    uniqueEruCount,
    uniqueNsCount,
    uniqueSectorCount,
    peopleReached,
    projectCountListBySector,
    projectCountListByStatus,
    sectorGroupedProjectList,
    sankeyData,
  } = useProjectStats(
    projectListResponse?.results,
    filteredProjectList,
  );

  const columns = React.useMemo(
    () => getColumns(styles.actionColumn),
    [],
  );

  const projectListDisplay = React.useMemo(() => {
    const offset = ITEM_PER_PAGE * (activePage - 1);
    return filteredProjectList.slice(offset, offset + ITEM_PER_PAGE);
  }, [filteredProjectList, activePage]);

  return (
    <Container
      className={_cs(styles.activities, className)}
      contentClassName={styles.activityContent}
      visibleOverflow
      hideHeaderBorder
      actions={(
        <Link
          to={{
            pathname: '/three-w/new',
            state: {
              operationType: 'response_activity',
            },
          }}
          {...linkProps}
        >
          Add 3W Activity
        </Link>
      )}
    >
      {projectListPending && (
        <BlockLoading />
      )}
      {!projectListPending && !projectListResponse && (
        <EmptyMessage />
      )}
      {!projectListPending && projectListResponse && (
        <>
          <div className={styles.statsContent}>
            <div className={styles.stats}>
              <Card multiColumn>
                <KeyFigure
                  value={uniqueEruCount+uniqueNsCount}
                  description="Active National Societies / ERUs"
                />
                <KeyFigure
                  value={peopleReached}
                  description="Services provided to people in need"  // People Reached
                  title="The figure displayed here is a sum of all individual services or interventions delivered as part of this emergency operation to people in need. Some people may have received more than one service or intervention."
                />
              </Card>
              <Card multiColumn>
                <KeyFigure
                  value={uniqueSectorCount}
                  description="Sectors"
                />
                <StatsPie
                  className={styles.statsPie}
                  data={projectCountListBySector}
                  title="Activity Sectors"
                />
              </Card>
              <Card multiColumn>
                <KeyFigure
                  value={projectListResponse?.count}
                  description="Total Activities"
                />
                <StatsPie
                  className={styles.statsPie}
                  data={projectCountListByStatus}
                  title="Activities Status"
                />
              </Card>
            </div>
            <div className={styles.disclaimer}>
              <IoInformationCircleOutline className={styles.icon} />
              &nbsp;
              The data represents the added projects and may not reflect all of the ongoing projects.
            </div>
          </div>
          <Container
            heading="Response Activities"
            footerActions={projectListResponse && (
              <Pager
                activePage={activePage}
                onActivePageChange={setActivePage}
                itemsCount={filteredProjectList.length}
                maxItemsPerPage={ITEM_PER_PAGE}
              />
            )}
            contentClassName={styles.responseActivityContent}
            visibleOverflow
            sub
          >
            <Filters
              allProjects={projectListResponse?.results}
              onFilterChange={setFilteredProjectList}
            />
            <ActivityMap
              projectCountByDistrict={projectCountByDistrict}
              countryIdList={eventCountryIdList}
              sectorGroupedProjectList={sectorGroupedProjectList}
            />
            <ExportButton filename='emergencyprojects' onlyFromAndSign={true}
              resource={'api/v2/emergency-project/?event=' + props.emergencyId}
            />
            <Table
              className={styles.projectsTable}
              data={projectListDisplay}
              columns={columns}
              keySelector={idSelector}
              variant="large"
            />
          </Container>
          <Container
            heading="Overview of Activities"
            sub
          >
            <ThreeWSankey
              className={styles.sankey}
              data={sankeyData}
            />
          </Container>
        </>
      )}
    </Container>
  );
}

export default Activities;
