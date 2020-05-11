import { disasterType } from './field-report-constants';
export function getDtypeMeta (dtypeId) {
  const searchTerm = dtypeId.toString();
  const result = disasterType.find(d => d.value === searchTerm);
  return result || null;
}
