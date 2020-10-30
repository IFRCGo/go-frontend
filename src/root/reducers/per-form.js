import { combineReducers } from 'redux';

import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { RESET_PER_STATE } from '#actions';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function assessmentTypes (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_ASSESSMENT_TYPES_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_ASSESSMENT_TYPES_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_ASSESSMENT_TYPES_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function createPerForm (state = initialState, action) {
  switch (action.type) {
    case 'CREATE_PER_FORM_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'CREATE_PER_FORM_FAILED':
      state = stateError(state, action);
      break;
    case 'CREATE_PER_FORM_SUCCESS':
      state = stateSuccess(state, action);
      break;
    case RESET_PER_STATE:
      state = Object.assign({}, state, {
        error: null,
        fetching: false,
        fetched: false,
        receivedAt: null,
        data: {}
      });
      break;
  }
  return state;
}

function updatePerForm (state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_PER_FORM_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'UPDATE_PER_FORM_FAILED':
      state = stateError(state, action);
      break;
    case 'UPDATE_PER_FORM_SUCCESS':
      state = stateSuccess(state, action);
      break;
    case RESET_PER_STATE:
      state = Object.assign({}, state, {
        error: null,
        fetching: false,
        fetched: false,
        receivedAt: null,
        data: {}
      });
      break;
  }
  return state;
}

function deletePerForm (state = initialState, action) {
  switch (action.type) {
    case 'DELETE_PER_FORM_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'DELETE_PER_FORM_FAILED':
      state = stateError(state, action);
      break;
    case 'DELETE_PER_FORM_SUCCESS':
      state = stateSuccess(state, action);
      break;
    case RESET_PER_STATE:
      state = Object.assign({}, state, {
        error: null,
        fetching: false,
        fetched: false,
        receivedAt: null,
        data: {}
      });
      break;
  }
  return state;
}

function getPerCountries (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_COUNTRIES_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_COUNTRIES_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_COUNTRIES_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function getPerForms (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_FORMS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_FORMS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_FORMS_SUCCESS':
      state = stateSuccess(state, action);
      break;
    case RESET_PER_STATE:
      state = Object.assign({}, state, {
        error: null,
        fetching: false,
        fetched: false,
        receivedAt: null,
        data: {}
      });
      break;
  }
  return state;
}

function getPerForm (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_FORM_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_FORM_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_FORM_SUCCESS':
      state = stateSuccess(state, action);
      break;
    case RESET_PER_STATE:
      state = Object.assign({}, state, {
        error: null,
        fetching: false,
        fetched: false,
        receivedAt: null,
        data: {}
      });
      break;
  }
  return state;
}

function getCollaboratingPerCountry (state = initialState, action) {
  switch (action.type) {
    case 'COLLABORATING_PER_COUNTRY_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'COLLABORATING_PER_COUNTRY_FAILED':
      state = stateError(state, action);
      break;
    case 'COLLABORATING_PER_COUNTRY_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function getPerEngagedNsPercentage (state = initialState, action) {
  switch (action.type) {
    case 'PER_ENGAGED_NS_PERCENTAGE_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'PER_ENGAGED_NS_PERCENTAGE_FAILED':
      state = stateError(state, action);
      break;
    case 'PER_ENGAGED_NS_PERCENTAGE_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export function getPerGlobalPreparedness (state = initialState, action) {
  switch (action.type) {
    case 'PER_GLOBAL_PREPAREDNESS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'PER_GLOBAL_PREPAREDNESS_FAILED':
      state = stateError(state, action);
      break;
    case 'PER_GLOBAL_PREPAREDNESS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export function getPerNsPhase (state = initialState, action) {
  switch (action.type) {
    case 'PER_NS_PHASE_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'PER_NS_PHASE_FAILED':
      state = stateError(state, action);
      break;
    case 'PER_NS_PHASE_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export function getPerOverviewForm (state = initialState, action) {
  switch (action.type) {
    case 'PER_OVERVIEW_FORM_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'PER_OVERVIEW_FORM_FAILED':
      state = stateError(state, action);
      break;
    case 'PER_OVERVIEW_FORM_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export function getPerWorkPlan (state = initialState, action) {
  switch (action.type) {
    case 'PER_WORK_PLAN_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'PER_WORK_PLAN_FAILED':
      state = stateError(state, action);
      break;
    case 'PER_WORK_PLAN_SUCCESS':
      state = stateSuccess(state, action);
      break;
    case 'ADD_NES_PER_WORK_PLAN':
      state.fetched = true;
      state.data.results.push(action.workplan);
      break;
    case 'DELETE_PER_WORK_PLAN_STATE':
      state.data.results = state.data.results.filter((workplan) => workplan.id !== action.wid);
      break;
  }
  return state;
}

export function createPerOverview (state = initialState, action) {
  switch (action.type) {
    case 'CREATE_PER_OVERVIEW_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'CREATE_PER_OVERVIEW_FAILED':
      state = stateError(state, action);
      break;
    case 'CREATE_PER_OVERVIEW_SUCCESS':
      state = stateSuccess(state, action);
      break;
    case RESET_PER_STATE:
      state = Object.assign({}, state, {
        error: null,
        fetching: false,
        fetched: false,
        receivedAt: null,
        data: {}
      });
      break;
  }
  return state;
}

export function updatePerOverview (state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_PER_OVERVIEW_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'UPDATE_PER_OVERVIEW_FAILED':
      state = stateError(state, action);
      break;
    case 'UPDATE_PER_OVERVIEW_SUCCESS':
      state = stateSuccess(state, action);
      break;
    case RESET_PER_STATE:
      state = Object.assign({}, state, {
        error: null,
        fetching: false,
        fetched: false,
        receivedAt: null,
        data: {}
      });
      break;
  }
  return state;
}

export function deletePerOverview (state = initialState, action) {
  switch (action.type) {
    case 'DELETE_PER_OVERVIEW_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'DELETE_PER_OVERVIEW_FAILED':
      state = stateError(state, action);
      break;
    case 'DELETE_PER_OVERVIEW_SUCCESS':
      state = stateSuccess(state, action);
      break;
    case RESET_PER_STATE:
      state = Object.assign({}, state, {
        error: null,
        fetching: false,
        fetched: false,
        receivedAt: null,
        data: {}
      });
      break;
  }
  return state;
}

export function sendPerWorkplan (state = initialState, action) {
  switch (action.type) {
    case 'SEND_PER_WORKPLAN_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'SEND_PER_WORKPLAN_FAILED':
      state = stateError(state, action);
      break;
    case 'SEND_PER_WORKPLAN_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export function deletePerWorkplanApi (state = initialState, action) {
  switch (action.type) {
    case 'DELETE_PER_WORKPLAN_API_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'DELETE_PER_WORKPLAN_API_FAILED':
      state = stateError(state, action);
      break;
    case 'DELETE_PER_WORKPLAN_API_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export function getPerUploadedDocuments (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_UPLOADED_DOCUMENTS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_UPLOADED_DOCUMENTS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_UPLOADED_DOCUMENTS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export function getPerMission (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_MISSION_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_MISSION_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_MISSION_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

export default combineReducers({
  assessmentTypes,
  createPerForm,
  updatePerForm,
  deletePerForm,
  getPerCountries,
  getPerForms,
  getPerForm,
  getCollaboratingPerCountry,
  getPerEngagedNsPercentage,
  getPerGlobalPreparedness,
  getPerNsPhase,
  getPerOverviewForm,
  getPerWorkPlan,
  createPerOverview,
  updatePerOverview,
  deletePerOverview,
  sendPerWorkplan,
  deletePerWorkplanApi,
  getPerUploadedDocuments,
  getPerMission
});
