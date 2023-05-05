import React from 'react';
import { isNotDefined, listToGroupList, _cs } from '@togglecorp/fujs';
import useReduxState from '#hooks/useReduxState';
import BlockLoading from '#components/block-loading';
import MeteoSwissEevnt from '#components/RiskImminentEventMap/MeteoSwissEvent';
import { ListResponse, useRequest } from '#utils/restRequest';
import { MeteoSwissEvent, MeteoSwissExposure } from '#types/risk';
import styles from './styles.module.scss';

interface Props {
  className: string;
  regionId: number;
}

function ImminentEventsMeteoSwiss(props: Props) {
  const {
    className,
    regionId,
  } = props;
  const allRegions = useReduxState('allRegions');

  const [activeEventId, setActiveEventId] = React.useState<number | undefined>(undefined);
  const region = React.useMemo(() => (
    allRegions?.data.results.find(d => d.id === regionId)
  ), [allRegions, regionId]);

  const handleEventClick = React.useCallback((eventUuid: number | undefined) => {
    setActiveEventId((oldEventUuid) => {
      if (oldEventUuid === eventUuid) {
        return undefined;
      }

      return eventUuid;
    });
  }, []);

  const {
    pending,
    response: meteoSwissResponse,
  } = useRequest<ListResponse<MeteoSwissEvent>>({
    skip: isNotDefined(regionId),
    url: 'risk://api/v1/meteoswiss/',
    query: {
      region: regionId,
      limit: 200,
    },
  });

  const {
    pending: activeEventExposurePending,
    response: activeEventExposure,
  } = useRequest<MeteoSwissExposure>({
    skip: isNotDefined(activeEventId),
    url: `risk://api/v1/meteoswiss/${activeEventId}/exposure`,
  });

  const data = React.useMemo(() => {
    if (!meteoSwissResponse || !meteoSwissResponse.results) {
      return undefined;
    }

    const uuidGroupedHazardList = listToGroupList(
      meteoSwissResponse.results,
      h => h.id,
    );

    const uniqueList = Object.values(uuidGroupedHazardList).map((hazardList) => {
      const sortedList = [...hazardList].sort((h1, h2) => {
        const date1 = new Date(h1.start_date);
        const date2: Date = new Date(h2.start_date);

        return date2.getTime() - date1.getTime();
      });

      let latestData = sortedList[0];

      return latestData;
    });

    return uniqueList;
  }, [meteoSwissResponse]);

  const hasMeteoSwissEvents = meteoSwissResponse && meteoSwissResponse.results && meteoSwissResponse.results.length > 0;
  console.log("meteo swiss", meteoSwissResponse, data);

  return  (
    <>
      {pending && <BlockLoading />}
      {!pending && data && (
        <MeteoSwissEevnt
          className={_cs(className, styles.map)}
          sidebarHeading={region?.region_name}
          hazardList={data}
          onActiveEventChange={handleEventClick}
          activeEventUuid={activeEventId}
          activeEventExposure={activeEventExposure}
          activeEventExposurePending={activeEventExposurePending}
        />
      )}
      {!pending && !hasMeteoSwissEvents && (
        <div className={styles.emptyMessage}>
          <div className={styles.text}>
            No MeteoSwiss events
          </div>
        </div>
      )}
    </>
  );
}

export default ImminentEventsMeteoSwiss;

