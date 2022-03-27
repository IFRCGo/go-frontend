import React from 'react';
import {
  IoCaretUp,
  IoCaretDown,
} from 'react-icons/io5';

import TextOutput from '#components/TextOutput';
import styles from './styles.module.scss';

interface EventDetailProps<E extends string> {
  eventUuid: E;
  title: string;
  startDate: string;
  description: string;
  type: string;
  isActive: boolean;
  onClick: (eventUuid: E) => void;
}

function EventDetail<E extends string>(props: EventDetailProps<E>) {
  const {
    eventUuid,
    title,
    description,
    startDate,
    type,
    onClick,
    isActive,
  } = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const handleClick = React.useCallback(() => {
    onClick(eventUuid);
  }, [eventUuid, onClick]);

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
            {title}
          </div>
          <div className={styles.icon}>
            {isActive ? <IoCaretUp /> : <IoCaretDown />}
          </div>
        </div>
        <div className={styles.subTitle}>
          <TextOutput
            className={styles.startDate}
            label="Start date"
            value={startDate}
            valueType="date"
          />
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

export default EventDetail;
