import React from 'react';

import {
  isNotDefined,
  listToGroupList,
  listToMap,
  isDefined,
} from '@togglecorp/fujs';
import turfBbox from '@turf/bbox';
import BlockLoading from '#components/block-loading';
import useReduxState from '#hooks/useReduxState';
import { useRequest, ListResponse } from '#utils/restRequest';

import {
  fixBounds,
  BBOXType,
} from '#utils/map';
import { PDCEvent, PDCEventExposure } from '#types';
import PDCEventMap from '#components/RiskImminentEventMap/PDCEventMap';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  countryId: number;
  onLoad: (numEvents: number | undefined) => void;
}

function ImminentEventsPDC(props: Props) {
  const {
    className,
    countryId,
    onLoad,
  } = props;
  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);
  const [activeEventUuid, setActiveEventUuid] = React.useState<string | undefined>(undefined);

  const {
    pending,
    response: pdcResponse,
  } = useRequest<ListResponse<PDCEvent>>({
    skip: !country,
    url: 'risk://api/v1/imminent/',
    query: { iso3: country?.iso3?.toLocaleLowerCase() },
    onSuccess: (response) => {
      onLoad(response.results?.length);
    },
    onFailure: () => {
      onLoad(undefined);
    }
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

  const countryBounds = React.useMemo(
    () => {
      let bbox = turfBbox(country?.bbox ?? []);
      return fixBounds(bbox as BBOXType);
    },
    [country?.bbox],
  );


  const handleEventClick = React.useCallback((eventUuid: string | undefined) => {
    setActiveEventUuid((oldEventUuid) => {
      if (oldEventUuid === eventUuid) {
        return undefined;
      }

      return eventUuid;
    });
  }, []);

  if ((!pending && !pdcResponse?.results) || data?.length === 0) {
    return (
      <div className={styles.empty}>
        There are currently no events!
      </div>
    );
  }

  return (
    <>
      {pending && <BlockLoading />}
      {!pending && data && (
        <PDCEventMap
          className={className}
          sidebarHeading={country?.name}
          hazardList={data}
          defaultBounds={countryBounds}
          onActiveEventChange={handleEventClick}
          activeEventUuid={activeEventUuid}
          activeEventExposure={activeEventExposure}
          activeEventExposurePending={activeEventExposurePending}
        />
      )}
    </>
  );
}

export default ImminentEventsPDC;
