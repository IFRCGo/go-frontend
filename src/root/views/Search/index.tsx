import React, { useCallback, useMemo } from 'react';
import { _cs, isDefined, mapToList, isNotDefined } from '@togglecorp/fujs';
import { MdSearch, MdSearchOff } from 'react-icons/md';
import { IoSearch, IoChevronForward, IoChevronBack, IoCloseOutline } from 'react-icons/io5';
import LanguageContext from '#root/languageContext';
import Page from '#components/Page';
import Container from '#components/Container';
import ButtonLikeLink from '#components/ButtonLikeLink';
import Button from '#components/Button';
import BlockLoading from '#components/block-loading';
import TextInput from '#components/TextInput';
import useInputState from '#hooks/useInputState';
import { useRequest } from '#utils/restRequest';
import { getSearchValue } from '#utils/common';
import { URL_SEARCH_KEY } from '#utils/constants';
import type { History } from 'history';

import EmergencyTable, { EmergencyResult } from './EmergencyTable';
import EmergencyPlanningTable, { EmergencyPlanningResult } from './EmergencyPlanningTable';
import FieldReportTable, { FieldReportResponse } from './FieldReportTable';
import ProjectTable, { ProjectResult } from './ProjectTable';
import SurgeAlertTable, { SurgeAlertResult } from './SurgeAlertTable';
import SurgeDeploymentTable, { SurgeDeploymentResult } from './SurgeDeploymentTable';
import CountryList, { CountryResult } from './CountryList';
import RegionList, { RegionResult } from './RegionList';
import ProvinceList, { ProvinceResult } from './ProvinceList';
import RapidResponseDeploymentTable, { RapidResponseResult } from './RapidDeploymentTable';

import styles from './styles.module.scss';

export type SearchResult = {
  countries: CountryResult[];
  regions: RegionResult[];
  district_province_response: ProvinceResult[];
  emergency_planning: EmergencyPlanningResult[];
  reports: FieldReportResponse[];
  projects: ProjectResult[];
  emergencies: EmergencyResult[];
  surge_alerts: SurgeAlertResult[];
  surge_deployments: SurgeDeploymentResult[];
  rapid_response_deployments: RapidResponseResult[];
}

const MAX_VIEW_PER_SECTION = 5;
type ResultKeys = 'provinces' | 'regions' | 'countries' | 'emergencies' | 'emergencyPlannings' | 'projects' | 'surgeAlerts' | 'surgeDeployments' | 'fieldReports' | 'rapidResponse';

const feedbackLink = 'https://forms.office.com/pages/responsepage.aspx?id=5Tu1ok5zbE6rDdGE9g_ZF6J45kKES69IsSyDatuGYF1UREdHUFlUWUY1TFg4TUEzNjNINkU1QUVEMi4u';

interface Props {
  className?: string;
  data: SearchResult[] | undefined;
  location: Location,
  history: History,
}

function Search(props: Props) {
  const {
    className,
    location,
    history,
  } = props;
  const urlSearchValue = getSearchValue(URL_SEARCH_KEY, location);

  const [activeView, setActiveView] = React.useState<ResultKeys | undefined>();
  const [searchString, setSearchString] = useInputState<string | undefined>(
    urlSearchValue,
  );

  const { strings } = React.useContext(LanguageContext);
  const handleClearSearchInput = useCallback(() => {
    setSearchString('');
  }, [setSearchString]);

  const viewAllStringMap: Record<ResultKeys, string> = useMemo(() => ({
    provinces: strings.searchViewAllProvince,
    regions: strings.searchViewAllRegions,
    countries: strings.searchViewAllCountries,
    emergencies: strings.searchViewAllEmergencies,
    emergencyPlannings: strings.searchViewAllEmergenciesPlansAndReportingDocuments,
    projects: strings.searchViewAllProjects,
    surgeAlerts: strings.searchViewAllSurgeAlerts,
    surgeDeployments: strings.searchViewAllSurgeDeployments,
    fieldReports: strings.searchViewAllFieldReports,
    rapidResponse: strings.searchViewAllRapidResponseDeployment,
  }), [
    strings.searchViewAllProvince,
    strings.searchViewAllRegions,
    strings.searchViewAllCountries,
    strings.searchViewAllEmergencies,
    strings.searchViewAllEmergenciesPlansAndReportingDocuments,
    strings.searchViewAllProjects,
    strings.searchViewAllSurgeAlerts,
    strings.searchViewAllSurgeDeployments,
    strings.searchViewAllFieldReports,
    strings.searchViewAllRapidResponseDeployment
  ]);

  const {
    pending: searchPending,
    response: searchResponse,
  } = useRequest<SearchResult>({
    url: 'api/v1/search/',
    query: {
      keyword: urlSearchValue,
    },
    skip: isNotDefined(urlSearchValue),
  });

  const [
    resultsMap,
    componentMap,
    sortedScoreList,
    isEmpty,
  ] = React.useMemo(() => {
    const resultsMap = {
      regions: searchResponse?.regions ?? [],
      countries: searchResponse?.countries ?? [],
      provinces: searchResponse?.district_province_response ?? [],
      emergencies: searchResponse?.emergencies ?? [],
      emergencyPlannings: searchResponse?.emergency_planning ?? [],
      projects: searchResponse?.projects ?? [],
      surgeAlerts: searchResponse?.surge_alerts ?? [],
      surgeDeployments: searchResponse?.surge_deployments ?? [],
      fieldReports: searchResponse?.reports ?? [],
      rapidResponse: searchResponse?.rapid_response_deployments ?? [],
    };

    const componentMap: Record<ResultKeys, React.ElementType> = {
      regions: RegionList,
      countries: CountryList,
      provinces: ProvinceList,
      emergencies: EmergencyTable,
      emergencyPlannings: EmergencyPlanningTable,
      projects: ProjectTable,
      surgeAlerts: SurgeAlertTable,
      surgeDeployments: SurgeDeploymentTable,
      fieldReports: FieldReportTable,
      rapidResponse: RapidResponseDeploymentTable,
    };

    const tableScoreList = mapToList(
      resultsMap,
      (item, key) => ({
        key: key as ResultKeys,
        totalItems: item.length,
        value: Math.max(0, ...(item.map((i) => i.score))),
      }),
    );

    const keysOrdering: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in ResultKeys]: number
    } = {
      regions: 0,
      countries: 1,
      provinces: 2,
      emergencies: 3,
      emergencyPlannings: 3,
      projects: 3,
      surgeAlerts: 3,
      surgeDeployments: 3,
      fieldReports: 3,
      rapidResponse: 3,
    };
    const sortedScoreList = tableScoreList.sort((a, b) => (
      keysOrdering[a.key] - keysOrdering[b.key] || b.value - a.value
    ));

    const isEmpty = searchResponse && tableScoreList.every((score) => score.totalItems === 0);

    return [
      resultsMap,
      componentMap,
      sortedScoreList,
      isEmpty,
    ];
  }, [searchResponse]);

  const ActiveComponent = activeView ? componentMap[activeView] : undefined;

  const handleSearchInputEnter = useCallback(() => {
    if ((searchString?.trim()?.length ?? 0) > 2) {
      history.push(`/search/?keyword=${searchString}`);
    }
  }, [searchString, history]);

  return (
    <Page
      className={_cs(styles.search, className)}
      title={strings.searchIfrcSearchTitle}
      heading="Search for keyword"
      withMainContentBackground
      description={(
        <div className={styles.feedbackSection}>
          <TextInput
            className={styles.inputSection}
            icons={<IoSearch />}
            variant='general'
            actions={searchString && (
              <Button
                name={undefined}
                variant="action"
                onClick={handleClearSearchInput}
              >
                <IoCloseOutline />
              </Button>
            )}
            name="search"
            value={searchString}
            onChange={setSearchString}
            placeholder="Enter at least 3 characters"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchInputEnter();
              }
            }}
          />
          <div className={styles.feedback}>
            <div className={styles.feedbackText}>
              Search is new to GO. Can't find what you're looking for?
              &nbsp;
            </div>
            <ButtonLikeLink
              variant="primary"
              to={feedbackLink}
            >
              Please let us know
            </ButtonLikeLink>
          </div>
        </div>
      )}
    >
      {searchPending && <Container><BlockLoading /></Container>}
      {!searchPending && isEmpty && (
        <Container contentClassName={styles.emptySearchContent}>
          {isDefined(searchString) && searchString.trim().length > 2 ? (
            <>
              <MdSearchOff className={styles.icon} />
              {strings.searchResultforQuery}
            </>
          ) : (
            <>
              <MdSearch className={styles.icon} />
              {strings.searchThreeCharactersRequired}
            </>
          )}
        </Container>
      )}
      <div className={styles.content}>
        {activeView && ActiveComponent && (
          <ActiveComponent
            data={resultsMap[activeView]}
            actions={(
              <Button
                className={styles.viewAll}
                name={undefined}
                variant="transparent"
                onClick={setActiveView}
                icons={<IoChevronBack />}
              >
                {strings.searchGoBack}
              </Button>
            )}
          />
        )}
        {!activeView && sortedScoreList.map((score) => {
          const Component = componentMap[score.key];
          const data = resultsMap[score.key];

          if (data.length === 0) {
            return null;
          }

          const truncatedData = data.slice(0, MAX_VIEW_PER_SECTION);

          return (
            <Component
              key={score.key}
              data={truncatedData}
              actions={data.length > MAX_VIEW_PER_SECTION && (
                <Button
                  className={styles.viewAll}
                  name={score.key}
                  variant="transparent"
                  onClick={setActiveView}
                  actions={<IoChevronForward />}
                >
                  {viewAllStringMap[score.key]}
                </Button>
              )}
            />
          );
        })}
      </div>
    </Page>
  );
}

export default Search;
