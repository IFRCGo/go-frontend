import React from 'react';
import {
  _cs,
  isNotDefined,
  unique,
  listToGroupList,
} from '@togglecorp/fujs';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Tooltip,
  Cell,
} from 'recharts';

import Tabs from '#components/Tabs';
import Tab from '#components/Tabs/Tab';
import TabPanel from '#components/Tabs/TabPanel';
import TabList from '#components/Tabs/TabList';
import KeyFigure from '#components/KeyFigure';
import Card from '#components/Card';
import Container from '#components/Container';

import Table, { Column } from '#components/Table';
import {
    createStringColumn,
    createNumberColumn,
} from '#components/Table/predefinedColumns';

import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';

import {
  User,
  Country,
  Project,
} from '#types';

import styles from './styles.module.scss';

export const PROJECT_STATUS_COMPLETED = 2;
export const PROJECT_STATUS_ONGOING = 1;
export const PROJECT_STATUS_PLANNED = 0;

const emptyProjectList: Project[] = [];

const projectTableColumns = [
  createStringColumn<Project, number>(
    'ns',
    'National Society',
    (item) => item.reporting_ns_detail?.society_name,
  ),
  createStringColumn<Project, number>(
    'name',
    'Project Name',
    (item) => item.name,
  ),
  createStringColumn<Project, number>(
    'sector',
    'Sector',
    (item) => item.primary_sector_display,
  ),
  createNumberColumn<Project, number>(
    'budget',
    'Total Budget',
    (item) => item.budget_amount,
    undefined,
    { normal: true }
  ),
  createStringColumn<Project, number>(
    'programmeType',
    'Programme Type',
    (item) => item.programme_type_display,
  ),
  createStringColumn<Project, number>(
    'disasterType',
    'Disaster Type',
    (item) => item.dtype_detail?.name,
  ),
  createNumberColumn<Project, number>(
    'peopleTargeted',
    'People Targeted',
    (item) => item.target_total,
    undefined,
    { normal: true }
  ),
  createNumberColumn<Project, number>(
    'peopleReached',
    'People Reached',
    (item) => item.reached_total,
    undefined,
    { normal: true }
  ),
];

const colors = ['#f5333f', '#f7969c', '#f9e5e6'];
function BasicPieChart(props: { data: LabelValue[] , title: React.ReactNode }) {
  const {
    title,
    data
  } = props;

  return (
    <div className={styles.basicPieChart}>
      <div className={styles.title}>
        { title }
      </div>
      <ResponsiveContainer width='100%' height={108}>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            nameKey='label'
            legendType='circle'
            // startAngle={90}
            // endAngle={450}
          >
            { data.map((entry, i) => {
              return (
                <Cell
                  key={entry.label}
                  fill={colors[i%colors.length]}
                />
              );
            })}
          </Pie>
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Legend
            align='right'
            iconSize={8}
            layout='vertical'
            verticalAlign='middle'
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface LabelValue {
  label: string;
  value: number;
}

interface Props {
  className?: string;
  country: Country | undefined;
}

function ThreeW(props: Props) {
  const {
    className,
    country,
  } = props;

  const {
    pending: fetchingUserDetails,
    response: userDetails,
  } = useRequest<User>({
    url: 'api/v2/user/me/',
  });

  const {
    pending: projectListPending,
    response: projectListResponse,
  } = useRequest<ListResponse<Project>>({
    skip: isNotDefined(country?.iso),
    url: 'api/v2/project/',
    query: {
      limit: 500,
      country: country?.iso,
    },
  });

  const projectList = projectListResponse?.results ?? emptyProjectList;

  const [
    ongoingProjects,
    targetedPopulation,
    ongoingProjectBudget,
    programmeTypeCounts,
    statusCounts,
  ] = React.useMemo(() => {
    const ongoing = projectList.filter((p) => p.status === PROJECT_STATUS_ONGOING);
    const ongoingBudget = ongoing.reduce((acc, val) => acc + (+(val.budget_amount ?? 0)), 0);
    const target = projectList.reduce((acc, val) => acc + (+(val.target_total ?? 0)), 0);
    const programmeTypeGrouped = (
      listToGroupList(
        projectList,
        d => d.programme_type_display,
        d => d,
      ) ?? {}
    );
    const programmeTypeCounts = Object.keys(programmeTypeGrouped).reduce((acc, key) => (
      [...acc, { label: key, value: programmeTypeGrouped[key].length }]
    ), [] as LabelValue[]);

    const statusGrouped = (
      listToGroupList(
        projectList,
        d => d.status_display,
        d => d,
      ) ?? {}
    );
    const statusCounts = Object.keys(statusGrouped).reduce((acc, key) => (
      [...acc, { label: key, value: statusGrouped[key].length }]
    ), [] as LabelValue[]);

    return [
      ongoing,
      target,
      ongoingBudget,
      programmeTypeCounts,
      statusCounts,
    ];
  }, [projectList]);

  const numActiveNS = React.useMemo(() => (
    unique(ongoingProjects, d => d.reporting_ns)?.length ?? 0
  ), [ongoingProjects]);

  const [activeTab, setActiveTab] = React.useState<'projectsIn' | 'nsProjects'>('projectsIn');

  return (
    <div className={_cs(styles.threeW, className)}>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant="secondary"
      >
        <TabList className={styles.tabList}>
          <Tab name="projectsIn">
            Projects in {country?.name}
          </Tab>
          <Tab name="nsProjects">
            {country?.society_name} projects
          </Tab>
        </TabList>
        <TabPanel name="projectsIn">
          <div className={styles.stats}>
            <Card multiColumn>
              <KeyFigure
                value={numActiveNS}
                description="Active National Societies"
              />
              <KeyFigure
                value={targetedPopulation}
                description="Targeted Population"
              />
            </Card>
            <Card multiColumn>
              <KeyFigure
                value={projectList.length}
                description="Total Projects"
              />
              <BasicPieChart
                title="Programme type"
                data={programmeTypeCounts}
              />
            </Card>
            <Card multiColumn>
              <KeyFigure
                value={ongoingProjectBudget}
                description="Total Budget (CHF) for Ongoing Projects"
              />
              <BasicPieChart
                title="Project status"
                data={statusCounts}
              />
            </Card>
          </div>
          <Container
            className={styles.ongoingProject}
            heading="Ongoing projects"
            actions="View All Projects >"
            sub
          >
            <Table
              data={projectList}
              columns={projectTableColumns}
              keySelector={d => d.id}
            />
          </Container>
        </TabPanel>
        <TabPanel name="nsProjects">
          International projects
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default ThreeW;
