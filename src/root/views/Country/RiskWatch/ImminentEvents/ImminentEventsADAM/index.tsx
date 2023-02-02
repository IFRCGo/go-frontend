import React from 'react';
import {
  isNotDefined,
  listToGroupList,
  _cs,
} from '@togglecorp/fujs';
import turfBbox from '@turf/bbox';

import useReduxState from '#hooks/useReduxState';
import BlockLoading from '#components/block-loading';
import { useRequest, ListResponse } from '#utils/restRequest';
import {
  fixBounds,
  BBOXType,
} from '#utils/map';
import { ADAMEvent } from '#types';
import ADAMEventMap from '#components/RiskImminentEventMap/ADAMEventMap';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  countryId: number;
}

function ImminentEventsADAM(props: Props) {
  const {
    className,
    countryId,
  } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);

  const [activeEventUuid, setActiveEventUuid] = React.useState<string | undefined>(undefined);

  const handleEventClick = React.useCallback((eventUuid: string | undefined) => {
    setActiveEventUuid((oldEventUuid) => {
      if (oldEventUuid === eventUuid) {
        return undefined;
      }

      return eventUuid;
    });
  }, []);

  const {
    pending,
    response,
  } = useRequest<ListResponse<ADAMEvent>>({
    skip: isNotDefined(country),
    url: 'risk://api/v1/adam-exposure/',
    query: { iso3: country?.iso3?.toLocaleLowerCase() },
  });

  const data = React.useMemo(() => {
    if (!response || !response.results) {
      return undefined;
    }

    const uuidGroupedHazardList = listToGroupList(
      response.results,
      h => h.event_id,
    );

    const uniqueList = Object.values(uuidGroupedHazardList).map((hazardList) => {
      const sortedList = [...hazardList].sort((h1, h2) => {
        const date1 = new Date(h1.publish_date);
        const date2 = new Date(h2.publish_date);

        return date2.getTime() - date1.getTime();
      });

      let latestData = sortedList[0];

      return latestData;
    });

    return uniqueList;
  }, [response]);

  const countryBounds = React.useMemo(
    () => {
      let bbox = turfBbox(country?.bbox ?? []);
      return fixBounds(bbox as BBOXType);
    },
    [country?.bbox],
  );

  if ((!pending && !response?.results) || data?.length === 0) {
    return null;
  }

  return (
    <>
      {pending && <BlockLoading />}
      {!pending && data && (
        <ADAMEventMap
          className={_cs(className, styles.map)}
          sidebarHeading={country?.name}
          hazardList={data}
          defaultBounds={countryBounds}
          onActiveEventChange={handleEventClick}
          activeEventUuid={activeEventUuid}
        />
      )}
    </>
  );
}

export default ImminentEventsADAM;
