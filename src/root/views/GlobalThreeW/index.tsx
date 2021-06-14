import React from 'react';
import Page from '#components/Page';
import { _cs } from '@togglecorp/fujs';

import BlockLoading from '#components/block-loading';
import Container from '#components/Container';
import BreadCrumb from '#components/breadcrumb';
import LanguageContext from '#root/languageContext';
import { useRequest } from '#utils/restRequest';

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

interface GlobalProjectsOverviewFields {
  total_ongoing_projects: number;
  ns_with_ongoing_activities: number;
  target_total: number;
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
    url: `api/v2/global-project/ns-ongoing-projects-stats/`,
  });

  const {
    pending: projectsOverviewPending,
    response: projectsOverviewResponse,
  } = useRequest<GlobalProjectsOverviewFields>({
    url: `api/v2/global-project/overview/`,
  });

  const pending = projectsOverviewPending || nsProjectsPending;

  const { strings } = React.useContext(LanguageContext);

  const crumbs = React.useMemo(() => [
    { link: location?.pathname, name: 'GlobalThreeW' },
    { link: '/', name: strings.breadCrumbHome },
  ], [strings.breadCrumbHome, location]);

  const numTotalProjects = React.useMemo(() => {
    const totalProjects = nsProjectsResponse?.results
    .map((r: NsProjectsOverviewFields) => r.ongoing_projects)
    .reduce((acc, val) => acc + val, 0);

    return totalProjects;
  }, [nsProjectsResponse]);

  const numActiveSocieties = projectsOverviewResponse?.ns_with_ongoing_activities;
  const numOngoingProjects = projectsOverviewResponse?.target_total;

  return (
    <Page
      className={_cs(styles.globalThreeW, className)}
      title="IFRC Go -Global 3W Response"
      heading="Global 3W Response"
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      {pending && <BlockLoading /> }
      <Container>
        <div>
          {numOngoingProjects}
        </div>
        <div>
          {numActiveSocieties}
        </div>
        <div>
          {numTotalProjects}
        </div>
      </Container>
    </Page>
  );
}
export default GlobalThreeW;
