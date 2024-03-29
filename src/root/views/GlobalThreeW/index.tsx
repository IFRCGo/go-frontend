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
import BreadCrumb from '#components/breadcrumb';
import Card from '#components/Card';
import Container from '#components/Container';
import DropdownMenu from '#components/dropdown-menu';
import DropdownMenuItem from '#components/DropdownMenuItem';
import ExportProjectsButton from '#components/ExportProjectsButton';
import KeyFigure from '#components/KeyFigure';
import Translate from '#components/Translate';
import { useButtonFeatures } from '#components/Button';
import LanguageContext from '#root/languageContext';
import { useRequest, ListResponse } from '#utils/restRequest';
import useReduxState from '#hooks/useReduxState';
import store from '#utils/store';

import {
  ThreeWBarChart,
  ThreeWPieChart,
} from './Charts';
import { NSOngoingProjectStat } from './common';

import Map from './Map';
import Filters, { FilterValue } from './Filters';
import styles from './styles.module.scss';

const emptyNsOngoingProjectStats: NSOngoingProjectStat[] = [];
const currentLanguage = store.getState().lang.current;

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
  secondary_sectors_display: string;
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

  const allRegions = useReduxState('allRegions');

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
        name: p.secondary_sectors_display,
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
      wikiLink={(
        strings.wikiJsLinkGlobal3W !== undefined && strings.wikiJsLinkGlobal3W.length>0 ?  
        <>
          <a href={strings.wikiJsLinkGOWiki+'/'+currentLanguage +'/'+ strings.wikiJsLinkGlobal3W} title='GO Wiki' target='_blank' ><img className='' src='/assets/graphics/content/wiki-help-section.svg' alt='IFRC GO logo'/></a>
        </>:null      
      )}
      actions={(
        <Link
          to="/three-w/new"
          {...addThreeWLinkProps}
        /> 
      )}
      description={(
        <>
          <p>
            {strings.globalThreeWPageDescriptionP1}
          </p>
          <p>
            <Translate
              stringId="globalThreeWPageDescriptionP2"
              params={{
                contactLink: (
                  <a
                    href="mailto:im@ifrc.org"
                  >
                    IM@ifrc.org
                  </a>
                ),
              }}
            />
          </p>
        </>

      )}
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
            >
              <ThreeWBarChart data={projectPerSectorChartData} />
            </Card>
            <Card
              title={strings.globalThreeWChartProgrammeTypeTitle}
            >
              <ThreeWPieChart data={projectPerProgrammeTypeChartData} />
            </Card>
            <Card
              title={strings.globalThreeWChartTopTagsTitle}
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
        contentClassName={styles.mapContent}
        actions={(
          <>
            <ExportProjectsButton
              fileNameSuffix="All 3W Projects"
            />
            {(allRegions?.data?.results?.length ?? 0) > 0 && (
              <DropdownMenu
                label={<div {...exploreRegional3WLinkProps} />}
              >
                {allRegions.data.results.map((region) => (
                  <DropdownMenuItem
                    key={region.id}
                    label={region.region_name}
                    href={`/regions/${region.id}`}
                    hash="#3w"
                  />
                ))}
              </DropdownMenu>
            )}
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
        <div className={styles.ppp}>
          <h1  className={styles.pppTitle}>{strings.PPPMapTitle}</h1>
          <p className={styles.pppDescription}>{strings.PPPMapDescription}</p>
          <div className={styles.ppp1}>
            <div className={styles.ppp2}>
            <iframe
                className={styles.pppIframe}
                src="https://public.tableau.com/views/PPPdashboard_16805965348010/1_OVERVIEW?:language=en-US&:display_count=n&:origin=viz_share_link?:embed=yes&:display_count=yes&:showVizHome=no&:toolbar=yes"
            >
            </iframe>
            </div>
          </div>
        </div>
      </Container>
    </Page>
  );
}
export default GlobalThreeW;
