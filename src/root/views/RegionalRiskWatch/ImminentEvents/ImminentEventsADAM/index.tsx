import React from 'react';
import {
  isNotDefined,
  listToGroupList,
  _cs,
} from '@togglecorp/fujs';
import turfBbox from '@turf/bbox';

import useReduxState from '#hooks/useReduxState';
import { BBOXType, fixBounds } from '#utils/map';
import { ListResponse, useRequest } from '#utils/restRequest';
import BlockLoading from '#components/block-loading';
import { ADAMEvent } from '#types/risk';
import ADAMEventMap from '#components/RiskImminentEventMap/ADAMEventMap';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  regionId: number;
}

function ImminentEventsADAM(props: Props) {
  const {
    className,
    regionId,
  } = props;

  const allRegions = useReduxState('allRegions');
  const region = React.useMemo(() => (
    allRegions?.data.results.find(d => d.id === regionId)
  ), [allRegions, regionId]);

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
    skip: isNotDefined(regionId),
    url: 'risk://api/v1/adam-exposure/',
    query: {
      region: regionId,
      limit: 200,
    },
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

  const regionBounds = React.useMemo(
    () => {
      let bbox = turfBbox(region?.bbox ?? []);
      return fixBounds(bbox as BBOXType);
    },
    [region?.bbox],
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
          sidebarHeading={region?.region_name}
          hazardList={data}
          defaultBounds={regionBounds}
          onActiveEventChange={handleEventClick}
          activeEventUuid={activeEventUuid}
        />
      )}
    </>
  );
}

export default ImminentEventsADAM;
