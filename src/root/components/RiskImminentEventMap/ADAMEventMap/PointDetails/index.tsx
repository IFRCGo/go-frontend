import React from 'react';
import {
    isDefined,
  isNotDefined,
} from '@togglecorp/fujs';

import TextOutput from '#components/TextOutput';
import MapTooltipContent from '#components/MapTooltipContent';

import { ADAMEvent, ADAMEventExposure } from '#types';

import styles from './styles.module.scss';
import Link from '#components/Link';

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
      dashboard_url,
      longitude,
      latitude,
      alert_level,
      flood_area,
      fl_croplnd,
      iso3,
      source,
      sitrep,
      url,
      admin1_name,
      mag,
      mmni,
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

  const dashboardUrl = dashboard_url ?? url.map;

  console.log({dashboardUrl});

  return (
    <MapTooltipContent
      title={generateTitle(hazardDetails)}
      onCloseButtonClick={onCloseButtonClick}
      contentClassName={styles.tooltipContent}
    >
      <div className={styles.eventDates}>
        {isDefined(dashboardUrl) &&
          <TextOutput
            label="Dashboard Link"
            value={
              <Link
                className={styles.url}
                href={dashboardUrl}
                target="_blank"
              >
                More Info
              </Link>
            }
            valueType='text'
          />
        }
        {isDefined(url) && isDefined(url.shakemap) &&
          <TextOutput
            label="ShakeMap Link"
            value={
              <Link
                className={styles.url}
                href={url.shakemap}
                target="_blank"
              >
                More Info
              </Link>
            }
            valueType='text'
          />
        }
        {isDefined(url) && isDefined(url.population) &&
          <TextOutput
            label="Population Table"
            value={
              <Link
                className={styles.url}
                href={url.population}
                target="_blank"
              >
                More Info
              </Link>
            }
            valueType='text'
          />
        }
        {isDefined(admin1_name) &&
          <TextOutput
            label="ADM1 Name"
            value={admin1_name}
            valueType="text"
          />
        }
        {isDefined(source) &&
          <TextOutput
            label="Source"
            value={source}
            valueType="text"
          />
        }
        {isDefined(sitrep) &&
          <TextOutput
            label="Sitrep"
            value={sitrep}
            valueType="text"
          />
        }
        {isDefined(iso3) &&
          <TextOutput
            label="ISO3"
            value={iso3}
            valueType="text"
          />
        }
        {isDefined(mag) &&
          <TextOutput
            label="Magnitude"
            value={mag}
            valueType="number"
          />
        }
        {isDefined(mmni) &&
          <TextOutput
            label="MMI Value"
            value={mmni}
            valueType="number"
          />
        }
        {isDefined(effective_date) &&
          <TextOutput
            label="Effective"
            value={effective_date}
            valueType="date"
          />
        }
        {isDefined(date_processed) &&
          <TextOutput
            label="Date Process"
            value={date_processed}
            valueType="date"
          />
        }
        {isDefined(from_date) &&
          <TextOutput
            label="From date"
            value={from_date}
            valueType="date"
          />
        }
        {isDefined(to_date) &&
          <TextOutput
            label="To date"
            value={to_date}
            valueType="date"
          />
        }
        {isDefined(longitude) &&
          <TextOutput
            label="Longitude"
            value={longitude}
            valueType="text"
          />
        }
        {isDefined(latitude) &&
          <TextOutput
            label="Latitude"
            value={latitude}
            valueType="text"
          />
        }
        {isDefined(alert_level) &&
          <TextOutput
            label="Alert Type"
            value={alert_level}
            valueType="text"
          />
        }
        {isDefined(depth) &&
          <TextOutput
            label="Depth (km)"
            value={depth}
            valueType="number"
          />
        }
        {isDefined(population_impact ) &&
          <TextOutput
            label="Population Impact"
            value={population_impact}
            valueType="number"
          />
        }
        {isDefined(flood_area) &&
          <TextOutput
            label="Flood Area"
            value={flood_area}
            valueType="number"
          />
        }
        {isDefined(fl_croplnd) &&
          <TextOutput
            label="Flood Cropland"
            value={fl_croplnd}
            valueType="number"
          />
        }
        {isDefined(population) &&
          <TextOutput
            label="Flood Population"
            value={population}
            valueType="number"
          />
        }
        {isDefined(hazardDetails.publish_date) &&
          <TextOutput
            label="Published At"
            value={hazardDetails.publish_date}
            valueType="date"
          />
        }
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
