import React from 'react';
import {
  isDefined,
  isNotDefined,
  listToGroupList,
  listToMap,
  _cs,
} from '@togglecorp/fujs';

import { useRequest, ListResponse } from '#utils/restRequest';
import useReduxState from '#hooks/useReduxState';
import { GDACSEvent, GDACSEventExposure } from '#types/risk';
import BlockLoading from '#components/block-loading';
import GDACSEventMap from '#components/RiskImminentEventMap/GDACSEventMap';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  regionId: number;
}

function ImminentEventsGDACS(props: Props) {
  const {
    className,
    regionId,
  } = props;
  const allRegions = useReduxState('allRegions');
  const [activeEventUuid, setActiveEventUuid] = React.useState<number>();

  const {
    pending,
    response: gdacsResponse,
  } = useRequest<ListResponse<GDACSEvent>>({
    skip: isNotDefined(regionId),
    url: 'risk://api/v1/gdacs/',
    query: {
      region: regionId,
      limit: 200,
    },
  });

  const data = React.useMemo(() => {
    if (isNotDefined(gdacsResponse) || isNotDefined(gdacsResponse.results)) {
      return undefined;
    }

    const uuidGroupedHazardList = listToGroupList(
      gdacsResponse.results,
      h => h.hazard_id,
    );

    const uniqueList = Object.values(uuidGroupedHazardList).map((hazardList) => {
      const sortedList = [...hazardList].sort((h1, h2) => {
        const date1 = new Date(h1.created_at);
        const date2 = new Date(h2.created_at);

        return date2.getTime() - date1.getTime();
      });

      let latestData = sortedList[0];
      return latestData;
    });

    return uniqueList;
  }, [gdacsResponse]);

  const eventUuidToIdMap = React.useMemo(() => {
    if (!gdacsResponse?.results) {
      return {};
    }

    return listToMap(gdacsResponse.results, d => d.hazard_id, d => d.id);
  }, [gdacsResponse?.results]);

  const eventId = isDefined(activeEventUuid) ? eventUuidToIdMap[activeEventUuid] : undefined;

  const region = React.useMemo(() => (
    allRegions?.data.results.find(d => d.id === regionId)
  ), [allRegions, regionId]);

  const handleEventClick = React.useCallback((eventUuid: number | undefined) => {
    setActiveEventUuid((oldEventUuid) => {
      if (oldEventUuid === eventUuid) {
        return undefined;
      }
      return eventUuid;
    });
  }, []);

  const {
    pending: activeEventExposurePending,
    response: activeEventExposure,
  } = useRequest<GDACSEventExposure>({
    skip: isNotDefined(eventId),
    url: `risk://api/v1/gdacs/${eventId}/exposure`,
  });

  const hasGdacsEvents = gdacsResponse && gdacsResponse.results && gdacsResponse.results.length > 0;

  return (
    <>
      {pending && <BlockLoading />}
      {!pending && data && (
        <GDACSEventMap
          sidebarHeading={region?.region_name}
          className={_cs(className, styles.map)}
          hazardList={data}
          onActiveEventChange={handleEventClick}
          activeEventUuid={activeEventUuid}
          activeEventExposure={activeEventExposure}
          activeEventExposurePending={activeEventExposurePending}
        />
      )}
      {!pending && !hasGdacsEvents && (
        <div className={styles.emptyMessage}>
          <div className={styles.text}>
            No GDACS events
          </div>
        </div>
      )}
    </>
  );
}

export default ImminentEventsGDACS;

