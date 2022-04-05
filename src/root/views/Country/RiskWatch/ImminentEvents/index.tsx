import React from 'react';
import {
  listToGroupList,
  isDefined,
} from '@togglecorp/fujs';
import turfBbox from '@turf/bbox';

import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import RiskImminentEventMap from '#components/RiskImminentEventMap';
import useReduxState from '#hooks/useReduxState';
import { useRequest } from '#utils/restRequest';

import {
  fixBounds,
  BBOXType,
} from '#utils/map';
import { ImminentResponse } from '#types';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  countryId: number;
}

function ImminentEvents(props: Props) {
  const { countryId } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);

  const {
    pending,
    response,
  } = useRequest<ImminentResponse>({
    skip: !country,
    url: 'risk://api/v1/imminent/',
    query: { iso3: country?.iso3?.toLocaleLowerCase() },
  });

  const data = React.useMemo(() => {
    if (!response || !response.pdc_data) {
      return undefined;
    }

    const hazardListWithDefinedCountries = response.pdc_data.filter(
      (h) => isDefined(h.country)
    );

    const uuidGroupedHazardList = listToGroupList(
      hazardListWithDefinedCountries,
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

  const countryBounds = React.useMemo(
    () => {
      let bbox = turfBbox(country?.bbox ?? []);
      return fixBounds(bbox as BBOXType);
    },
    [country?.bbox],
  );

  const [activeEventUuid, setActiveEventUuid] = React.useState<string | undefined>(undefined);

  const handleEventClick = React.useCallback((eventUuid: string | undefined) => {
    setActiveEventUuid((oldEventUuid) => {
      if (oldEventUuid === eventUuid) {
        return undefined;
      }

      return eventUuid;
    });
  }, []);

  if((!pending && !response?.pdc_data) || data?.length === 0) {
    return null;
  }

  return (
    <Container
      heading="Imminent events"
      className={styles.imminentEvents}
      description="This map displays information about the modeled impact of specific forecasted or detected natural hazards. By hovering over the icons, if available, you can see the forecasted/observed footprint of the hazard; when you click on it, the table of modeled impact estimates will appear, as well as an information about who produced the impact estimate."
      descriptionClassName={styles.mapDescription}
      contentClassName={styles.mainContent}
      sub
    >
      {pending && <BlockLoading /> }
      {!pending && data && (
        <RiskImminentEventMap
          className={styles.map}
          sidebarHeading={country?.name}
          hazardList={data}
          defaultBounds={countryBounds}
          onActiveEventChange={handleEventClick}
          activeEventUuid={activeEventUuid}
        />
      )}
    </Container>
  );
}

export default ImminentEvents;
