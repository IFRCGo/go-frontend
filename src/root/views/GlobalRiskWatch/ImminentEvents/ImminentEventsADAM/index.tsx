import React from 'react';
import {
  listToGroupList,
  _cs,
} from '@togglecorp/fujs';

import { ListResponse, useRequest } from '#utils/restRequest';
import BlockLoading from '#components/block-loading';
import { ADAMEvent } from '#types/risk';
import ADAMEventMap from '#components/RiskImminentEventMap/ADAMEventMap';

import styles from './styles.module.scss';

interface Props {
  className?: string;
}

function ImminentEventsADAM(props: Props) {
  const {
    className,
  } = props;

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
    url: 'risk://api/v1/adam-exposure/',
    query: {
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

  const hasAdamEvents = response && response.results && response.results.length > 0;

  return (
    <>
      {pending && <BlockLoading />}
      {!pending && data && (
        <ADAMEventMap
          className={_cs(className, styles.map)}
          sidebarHeading="Global Imminent Events"
          hazardList={data}
          onActiveEventChange={handleEventClick}
          activeEventUuid={activeEventUuid}
        />
      )}
      {!pending && !hasAdamEvents && (
        <div className={styles.emptyMessage}>
          <div className={styles.text}>
            No ADAM events
          </div>
        </div>
      )}
    </>
  );
}

export default ImminentEventsADAM;
