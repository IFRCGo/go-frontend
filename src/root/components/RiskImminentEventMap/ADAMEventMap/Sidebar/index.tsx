import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import { ADAMEvent } from '#types';

import EventDetail from './EventDetail';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  hazardList?: ADAMEvent[];
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
      headingSize="superSmall"
      sub
    >
      {hazardList?.map((hazard) => (
        <EventDetail
          key={hazard.id}
          onClick={onActiveEventChange}
          isActive={activeEventUuid === hazard.event_id}
          hazardDetails={hazard}
        />
      ))}
    </Container>
  );
}

export default Sidebar;
