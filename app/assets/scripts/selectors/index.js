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
