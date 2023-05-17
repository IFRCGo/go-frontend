import React from 'react';
import {
  isDefined,
  isNotDefined,
} from '@togglecorp/fujs';

import TextOutput from '#components/TextOutput';
import MapTooltipContent from '#components/MapTooltipContent';
import Link from '#components/Link';
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
      dashboard_url,
      alert_level,
      flood_area,
      fl_croplnd,
      source,
      sitrep,
      url,
      mag,
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
        {isDefined(url) && isDefined(url.wind) &&
          <TextOutput
            label="Wind Link"
            value={
              <Link
                className={styles.url}
                href={url.wind}
                target="_blank"
              >
                More Info
              </Link>
            }
            valueType='text'
          />
        }
        {isDefined(url) && isDefined(url.rainfall) &&
          <TextOutput
            label="Rainfall Link"
            value={
              <Link
                className={styles.url}
                href={url.wind}
                target="_blank"
              >
                More Info
              </Link>
            }
            valueType='text'
          />
        }
        {isDefined(url) && isDefined(url.shapefile) &&
          <TextOutput
            label="Shapefile Link"
            value={
              <Link
                className={styles.url}
                href={url.shapefile}
                target="_blank"
              >
                More Info
              </Link>
            }
            valueType='text'
          />
        }
      </div>

      {(isDefined(population_impact) || isDefined(population)) &&(
        <>
          <EstimatedOutput
            attribute="People Exposed / Potentially Affected"
            value={population_impact ?? population}
          />
          <hr />
        </>
      )}
      <div className={styles.eventDates}>
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
        {isDefined(mag) &&
          <TextOutput
            label="Magnitude"
            value={mag}
            valueType="number"
          />
        }
        {isDefined(depth) &&
          <TextOutput
            label="Depth (km)"
            value={depth}
            valueType="number"
          />
        }
        {isDefined(alert_level) &&
          <TextOutput
            label="Alert Type"
            value={alert_level}
            valueType="text"
          />
        }
        {isDefined(effective_date) &&
          <TextOutput
            label="Effective"
            value={effective_date}
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
        {isDefined(hazardDetails.population_exposure) &&
          isDefined (hazardDetails.population_exposure['exposure_60km/h']) &&
          <TextOutput
            label="Exposure (60km/h)"
            value={hazardDetails.population_exposure['exposure_60km/h']}
            valueType="number"
          />
        }
        {isDefined(hazardDetails.population_exposure) &&
          isDefined(hazardDetails.population_exposure['exposure_90km/h']) &&
          <TextOutput
            label="Exposure (90km/h)"
            value={hazardDetails.population_exposure['exposure_90km/h']}
            valueType="number"
          />
        }
        {isDefined(hazardDetails.population_exposure) &&
          isDefined(hazardDetails.population_exposure['exposure_120km/h']) &&
          <TextOutput
            label="Exposure (120km/h)"
            value={hazardDetails.population_exposure['exposure_120km/h']}
            valueType="number"
          />
        }
        {isDefined(flood_area) &&
          <TextOutput
            label="Flood Area"
            value={flood_area}
            valueType="number"
            description="hectares"
          />
        }
        {isDefined(fl_croplnd) &&
          <TextOutput
            label="Flood Cropland"
            value={fl_croplnd}
            valueType="number"
            description="hectares"
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
      {isDefined(wind_speed) && (
        <>
          <hr />
          <EstimatedOutput
            attribute="Wind speed"
            value={wind_speed}
          />
        </>
      )
      }
    </MapTooltipContent>
  );
}

export default PointDetails;
