import { listToMap } from '@togglecorp/fujs';

export const NO_DATA = 'No data to display.';

export const programmeTypeList = [
  {
    key: '0',
    title: 'Bilateral'
  },
  {
    key: '1',
    title: 'Multilateral'
  }
];

export const programmeTypes = listToMap(programmeTypeList, d => d.key, d => d.title);

export const sectorList = [
  {
    key: '0',
    title: 'WASH',
    color: '#66c2a5',
    inputValue: 'Wash',
  },
  {
    key: '1',
    title: 'PGI',
    color: '#fc8d62',
    inputValue: 'Pgi',
  },
  {
    key: '2',
    title: 'CEA',
    color: '#8da0cb',
    inputValue: 'Cea',
  },
  {
    key: '3',
    title: 'Migration',
    color: '#e78ac3',
    inputValue: 'Migration',
  },
  {
    key: '4',
    title: 'Health',
    color: '#a6d854',
    inputValue: 'Health',
  },
  {
    key: '5',
    title: 'DRR',
    color: '#ffd92f',
    inputValue: 'Drr',
  },
  {
    key: '6',
    title: 'Shelter',
    color: '#e5c494',
    inputValue: 'Shelter',
  },
  {
    key: '7',
    title: 'Preparedness',
    color: '#b3b3b3',
    inputValue: 'Preparedness',
  },
];

export const sectors = listToMap(sectorList, d => d.key, d => d.title);

export const statusList = [
  {
    key: '0',
    title: 'Planned'
  },
  {
    key: '1',
    title: 'Ongoing'
  },
  {
    key: '2',
    title: 'Completed'
  }
];

export const statuses = listToMap(statusList, d => d.key, d => d.title);

