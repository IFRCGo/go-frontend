import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import { PDCEvent } from '#types';

import EventDetail from './EventDetail';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  hazardList?: PDCEvent[];
  heading?: React.ReactNode;
  onActiveEventChange: (eventUuid: string) => void;
  activeEventUuid?: string;
}

function Sidebar(props: Props) {
  const {
    className,
    hazardList,
    heading = 'Imminent Events',
    onActiveEventChange,
    activeEventUuid,
  } = props;

  return (
    <Container
      className={_cs(styles.sidebar, className)}
      contentClassName={styles.eventList}
      heading={heading}
      headingSize="small"
      sub
    >
      {hazardList?.map((hazard) => (
        <EventDetail
          eventUuid={hazard.pdc_details.uuid}
          key={hazard.id}
          title={hazard.pdc_details.hazard_name}
          type={hazard.hazard_type_display}
          description={hazard.pdc_details.description}
          startDate={hazard.pdc_details.start_date}
          onClick={onActiveEventChange}
          isActive={activeEventUuid === hazard.pdc_details.uuid}
        />
      ))}
    </Container>
  );
}

export default Sidebar;
