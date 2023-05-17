import React from 'react';
import {
  isNotDefined,
} from '@togglecorp/fujs';

import TextOutput from '#components/TextOutput';
import MapTooltipContent from '#components/MapTooltipContent';

import { PDCEvent, PDCEventExposure } from '#types';

import styles from './styles.module.scss';

function RoundPopulation(population?: number) {
  if(isNotDefined(population)) {
    return null;
  }
  return Math.round(population);
}

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
  hazardDetails: PDCEvent;
  exposureDetails: PDCEventExposure;
  onCloseButtonClick: () => void;
}

function PointDetails(props: PointDetailsProps) {
  const {
    hazardDetails: {
      hazard_name,
      start_date,
      pdc_created_at,
      pdc_updated_at,
    },
    exposureDetails: {
      population_exposure,
      capital_exposure,
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
          label="Event start date"
          value={start_date}
          valueType="date"
        />
        <TextOutput
          label="Created on"
          value={pdc_created_at}
          valueType="date"
        />
        <TextOutput
          label="Updated on"
          value={pdc_updated_at}
          valueType="date"
        />
      </div>
      <EstimatedOutput
        attribute="People Exposed / Potentially Affected"
        value={RoundPopulation(population_exposure?.total.value)}
      />
      <hr />
      <EstimatedOutput
        attribute="Households Exposed"
        value={RoundPopulation(population_exposure?.households?.value)}
      />
      <EstimatedOutput
        attribute="People in vulnerable groups exposed to the hazard"
        value={RoundPopulation(population_exposure?.vulnerable?.value)}
      />
      <EstimatedOutput
        attribute="value (USD) of exposed buildings"
        value={capital_exposure?.total?.value}
      />
      <EstimatedOutput
        attribute="Schools Exposed"
        value={RoundPopulation(capital_exposure?.school?.value)}
      />
      <EstimatedOutput
        attribute="Hospitals Exposed"
        value={RoundPopulation(capital_exposure?.hospital?.value)}
      />
    </MapTooltipContent>
  );
}

export default PointDetails;
