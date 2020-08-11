// import { getResponseFromRequest } from '#utils/request';
import _groupBy from 'lodash.groupby';
import _find from 'lodash.find';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export const countriesSelector = (state) => {
  if (state.countries.data.results && state.countries.data.results.length) {
    let results = state.countries.data.results.map((country) => {
      return {
        'value': country.id,
        'label': country.name || null,
        'iso': country.iso || null,
        'iso3': country.iso3 || null,
        'region': country.region,
        'bbox': country.bbox,
        'centroid': country.centroid,
        'independent': country.independent,
        'society_name': country.society_name,
        'society_url': country.society_url,
        'url_ifrc': country.url_ifrc,
        'overview': country.overview,
        'key_priorities': country.key_priorities,
        'record_type': country.record_type,
        'inform_score': country.inform_score
      };
    });
    return results;
  } else {
    return initialState;
  }
};

export const countriesByRegionSelector = (state) => {
  if (state.countries && state.countries.data.results) {
    let countriesByRegion = _groupBy(state.countries.data.results, 'region');
    return countriesByRegion;
  } else {
    return initialState;
  }
};

export const countrySelector = (state, countryId) => {
  if (state.countries && state.countries.data.results) {
    countryId = typeof(countryId) === "string" ? Number(countryId) : countryId;
    let thisCountry = _find(state.countries.data.results, { 'id': countryId } );
    return thisCountry;
  } else {
    return null;
  }
};

export const countriesByIso = (state) => {
  if (state.countries && state.countries.data.results) {
    let countriesByIso = _groupBy(state.countries.data.results, 'iso');
    return countriesByIso;
  } else {
    return null;
  }
};

export const countryOverviewSelector = (state) => (
  state.countryOverview
);

export const countryProjectSelector = (state, id) => (
  state.projects[id] || initialState
);

export const meSelector = (state) => (
  state.me
);

export const regionalMovementActivitiesSelector = (state) => (
  state.regionalMovementActivities
);

export const regionalProjectsOverviewSelector = (state) => (
  state.regionalProjectsOverview
);

export const nationalSocietyActivitiesSelector = (state) => (
  state.nationalSocietyActivities
);

export const nationalSocietyActivitiesWoFiltersSelector = (state) => (
  state.nationalSocietyActivitiesWoFilters
);

export const regionalProjectsSelector = (state) => (
  state.regionalProjects
);

export const projectDeleteSelector = (state) => (
  state.projectDelete
);

export const projectFormSelector = (state) => (
  state.projectForm
);

export const languageSelector = (state) => (
  state.lang
);

export const languageResponseSelector = (state) => (
  state.lang
);

export const currentLanguageSelector = (state) => (
  languageSelector(state).current
);

export const languageDataSelector = (state) => (
  languageSelector(state).data
);

export const languageStringsSelector = (state) => (
  languageSelector(state).strings
);

export const currentLanguageStringsSelector = languageStringsSelector;

export const languageBulkResponseSelector = (state) => (
  state.postLanguageBulk
);

export const currentLangugageSelector = (state) => (
  languageSelector(state).current || 'en'
);

export const userResponseSelector = (state) => (
  state.me || {}
);

export const userSelector = (state) => (
  userResponseSelector(state).data
);
