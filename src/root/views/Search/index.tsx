import React, { useState } from 'react';

import { _cs } from '@togglecorp/fujs';
import { useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import Page from '#components/Page';
import Container from '#components/Container';
import TextInput from '#components/TextInput';
import BlockLoading from '#components/block-loading';
import useInputState from '#hooks/useInputState';

import EmergencyTable from './EmergencyTable';
import AppealsTable from './AppealsTable';
import FieldReportTable from './FieldReportTable';
import ProjectTabel from './ProjectTable';
import SurgeAlertTable from './SurgeAlertTable';
import SurgeDeployementTable from './SurgeDeployementTable';
import CountryList from './Country';

import styles from './styles.module.scss';

export interface Option {
  value: string | number;
  label: string;
}

export interface Country {
  id: number;
  name: string;
  society_name: string;
  score: number;
}

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
  countries: Country[];
  appeals: Appeal[];
  field_reports: FieldReport[];
  projects: Project[];
  emergencies: Emergency[];
  surge_alerts: SurgeAlert[];
  surge_deployments: SurgeDeployement[];
}

interface Props {
  className?: string;
  data: SearchResult[] | undefined;
}

function Search(props: Props) {
  const {
    className,
    data,
  } = props;

  const [searchString, setSearchString] = useInputState<string | undefined>(undefined);
  const { strings } = React.useContext(LanguageContext);

  const shouldSendSearchRequest = searchString && searchString.length > 2;
  const {
    pending: searchPending,
    response: searchResponse,
  } = useRequest<SearchResult>({
    skip: !shouldSendSearchRequest,
    url: 'api/v1/search/',
    query: {
      keyword: searchString,
    }
  });

  const emergencies = searchResponse?.emergencies.slice(0, 4);
  const fieldReport = searchResponse?.field_reports.slice(0, 5);
  const appeals = searchResponse?.appeals.slice(0, 5);
  const projects = searchResponse?.projects.slice(0, 5);
  const surgeAlert = searchResponse?.surge_alerts.slice(0, 5);
  const surgeDeployement = searchResponse?.surge_deployments.slice(0, 5);
  const country = searchResponse?.countries.map((country) => country.name);
  const countryList = country?.slice(0, 5).join(', ');

  const scoreEmergencies = searchResponse?.emergencies.map((i) => i.score);
  const totalScoreEmergencies = scoreEmergencies?.reduce(function (prev, current) {
    return (prev + current) / scoreEmergencies.length;
  }, 0);

  const scoreFieldReport = searchResponse?.field_reports.map((i) => i.score);
  const totalScoreFieldReport = scoreFieldReport?.reduce(function (prev, current) {
    return (prev + current) / scoreFieldReport.length;
  }, 0);

  const scoreSurgeAlert = searchResponse?.surge_alerts.map((i) => i.score);
  const totalScoreSurgeAlert = scoreSurgeAlert?.reduce(function (prev, current) {
    return (prev + current) / scoreSurgeAlert.length;
  }, 0);

  const scoreAppeal = searchResponse?.appeals.map((i) => i.score);
  const totalScoreAppeal = scoreAppeal?.reduce(function (prev, current) {
    return (prev + current) / scoreAppeal?.length;
  }, 0);

  const scoreProject = searchResponse?.projects.map((i) => i.score);
  const totalScoreProject = scoreProject?.reduce(function (prev, current) {
    return (prev + current) / scoreProject?.length;
  }, 0);

  const scoreSurgeDeployment = searchResponse?.surge_deployments.map((i) => i.score);
  const totalScoreSurgeAlertDeployment = scoreSurgeDeployment?.reduce(function(prev, current){
    return (prev + current) / scoreSurgeDeployment?.length;
  }, 0);


  const isEmpty = !emergencies && !fieldReport && !appeals
    && !projects && !surgeAlert && !surgeDeployement && !country;

  const sortList = (props: SearchResult) => {
    // { data?.sort((a, b) => b) }
    switch (sort.data) {
      case "appeal":
        return <AppealsTable data={appeals} />;
      case "surgeAlert":
        return <SurgeAlertTable data={surgeAlert} />;
      case "emergencyTable":
        return <EmergencyTable data={emergencies} />;
      case "fieldReport":
        return <FieldReportTable data={fieldReport} />;
      case "projectTable":
        return <ProjectTabel data={projects} />;
      case "surgeAlertTable":
        return <SurgeAlertTable data={surgeAlert} />;
      case "surgeDeployement":
        return <SurgeDeployementTable data={surgeDeployement} />;
    }
  };

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
        <CountryList
          data={countryList}
        />
        <EmergencyTable
          data={emergencies}
        />
        <AppealsTable
          data={appeals}
        />
        <FieldReportTable
          data={fieldReport} />
        <ProjectTabel
          data={projects}
        />
        <SurgeAlertTable
          data={surgeAlert}
        />
        <SurgeDeployementTable
          data={surgeDeployement}
        />
      </div>
    </Page >
  );
}

export default Search;
