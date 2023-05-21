import {
  unique,
  isDefined,
  listToGroupList,
  mapToList,
} from '@togglecorp/fujs';
import { Project } from '#types';

export const emptyProjectList: Project[] = [];

export interface LabelValue {
  label: string;
  value: number;
}

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface SankeyNodeInternal {
  id: number;
  name: string;
  uniqueId: string;
}

interface SankeyLinkInternal {
  source: number | undefined;
  target: number | undefined;
  value: number;
}

function isValidLink(value: SankeyLinkInternal): value is SankeyLink {
  return isDefined(value.source) && isDefined(value.target);
}

function mergeList<T>(list: T[], transform: (acc: T, val: T) => T): T {
  const [firstValue, ...otherValues] = list;
  return otherValues.reduce(
    transform,
    firstValue,
  );
}

export function listToMap<T, K extends string | number, V>(
  items: T[],
  keySelector: (val: T, index: number) => K,
  valueSelector: (val: T, index: number) => V,
) {
  const val: Partial<Record<K, V>> = items.reduce(
    (acc, item, index) => {
      const key = keySelector(item, index);
      const value = valueSelector(item, index);
      return {
        ...acc,
        [key]: value,
      };
    },
    {},
  );
  return val;
}

function uniqueAndTransform<I, R>(
  list: I[],
  keySelector: (item: I) => string | number,
  transformer: (item: I) => R,
) {
  const transformedList = (unique(
    list,
    keySelector,
  ) ?? [])
  .filter(d => isDefined(keySelector(d)))
  .map(transformer);

  return transformedList;
}

function mergeLinks(links: SankeyLink[]) {
  const groupedLinks = listToGroupList(
    links,
    (item) => `${item.source}-${item.target}`,
    (item) => item,
  );

  return mapToList(
    groupedLinks,
    item => mergeList(item, (prev, next) => ({
      ...prev,
      value: prev.value + next.value,
    })),
  );
}

export function projectListToInCountrySankeyData(projectList: Project[]) {
  const nsList: SankeyNodeInternal[] = uniqueAndTransform(
    projectList,
    d => d.reporting_ns,
    d => ({
      id: d.reporting_ns,
      name: d.reporting_ns_detail.society_name,
      uniqueId: `ns-${d.reporting_ns}`,
    }),
  );
  const primarySectorList: SankeyNodeInternal[] = uniqueAndTransform(
    projectList,
    d => d.primary_sector,
    d => ({
      id: d.primary_sector,
      name: d.primary_sector_display,
      uniqueId: `primary-sector-${d.primary_sector}`,
    }),
  );
  const secondarySectorList: SankeyNodeInternal[] = uniqueAndTransform(
    projectList.map((project) => (
      project.secondary_sectors.map((key, index) => ({
        id: key,
        name: project.secondary_sectors_display[index],
        uniqueId: `secondary-sector-${key}`,
      }))
    )).flat(),
    d => d.id,
    d => d,
  );

  const nodes: SankeyNodeInternal[] = [
    ...nsList,
    ...primarySectorList,
    ...secondarySectorList,
  ];
  const nodesMapping = listToMap(
    nodes,
    (node) => node.uniqueId,
    (_, index) => index,
  );

  const nsToPrimarySectorLinks: SankeyLinkInternal[] = projectList.map((project) => ({
    source: nodesMapping[`ns-${project.reporting_ns}`],
    target: nodesMapping[`primary-sector-${project.primary_sector}`],
    value: 1,
  })).flat();

  const primarySectorToSecondarySectorLinks: SankeyLinkInternal[] = projectList.map((project) => (
    project.secondary_sectors.map((secondary_sector_key) => ({
      source: nodesMapping[`primary-sector-${project.primary_sector}`],
      target: nodesMapping[`secondary-sector-${secondary_sector_key}`],
      value: 1,
    }))
  )).flat(2);

  const reducedLinks = mergeLinks([
    ...nsToPrimarySectorLinks,
    ...primarySectorToSecondarySectorLinks,
  ].filter(isValidLink));

  return {
    nodes,
    links: reducedLinks,
  };
}

export function projectListToNsSankeyData(projectList: Project[]) {
  const nsList: SankeyNodeInternal[] = uniqueAndTransform(
    projectList,
    d => d.reporting_ns,
    d => ({
      id: d.reporting_ns,
      name: d.reporting_ns_detail.society_name,
      uniqueId: `ns-${d.reporting_ns}`,
    }),
  );
  const primarySectorList: SankeyNodeInternal[] = uniqueAndTransform(
    projectList,
    d => d.primary_sector,
    d => ({
      id: d.primary_sector,
      name: d.primary_sector_display,
      uniqueId: `primary-sector-${d.primary_sector}`,
    }),
  );

  const countryList: SankeyNodeInternal[] = uniqueAndTransform(
    projectList,
    d => d.project_country,
    d => ({
      id: d.project_country,
      name: d.project_country_detail.name,
      uniqueId: `country-${d.project_country}`,
    }),
  );

  const nodes: SankeyNodeInternal[] = [
    ...nsList,
    ...primarySectorList,
    ...countryList,
  ];
  const nodesMapping = listToMap(
    nodes,
    (node) => node.uniqueId,
    (_, index) => index,
  );

  const nsToPrimarySectorLinks: SankeyLinkInternal[] = projectList.map((project) => ({
    source: nodesMapping[`ns-${project.reporting_ns}`],
    target: nodesMapping[`primary-sector-${project.primary_sector}`],
    value: 1,
  })).flat();

  const primarySectorToCountryLinks: SankeyLinkInternal[] = projectList.map((project) => ({
    source: nodesMapping[`primary-sector-${project.primary_sector}`],
    target: nodesMapping[`country-${project.project_country}`],
    value: 1,
  })).flat();

  const reducedLinks = mergeLinks([
    ...nsToPrimarySectorLinks,
    ...primarySectorToCountryLinks,
  ].filter(isValidLink));

  return {
    nodes,
    links: reducedLinks,
  };
}

export const PROJECT_STATUS_COMPLETED = 2;
export const PROJECT_STATUS_ONGOING = 1;
export const PROJECT_STATUS_PLANNED = 0;

export const projectKeySelector = (p: Project) => p.id;

type ProjectKey = keyof Project;

export function filterProjects(
  projectList: Project[],
  filters: Partial<Record<ProjectKey, number[]>>,
) {
  const filterKeys = Object.keys(filters) as ProjectKey[];

  return filterKeys.reduce((filteredProjectList, filterKey) => {
    const filterValue = filters[filterKey];

    if (filterValue?.length === 0) {
      return filteredProjectList;
    }

    return filteredProjectList.filter((project) => {
      const value = project[filterKey];

      if (!isDefined(value)) {
        return true;
      }


      if (!isDefined(filterValue)) {
        return true;
      }

      if (Array.isArray(value)) {
        return (value as number[]).some(
          (v) => (
            filterValue.findIndex(
              (fv) => String(fv) === String(v)
            ) !== -1
          )
        );
      }

      return filterValue.findIndex(
        (fv) => String(fv) === String(value)
      ) !== -1;
    });
  }, projectList);
}
