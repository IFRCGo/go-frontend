import React from 'react';
import {
  isDefined,
  unique,
  listToGroupList,
} from '@togglecorp/fujs';

import useInputState from '#hooks/useInputState';
import SelectInput from '#components/SelectInput';
import { EmergencyProjectResponse } from '#types';

import styles from './styles.module.scss';

interface Props {
  allProjects?: EmergencyProjectResponse[];
  onFilterChange?: (filteredProjects: EmergencyProjectResponse[]) => void;
}

const emptyDistrictList: {
  label: string;
  value: number;
}[] = [];

function Filters(props: Props) {
  const {
    allProjects = [],
    onFilterChange,
  } = props;

  const [ns, setNs] = useInputState<number | undefined>(undefined);
  const [eru, setEru] = useInputState<number | undefined>(undefined);
  const [sector, setSector] = useInputState<number | undefined>(undefined);
  const [status, setStatus] = useInputState<string | undefined>(undefined);
  const [country, setCountry] = useInputState<number | undefined>(undefined);
  const [district, setDistrict] = useInputState<number | undefined>(undefined);

  React.useEffect(() => {
    if (isDefined(ns)) {
      setEru(undefined);
    }
  }, [ns, setEru]);

  React.useEffect(() => {
    if (isDefined(eru)) {
      setNs(undefined);
    }
  }, [eru, setNs]);

  React.useEffect(() => {
    if (isDefined(country)) {
      setDistrict(undefined);
    }
  }, [country, setDistrict]);

  React.useEffect(() => {
    if (!onFilterChange) {
      return;
    }

    let filteredValues = [...allProjects];

    if (isDefined(ns)) {
      filteredValues = filteredValues.filter(p => p.reporting_ns === ns);
    }

    if (isDefined(eru)) {
      filteredValues = filteredValues.filter(p => p.deployed_eru === eru);
    }

    if (isDefined(sector)) {
      filteredValues = filteredValues.filter(p => -1 !== p.activities.findIndex(a => a.sector === sector));
    }

    if (isDefined(status)) {
      filteredValues = filteredValues.filter(p => p.status === status);
    }

    if (isDefined(country)) {
      filteredValues = filteredValues.filter(p => p.country === country);

      if (isDefined(district)) {
        filteredValues = filteredValues.filter(p => -1 !== p.districts_details.findIndex(d => d.id === district));
      }
    }

    onFilterChange(filteredValues);
  }, [
    sector,
    ns,
    eru,
    status,
    country,
    district,
    allProjects,
    onFilterChange
  ]);

  const [
    sectorOptions,
    nsOptions,
    eruOptions,
    statusOptions,
    countryOptions,
    districtOptionsByCountry,
  ] = React.useMemo(() => ([
    unique(
      allProjects.map(p => p.activities).flat(1).map(
        a => ({
          value: a.sector_details.id,
          label: a.sector_details.title,
        }),
      ),
      s => s.value,
    ),
    unique(
      allProjects.map(p => (
        (p.activity_lead === 'national_society' && p.reporting_ns_details) ? ({
          value: p.reporting_ns_details.id,
          label: p.reporting_ns_details.society_name,
        }) : null
      )).filter(isDefined),
      ns => ns.value,
    ),
    unique(
      allProjects.map(p => (
        (p.activity_lead === 'deployed_eru' && p.deployed_eru_details) ? ({
          value: p.deployed_eru_details.id,
          label: p.deployed_eru_details.eru_owner_details.national_society_country_details.society_name,
        }) : null
      )).filter(isDefined),
      eru => eru.value,
    ),
    unique(
      allProjects.map(p => ({
        label: p.status_display,
        value: p.status,
      })),
      s => s.value,
    ),
    unique(
      allProjects.map(p => ({
        label: p.country_details?.name,
        value: p.country_details?.id,
      })),
      c => c.value,
    ),
    listToGroupList(
      unique(
        allProjects.map(p => (
          p.districts_details.map(
            d => ({
              label: d.name,
              value: d.id,
              country: p.country,
            })
          )
        )).flat(1),
        d => d.value,
      ),
      d => d.country,
      d => d,
    ),
  ]), [allProjects]);


  return (
    <div className={styles.filters}>
      <SelectInput
        className={styles.filter}
        name={undefined}
        label="National Society"
        options={nsOptions}
        value={ns}
        onChange={setNs}
        isClearable
      />
      <SelectInput
        className={styles.filter}
        name={undefined}
        label="ERU"
        options={eruOptions}
        value={eru}
        onChange={setEru}
        isClearable
      />
      <SelectInput
        className={styles.filter}
        name={undefined}
        label="Sector"
        options={sectorOptions}
        value={sector}
        onChange={setSector}
        isClearable
      />
      <SelectInput
        className={styles.filter}
        name={undefined}
        label="Status"
        options={statusOptions}
        value={status}
        onChange={setStatus}
        isClearable
      />
      <SelectInput
        className={styles.filter}
        name={undefined}
        label="Country"
        options={countryOptions}
        value={country}
        onChange={setCountry}
        isClearable
      />
      <SelectInput
        disabled={!country}
        className={styles.filter}
        name={undefined}
        label="Region/Province"
        options={isDefined(country) ? (districtOptionsByCountry[country] ?? emptyDistrictList) : emptyDistrictList}
        value={district}
        onChange={setDistrict}
        isClearable
      />
    </div>
  );
}

export default Filters;
