import React from 'react';
import {
  isNotDefined,
  listToGroupList,
} from '@togglecorp/fujs';
import turfBbox from '@turf/bbox';

import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import RiskImminentEventMap from '#components/RiskImminentEventMap';
import WikiLink from '#components/WikiLink';

import useReduxState from '#hooks/useReduxState';
import { useRequest } from '#utils/restRequest';
import {
  fixBounds,
  BBOXType,
} from '#utils/map';
import store from '#utils/store';

import { ImminentResponse } from '#types';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  regionId: number;
}

function ImminentEvents(props: Props) {
  const { regionId } = props;
  const allRegions = useReduxState('allRegions');
  const region = React.useMemo(() => (
    allRegions?.data.results.find(d => d.id === regionId)
  ), [allRegions, regionId]);

  const {
    pending,
    response,
  } = useRequest<ImminentResponse>({
    skip: isNotDefined(regionId),
    url: 'risk://api/v1/imminent/',
    query: {
      region: regionId,
    },
  });

  const data = React.useMemo(() => {
    if (!response || !response.pdc_data) {
      return undefined;
    }

    const uuidGroupedHazardList = listToGroupList(
      response.pdc_data,
      h => h.pdc_details.uuid,
    );

    const uniqueList = Object.values(uuidGroupedHazardList).map((hazardList) => {
      const sortedList = [...hazardList].sort((h1, h2) => {
        const date1 = new Date(h1.pdc_details.pdc_updated_at ?? h1.pdc_details.created_at);
        const date2 = new Date(h2.pdc_details.pdc_updated_at ?? h2.pdc_details.created_at);

        return date2.getTime() - date1.getTime();
      });

      let latestData = sortedList[0];

      const latestFootprint = sortedList.find(h => !!h.pdc_details.footprint_geojson)?.pdc_details?.footprint_geojson;
      const latestTrack = sortedList.find(h => !!h.pdc_details.storm_position_geojson)?.pdc_details?.storm_position_geojson;

      if (!latestData.pdc_details.footprint_geojson && latestFootprint) {
        latestData = {
          ...latestData,
          pdc_details: {
            ...latestData.pdc_details,
            footprint_geojson: latestFootprint,
          },
        };
      }

      if (!latestData.pdc_details.storm_position_geojson && latestTrack) {
        latestData = {
          ...latestData,
          pdc_details: {
            ...latestData.pdc_details,
            storm_position_geojson: latestTrack,
          },
        };
      }

      return latestData;
    });

    return uniqueList;
  }, [response]);

  const [activeEventUuid, setActiveEventUuid] = React.useState<string>();
  const handleEventClick = React.useCallback((eventUuid: string | undefined) => {
    setActiveEventUuid((oldEventUuid) => {
      if (oldEventUuid === eventUuid) {
        return undefined;
      }

      return eventUuid;
    });
  }, []);

  const hasImminentEvents = response && response.pdc_data && response.pdc_data.length > 0;
  const regionBounds = React.useMemo(
    () => {
      let bbox = turfBbox(region?.bbox ?? []);
      return fixBounds(bbox as BBOXType);
    },
    [region?.bbox],
  );

  const lang = store.getState().lang.current ?? 'en';

  return (
    <Container
      heading="Imminent events"
      className={styles.imminentEvents}
      description="This map displays information about the modeled impact of specific forecasted or detected natural hazards. By hovering over the icons, if available, you can see the forecasted/observed footprint of the hazard; when you click on it, the table of modeled impact estimates will appear, as well as an information about who produced the impact estimate."
      descriptionClassName={styles.mapDescription}
      contentClassName={styles.mainContent}
      actions={<WikiLink language={lang} linkEnding='user_guide/risk_module#imminent-events'/>}
    >
      {pending && <BlockLoading /> }
      {!pending && data && (
        <RiskImminentEventMap
          sidebarHeading={region?.region_name}
          className={styles.map}
          hazardList={data}
          defaultBounds={regionBounds}
          onActiveEventChange={handleEventClick}
          activeEventUuid={activeEventUuid}
        />
      )}
      {!pending && !hasImminentEvents && (
        <div className={styles.emptyMessage}>
          <div className={styles.text}>
            No imminent events
          </div>
        </div>
      )}
    </Container>
  );
}

export default ImminentEvents;
