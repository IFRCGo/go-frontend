import React from 'react';
import {
  isNotDefined,
} from '@togglecorp/fujs';

import TextOutput from '#components/TextOutput';
import MapTooltipContent from '#components/MapTooltipContent';

import { PDCEvent } from '#types';

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
  hazardDetails: PDCEvent;
  onCloseButtonClick: () => void;
}

function PointDetails(props: PointDetailsProps) {
  const {
    hazardDetails: {
      pdc_details,
      population_exposure,
      capital_exposure,
    },
    onCloseButtonClick,
  } = props;

  return (
    <MapTooltipContent
      title={pdc_details.hazard_name}
      onCloseButtonClick={onCloseButtonClick}
      contentClassName={styles.tooltipContent}
    >
      <EstimatedOutput
        attribute="People Exposed / Potentially Affected"
        value={population_exposure?.total?.value}
      />
      <hr />
      <EstimatedOutput
        attribute="Households Exposed"
        value={population_exposure?.households?.value}
      />
      <EstimatedOutput
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
      />
    </MapTooltipContent>
  );
}

export default PointDetails;
