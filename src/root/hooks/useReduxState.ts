import React from 'react';
import store from '#utils/store';
import {
  Country,
  Region,
  User,
} from '#types';

type StateKeys = 'user'
  | 'lang'
  | 'allCountries'
  | 'allRegions'
  | 'me'
  | 'disasterTypes';

export interface ReduxResponse<T> {
  cached?: boolean;
  fetching: boolean;
  fetched: boolean;
  receivedAt: string | null;
  data: T;
}

export interface OldListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface State {
  user: ReduxResponse<{
    expires: string;
    firstName: string;
    id: number;
    lastName: string;
    token: string;
    username: string;
  }>;
  lang: string;
  allCountries: ReduxResponse<OldListResponse<Country>>;
  allRegions: ReduxResponse<OldListResponse<Region>>;
  me: ReduxResponse<User>;
  disasterTypes:ReduxResponse<OldListResponse<{
    id: number;
    name: string;
    summary: string;
  }>>
}

/* eslint-disable no-redeclare */
function useReduxState(watchFor: 'allCountries'): State['allCountries']
function useReduxState(watchFor: 'allRegions'): State['allRegions']
function useReduxState(watchFor: 'me'): State['me']
function useReduxState(watchFor: 'lang'): State['lang']
function useReduxState(watchFor: 'disasterTypes'): State['disasterTypes']
function useReduxState(watchFor?: StateKeys): unknown {
/* elsint-enable no-redeclare */
  const [state, setState] = React.useState<State>(store.getState());

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState((prevState) => {
        const newState = store.getState();
        if (!watchFor) {
          return newState;
        }

        if (prevState[watchFor] !== newState[watchFor]) {
          return newState;
        }

        return prevState;
      });
    });

    return unsubscribe;
  }, [watchFor]);

  return (watchFor ? state[watchFor] : state);
}

export default useReduxState;
