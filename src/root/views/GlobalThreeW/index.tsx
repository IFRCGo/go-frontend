import React, {
  useMemo,
  useContext,
} from 'react';
import { IoAdd } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import Page from '#components/Page';
import { _cs } from '@togglecorp/fujs';
import type { Location } from 'history';

import BlockLoading from '#components/block-loading';
import { useButtonFeatures } from '#components/Button';
import Card from '#components/Card';
import KeyFigure from '#components/KeyFigure';
import Container from '#components/Container';
import BreadCrumb from '#components/breadcrumb';
import ExportProjectsButton from '#components/ExportProjectsButton';
import LanguageContext from '#root/languageContext';
import { useRequest, ListResponse } from '#utils/restRequest';

import {
  ThreeWBarChart,
  ThreeWPieChart,
} from './Charts';
import { NSOngoingProjectStat } from './common';

import Map from './Map';
import Filters, { FilterValue } from './Filters';
import styles from './styles.module.scss';

const emptyNsOngoingProjectStats: NSOngoingProjectStat[] = [];

interface ProjectPerProgrammeType {
  programme_type: number;
  programme_type_display: string;
  count: number;
}

interface ProjectPerSector {
  count: number;
  primary_sector: number;
  primary_sector_display: string;
}

interface ProjectPerSecondarySector {
  count: number;
  secondary_sector: number;
  secondary_sector_display: string;
}

interface GlobalProjectsOverview {
  total_ongoing_projects: number;
  ns_with_ongoing_activities: number;
  target_total: number;
  projects_per_sector: ProjectPerSector[];
  projects_per_programme_type: ProjectPerProgrammeType[];
  projects_per_secondary_sectors: ProjectPerSecondarySector[];
}

interface Props {
  className?: string;
  location: Location;
}

function GlobalThreeW(props: Props) {
  const {
    className,
    location,
  } = props;

  const { strings } = useContext(LanguageContext);

  const [filters, setFilters] = React.useState<FilterValue>({
    reporting_ns: [],
    programme_type: [],
    primary_sector: [],
    secondary_sectors: [],
  });

  const {
    pending: nsProjectsPending,
    response: nsProjectsResponse,
  } = useRequest<ListResponse<NSOngoingProjectStat>>({
    url: 'api/v2/global-project/ns-ongoing-projects-stats/',
    query: {
      ...filters,
    }
  });

  const ongoingProjectStats = nsProjectsResponse?.results ?? emptyNsOngoingProjectStats;

  const {
    pending: projectsOverviewPending,
    response: projectsOverviewResponse,
  } = useRequest<GlobalProjectsOverview>({
    url: 'api/v2/global-project/overview/',
  });

  const numActiveSocieties = projectsOverviewResponse?.ns_with_ongoing_activities;
  const numOngoingProjects = projectsOverviewResponse?.total_ongoing_projects;
  const numTargetedPopulation = projectsOverviewResponse?.target_total;

  const crumbs = useMemo(() => [
    { link: location?.pathname, name: strings.breadCrumbGlobalThreeW },
    { link: '/', name: strings.breadCrumbHome },
  ], [strings.breadCrumbHome, strings.breadCrumbGlobalThreeW, location]);

  const addThreeWLinkProps = useButtonFeatures({
    variant: 'secondary',
    icons: <IoAdd />,
    children: strings.globalThreeWAddProjectButtonLabel,
  });

  const exploreRegional3WLinkProps = useButtonFeatures({
    variant: 'primary',
    children: strings.globalThreeWExploreRegionalButtonLabel,
  });

  const [
    projectPerSectorChartData,
    projectPerSecondarySectorChartData,
    projectPerProgrammeTypeChartData,
  ] = useMemo(() => {
    if (!projectsOverviewResponse) {
      return [[], [], []];
    }

    const {
      projects_per_sector,
      projects_per_secondary_sectors,
      projects_per_programme_type,
    } = projectsOverviewResponse;

    return [
      projects_per_sector.map((p) => ({
        key: p.primary_sector,
        value: p.count,
        name: p.primary_sector_display,
      })),
      projects_per_secondary_sectors.map((p) => ({
        key: p.secondary_sector,
        value: p.count,
        name: p.secondary_sector_display,
      })),
      projects_per_programme_type.map((p) => ({
        key: p.programme_type,
        value: p.count,
        name: p.programme_type_display,
      })),
    ];
  }, [projectsOverviewResponse]);

  return (
    <Page
      className={_cs(styles.globalThreeW, className)}
      title={strings.globalThreeWPageTitle}
      heading={strings.globalThreeWPageHeading}
      actions={(
        <Link
          to="/three-w/new"
          {...addThreeWLinkProps}
        />
      )}
      description={strings.globalThreeWPageDescription}
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
      infoContainerClassName={styles.infoContainer}
      withMainContentBackground
      info={projectsOverviewPending ? (
        <BlockLoading />
      ) : (
        <>
          <Card>
            <KeyFigure
              value={numOngoingProjects}
              description={strings.globalThreeWKeyFigureOngoingProjectsTitle}
              footerIcon={<div className="collecticon-book" />}
              inline
            />
          </Card>
          <Card>
            <KeyFigure
              value={numActiveSocieties}
              description={strings.globalThreeWKeyFigureActiveNSTitle}
              footerIcon={<div className="collecticon-rc-block" />}
              inline
            />
          </Card>
          <Card>
            <KeyFigure
              value={numTargetedPopulation}
              description={strings.globalThreeWKeyTargetedPopulationTitle}
              footerIcon={<div className="collecticon-affected-population" />}
              inline
            />
          </Card>
        </>
      )}
    >
      <Container
        contentClassName={styles.chartsContainer}
      >
        {projectsOverviewPending ? (
          <BlockLoading />
        ) : (
          <>
            <Card
              title={strings.globalThreeWChartProjectPerSectorTitle}
              className={styles.projectPerSectorChart}
            >
              <ThreeWBarChart data={projectPerSectorChartData} />
            </Card>
            <Card
              title={strings.globalThreeWChartProgrammeTypeTitle}
              className={styles.programmeTypeChart}
            >
              <ThreeWPieChart data={projectPerProgrammeTypeChartData} />
            </Card>
            <Card
              title={strings.globalThreeWChartTopTagsTitle}
              className={styles.topTagsChart}
            >
              <ThreeWBarChart
                data={projectPerSecondarySectorChartData}
              />
            </Card>
          </>
        )}
      </Container>
      <Container
        className={styles.nsWithOngoingProjects}
        heading={strings.globalThreeWMapHeading}
        actions={(
          <>
            <ExportProjectsButton
              fileNameSuffix="All 3W Projects"
            />
            <Link
              to="/regions/0#3w"
              {...exploreRegional3WLinkProps}
            />
          </>
        )}
        descriptionClassName={styles.filtersContainer}
        description={(
          <Filters
            disabled={nsProjectsPending}
            value={filters}
            onChange={setFilters}
          />
        )}
      >
        {nsProjectsPending && <BlockLoading className={styles.mapLoading} />}
        <Map projectList={ongoingProjectStats} />
      </Container>
    </Page>
  );
}
export default GlobalThreeW;
