import React from 'react';
import Page from '#components/Page';
import { _cs } from '@togglecorp/fujs';
import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import BreadCrumb from '#components/breadcrumb';
import {
  useRequest
} from '#utils/restRequest';

import styles from './styles.module.scss';


interface Props {
  className?: string;
  location: Location;
}

interface ProjectOverview {
  target_total?: number | string;
  active_societies?: number | string;
  on_going_projects?: number | string;
}

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

  const [projectOverview, setProjectOverview] = React.useState<ProjectOverview>({ target_total: 'n/a', active_societies: 'n/a', on_going_projects: 'n/a' });

  const crumbs = React.useMemo(() => [
    { link: location?.pathname, name: 'GlobalThreeW' },
    { link: '/', name: strings.breadCrumbHome },
  ], [strings.breadCrumbHome, strings.breadCrumbNewFieldReport, location]);

  React.useEffect(() => {
    if (nsProjectsResponse && projectsOverviewResponse) {
      const totalprojects = nsProjectsResponse.results
        .map((r: NsProjectsOverviewFields) => r.ongoing_projects)
        .reduce((a, b) => a + b, 0);

      const overview: ProjectOverview = {
        target_total: projectsOverviewResponse.target_total,
        active_societies: projectsOverviewResponse.ns_with_ongoing_activities,
        on_going_projects: totalprojects,
      };
      setProjectOverview(overview);
    }
  }, [nsProjectsResponse, projectsOverviewResponse,]);

  return (
    <Page
      title="IFRC Go -Global 3W Response"
      heading="Global 3W Response"
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container>
        <div>
          {projectOverview.on_going_projects}
        </div>
        <div>
          {projectOverview.active_societies}
        </div>
        <div>
          {projectOverview.target_total}
        </div>
      </Container>
    </Page>
  );
}
export default GlobalThreeW;
