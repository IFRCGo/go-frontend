import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import { MeteoSwissEvent } from '#types';

import EventDetail from './EventDetails';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  hazardList?: MeteoSwissEvent[];
  heading?: React.ReactNode;
  onActiveEventChange: (eventUuid: number) => void;
  activeEventUuid?: number;
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
          key={hazard.id}
          onClick={onActiveEventChange}
          isActive={activeEventUuid === hazard.id}
          hazardDetails={hazard}
        />
      ))}
    </Container>
  );
}

export default Sidebar;
