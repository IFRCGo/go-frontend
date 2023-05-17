import React from 'react';
import turfBbox from '@turf/bbox';
import {
  isNotDefined,
  isDefined,
  listToGroupList,
  listToMap,
  _cs,
} from '@togglecorp/fujs';

import { useRequest, ListResponse } from '#utils/restRequest';
import { BBOXType, fixBounds } from '#utils/map';
import { PDCEvent, PDCEventExposure } from '#types/risk';
import useReduxState from '#hooks/useReduxState';
import BlockLoading from '#components/block-loading';
import PDCEventMap from '#components/RiskImminentEventMap/PDCEventMap';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  regionId: number;
}

function ImminentEventsPDC(props: Props) {
  const {
    className,
    regionId,
  } = props;

  const allRegions = useReduxState('allRegions');
  const region = React.useMemo(() => (
    allRegions?.data.results.find(d => d.id === regionId)
  ), [allRegions, regionId]);

  const [activeEventUuid, setActiveEventUuid] = React.useState<string>();
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
    response: pdcResponse,
  } = useRequest<ListResponse<PDCEvent>>({
    skip: isNotDefined(regionId),
    url: 'risk://api/v1/imminent/',
    query: {
      region: regionId,
      limit: 200,
    },
  });

  const eventUuidToIdMap = React.useMemo(() => {
    if (!pdcResponse?.results) {
      return {};
    }

    return listToMap(pdcResponse.results, d => d.uuid, d => d.id);
  }, [pdcResponse?.results]);

  const eventId = isDefined(activeEventUuid) ? eventUuidToIdMap[activeEventUuid] : undefined;

  const {
    pending: activeEventExposurePending,
    response: activeEventExposure,
  } = useRequest<PDCEventExposure>({
    skip: isNotDefined(eventId),
    url: `risk://api/v1/imminent/${eventId}/exposure`,
  });

  const data = React.useMemo(() => {
    if (!pdcResponse || !pdcResponse.results) {
      return undefined;
    }

    const uuidGroupedHazardList = listToGroupList(
      pdcResponse.results,
      h => h.uuid,
    );

    const uniqueList = Object.values(uuidGroupedHazardList).map((hazardList) => {
      const sortedList = [...hazardList].sort((h1, h2) => {
        const date1 = new Date(h1.pdc_updated_at ?? h1.pdc_created_at ?? h1.created_at);
        const date2: Date = new Date(h2.pdc_updated_at ?? h2.pdc_created_at ?? h2.created_at);

        return date2.getTime() - date1.getTime();
      });

      let latestData = sortedList[0];

      return latestData;
    });

    return uniqueList;
  }, [pdcResponse]);

  const hasImminentEvents = pdcResponse && pdcResponse.results && pdcResponse.results.length > 0;
  const regionBounds = React.useMemo(
    () => {
      let bbox = turfBbox(region?.bbox ?? []);
      return fixBounds(bbox as BBOXType);
    },
    [region?.bbox],
  );

  return (
    <>
      {pending && <BlockLoading />}
      {!pending && data && (
        <PDCEventMap
          sidebarHeading={region?.region_name}
          className={_cs(className, styles.map)}
          hazardList={data}
          defaultBounds={regionBounds}
          onActiveEventChange={handleEventClick}
          activeEventUuid={activeEventUuid}
          activeEventExposure={activeEventExposure}
          activeEventExposurePending={activeEventExposurePending}
        />
      )}
      {!pending && !hasImminentEvents && (
        <div className={styles.emptyMessage}>
          <div className={styles.text}>
            No PDC events
          </div>
        </div>
      )}
    </>
  );
}

export default ImminentEventsPDC;
