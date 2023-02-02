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
    hazardDetails,
    exposureDetails: {
      from_date,
      to_date,
      population_impact,
      population,
      depth,
      wind_speed,
      effective_date,
      date_processed,
    },
    onCloseButtonClick,
  } = props;

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
    <MapTooltipContent
      title={generateTitle(hazardDetails)}
      onCloseButtonClick={onCloseButtonClick}
      contentClassName={styles.tooltipContent}
    >
      <div className={styles.eventDates}>
        <TextOutput
          label="Event start date"
          value={hazardDetails.publish_date}
          valueType="date"
        />
        {from_date &&
          <TextOutput
            label="From date"
            value={from_date}
            valueType="date"
          />
        }
        {to_date &&
          <TextOutput
            label="To date"
            value={to_date}
            valueType="date"
          />
        }
        {effective_date &&
          <TextOutput
            label="Effective date"
            value={effective_date}
            valueType="date"
          />
        }
        {date_processed &&
          <TextOutput
            label="Processed date"
            value={date_processed}
            valueType="text"
          />
        }
        {date_processed}
      </div>
      <EstimatedOutput
        attribute="People Exposed / Potentially Affected"
        value={population_impact ?? population}
      />
      <hr />
      <EstimatedOutput
        attribute="Depth"
        value={depth}
      />
      <EstimatedOutput
        attribute="Wind speed"
        value={wind_speed}
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
