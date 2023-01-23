import React from 'react';
import {
  IoCaretUp,
  IoCaretDown,
} from 'react-icons/io5';

import { ADAMEvent } from '#types';
import TextOutput from '#components/TextOutput';
import styles from './styles.module.scss';

interface EventDetailProps {
  isActive: boolean;
  onClick: (uuid: string) => void;
  hazardDetails: ADAMEvent;
}

function EventDetail(props: EventDetailProps) {
  const {
    hazardDetails,
    onClick,
    isActive,
  } = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const handleClick = React.useCallback(() => {
    onClick(hazardDetails.event_id);
  }, [hazardDetails.event_id, onClick]);

  React.useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isActive]);

  return (
    <div
      ref={ref}
      className={styles.eventDetail}
    >
      <div
        className={styles.topSection}
        role="presentation"
        onClick={handleClick}
      >
        <div className={styles.header}>
          <div className={styles.title}>
            {hazardDetails.hazard_type}
          </div>
          <div className={styles.icon}>
            {isActive ? <IoCaretUp /> : <IoCaretDown />}
          </div>
        </div>
        <div className={styles.subTitle}>
          <TextOutput
            className={styles.startDate}
            label="Event publish date"
            value={hazardDetails.publish_date}
            valueType="date"
          />
        </div>
      </div>
      {isActive && (
        <div className={styles.details}>
          <div className={styles.dates}>
            <TextOutput
              className={styles.startDate}
              label="Created at"
              value={hazardDetails.publish_date}
              valueType="date"
            />
            <TextOutput
              className={styles.startDate}
              label="Updated at"
              value={hazardDetails.publish_date}
              valueType="date"
            />
          </div>
          <div className={styles.description}>
            {hazardDetails.publish_date}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetail;
