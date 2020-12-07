import { fetchJSON } from '#utils/network';
import { stringify as buildAPIQS } from 'qs';

import { fdrsAuth } from '#root/config';
import { countrySelector, fdrsByIso } from '#selectors';

// Properties to query from the FDRS API
const fdrsProps = [
  'Population',
  'GDP',
  'Poverty',
  'GNIPC',
  'LifeExp',
  'ChildMortality',
  'Literacy',
  'UrbPop',
  'MaternalMortality',
  'KPI_IncomeLC_CHF', // total income in CHF
  'KPI_expenditureLC_CHF', // total expenditure in CHF
  'KPI_PeopleVol_Tot', // total # volunteers
  'KPI_TrainFA_Tot', // # people trained in first aid
  'KPI_DonBlood_Tot', // # people giving blood
  'KPI_ReachDRER_D_Tot' // # people reached direct disaster response, recovery
];

const fdrsQuery = {
  indicator: fdrsProps.join(',')
};

export const GET_FDRS = 'GET_FDRS';
export function getFdrs (countryId) {
  return (dispatch, getState) => {
    const { iso } = countrySelector(getState(), countryId) || {};
    const fdrsCode = fdrsByIso(getState(), iso);
    if (!fdrsCode) {
      return {
        type: 'GET_FDRS_FAILED',
        error: new Error('We don\'t have a valid FDRS code for this country.')
      };
    }
    const f = buildAPIQS(Object.assign({
      KPI_Don_Code: fdrsCode
    }, fdrsQuery));
  
    dispatch(fetchJSON('https://data-api.ifrc.org/api/data?' + f, GET_FDRS, {
      headers: { Authorization: `Basic ${fdrsAuth}` }
    }));
  };
}
