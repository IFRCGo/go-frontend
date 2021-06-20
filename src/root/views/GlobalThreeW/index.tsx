import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { IoAdd } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import BlockLoading from '#components/block-loading';
import Page from '#components/Page';
import { useButtonFeatures } from '#components/Button';
import Card from '#components/Card';
import KeyFigure from '#components/KeyFigure';
import Container from '#components/Container';
import BreadCrumb from '#components/breadcrumb';
import ExportProjectsButton from '#components/ExportProjectsButton';
import LanguageContext from '#root/languageContext';
import { useRequest, ListResponse } from '#utils/restRequest';
import { sum } from '#utils/common';

import {
  ThreeWBarChart,
  ThreeWPieChart,
} from './Charts';

import styles from './styles.module.scss';

interface NsProjectsOverviewFields {
  ongoing_projects: number;
  target_total: number;
  society_name: string;
  name: string;
}

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

interface GlobalProjectsOverviewFields {
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
    location
  } = props;

  const {
    pending: nsProjectsPending,
    response: nsProjectsResponse,
  } = useRequest<ListResponse<NsProjectsOverviewFields>>({
    url: 'api/v2/global-project/ns-ongoing-projects-stats/',
  });

  const {
    pending: projectsOverviewPending,
    response: projectsOverviewResponse,
  } = useRequest<GlobalProjectsOverviewFields>({
    url: 'api/v2/global-project/overview/',
  });

  const pending = projectsOverviewPending || nsProjectsPending;

  const { strings } = React.useContext(LanguageContext);

  const crumbs = React.useMemo(() => [
    { link: location?.pathname, name: 'Global 3W' },
    { link: '/', name: strings.breadCrumbHome },
  ], [strings.breadCrumbHome, location]);

  const numTargetedPopulation = React.useMemo(() => (
    sum(nsProjectsResponse?.results ?? [], d => d.target_total)
  ), [nsProjectsResponse]);

  const numActiveSocieties = projectsOverviewResponse?.ns_with_ongoing_activities;
  const numOngoingProjects = projectsOverviewResponse?.target_total;

  const linkProps = useButtonFeatures({
    variant: "secondary",
    icons: <IoAdd />,
    children: "Add 3W Project",
  });

  const projectPerSectorChartData = projectsOverviewResponse?.projects_per_sector.map((p) => ({
    key: p.primary_sector,
    value: p.count,
    name: p.primary_sector_display,
  })) ?? [];

  const projectPerSecondarySectorChartData = projectsOverviewResponse?.projects_per_secondary_sectors
    .map((p) => ({
      key: p.secondary_sector,
      value: p.count,
      name: p.secondary_sector_display,
    })) ?? [];

  const projectPerProgrammeTypeChartData = projectsOverviewResponse?.projects_per_programme_type
    .map((p) => ({
      key: p.programme_type,
      value: p.count,
      name: p.programme_type_display,
    })) ?? [];

  console.info(projectsOverviewResponse?.projects_per_secondary_sectors);

  return (
    <Page
      className={_cs(styles.globalThreeW, className)}
      title="IFRC Go - Global 3W Response"
      heading="Global 3W Response"
      actions={(
        <Link
          to="/three-w/new"
          {...linkProps}
        />
      )}
      description="Description lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ligula sem, tempus et iaculis quis, auctor ut elit. Ut vitae eros quis nunc fringilla ultrices."
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
      infoContainerClassName={styles.infoContainer}
      info={(
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
      {pending ? <BlockLoading /> : (
        <>
          <Container>
            <ExportProjectsButton
              fileNameSuffix="All projects"
            />
          </Container>
          <Container
            contentClassName={styles.chartsContainer}
          >
            <ThreeWBarChart
              className={styles.projectPerSectorChart}
              heading="Project Per Sector"
              data={projectPerSectorChartData}
            />
            <ThreeWPieChart
              className={styles.programmeTypeChart}
              heading="Programme Type"
              data={projectPerProgrammeTypeChartData}
            />
            <ThreeWBarChart
              className={styles.topTagsChart}
              heading="Top Tags"
              data={projectPerSecondarySectorChartData}
            />
          </Container>
        </>
      )}
    </Page>
  );
}
export default GlobalThreeW;
