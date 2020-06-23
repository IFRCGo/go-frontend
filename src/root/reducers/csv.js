import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { combineReducers } from 'redux';

const initialState = {};

function list (state = initialState, action) {
  switch (action.type) {
    case 'GET_LIST_CSV_INFLIGHT':
      state = Object.assign({}, state, {
        [action.id]: stateInflight(state, action)
      });
      break;
    case 'GET_LIST_CSV_FAILED':
      state = Object.assign({}, state, {
        [action.id]: stateError(state, action)
      });
      break;
    case 'GET_LIST_CSV_SUCCESS':
      state = Object.assign({}, state, {
        [action.id]: stateSuccess(state, action)
      });
      break;
    case 'CLEAR_LOADED_CSV':
      console.log('clearing', state);
      state = Object.assign({}, state);
      console.log(state);
      delete state[action.id];
      break;
  }
  return state;
}

export default combineReducers({
  list
});
