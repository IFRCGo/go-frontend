import React from 'react';
import {
  isDefined,
  isNotDefined,
} from '@togglecorp/fujs';

import TextOutput from '#components/TextOutput';
import MapTooltipContent from '#components/MapTooltipContent';
import Link from '#components/Link';
import { GDACSEvent, GDACSEventExposure } from '#types';

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
  hazardDetails: GDACSEvent;
  populationExposure?: GDACSEventExposure['population_exposure'];
  onCloseButtonClick: () => void;
}

function PointDetails(props: PointDetailsProps) {
  const {
    hazardDetails: {
      hazard_name,
      start_date,
      end_date,
      event_details,
      alert_level,
    },
    populationExposure,
    onCloseButtonClick,
  } = props;

  return (
    <MapTooltipContent
      title={hazard_name}
      onCloseButtonClick={onCloseButtonClick}
      contentClassName={styles.tooltipContent}
    >
      <div className={styles.eventDates}>
        {isDefined(event_details.url.details) && (
          <TextOutput
            label="Details Link"
            value={
              <Link
                className={styles.url}
                href={event_details.url.details}
                target="_blank"
              >
                More Info
              </Link>
            }
            valueType='text'
          />
        )}
        {isDefined(event_details.url.geometry) && (
          <TextOutput
            label="Geometry Link"
            value={
              <Link
                className={styles.url}
                href={event_details.url.geometry}
                target="_blank"
              >
                More Info
              </Link>
            }
            valueType='text'
          />
        )}
        {isDefined(event_details.url.report) && (
          <TextOutput
            label="Report Link"
            value={
              <Link
                className={styles.url}
                href={event_details.url.report}
                target="_blank"
              >
                More Info
              </Link>
            }
            valueType='text'
          />
        )}
      </div>
      <div className={styles.eventDates}>
      <EstimatedOutput
        attribute="Death"
        value={populationExposure?.death}
      />
      <EstimatedOutput
        attribute="Displaced"
        value={populationExposure?.displaced}
      />
      <EstimatedOutput
        attribute={event_details.severitydata.severitytext}
        value={event_details.severitydata.severity}
      />
      {isDefined(populationExposure?.exposed_population) && (
        <TextOutput
          label="Population Exposed"
          value={populationExposure?.exposed_population}
        />
      )}
      {isDefined(populationExposure?.people_affected) && (
        <TextOutput
          label="Population Affected"
          value={populationExposure?.people_affected}
        />
      )}
      </div>
      <hr />
      <div className={styles.eventDates}>
        <TextOutput
          label="Event Start Date"
          value={start_date}
          valueType="date"
        />
        <TextOutput
          label="Event End Date"
          value={end_date}
          valueType="date"
        />
        <TextOutput
          label="Alert Type"
          value={alert_level}
          valueType="text"
        />
      </div>
    </MapTooltipContent>
  );
}

export default PointDetails;

