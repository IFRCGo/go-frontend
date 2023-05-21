export function getCountryMeta (countryId, countries) {
  countryId = typeof(countryId) === "string" ? Number(countryId) : countryId;
  const result = countries.find(d => d.value === countryId);
  return result || null;
}
