import React from 'react';
import {
  isNotDefined,
} from '@togglecorp/fujs';
import TextOutput from '#components/TextOutput';
import MapTooltipContent from '#components/MapTooltipContent';
import { MeteoSwissEvent } from '#types';
import styles from './styles.module.scss';

function EstimatedOutput({
  value,
  attribute,
}: {
    value: number | undefined | null;
    attribute: string;
  }) {
  if (isNotDefined(value)) {
    return null;
  }

  return (
    <TextOutput
      className={styles.estimatedOutput}
      valueContainerClassName={styles.value}
      labelContainerClassName={styles.label}
      descriptionContainerClassName={styles.description}
      label="Est."
      description={attribute}
      hideLabelColon
      value={value}
      valueType="number"
      valueProps={{
        normal: true,
        precision: 'auto',
      }}
    />
  );
}

interface PointDetailsProps {
  hazardDetails: MeteoSwissEvent;
  onCloseButtonClick: () => void;
}

function PointDetails(props: PointDetailsProps) {
  const {
    hazardDetails: {
      hazard_name,
      start_date,
      end_date,
      event_details,
    },
    onCloseButtonClick,
  } = props;

  return (
    <MapTooltipContent
      title={hazard_name}
      onCloseButtonClick={onCloseButtonClick}
      contentClassName={styles.tooltipContent}
    >
      <div className={styles.eventDates}>
        <TextOutput
          label="Event Start Date"
          value={start_date}
          valueType="date"
        />
        <TextOutput
          label="Updated at"
          value={end_date}
          valueType="date"
        />
      </div>
      <hr />
      {event_details.map((disasterDetail) => (
        <EstimatedOutput
          key={disasterDetail.id}
          attribute={disasterDetail.impact_type}
          value={disasterDetail.mean}
        />
      ))}
    </MapTooltipContent>
  );
}

export default PointDetails;

