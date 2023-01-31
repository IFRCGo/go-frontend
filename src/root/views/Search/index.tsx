import React from 'react';
import AsyncSelect, { Props as SelectProps } from 'react-select/async';

import { isDefined, unique, _cs } from '@togglecorp/fujs';
import { useRequest } from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import Page from '#components/Page';
import Container from '#components/Container';
import { getSelectInputNoOptionsMessage } from '#utils/utils';

import EmergencyTable from './EmergencyTable';
import AppealsTable from './AppealsTable';
import FieldReportTable from './FieldReportTable';
import ProjectTabel from './ProjectTable';
import SurgeAlertTable from './SurgeAlertTable';
import SurgeDeployementTable from './SurgeDeployementTable';

import styles from './styles.module.scss';

export interface Option {
  value: string | number;
  label: string;
}

interface BaseProps<N> {
  className?: string;
  readOnly?: boolean;
  initialOptions?: Option[];
  pending?: boolean;
  defaultOptions?: boolean;
  name: N;
  loadOptions: (value: string | undefined, callback: (opt: Option[]) => void) => void;
}
const emptyOptionList: Option[] = [];

type Key = string | number;

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

type Props<N, V extends Key> = BaseProps<N> & ({
  isMulti: true;
  isOptionDisabled?: SelectProps<Option, true>['isOptionDisabled'];
  value: V[] | undefined | null;
  onChange: (newValue: NonNullable<V>[] | undefined, name: N) => void;
} | {
  isMulti?: false;
  isOptionDisabled?: SelectProps<Option, false>['isOptionDisabled'];
  value: V | undefined | null;
  onChange: (newValue: V, name: N) => void;
})

function Search<N, V extends Key>(props: Props<N, V>) {
  const {
    className,
    readOnly,
    loadOptions,
    name,
    defaultOptions,
    initialOptions = emptyOptionList,
    pending,
  } = props;

  const [options, setOptions] = React.useState<Option[]>(initialOptions);

  const { strings } = React.useContext(LanguageContext);

  const selectValue = React.useMemo(() => {
    if (!props.isMulti) {
      return options.find(o => (
        String(props.value) === String(o.value)
      ));
    }

    return options.filter(
      o => (props.value || []).findIndex(
        v => String(v) === String(o.value)
      ) !== -1
    );
  }, [props.isMulti, options, props.value]);

  const timeoutRef = React.useRef<number | undefined>();

  const handleChange = React.useCallback((newValue) => {
    if (!props.onChange) {
      return;
    }

    if (isDefined(newValue)) {
      if (props.isMulti) {
        props.onChange(newValue.map((d: Option) => d.value), name);
      } else {
        props.onChange(newValue.value, name);
      }
    } else {
      if (props.isMulti) {
        props.onChange([], name);
      } else {
        props.onChange(undefined as unknown as V, name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, props.isMulti, props.onChange]);

  const handleLoadOptions = React.useCallback((searchText, callback) => {
    if (!isDefined(searchText)) {
      callback(emptyOptionList);
    }

    const localCallback = (currentOptions: Option[]) => {
      if (currentOptions?.length > 0) {
        setOptions(
          prevOptions => unique(
            [
              ...prevOptions,
              ...currentOptions,
            ],
            o => o.value
          ) ?? [],
        );
      }
      callback(currentOptions);
    };

    // window.clearTimeout(timeoutRef.current);
    // timeoutRef.current = window.setTimeout(() => {
    //   loadOptions(searchText, localCallback);
    // }, 350);
  }, [setOptions, loadOptions]);

    const {
    pending: searchPending,
    response: searchResponse,
  } = useRequest<SearchResult>({
    url: 'https://search-page-ifrc.dev.datafriendlyspace.org/api/v1/search/?keyword=${inputValue}',
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
          className={styles.searchBar}
          placeholder={strings.headerSearchPlaceholder}
          select={false}
          classNamePrefix="go"
          readOnly={readOnly}
          onChange={handleChange}
          value={selectValue}
          loadOptions={handleLoadOptions}
          isDisabled={searchPending}
          isLoading={pending}
          noOptionsMessage={getSelectInputNoOptionsMessage as unknown as (obj: { inputValue: string }) => string}
          defaultOptions={defaultOptions}
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