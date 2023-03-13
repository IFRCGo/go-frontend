import React, { useCallback, useMemo } from 'react';
import { _cs, isDefined, mapToList } from '@togglecorp/fujs';
import { MdSearch, MdSearchOff } from 'react-icons/md';
import { IoSearch, IoChevronForward, IoChevronBack } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import LanguageContext from '#root/languageContext';
import Page from '#components/Page';
import Container from '#components/Container';
import Button from '#components/Button';
import BlockLoading from '#components/block-loading';
import useInputState from '#hooks/useInputState';
import useDebouncedValue from '#hooks/useDebouncedValue';
import { useRequest } from '#utils/restRequest';
import { getSearchValue } from '#utils/common';
import { URL_SEARCH_KEY } from '#utils/constants';

import EmergencyTable, { EmergencyResult } from './EmergencyTable';
import EmergencyPlanningTable, { EmergencyPlanningResult } from './EmergencyPlanningTable';
import FieldReportTable, { FieldReportResponse } from './FieldReportTable';
import ProjectTable, { ProjectResult } from './ProjectTable';
import SurgeAlertTable, { SurgeAlertResult } from './SurgeAlertTable';
import SurgeDeploymentTable, { SurgeDeploymentResult } from './SurgeDeploymentTable';
import CountryList, { CountryResult } from './CountryList';
import RegionList, { RegionResult } from './RegionList';
import ProvinceList, { ProvinceResult } from './ProvinceList';

import styles from './styles.module.scss';
import SearchInput from '#components/SearchInput';

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
}

const MAX_VIEW_PER_SECTION = 5;
type ResultKeys = 'provinces' | 'regions' | 'countries' | 'emergencies' | 'emergencyPlannings' | 'projects' | 'surgeAlerts' | 'surgeDeployments' | 'fieldReports';

interface Props {
  className?: string;
  data: SearchResult[] | undefined;
}

function Search(props: Props) {
  const { className } = props;
  const urlSearchValue = getSearchValue(URL_SEARCH_KEY);

  const [activeView, setActiveView] = React.useState<ResultKeys | undefined>();
  const [searchString, setSearchString] = useInputState<string | undefined>(
    getSearchValue(URL_SEARCH_KEY)
  );

  const { strings } = React.useContext(LanguageContext);
  const debouncedSearchString = useDebouncedValue(
    searchString?.trim(),
    500,
  );

  const handleSearchInputChange = useCallback((debouncedSearchString) => {
    setSearchString(debouncedSearchString.target.value);
  }, []);
  const handleClearSearchInput = useCallback(() => {
    setSearchString('');
  }, []);

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
  ]);

  React.useEffect(() => {
    setSearchString(urlSearchValue);
  }, [urlSearchValue, setSearchString]);

  const shouldSendSearchRequest = debouncedSearchString && debouncedSearchString.length > 2;
  const {
    pending: searchPending,
    response: searchResponse,
  } = useRequest<SearchResult>({
    skip: !shouldSendSearchRequest,
    url: 'api/v1/search/',
    query: {
      keyword: debouncedSearchString,
    }
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
    };
    const sortedScoreList = tableScoreList.sort((a, b) => (
      keysOrdering[a.key] - keysOrdering[b.key] || b.value - a.value
    ));

    const isEmpty = tableScoreList.every((score) => score.totalItems === 0);

    return [
      resultsMap,
      componentMap,
      sortedScoreList,
      isEmpty,
    ];
  }, [searchResponse]);

  const ActiveComponent = activeView ? componentMap[activeView] : undefined;
  const redirectSearchString = isDefined(debouncedSearchString) ? `?${URL_SEARCH_KEY}=${window.encodeURI(debouncedSearchString)}` : undefined;

  return (
    <Page
      className={_cs(styles.search, className)}
      title={strings.searchIfrcSearchTitle}
      heading="Search for keyword"
      withMainContentBackground
      description={(
        <div className={styles.reset}>
          <SearchInput
            className={styles.inputSection}
            icons={<IoSearch />}
            type="search"
            name="search"
            value={searchString}
            onChange={setSearchString}
            placeholder="Enter at least 3 characters"
          />
          {debouncedSearchString &&
            <button
              className={styles.resetButton}
              onChange={handleSearchInputChange}
            >
              {<MdOutlineCancel
                size={16}
                onClick={handleClearSearchInput}
              />}
            </button>
          }
        </div>
      )}
    >
      {searchPending && <BlockLoading />}
      {!searchPending && isEmpty && (
        <Container contentClassName={styles.emptySearchContent}>
          {isDefined(debouncedSearchString) && debouncedSearchString.trim().length > 2 ? (
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
            <Container key={score.key}>
              <Component
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
            </Container>
          );
        })}
      </div>
    </Page>
  );
}

export default Search;
