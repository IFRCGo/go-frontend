import React from 'react';
import { unique } from '@togglecorp/fujs';

import SearchSelectInput from '#components/SearchSelectInput';

import {
  useRequest,
  ListResponse,
} from '#utils/restRequest';
import {
  NumericValueOption,
  EventMini,
} from '#types';

type ValueType = string | number;
type StoredEventMini = Pick<EventMini, 'id' | 'name' | 'emergency_response_contact_email'>;

interface Props<N, V extends ValueType> {
  name: N;
  value: V | undefined | null;
  onChange: (newValue: V | undefined, name: N) => void;
  error?: React.ReactNode;
  fetchedEvents: StoredEventMini[];
  setFetchedEvents: React.Dispatch<React.SetStateAction<StoredEventMini[]>>;
}

function EmergencyEventInput<N, V extends ValueType> (props: Props<N, V>) {
  const {
    name,
    value,
    onChange,
    error,
    fetchedEvents,
    setFetchedEvents,
  } = props;

  type EventCallback = (options: NumericValueOption[]) => void;
  const [eventSearch, setEventSearch] = React.useState<string | undefined>();
  const eventCallbackRef = React.useRef<EventCallback>();

  useRequest<ListResponse<EventMini>>({
    skip: (eventSearch?.length ?? 0) < 3,
    url: 'api/v2/event/mini/',
    query: {
      auto_generated_source: 'New field report',
      search: eventSearch,
      limit: 20,
    },
    onSuccess: (response) => {
      if (eventCallbackRef.current) {
        const frOptions = response?.results?.map((e) => ({
          value: e.id,
          label: e.name,
        }));
        eventCallbackRef.current(frOptions ?? []);
        setFetchedEvents((oldEvents) => {
          const newEvents = unique(
            [
              ...oldEvents,
              ...(response?.results ?? []),
            ],
            d => d.id
          ) ?? [];

          return newEvents;
        });
      }
    }
  });

  const handleEventLoad = React.useCallback((
    input: string | undefined,
    callback: EventCallback,
  ) => {
    if (!input || input.length < 3) {
      callback([]);
    }

    setEventSearch(input);
    eventCallbackRef.current = callback;
  }, []);

  const initialOptions = React.useMemo(() => {
    const optionList = fetchedEvents.map((e) => ({
      value: e.id,
      label: e.name,
    }));

    return optionList;
  }, [fetchedEvents]);

  return (
    <SearchSelectInput
      name={name}
      value={value}
      onChange={onChange}
      loadOptions={handleEventLoad}
      initialOptions={initialOptions}
      defaultOptions
      error={error}
      placeholder="Type at least 3 characters to search"
    />
  );
}

export default EmergencyEventInput;
