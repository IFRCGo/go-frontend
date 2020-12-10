import { stateInflight, stateError, stateSuccess } from '#utils/reducer-utils';
import { PER_EXPORT_TO_CSV } from '#actions';

const initialState = {
  fetching: false,
  fetched: false,
  receivedAt: null,
  data: {}
};

export default function exportPerToCSV (state = initialState, action) {
  switch (action.type) {
    case `${PER_EXPORT_TO_CSV}_INFLIGHT`:
      state = stateInflight(state, action);
      break;
    case `${PER_EXPORT_TO_CSV}_FAILED`:
      state = stateError(state, action);
      break;
    case `${PER_EXPORT_TO_CSV}_SUCCESS`:
      state = stateSuccess(state, action);
      break;
    case 'CLEAR_LOADED_CSV':
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
