import React from 'react';
import { isDefined, isNotDefined, listToGroupList, listToMap, _cs } from '@togglecorp/fujs';
import turfBbox from '@turf/bbox';
import { useRequest, ListResponse } from '#utils/restRequest';
import useReduxState from '#hooks/useReduxState';
import { GDACSEvent, GDACSEventExposure } from '#types/risk';
import BlockLoading from '#components/block-loading';
import { BBOXType, fixBounds } from '#utils/map';

import styles from './styles.module.scss';
import GDACSEventMap from '#components/RiskImminentEventMap/GDACSEventMap';

interface Props {
    className?: string;
    regionId: number;
}

function ImminentEventsGDACS(props: Props) {
    const {
        className,
        regionId,
    } = props;

    const [activeEventUuid, setActiveEventUuid] = React.useState<number>();
    const handleEventClick = React.useCallback((eventUuid: number | undefined) => {
        setActiveEventUuid((oldEventUuid) => {
            if (oldEventUuid === eventUuid) {
                return undefined;
            }

            return eventUuid;
        });
    }, []);
    const allRegions = useReduxState('allRegions');
    const region = React.useMemo(() => (
        allRegions?.data.results.find(d => d.id === regionId)
    ), [allRegions, regionId]);

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

    const eventUuidToIdMap = React.useMemo(() => {
        if (!gdacsResponse?.results) {
            return {};
        }

        return listToMap(gdacsResponse.results, d => d.event_details.eventid, d => d.id);
    }, [gdacsResponse?.results]);

    const eventId = isDefined(activeEventUuid) ? eventUuidToIdMap[activeEventUuid] : undefined;


    const {
        pending: activeEventExposurePending,
        response: activeEventExposure,
    } = useRequest<GDACSEventExposure>({
        skip: isNotDefined(eventId),
        url: `risk://api/v1/gdacs/${eventId}/exposure`,
    });

    const data = React.useMemo(() => {
        if (!gdacsResponse || !gdacsResponse.results) {
            return undefined;
        }

        const uuidGroupedHazardList = listToGroupList(
            gdacsResponse.results,
            h => h.event_details.eventid,
        );

        const uniqueList = Object.values(uuidGroupedHazardList).map((hazardList) => {
            const sortedList = [...hazardList].sort((h1, h2) => {
                const date1 = new Date(h1.created_at ?? h1.start_date ?? h1.end_date);
                const date2: Date = new Date(h2.created_at ?? h2.start_date ?? h2.end_date);

                return date2.getTime() - date1.getTime();
            });

            let latestData = sortedList[0];

            return latestData;
        });

        return uniqueList;
    }, [gdacsResponse]);
    const hasImminentEvents = gdacsResponse && gdacsResponse.results && gdacsResponse.results.length > 0;

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
                <GDACSEventMap
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
                        No GDACS events
                    </div>
                </div>
            )}
        </>
    );
}

export default ImminentEventsGDACS;
