import React from 'react';
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
  _cs,
  isDefined,
  isNotDefined,
  unique,
  listToGroupList,
  mapToList,
} from '@togglecorp/fujs';
import {
  IoChevronForward,
  IoLockClosed,
} from 'react-icons/io5';

import BlockLoading from '#components/block-loading';
import Button, { useButtonFeatures } from '#components/Button';
import Translate from '#components/Translate';
import KeyFigure from '#components/KeyFigure';
import Card from '#components/Card';
import Container from '#components/Container';
import ExportProjectsButton from '#components/ExportProjectsButton';
import ExpandableContainer from '#components/ExpandableContainer';
import Table from '#components/Table';
import { createActionColumn } from '#components/Table/predefinedColumns';
import LanguageContext from '#root/languageContext';
import useReduxState from '#hooks/useReduxState';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import {
  sum,
  denormalizeList,
} from '#utils/common';
import {
  Country,
  Project,
  District,
} from '#types';

import ProjectFormModal from '../ProjectFormModal';
import ProjectTableActions from '../ProjectTableActions';
import ProjectStatPieChart from '../ProjectStatPieChart';
import ProjectFlowSankey from '../ProjectFlowSankey';
import { inCountryProjectColumns } from '../projectTableColumns';
import {
  LabelValue,
  emptyProjectList,
  PROJECT_STATUS_ONGOING,
  projectKeySelector,
  projectListToInCountrySankeyData,
  filterProjects,
} from '../common';
import Map from './Map';
import Filters, { FilterValue } from './Filters';
import SankeyFilters, { SankeyFilterValue } from './SankeyFilters';

import styles from './styles.module.scss';

const emptyDistrictList: District[] = [];
const history = createBrowserHistory();

interface Props {
  country: Country | undefined;
  className?: string;
  projectsUpdatedOn?: number | undefined;
}

function InCountryProjects(props: Props) {
  const {
    country,
    className,
    projectsUpdatedOn,
  } = props;

  const { strings } = React.useContext(LanguageContext);
  const user = useReduxState('me');
  const isLoggedIn = !!user.data.id;

  const [filters, setFilters] = React.useState<FilterValue>({
    reporting_ns: [],
    project_districts: [],
    operation_type: [],
    programme_type: [],
    primary_sector: [],
    secondary_sectors: [],
  });

  const [sankeyFilters, setSankeyFilters] = React.useState<SankeyFilterValue>({
    reporting_ns: [],
    primary_sector: [],
    secondary_sectors: [],
  });

  const {
    pending: projectListPending,
    response: projectListResponse,
    retrigger: retriggerProjectListRequest,
  } = useRequest<ListResponse<Project>>({
    skip: isNotDefined(country?.iso),
    url: 'api/v2/project/',
    query: {
      limit: 500,
      country: country?.iso,
    },
  });

  const {
    response: districtListResponse,
  } = useRequest<ListResponse<District>>({
    skip: !country?.id,
    url: 'api/v2/district/',
    query: {
      country: country?.id,
      limit: 200,
    },
  });

  const districtList = districtListResponse?.results ?? emptyDistrictList;

  React.useEffect(() => {
    if (projectsUpdatedOn) {
      retriggerProjectListRequest();
    }
  }, [projectsUpdatedOn, retriggerProjectListRequest]);

  const [projectIdToEdit, setProjectIdToEdit] = React.useState<number | undefined>();
  const projectList = projectListResponse?.results ?? emptyProjectList;
  const filteredProjectList = filterProjects(projectList, filters);

  const [
    ongoingProjects,
    targetedPopulation,
    ongoingProjectBudget,
    programmeTypeCounts,
    statusCounts,
  ] = React.useMemo(() => {
    const ongoing = filteredProjectList.filter((p) => p.status === PROJECT_STATUS_ONGOING);
    const ongoingBudget = sum(ongoing, d => (d.budget_amount ?? 0));
    const target = sum(filteredProjectList, d => (d.target_total ?? 0));
    const programmeTypeGrouped = (
      listToGroupList(
        filteredProjectList,
        d => d.programme_type_display,
        d => d,
      ) ?? {}
    );

    const programmeTypeCounts: LabelValue[] = mapToList(
      programmeTypeGrouped,
      (d, k) => ({ label: String(k), value: d.length })
    );

    const statusGrouped = (
      listToGroupList(
        filteredProjectList,
        d => d.status_display,
        d => d,
      ) ?? {}
    );

    const statusCounts: LabelValue[] = mapToList(
      statusGrouped,
      (d, k) => ({ label: String(k), value: d.length }),
    );

    return [
      ongoing,
      target,
      ongoingBudget,
      programmeTypeCounts,
      statusCounts,
    ];
  }, [filteredProjectList]);

  const numActiveNS = React.useMemo(() => (
    unique(ongoingProjects, d => d.reporting_ns)?.length ?? 0
  ), [ongoingProjects]);

  const tableColumns = React.useMemo(() => ([
    ...inCountryProjectColumns,
    createActionColumn(
      'actions',
      (rowKey: number | string, prj: Project) => ({
        children: (
          <ProjectTableActions
            onProjectFormSubmitSuccess={retriggerProjectListRequest}
            onProjectDeletionSuccess={retriggerProjectListRequest}
            project={prj}
          />
        ),
      }),
    ),
  ]), [retriggerProjectListRequest]);

  const currentProjectList = ongoingProjects;

  const sankeyData = React.useMemo(() => (
    projectListToInCountrySankeyData(
      filterProjects(
        projectList,
        sankeyFilters,
      ),
    )
  ), [sankeyFilters, projectList]);

  const districtGroupedProject = React.useMemo(() => {
    const districtDenormalizedProjectList = denormalizeList(
      currentProjectList ?? [],
      (p) => p.project_districts_detail,
      (p, d) => ({
        ...p,
        project_district: d,
      }),
    );

    return listToGroupList(
      districtDenormalizedProjectList,
      d => d.project_district.id,
    );
  }, [currentProjectList]);

  const [
    localNSProjects,
    otherNSProjects,
  ] = React.useMemo(() => ([
    currentProjectList.filter(d => d.reporting_ns === d.project_country),
    currentProjectList.filter(d => d.reporting_ns !== d.project_country),
  ]), [currentProjectList]);

  const bottomLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.threeWLoginMessage,
    actions: <IoLockClosed />,
  });

  const viewAllProjectLinkProps = useButtonFeatures({
    variant: 'tertiary',
    actions: <IoChevronForward />,
    children: strings.threeWViewAllProjectsLabel,
  });

  return (
    <div className={_cs(styles.inCountryProjects, className)}>
      { projectListPending ? (
        <BlockLoading />
      ) : (
        <>
          <div className={styles.stats}>
            <Card multiColumn>
              <KeyFigure
                value={numActiveNS}
                description={strings.threeWKeyFigureActiveNSTitle}
              />
              <KeyFigure
                value={targetedPopulation}
                description={strings.threeWKeyFigureTargetedPopulationTitle}
              />
            </Card>
            <Card multiColumn>
              <KeyFigure
                value={projectList.length}
                description={strings.threeWKeyFigureTotalProjectsTitle}
              />
              <ProjectStatPieChart
                title={strings.threeWKeyFigureProgrammeTypeTitle}
                data={programmeTypeCounts}
              />
            </Card>
            <Card multiColumn>
              <KeyFigure
                value={ongoingProjectBudget}
                description={strings.threeWKeyFigureOngoingProjectBudgetTitle}
              />
              <ProjectStatPieChart
                title={strings.threeWKeyFigureStatusTitle}
                data={statusCounts}
              />
            </Card>
          </div>
          {!isLoggedIn && (
            <div className={styles.topLoginInfo}>
              <Translate
                stringId="threeWTopNoLoginMessage"
                params={{
                  loginLink: (
                    <Link
                      className={styles.link}
                      to={{
                        pathname: '/login',
                        state: { from: history.location }
                      }}
                    >
                      <Translate stringId='userMenuLogin'/>
                    </Link>
                  ),
                }}
              />
            </div>
          )}
          <Container
            className={styles.ongoingProject}
            heading={strings.threeWOngoingProjectsTitle}
            actions={(
              <>
                <ExportProjectsButton
                  countryId={country?.id}
                  fileNameSuffix={country?.name}
                />
                <Link
                  to={`/three-w/all/?country=${country?.iso}`}
                  {...viewAllProjectLinkProps}
                />
              </>
            )}
            sub
          >
            <Filters
              value={filters}
              onChange={setFilters}
              districtList={districtList}
            />
            <div className={styles.mapSection}>
              <Map
                className={styles.map}
                projectList={currentProjectList}
                countryId={country?.id}
              />
              <Container
                className={styles.mapDetails}
                heading={strings.threeWInCountryMapSidebarTitle}
                contentClassName={styles.content}
                innerContainerClassName={styles.innerContainer}
                sub
              >
                {Object.values(districtGroupedProject).map((pl) => {
                  if (!pl || pl.length === 0) {
                    return null;
                  }

                  const d0 = pl[0].project_district;

                  if (isNotDefined(d0.id)) {
                    return (
                      <ExpandableContainer
                        key="others"
                        heading={(
                          <Translate
                            stringId="threeWInCountryOtherProjectsText"
                            params={{ numProjects: pl.length }}
                          />
                        )}
                        headingSize="small"
                        initiallyExpanded
                        sub
                      >
                        {pl.map((project) => (
                          <div
                            key={project.id}
                            className={styles.projectDetailItem}
                          >
                            <div className={styles.name}>
                              {project.name}
                            </div>
                            <Button
                              name={project.id}
                              variant="tertiary"
                              className={styles.actions}
                              onClick={setProjectIdToEdit}
                            >
                              { strings.threeWInCountryAddProvinceButtonLabel }
                            </Button>
                          </div>
                        ))}
                      </ExpandableContainer>
                    );
                  }

                  return (
                    <ExpandableContainer
                      key={d0.id}
                      heading={(
                        <Translate
                          stringId="threeWInCountryProvinceProjectsText"
                          params={{
                            provinceName: d0.name,
                            numProjects: pl.length,
                          }}
                        />
                      )}
                      headingSize="small"
                      sub
                    >
                      {pl.map((project) => (
                        <div
                          key={project.id}
                          className={styles.projectDetailItem}
                        >
                          <div className={styles.name}>
                            {project.name}
                          </div>
                          <ProjectTableActions
                            className={styles.actions}
                            project={project}
                            onProjectFormSubmitSuccess={retriggerProjectListRequest}
                            onProjectDeletionSuccess={retriggerProjectListRequest}
                          />
                        </div>
                      ))}
                    </ExpandableContainer>
                  );
                })}
              </Container>
            </div>
            <ExpandableContainer
              className={styles.projectsTableContainer}
              heading={(
                <Translate
                  stringId="threeWInCountryTableLocalTitle"
                  params={{ numProjects: localNSProjects.length }}
                />
              )}
              headingSize="small"
              sub
              initiallyExpanded={localNSProjects.length > 0}
            >
              <Table
                className={styles.projectsTable}
                data={localNSProjects}
                columns={tableColumns}
                keySelector={projectKeySelector}
                variant="large"
              />
            </ExpandableContainer>
            <ExpandableContainer
              className={styles.projectsTableContainer}
              heading={(
                <Translate
                  stringId="threeWInCountryTableOtherNSTitle"
                  params={{ numProjects: otherNSProjects.length }}
                />
              )}
              headingSize="small"
              sub
              initiallyExpanded={localNSProjects.length === 0 && otherNSProjects.length > 0}
            >
              <Table
                className={styles.projectsTable}
                data={otherNSProjects}
                columns={tableColumns}
                keySelector={projectKeySelector}
                variant="large"
              />
            </ExpandableContainer>
          </Container>
          <Container
            heading={strings.threeWSankeyDiagramTitle}
            sub
          >
            <SankeyFilters
              value={sankeyFilters}
              onChange={setSankeyFilters}
            />
            <ProjectFlowSankey data={sankeyData} />
          </Container>
          {isDefined(projectIdToEdit) && (
            <ProjectFormModal
              projectId={projectIdToEdit}
              onCloseButtonClick={setProjectIdToEdit}
              onSubmitSuccess={retriggerProjectListRequest}
            />
          )}
        </>
      )}
      {!isLoggedIn && (
        <div className={styles.bottomLoginInfo}>
          <Link
            {...bottomLinkProps}
            to={{
              pathname: '/login',
              state: { from: history.location }
            }}
          />
          { strings.threeWBottomNoLoginMessage }
        </div>
      )}
    </div>
  );
}

export default InCountryProjects;
