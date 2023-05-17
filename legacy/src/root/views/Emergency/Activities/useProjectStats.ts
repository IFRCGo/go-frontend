import React from 'react';
import {
  isDefined,
  unique,
  listToMap,
  mapToList,
} from '@togglecorp/fujs';

import {
  EmergencyProjectResponse,
  CountryMini,
  ActivityInEmergencyProjectResponse,
} from '#types';

// TODO merge with one in utils
const sumSafe = (nums: (number | undefined | null)[]) => {
  const safeNums = nums.filter(isDefined);
  if (safeNums.length === 0) {
    return undefined;
  }

  return safeNums.reduce((acc, val) => acc + val, 0);
};

export function getPeopleReachedInActivity(activity: EmergencyProjectResponse['activities'][number]) {
  const {
    is_simplified_report,

    people_count,
    male_0_1_count,
    male_2_5_count,
    male_6_12_count,
    male_13_17_count,
    male_18_59_count,
    male_60_plus_count,
    male_unknown_age_count,

    female_0_1_count,
    female_2_5_count,
    female_6_12_count,
    female_13_17_count,
    female_18_59_count,
    female_60_plus_count,
    female_unknown_age_count,

    other_0_1_count,
    other_2_5_count,
    other_6_12_count,
    other_13_17_count,
    other_18_59_count,
    other_60_plus_count,
    other_unknown_age_count,
  } = activity;


  if (is_simplified_report === true) {
    return people_count ?? 0;
  }

  if (is_simplified_report === false) {
    return sumSafe([
      male_0_1_count,
      male_2_5_count,
      male_6_12_count,
      male_13_17_count,
      male_18_59_count,
      male_60_plus_count,
      male_unknown_age_count,

      female_0_1_count,
      female_2_5_count,
      female_6_12_count,
      female_13_17_count,
      female_18_59_count,
      female_60_plus_count,
      female_unknown_age_count,

      other_0_1_count,
      other_2_5_count,
      other_6_12_count,
      other_13_17_count,
      other_18_59_count,
      other_60_plus_count,
      other_unknown_age_count,
    ]);
  }

  return undefined;
}

export function getPeopleReached(project: EmergencyProjectResponse) {
  const peopleReached = sumSafe(project.activities.map(getPeopleReachedInActivity));

  return peopleReached;
}

function useProjectStats(
  projectList: EmergencyProjectResponse[] = [],
  filteredProjectList: EmergencyProjectResponse[] = [],
) {
  return React.useMemo(() => {
    const eruList = unique(
      projectList?.map((p) => p.activity_lead === 'deployed_eru' ? p.deployed_eru : undefined)
        .filter(isDefined)
    );

    const nsList = unique(
      projectList?.map((p) => p.activity_lead === 'national_society' ? p.reporting_ns : undefined)
        .filter(isDefined)
    );

    const sectors = unique(
      projectList?.map((p) => p.activities?.map(a => a.sector))
        .flat(1)
        .filter(isDefined)
    );

    const sectorList = projectList
      ?.map((p) => unique(p.activities?.map(a => a.sector_details), a => a.id))
      .flat(1) ?? [];

    const projectCountListBySector = Object.values(
      sectorList.reduce((acc, val) => {
        const newAcc = { ...acc };
        if (!acc[val.id]) {
          newAcc[val.id] = {
            id: val.id,
            title: val.title,
            count: 1,
          };
        } else {
          newAcc[val.id] = {
            ...newAcc[val.id],
            count: newAcc[val.id].count + 1,
          };
        }

        return newAcc;
      }, {} as Record<number, { id: number, title: string, count: number }>)
    );

    const projectCountByStatus = projectList.map((p) => p.status_display).reduce(
      (acc, val) => {
        const newAcc = { ...acc };
        if (!newAcc[val]) {
          newAcc[val] = { title: val, count: 1 };
        } else {
          newAcc[val] = {
            ...newAcc[val],
            count: newAcc[val].count + 1,
          };
        }

        return newAcc;
      },
      {} as Record<string, { title: string, count: number }>,
    );

    const districtList = filteredProjectList?.map((p) => p.districts_details.map(d => d.id)).flat(1) ?? [];
    const projectCountByDistrict = districtList.reduce((acc, val) => {
      const newAcc = {...acc};
      if (!newAcc[val]) {
        newAcc[val] = 0;
      }

      newAcc[val] += 1;
      return newAcc;
    }, {} as Record<number, number>);

    const sectorGroupedProjectList = filteredProjectList.reduce((acc, val) => {
      const newAcc = { ...acc };
      val.activities.forEach((activity) => {
        if (!newAcc[activity.sector]) {
          newAcc[activity.sector] = {
            sectorDetails: activity.sector_details,
            projects: [],
          };
        }

        const projectIndex = newAcc[activity.sector].projects.findIndex(d => d.id === val.id);
        if (projectIndex === -1) {
          newAcc[activity.sector].projects.push(val);
        }
      });

      return newAcc;
    }, {} as Record<
      number, {
        sectorDetails: EmergencyProjectResponse['activities'][number]['sector_details'];
        projects: EmergencyProjectResponse[];
      }>
    );

    const peopleReached = sumSafe(projectList.map((p) => getPeopleReached(p)));

    const denormalizedList = projectList.reduce((acc, val) => {
      const newAcc = [
        ...acc,
        ...(
          val.activities.map((a) => ({
            ns: val.reporting_ns_details ?? val.deployed_eru_details?.eru_owner_details?.national_society_country_details,
            sector: a.sector_details,
            country: val.country_details,
          }))
        ),
      ];

      return newAcc;
    }, [] as {
      ns: CountryMini;
      sector: ActivityInEmergencyProjectResponse['sector_details'];
      country: CountryMini;
    }[]);

    const nsNodes = unique(
      denormalizedList.map(d => ({
        ns: d.ns.id,
        name: d.ns.society_name
      })),
      d => d.ns,
    );

    const sectorNodes = unique(
      denormalizedList.map(d => ({
        sector: d.sector.id,
        name: d.sector.title,
      })),
      d => d.sector,
    );

    const countryNodes = unique(
      denormalizedList.map(d => ({
        country: d.country.id,
        name: d.country.name,
      })),
      d => d.country,
    );

    const allNodes: {
      ns?: number;
      sector?: number;
      country?: number;
      name: string;
    }[] = [
      ...nsNodes,
      ...sectorNodes,
      ...countryNodes,
    ];

    const nodeElementToIndexMap: Record<string, number> = listToMap(
      allNodes,
      (d) => {
        if (isDefined(d.ns)) {
          return `ns-${d.ns}`;
        }

        if (isDefined(d.sector)) {
          return `sector-${d.sector}`;
        }

        if (isDefined(d.country)) {
          return `country-${d.country}`;
        }

        return 'unknown';
      },
      (_, __, i) => i,
    );

    const linkMap: Record<string, number> = {};

    denormalizedList.forEach((item) => {
      const nsIndex = nodeElementToIndexMap[`ns-${item.ns.id}`];
      const sectorIndex = nodeElementToIndexMap[`sector-${item.sector.id}`];
      const countryIndex = nodeElementToIndexMap[`country-${item.country.id}`];

      const key1 = `${nsIndex}:${sectorIndex}`;
      const key2 = `${sectorIndex}:${countryIndex}`;

      if (!linkMap[key1]) {
        linkMap[key1] = 0;
      }

      if (!linkMap[key2]) {
        linkMap[key2] = 0;
      }

      linkMap[key1] = linkMap[key1] + 1;
      linkMap[key2] = linkMap[key2] + 1;
    });

    const links = mapToList(
      linkMap,
      (v, k) => {
        const [s, t] = k.split(':');

        return {
          source: +s,
          target: +t,
          value: v,
        };
      },
    );

    return {
      uniqueEruCount: eruList?.length ?? 0,
      uniqueNsCount: nsList?.length ?? 0,
      uniqueSectorCount: sectors?.length ?? 0,
      projectCountListBySector,
      projectCountByDistrict,
      peopleReached,
      projectCountListByStatus: Object.values(projectCountByStatus),
      sectorGroupedProjectList,
      sankeyData: {
        nodes: allNodes,
        links,
      }
    };
  }, [projectList, filteredProjectList]);
}

export default useProjectStats;
