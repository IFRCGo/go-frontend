import {
  unique,
  isDefined,
  listToGroupList,
} from '@togglecorp/fujs';
import { Project } from '#types';

export const emptyProjectList: Project[] = [];


export interface LabelValue {
  label: string;
  value: number;
}

interface SankeyNode {
  name: string;
}
interface SankeyLink {
  source: number;
  target: number;
  value: number;
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

export function projectListToSankeyData(projectList: Project[]) {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  const nsList = uniqueAndTransform(
    projectList,
    d => d.reporting_ns,
    d => d.reporting_ns_detail,
  );
  const nsIdToNodeIndexMap: Record<string, number> = {};
  nsList.forEach((ns) => {
    nsIdToNodeIndexMap[ns.id] = nodes.push({
      name: ns.society_name
    }) - 1;
  });

  const primarySectorList = uniqueAndTransform(
    projectList,
    d => d.primary_sector,
    d => ({ id: d.primary_sector, label: d.primary_sector_display }),
  );
  const primarySectorIdToNodeIndexMap: Record<string, number> = {};
  primarySectorList.forEach((ps) => {
    primarySectorIdToNodeIndexMap[ps.id] = nodes.push({
      name: ps.label,
    }) - 1;
  });


  const allSecondarySectorList = projectList.reduce((acc, val) => ([
    ...acc,
    ...val.secondary_sectors.map((key, i) => ({
      id: key,
      label: val.secondary_sectors_display[i],
    })),
  ]), [] as { id: number, label: string }[]);

  const secondarySectorList = unique(allSecondarySectorList, d => d.id) ?? [];
  const secondarySectorIdToNodeIndexMap: Record<string, number> = {};
  secondarySectorList.forEach((ss) => {
    secondarySectorIdToNodeIndexMap[ss.id] = nodes.push({
      name: ss.label,
    }) - 1;
  });

  const nsGroupedProjectList = listToGroupList(
    projectList,
    d => d.reporting_ns,
    d => d,
  );
  Object.keys(nsGroupedProjectList).forEach((nsId) => {
    const nsProjectList = nsGroupedProjectList[nsId];
    nsProjectList.forEach((p) => {
      links.push({
        source: nsIdToNodeIndexMap[nsId],
        target: primarySectorIdToNodeIndexMap[p.primary_sector],
        value: 1,
      });
    });
  });

  const primarySectorGroupedProjectList = listToGroupList(
    projectList,
    d => d.primary_sector,
    d => d,
  );
  Object.keys(primarySectorGroupedProjectList).forEach((psId) => {
    const psProjectList = primarySectorGroupedProjectList[psId];
    psProjectList.forEach((p) => {
      (p.secondary_sectors ?? []).forEach((ssId) => {
        links.push({
          source: primarySectorIdToNodeIndexMap[psId],
          target: secondarySectorIdToNodeIndexMap[ssId],
          value: 1,
        });
      });
    });
  });

  const reducedLinks = links.reduce((acc, val) => {
    const i = acc.findIndex(
      l => l.source === val.source
      && l.target === val.target
    );

    if (i === -1) {
      return [...acc, val];
    }

    const newAcc = [...acc];
    const {0: prevLink} = newAcc.splice(i, 1);

    return [
      ...newAcc, {
        ...prevLink,
        value: prevLink.value + 1
      }
    ];
  }, [] as SankeyLink[]);

  return {
    nodes,
    links: reducedLinks,
  };
}

export const PROJECT_STATUS_COMPLETED = 2;
export const PROJECT_STATUS_ONGOING = 1;
export const PROJECT_STATUS_PLANNED = 0;

