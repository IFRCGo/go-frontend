import React from 'react';
import {
  isNotDefined,
} from '@togglecorp/fujs';

import TextOutput from '#components/TextOutput';
import MapTooltipContent from '#components/MapTooltipContent';

import { ADAMEvent, ADAMEventExposure } from '#types';

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
  hazardDetails: ADAMEvent;
  exposureDetails: ADAMEventExposure;
  onCloseButtonClick: () => void;
}

function PointDetails(props: PointDetailsProps) {
  const {
    hazardDetails: {
      hazard_type,
      publish_date,

      // hazard_name,
      // start_date,
      // pdc_created_at,
      // pdc_updated_at,
    },
    exposureDetails: {
      population_impact,
      depth,
    },
    onCloseButtonClick,
  } = props;

  return (
    <MapTooltipContent
      title={hazard_type}
      onCloseButtonClick={onCloseButtonClick}
      contentClassName={styles.tooltipContent}
    >
      <div className={styles.eventDates}>
        <TextOutput
          label="Event start date"
          value={publish_date}
          valueType="date"
        />
        <TextOutput
          label="Created on"
          value={publish_date}
          valueType="date"
        />
        <TextOutput
          label="Updated on"
          value={publish_date}
          valueType="date"
        />
      </div>
      <EstimatedOutput
        attribute="People Exposed / Potentially Affected"
        value={population_impact}
      />
      <hr />
      <EstimatedOutput
        attribute="Earthquake depth"
        value={depth}
      />
      {/* <EstimatedOutput
        attribute="People in vulnerable groups exposed to the hazard"
        value={population_exposure?.vulnerable?.value}
      />
      <EstimatedOutput
        attribute="value (USD) of exposed buildings"
        value={capital_exposure?.total?.value}
      />
      <EstimatedOutput
        attribute="Schools Exposed"
        value={capital_exposure?.school?.value}
      />
      <EstimatedOutput
        attribute="Hospitals Exposed"
        value={capital_exposure?.hospital?.value}
      /> */}
    </MapTooltipContent>
  );
}

export default PointDetails;
