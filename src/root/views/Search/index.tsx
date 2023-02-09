import React from 'react';
import { _cs, sum, isDefined } from '@togglecorp/fujs';
import { Redirect } from 'react-router-dom';
import { MdSearch, MdSearchOff } from 'react-icons/md';
import { IoSearch, IoChevronForward, IoChevronBack } from 'react-icons/io5';

import LanguageContext from '#root/languageContext';
import Page from '#components/Page';
import Container from '#components/Container';
import TextInput from '#components/TextInput';
import Button from '#components/Button';
import BlockLoading from '#components/block-loading';
import useInputState from '#hooks/useInputState';
import useDebouncedValue from '#hooks/useDebouncedValue';
import { useRequest } from '#utils/restRequest';
import { getSearchValue } from '#utils/common';
import { URL_SEARCH_KEY } from '#utils/constants';

import EmergencyTable, { EmergencyResult } from './EmergencyTable';
import AppealsTable, { AppealResult } from './AppealsTable';
import FieldReportTable, { FieldReportResponse } from './FieldReportTable';
import ProjectTable, { ProjectResult } from './ProjectTable';
import SurgeAlertTable, { SurgeAlertResult } from './SurgeAlertTable';
import SurgeDeploymentTable, { SurgeDeploymentResult } from './SurgeDeploymentTable';
import CountryList, { CountryResult } from './CountryList';
import RegionList, { RegionResult } from './RegionList';
import ProvinceList, { ProvinceResult } from './ProvinceList';

import styles from './styles.module.scss';

export type SearchResult = {
  countries: CountryResult[];
  appeals: AppealResult[];
  field_reports: FieldReportResponse[];
  projects: ProjectResult[];
  emergencies: EmergencyResult[];
  surge_alerts: SurgeAlertResult[];
  surge_deployments: SurgeDeploymentResult[];
  regions: RegionResult[];
  district_province_response: ProvinceResult[];
}

const MAX_VIEW_PER_SECTION = 5;
type ResultKeys = 'emergencies' | 'appeals' | 'projects' | 'surgeAlerts' | 'surgeDeployments' | 'fieldReports';

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

  const countriesName = searchResponse?.countries;
  const regionsName = searchResponse?.regions;
  const provinceName = searchResponse?.district_province_response;

  const [
    resultsMap,
    componentMap,
    sortedScoreList,
    isEmpty,
  ] = React.useMemo(() => {
    const scoreSelector = (d: { score: number }) => d.score;
    const resultsMap = {
      emergencies: searchResponse?.emergencies ?? [],
      appeals: searchResponse?.appeals ?? [],
      projects: searchResponse?.projects ?? [],
      surgeAlerts: searchResponse?.surge_alerts ?? [],
      surgeDeployments: searchResponse?.surge_deployments ?? [],
      fieldReports: searchResponse?.field_reports ?? [],
    };

    const componentMap: Record<ResultKeys, React.ElementType> = {
      emergencies: EmergencyTable,
      appeals: AppealsTable,
      projects: ProjectTable,
      surgeAlerts: SurgeAlertTable,
      surgeDeployments: SurgeDeploymentTable,
      fieldReports: FieldReportTable,
    };

    const scoreList = (Object.keys(resultsMap) as ResultKeys[]).map((resultKey) => ({
      key: resultKey,
      value: sum(resultsMap[resultKey].slice(0, MAX_VIEW_PER_SECTION).map(scoreSelector)),
    }));

    const sortedScoreList = scoreList.sort((a, b) => a.value - b.value);
    const isEmpty = scoreList.every((score) => resultsMap[score.key].length === 0);

    return [
      resultsMap,
      componentMap, sortedScoreList,
      isEmpty,
    ];
  }, [searchResponse]);

  const ActiveComponent = activeView ? componentMap[activeView] : undefined;
  const redirectSearchString = isDefined(debouncedSearchString) ? `?${URL_SEARCH_KEY}=${window.encodeURI(debouncedSearchString)}` : undefined;
  const currentSearchString = window.location.search;

  return (
    <Page
      className={_cs(styles.search, className)}
      title={strings.threeWPageTitle}
      heading="Search for keyword"
      withMainContentBackground
      description={(
        <TextInput
          icons={<IoSearch />}
          type="search"
          name="search"
          value={searchString}
          onChange={setSearchString}
          placeholder="Enter at least 3 characters"
        />
      )}
    >
      {searchPending && <BlockLoading />}
      {!searchPending && isEmpty && (
        <Container contentClassName={styles.emptySearchContent}>
          {isDefined(debouncedSearchString) && debouncedSearchString.trim().length > 2 ? (
            <>
              <MdSearchOff className={styles.icon} />
              Couldn't find any results for given query!
            </>
          ) : (
            <>
              <MdSearch className={styles.icon} />
              Please enter at least 3 characters to get started with search!
            </>
          )}
        </Container>
      )}
      {redirectSearchString !== currentSearchString && (
        <Redirect
          to={{
            pathname: '/search',
            search: redirectSearchString,
          }}
        />
      )}
      <div className={styles.content}>
        {regionsName && regionsName.length > 0 && (
          <RegionList
            data={regionsName}
            actions={undefined}
          />
        )}
        {countriesName && countriesName.length > 0 && (
          <CountryList
            data={countriesName}
            actions={undefined}
          />
        )}
        {provinceName && provinceName.length > 0 && (
          <ProvinceList
            data={provinceName}
            actions={undefined}
          />
        )}
        {activeView && ActiveComponent && (
          <ActiveComponent
            data={resultsMap[activeView]}
            actions={(
              <Button
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
                  name={score.key}
                  variant="transparent"
                  onClick={setActiveView}
                  actions={<IoChevronForward />}
                >
                  {strings.searchViewAllDocuments}
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
