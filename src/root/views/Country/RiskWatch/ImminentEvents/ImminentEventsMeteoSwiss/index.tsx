import React from 'react';
import {
  isNotDefined,
  listToGroupList,
  _cs,
} from '@togglecorp/fujs';

import { useRequest, ListResponse } from '#utils/restRequest';
import useReduxState from '#hooks/useReduxState';
import { MeteoSwissEvent, MeteoSwissExposure } from '#types/risk';
import BlockLoading from '#components/block-loading';
import MeteoSwissEevnt from '#components/RiskImminentEventMap/MeteoSwissEvent';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  countryId: number;
}

function ImminentEventsMeteoSwiss(props: Props) {
  const {
    className,
    countryId,
  } = props;

  const allCountries = useReduxState('allCountries');
  const [activeEventId, setActiveEventId] = React.useState<number | undefined>(undefined);

  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);

  const {
    pending,
    response: meteoSwissResponse,
  } = useRequest<ListResponse<MeteoSwissEvent>>({
    skip: isNotDefined(country),
    url: 'risk://api/v1/meteoswiss/',
    query: { iso3: country?.iso3?.toLocaleLowerCase() },
  });

  const handleEventClick = React.useCallback((eventUuid: number | undefined) => {
    setActiveEventId((oldEventUuid) => {
      if (oldEventUuid === eventUuid) {
        return undefined;
      }

      return eventUuid;
    });
  }, []);

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

  return (
    <>
      {pending && <BlockLoading />}
      {!pending && data && (
        <MeteoSwissEevnt
          sidebarHeading={country?.name}
          className={_cs(className, styles.map)}
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
