// import { getResponseFromRequest } from '#utils/request';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
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
