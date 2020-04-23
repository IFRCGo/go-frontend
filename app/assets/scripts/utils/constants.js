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
    title: 'Health (public)',
    color: '#a6d854',
    inputValue: 'Health Public',
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
    title: 'NS Strengthening',
    color: '#b3b3b3',
    inputValue: 'NS Strengthening',
  },
  {
    key: '8',
    title: 'Education',
    color: '#b3b3b3',
    inputValue: 'Education',
  },
  {
    key: '9',
    title: 'Livelihoods and basic needs',
    color: '#b3b3b3',
    inputValue: 'Livelihoods And Basic Needs',
  },
  {
    key: '10',
    title: 'Health (clinical)',
    color: '#a6d854',
    inputValue: 'Health Clinical',
  },
];

export const secondarySectorList = [
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
    title: 'Health (public)',
    color: '#a6d854',
    inputValue: 'Health Public',
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
    title: 'NS Strengthening',
    color: '#b3b3b3',
    inputValue: 'NS Strengthening',
  },
  {
    key: '8',
    title: 'Education',
    color: '#b3b3b3',
    inputValue: 'Education',
  },
  {
    key: '9',
    title: 'Livelihoods and basic needs',
    color: '#b3b3b3',
    inputValue: 'Livelihoods And Basic Needs',
  },
  {
    key: '10',
    title: 'Recovery',
    color: '#b3b3b3',
    inputValue: 'Recovery',
  },
  {
    key: '11',
    title: 'Internal displacement',
    color: '#b3b3b3',
    inputValue: 'Internal Displacement',
  },
  {
    key: '12',
    title: 'Health (clinical)',
    color: '#a6d854',
    inputValue: 'Health Clinical',
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
  { value: 'Programme', label: 'Programme' },
  { value: 'Emergency Operation', label: 'Emergency operation' },
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
