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

import Map from './Map';
import Filters, { FilterValue } from './Filters';
import styles from './styles.module.scss';

interface NSOngoingProjectStat {
  id: number;
  iso3: string;
  ongoing_projects: number;
  target_total: number;
  society_name: string;
  name: string;
  projects_per_sector: {
    primary_sector: number;
    primary_sector_display: string;
    count: number;
  }[];
}

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
    { link: location?.pathname, name: 'Global 3W' },
    { link: '/', name: strings.breadCrumbHome },
  ], [strings.breadCrumbHome, location]);

  const addThreeWLinkProps = useButtonFeatures({
    variant: 'secondary',
    icons: <IoAdd />,
    children: 'Add 3W Project',
  });

  const exploreRegional3WLinkProps = useButtonFeatures({
    variant: 'primary',
    children: 'Explore Regional 3W',
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
      title="IFRC Go - Global 3W Response"
      heading="Global 3W Response"
      actions={(
        <Link
          to="/three-w/new"
          {...addThreeWLinkProps}
        />
      )}
      description="Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ligula sem, tempus et iaculis quis, auctor ut elit. Ut vitae eros quis nunc fringilla ultrices."
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
              description="Ongoing Projects"
              footerIcon={<div className="collecticon-book" />}
              inline
            />
          </Card>
          <Card>
            <KeyFigure
              value={numActiveSocieties}
              description="Active National Societies"
              footerIcon={<div className="collecticon-rc-block" />}
              inline
            />
          </Card>
          <Card>
            <KeyFigure
              value={numTargetedPopulation}
              description="Targeted Population"
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
              title="Project Per Sector"
              className={styles.projectPerSectorChart}
            >
              <ThreeWBarChart data={projectPerSectorChartData} />
            </Card>
            <Card
              className={styles.programmeTypeChart}
              title="Programme Type"
            >
              <ThreeWPieChart data={projectPerProgrammeTypeChartData} />
            </Card>
            <Card
              className={styles.topTagsChart}
              title="Top Tags"
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
        heading="NS with ongoing projects"
        actions={(
          <>
            <ExportProjectsButton
              label="Export"
              fileNameSuffix="All projects"
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
