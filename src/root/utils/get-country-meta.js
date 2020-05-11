import { countries } from './field-report-constants';
export function getCountryMeta (countryId) {
  const searchTerm = countryId.toString();
  const result = countries.find(d => d.value === searchTerm);
  return result || null;
}
