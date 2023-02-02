import React, { useState } from 'react';

import { _cs, sum } from '@togglecorp/fujs';
import { useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import Page from '#components/Page';
import Container from '#components/Container';
import TextInput from '#components/TextInput';
import Button from '#components/Button';
import BlockLoading from '#components/block-loading';
import useInputState from '#hooks/useInputState';
import useDebouncedValue from '#hooks/useDebouncedValue';

import EmergencyTable from './EmergencyTable';
import AppealsTable from './AppealsTable';
import FieldReportTable from './FieldReportTable';
import ProjectTabel from './ProjectTable';
import SurgeAlertTable from './SurgeAlertTable';
import SurgeDeployementTable from './SurgeDeployementTable';
import CountryList, { CountryResult } from './CountryList';

import styles from './styles.module.scss';

export interface Appeal {
  id: number;
  name: string;
  appeal_type: string;
  code: string;
  country: string;
  start_date: string;
  score: number;
}

export interface Emergency {
  id: number;
  disaster_type: string;
  funding_requirements: string;
  name: string;
  funding_coverage: string;
  event_date: string;
  score: number;
}

export interface SurgeAlert {
  id: number;
  name: string;
  keywords: string[] | null;
  event_name: string;
  country: string | null;
  start_date: string;
  alert_date: string | null;
  score: number;
  event_id: number;
  status: string;
  deadline: string;
  surge_type: string;
}

export interface Project {
  id: number;
  name: string;
  event_name: string;
  national_society: string;
  tags: string[];
  sector: string;
  start_date: string;
  regions: string[];
  people_targeted: number;
  score: number;
}

export interface FieldReport { // FIXME: emergency type is required as per wireframe
  created_at: string;
  name: string;
  id: number;
  score: number;
  event_name: string;
}

export interface SurgeDeployement {
  id: number;
  event_name: string;
  deployed_country: string;
  type: string;
  owner: string;
  personnel_units: number;
  equipment_units: number;
  score: number;
}

export type SearchResult = {
  countries: CountryResult[];
  appeals: Appeal[];
  field_reports: FieldReport[];
  projects: Project[];
  emergencies: Emergency[];
  surge_alerts: SurgeAlert[];
  surge_deployments: SurgeDeployement[];
}

const MAX_VIEW_PER_SECTION = 5;
type ResultKeys = 'countries' | 'emergencies' | 'appeals' | 'projects' | 'surgeAlerts' | 'surgeDeployments' | 'fieldReports';

interface Props {
  className?: string;
  data: SearchResult[] | undefined;
}

function Search(props: Props) {
  const { className } = props;

  const [activeView, setActiveView] = React.useState<ResultKeys | undefined>();
  const [searchString, setSearchString] = useInputState<string | undefined>(undefined);
  const { strings } = React.useContext(LanguageContext);

  const debouncedSearchString = useDebouncedValue(searchString);
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
    const scoreSelector = (d: { score: number }) => d.score;
    const resultsMap = {
      countries: searchResponse?.countries ?? [],
      emergencies: searchResponse?.emergencies ?? [],
      appeals: searchResponse?.appeals ?? [],
      projects: searchResponse?.projects ?? [],
      surgeAlerts: searchResponse?.surge_alerts ?? [],
      surgeDeployments: searchResponse?.surge_deployments ?? [],
      fieldReports: searchResponse?.field_reports ?? [],
    };

    const componentMap: Record<ResultKeys, React.ElementType> = {
      countries: CountryList,
      emergencies: EmergencyTable,
      appeals: AppealsTable,
      projects: ProjectTabel,
      surgeAlerts: SurgeAlertTable,
      surgeDeployments: SurgeDeployementTable,
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

  return (
    <Page
      className={_cs(styles.search, className)}
      title={strings.threeWPageTitle}
      heading="Search for keyword"
      withMainContentBackground
      description={(
        <TextInput
          name="search"
          value={searchString}
          onChange={setSearchString}
        />
      )}
    >
      {searchPending && <BlockLoading />}
      {!searchPending && isEmpty && (
        <Container>
          Nothing here!
        </Container>
      )}
      <div className={styles.content}>
        {activeView && ActiveComponent && (
          <ActiveComponent
            data={resultsMap[activeView]}
            actions={(
              <Button
                name={undefined}
                variant="transparent"
                onClick={setActiveView}
              >
                Go back
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
                >
                  View all results
                </Button>
              )}
            />
          );
        })}
      </div>
    </Page >
  );
}

export default Search;
