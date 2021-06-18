import React from 'react';
import Page from '#components/Page';
import { _cs } from '@togglecorp/fujs';

import BlockLoading from '#components/block-loading';
import Card from '#components/Card';
import KeyFigure from '#components/KeyFigure';
import Container from '#components/Container';
import BreadCrumb from '#components/breadcrumb';
import ExportProjectsButton from '#components/ExportProjectsButton';
import LanguageContext from '#root/languageContext';
import { useRequest } from '#utils/restRequest';
import { sum } from '#utils/common';

import { GoBarChart, GoPieChart } from './Charts';

import styles from './styles.module.scss';

interface NsProjectsOverviewFields {
  ongoing_projects: number;
  target_total: number;
  society_name: string;
  name: string;
}

interface NsProjectOverview {
  results: NsProjectsOverviewFields[];
}

interface ProgrammePerSector {
  programme_type: number;
  programme_type_display: string;
  count: number;
}

interface GlobalProjectsOverviewFields {
  total_ongoing_projects: number;
  ns_with_ongoing_activities: number;
  target_total: number;
  projects_per_sector: any[];
  projects_per_programme_type: ProgrammePerSector[];
  projects_per_secondary_sectors: any[];
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
  } = useRequest<NsProjectOverview>({
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

  return (
    <Page
      className={_cs(styles.globalThreeW, className)}
      title="IFRC Go - Global 3W Response"
      heading="Global 3W Response"
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
      actions={(
        <ExportProjectsButton
          fileNameSuffix="All projects"
        />
      )}
    >
      {pending ? <BlockLoading /> : (
        <Container>
          {projectsOverviewResponse && <GoPieChart
            heading="Programme Type"
            data={projectsOverviewResponse.projects_per_programme_type} />}

          {projectsOverviewResponse && <GoBarChart
            heading="Project Per Sector"
            data={projectsOverviewResponse.projects_per_sector} />}

          {projectsOverviewResponse && <GoBarChart
            heading="Top Tags"
            data={projectsOverviewResponse.projects_per_secondary_sectors}
          />}
        </Container>
      )}
    </Page>
  );
}
export default GlobalThreeW;
