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

  const generateTitle = React.useCallback(
    (data: ADAMEvent) => {
      if (!data.title) {
        return `${data.hazard_type_display} - ${data.country_details?.name}`;
      }

      if (data.title) {
        return data.title;
      }
    }, []);

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
            {generateTitle(hazardDetails)}
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
      {isActive && (hazardDetails.event_details.from_date
        || hazardDetails.event_details.to_date
        || hazardDetails.event_details.published_at)
        && (
          <div className={styles.details}>
            <div className={styles.dates}>
              <TextOutput
                className={styles.startDate}
                label="From Date"
                value={hazardDetails.event_details.from_date}
                valueType="date"
              />
              <TextOutput
                className={styles.startDate}
                label="Updated at"
                value={hazardDetails.event_details.to_date}
                valueType="date"
              />
            </div>
            <div className={styles.description}>
              {hazardDetails.event_details.published_at}
            </div>
          </div>
        )}
    </div>
  );
}

export default EventDetail;
