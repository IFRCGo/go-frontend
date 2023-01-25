import React from 'react';
import {
  IoCaretUp,
  IoCaretDown,
} from 'react-icons/io5';

import { PDCEvent } from '#types';
import TextOutput from '#components/TextOutput';
import styles from './styles.module.scss';

interface EventDetailProps {
  isActive: boolean;
  onClick: (uuid: string) => void;
  hazardDetails: PDCEvent;
}

function EventDetail(props: EventDetailProps) {
  const {
    hazardDetails,
    onClick,
    isActive,
  } = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const handleClick = React.useCallback(() => {
    onClick(hazardDetails.uuid);
  }, [hazardDetails.uuid, onClick]);

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
            {hazardDetails.hazard_name}
          </div>
          <div className={styles.icon}>
            {isActive ? <IoCaretUp /> : <IoCaretDown />}
          </div>
        </div>
        <div className={styles.subTitle}>
          <TextOutput
            className={styles.startDate}
            label="Event start date"
            value={hazardDetails.start_date}
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
              value={hazardDetails.pdc_created_at}
              valueType="date"
            />
            <TextOutput
              className={styles.startDate}
              label="Updated at"
              value={hazardDetails.pdc_updated_at}
              valueType="date"
            />
          </div>
          <div className={styles.description}>
            {hazardDetails.description}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetail;
