'use strict';
import { combineReducers } from 'redux';

import { stateInflight, stateError, stateSuccess } from '../utils/reducer-utils';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

function sendPerForm (state = initialState, action) {
  switch (action.type) {
    case 'SEND_PER_FORM_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'SEND_PER_FORM_FAILED':
      state = stateError(state, action);
      break;
    case 'SEND_PER_FORM_SUCCESS':
      state = stateSuccess(state, action);
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

function getPerDocuments (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_DOCUMENTS_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_DOCUMENTS_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_DOCUMENTS_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function getPerDocument (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_DOCUMENT_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_DOCUMENT_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_DOCUMENT_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function getPerDraftDocument (state = initialState, action) {
  switch (action.type) {
    case 'GET_PER_DRAFT_DOCUMENT_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'GET_PER_DRAFT_DOCUMENT_FAILED':
      state = stateError(state, action);
      break;
    case 'GET_PER_DRAFT_DOCUMENT_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function sendPerDraft (state = initialState, action) {
  switch (action.type) {
    case 'SEND_PER_DRAFT_DOCUMENT_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'SEND_PER_DRAFT_DOCUMENT_FAILED':
      state = stateError(state, action);
      break;
    case 'SEND_PER_DRAFT_DOCUMENT_SUCCESS':
      state = stateSuccess(state, action);
      break;
  }
  return state;
}

function editPerDocument (state = initialState, action) {
  switch (action.type) {
    case 'EDIT_PER_DOCUMENT_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'EDIT_PER_DOCUMENT_FAILED':
      state = stateError(state, action);
      break;
    case 'EDIT_PER_DOCUMENT_SUCCESS':
      state = stateSuccess(state, action);
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

export function sendPerOverview (state = initialState, action) {
  switch (action.type) {
    case 'PER_SEND_OVERVIEW_INFLIGHT':
      state = stateInflight(state, action);
      break;
    case 'PER_SEND_OVERVIEW_FAILED':
      state = stateError(state, action);
      break;
    case 'PER_SEND_OVERVIEW_SUCCESS':
      state = stateSuccess(state, action);
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
  sendPerForm,
  getPerCountries,
  getPerDocuments,
  getPerDocument,
  getPerDraftDocument,
  sendPerDraft,
  editPerDocument,
  getCollaboratingPerCountry,
  getPerEngagedNsPercentage,
  getPerGlobalPreparedness,
  getPerNsPhase,
  getPerOverviewForm,
  getPerWorkPlan,
  sendPerOverview,
  sendPerWorkplan,
  deletePerWorkplanApi,
  getPerUploadedDocuments,
  getPerMission
});
