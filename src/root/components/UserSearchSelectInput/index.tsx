import React  from 'react';
import SearchSelectInput, { Option } from '#components/SearchSelectInput';
import {
  useLazyRequest,
  ListResponse,
} from '#utils/restRequest';

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export function getDisplayName(user: User) {
  if (user.first_name || user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }

  return user.username;
}

type Key = string | number;

interface BaseProps<N> {
  name: N;
  initialOptions: Option[];
  isMulti?: boolean;
}

interface MultiSelectProps<N, V extends Key> {
  isMulti: true;
  value: V[] | undefined | null;
  onChange: (newValue: V[], name: N) => void;
}

interface SingleSelectProps<N, V extends Key> {
  isMulti?: false;
  value: V | undefined | null;
  onChange: (newValue: V, name: N) => void;
}

type Props<N, V extends Key> = BaseProps<N> & (SingleSelectProps<N, V> | MultiSelectProps<N, V>)

function isMultiValued<N, V extends Key>(props: Props<N, V>): props is (BaseProps<N> & MultiSelectProps<N, V>) {
  return !!props.isMulti;
}

function UserSearchSelectInput<N, V extends Key>(props: Props<N, V>) {
  const {
    name,
    initialOptions,
  } = props;

  const callbackRef = React.useRef<(opt: Option[]) => void | undefined>();

  const {
    trigger: triggerSearch,
  } = useLazyRequest<ListResponse<User>, string>({
    url: 'api/v2/users',
    query: (searchString: string) => ({
      name: searchString,
    }),
    onSuccess: (response) => {
      if (callbackRef.current) {
        callbackRef.current(response.results.map((user) => ({
          label: getDisplayName(user),
          value: user.id,
        })));
      }
    },
  });


  const handleUserSearch = React.useCallback((searchString: string | undefined, callback) => {
    if (searchString && searchString.length > 2) {
      triggerSearch(searchString);
    }

    callbackRef.current = callback;

    return [];
  }, [triggerSearch]);

  if (isMultiValued(props)) {
    return (
      <SearchSelectInput<N, V>
        name={name}
        isMulti
        initialOptions={initialOptions}
        value={props.value}
        onChange={props.onChange}
        loadOptions={handleUserSearch}
      />
    );
  }

  return (
    <SearchSelectInput<N, V>
      name={name}
      initialOptions={initialOptions}
      value={props.value}
      onChange={props.onChange}
      loadOptions={handleUserSearch}
    />
  );
}

export default UserSearchSelectInput;
