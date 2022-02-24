import React from 'react';
import { isNotDefined } from '@togglecorp/fujs';

import { useRequest } from '#utils/restRequest';
import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import useReduxState from '#hooks/useReduxState';

import PDCExposureMap from './PDCExposureMap';

import { ImminentResponse } from './common';
import styles from './styles.module.scss';

interface EventDetailProps<E extends number> {
  eventId: E;
  title: string;
  description: string;
  startDate: string;
  type: string;
  onClick: (eventId: E) => void;
  isActive: boolean;
}

function EventDetail<E extends number>(props: EventDetailProps<E>) {
  const {
    eventId,
    title,
    description,
    startDate,
    type,
    onClick,
    isActive,
  } = props;

  const handleClick = React.useCallback(() => {
    onClick(eventId);
  }, [eventId, onClick]);

  return (
    <div className={styles.eventDetail}>
      <div
        className={styles.topSection}
        role="presentation"
        onClick={handleClick}
      >
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.subTitle}>
          <div className={styles.type}>
            {type}
          </div>
          <div className={styles.startDate}>
            {startDate}
          </div>
        </div>
      </div>
      {isActive && (
        <div className={styles.description}>
          {description}
        </div>
      )}
    </div>
  );
}

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

  const [activeEventId, setActiveEventId] = React.useState<number | undefined>(undefined);
  const handleEventDetailClick = React.useCallback((eventId: number | undefined) => {
    setActiveEventId((oldEventId) => {
      if (oldEventId === eventId) {
        return undefined;
      }

      return eventId;
    });
  }, []);

  if((!pending && !response?.pdc_data) || response?.pdc_data.length === 0) {
    return null;
  }

  return (
    <Container
      heading="Imminent events"
      className={styles.imminentEvents}
      description="This map displays information about the modeled impact of specific forecasted or detected natural hazards. By hovering over the icons, if available, you can see the forecasted/observed footprint of the hazard; when you click on it, the table of modeled impact estimates will appear, as well as an information about who produced the impact estimate."
      descriptionClassName={styles.mapDescription}
    >
      {pending && <BlockLoading /> }
      {!pending && response?.pdc_data && response?.pdc_data.length > 0 && (
        <div className={styles.mapSection}>
          <PDCExposureMap
            regionId={regionId}
            className={styles.map}
            activeEventId={activeEventId}
            data={response.pdc_data}
            onActiveEventChange={setActiveEventId}
          />
          <Container
            className={styles.sideBar}
            contentClassName={styles.eventList}
            heading={region?.region_name}
            sub
          >
            {response?.pdc_data?.map((hazard) => (
              <EventDetail
                eventId={hazard.id}
                key={hazard.id}
                title={hazard.pdc_details.hazard_name}
                type={hazard.hazard_type_display}
                description={hazard.pdc_details.description}
                startDate={hazard.pdc_details.start_date}
                onClick={handleEventDetailClick}
                isActive={activeEventId === hazard.id}
              />
            ))}
          </Container>
        </div>
      )}
    </Container>
  );
}

export default ImminentEvents;
