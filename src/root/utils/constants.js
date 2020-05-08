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
  },
  {
    key: '2',
    title: 'Domestic',
  }
];

export const programmeTypes = listToMap(programmeTypeList, d => d.key, d => d.title);

export const sectorList = [
  {
    key: '0',
    title: 'WASH',
    color: '#66c2a5',
    inputValue: '0',
  },
  {
    key: '1',
    title: 'PGI',
    color: '#fc8d62',
    inputValue: '1',
  },
  {
    key: '2',
    title: 'CEA',
    color: '#8da0cb',
    inputValue: '2',
  },
  {
    key: '3',
    title: 'Migration',
    color: '#e78ac3',
    inputValue: '3',
  },
  {
    key: '4',
    title: 'Health (public)',
    color: '#a6d854',
    inputValue: '4',
  },
  {
    key: '5',
    title: 'DRR',
    color: '#ffd92f',
    inputValue: '5',
  },
  {
    key: '6',
    title: 'Shelter',
    color: '#e5c494',
    inputValue: '6',
  },
  {
    key: '7',
    title: 'NS Strengthening',
    color: '#b3b3b3',
    inputValue: '7',
  },
  {
    key: '8',
    title: 'Education',
    color: '#b3b3b3',
    inputValue: '8',
  },
  {
    key: '9',
    title: 'Livelihoods and basic needs',
    color: '#b3b3b3',
    inputValue: '9',
  },
  {
    key: '10',
    title: 'Health (clinical)',
    color: '#a6d854',
    inputValue: '10',
  },
];

export const secondarySectorList = [
  {
    key: '0',
    title: 'WASH',
    color: '#66c2a5',
    inputValue: '0',
  },
  {
    key: '1',
    title: 'PGI',
    color: '#fc8d62',
    inputValue: '1',
  },
  {
    key: '2',
    title: 'CEA',
    color: '#8da0cb',
    inputValue: '2',
  },
  {
    key: '3',
    title: 'Migration',
    color: '#e78ac3',
    inputValue: '3',
  },
  {
    key: '4',
    title: 'Health (public)',
    color: '#a6d854',
    inputValue: '4',
  },
  {
    key: '5',
    title: 'DRR',
    color: '#ffd92f',
    inputValue: '5',
  },
  {
    key: '6',
    title: 'Shelter',
    color: '#e5c494',
    inputValue: '6',
  },
  {
    key: '7',
    title: 'NS Strengthening',
    color: '#b3b3b3',
    inputValue: '7',
  },
  {
    key: '8',
    title: 'Education',
    color: '#b3b3b3',
    inputValue: '8',
  },
  {
    key: '9',
    title: 'Livelihoods and basic needs',
    color: '#b3b3b3',
    inputValue: '9',
  },
  {
    key: '10',
    title: 'Recovery',
    color: '#b3b3b3',
    inputValue: '10',
  },
  {
    key: '11',
    title: 'Internal displacement',
    color: '#b3b3b3',
    inputValue: '11',
  },
  {
    key: '12',
    title: 'Health (clinical)',
    color: '#a6d854',
    inputValue: '12',
  },
  {
    key: '13',
    title: 'COVID-19',
    color: '#a6d854',
    inputValue: '13',
  },
];

export const sectors = listToMap(sectorList, d => d.key, d => d.title);
export const sectorInputValues = listToMap(sectorList, d => d.key, d => d.inputValue);

export const secondarySectors = listToMap(secondarySectorList, d => d.key, d => d.title);
export const secondarySectorInputValues = listToMap(secondarySectorList, d => d.key, d => d.inputValue);

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

export const operationTypeList = [
  { value: '0', label: 'Programme' },
  { value: '1', label: 'Emergency operation' },
];

export const operationTypes = {
  0: 'Programme',
  1: 'Emergency Operation',
};

export const projectVisibilityList = [
  { value: 'public', label: 'Public' },
  { value: 'logged_in_user', label: 'Logged in user' },
  { value: 'ifrc_only', label: 'IFRC only' },
];
