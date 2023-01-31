import React from 'react';
import AsyncSelect from 'react-select/async';
import { _cs } from '@togglecorp/fujs';
import { useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import Page from '#components/Page';
import Container from '#components/Container';

import EmergencyTable from './EmergencyTable';
import AppealsTable from './AppealsTable';
import FieldReportTable from './FieldReportTable';
import ProjectTabel from './ProjectTable';
import SurgeAlertTable from './SurgeAlertTable';
import SurgeDeployementTable from './SurgeDeployementTable';

import styles from './styles.module.scss';

interface Props {
  className?: string;
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
  keywords: string | null;
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

export interface SurgeDeployement { // FIXME: duration field is missing
  id: number;
  event_name: string;
  deployed_country: string;
  type: string;
  owner: string;
  personnel_units: number;
  equipment_units: number;
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


function Search(props: Props) {
  const {
    className,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const {
    pending: searchPending,
    response: searchResponse,
  } = useRequest<SearchResult>({
    url: 'https://search-page-ifrc.dev.datafriendlyspace.org/api/v1/search/?keyword=in',
  });

  const emergencies = searchResponse?.emergencies.slice(0, 4);
  const fieldReport = searchResponse?.field_reports.slice(0, 5);
  const appeals = searchResponse?.appeals.slice(0, 5);
  const projectTable = searchResponse?.projects.slice(0, 5);
  const surgeAlert = searchResponse?.surge_alerts.slice(0, 5);
  const surgeDeployement = searchResponse?.surge_deployments.slice(0, 5);
  const country = searchResponse?.countries.map((country) => country.name);
  const countryList = country?.slice(0, 5).join(', ');

  return (
    <Page
      className={_cs(styles.searchDetails, className)}
      title={strings.threeWPageTitle}
      heading="Search for keyword"
      withMainContentBackground
      description={(
        <AsyncSelect
          placeholder={strings.headerSearchPlaceholder}
          className={styles.searchBar}
          select={false}
        />
      )}
    >
      <div className={styles.content}>
        <Container
          heading={strings.searchIfrcCountry}
          description={countryList}
          contentClassName={styles.content}
        >
        </Container>
        {emergencies && (
          <EmergencyTable
            data={emergencies}
          />
        )}
        {appeals && (
          <AppealsTable
            data={appeals}
          />
        )}
        {fieldReport && (
          <FieldReportTable
            data={fieldReport} />
        )}
        {projectTable && (
          <ProjectTabel
            data={projectTable}
          />
        )}
        {surgeAlert && (
          <SurgeAlertTable
            data={surgeAlert}
          />
        )}
        {surgeDeployement && (
          <SurgeDeployementTable
            data={surgeDeployement}
          />
        )}
      </div>
    </Page>
  );
}

export default Search;