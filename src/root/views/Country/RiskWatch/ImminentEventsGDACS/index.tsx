import React from 'react';
import {
  isDefined,
  isNotDefined,
  listToGroupList,
  listToMap,
  _cs,
} from '@togglecorp/fujs';
import turfBbox from '@turf/bbox';

import { useRequest, ListResponse } from '#utils/restRequest';
import useReduxState from '#hooks/useReduxState';
import { GDACSEvent, GDACSEventExposure } from '#types/risk';
import BlockLoading from '#components/block-loading';
import GDACSEventMap from '#components/RiskImminentEventMap/GDACSEventMap';
import { BBOXType, fixBounds } from '#utils/map';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  countryId: number;
  onLoad: (numEvents: number | undefined) => void;
}

function ImminentEventsGDACS(props: Props) {
  const {
    className,
    countryId,
    onLoad,
  } = props;

  const [activeEventUuid, setActiveEventUuid] = React.useState<number>();
  const allCountries = useReduxState('allCountries');

  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);

  const {
    pending,
    response: gdacsResponse,
  } = useRequest<ListResponse<GDACSEvent>>({
    skip: isNotDefined(country),
    url: 'risk://api/v1/gdacs/',
    query: { iso3: country?.iso3?.toLocaleLowerCase() },
    onSuccess: (response) => {
      onLoad(response.results?.length);
    },
    onFailure: () => {
      onLoad(undefined);
    }
  });

  const data = React.useMemo(() => {
    if (isNotDefined(gdacsResponse) || isNotDefined(gdacsResponse.results)) {
      return [];
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

  const countryBounds = React.useMemo(
    () => {
      let bbox = turfBbox(country?.bbox ?? []);
      return fixBounds(bbox as BBOXType);
    },
    [country?.bbox],
  );
  const hasGdacsEvents = gdacsResponse && gdacsResponse.results && gdacsResponse.results.length > 0;

  return (
    <>
      {pending && <BlockLoading className={styles.loading} />}
      <GDACSEventMap
        sidebarHeading={country?.name}
        className={_cs(className, styles.map)}
        hazardList={data}
        onActiveEventChange={handleEventClick}
        activeEventUuid={activeEventUuid}
        activeEventExposure={activeEventExposure}
        activeEventExposurePending={activeEventExposurePending}
        defaultBounds={countryBounds}
      />
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
