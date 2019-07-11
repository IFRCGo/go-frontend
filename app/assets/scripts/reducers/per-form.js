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
  getPerOverviewForm
});
