import store from './store';
import { disasterTypesSelectSelector } from '#selectors';

export function getDtypeMeta (dtypeId) {
  const state = store.getState();
  const disasterTypesSelect = disasterTypesSelectSelector(state);
  const searchTerm = dtypeId.toString();
  const result = disasterTypesSelect.find(d => d.value === searchTerm);
  return result || null;
}
