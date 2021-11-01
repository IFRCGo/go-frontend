import React from 'react';
import { RiDownloadLine } from 'react-icons/ri';
import { unique } from '@togglecorp/fujs';

import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import Container from '#components/Container';
import SelectInput from '#components/SelectInput';
import Button from '#components/Button';
import RadioInput from '#components/RadioInput';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import { StringValueOption } from '#types';

import {
  HazardData,
  ImminentHazardTypes,
  PDCExposure,
} from './common';
import Map from './Map';
import styles from './styles.module.scss';

const sourceOptions = [
  { label: 'PDC', value: 'pdc' },
  { label: 'ODDRIN', value: 'oddrin' },
];

interface EventDetailProps<E extends number> {
  eventId: E;
  title: string;
  description: string;
  startDate: string;
  type: string;
  onClick: (eventId: E) => void;
  isActive: boolean;
}

function EventDetail<E extends number>(props: EventDetailProps<E>) {
  const {
    eventId,
    title,
    description,
    startDate,
    type,
    onClick,
    isActive,
  } = props;

  const handleClick = React.useCallback(() => {
    onClick(eventId);
  }, [eventId, onClick]);

  return (
    <div
      className={styles.eventDetail}
    >
      <div
        className={styles.topSection}
        role="presentation"
        onClick={handleClick}
      >
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.subTitle}>
          <div className={styles.type}>
            {type}
          </div>
          <div className={styles.startDate}>
            {startDate}
          </div>
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

interface Props {
  className?: string;
  countryId: number;
}

function ImminentEvents(props: Props) {
  const { countryId } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);

  /*
  const { response } = useRequest<ListResponse<GlobalExposureData>>({
    skip: !country,
    url: 'https://risk-module-api.togglecorp.com/api/v1/global-exposure-data/',
    query: {
      country: country?.iso3?.toLocaleLowerCase(),
    },
  });
   */

  const { response } = useRequest({
    skip: !country,
    url: 'https://risk-module-api.togglecorp.com/api/v1/imminent/',
    query: {
      iso3: country?.iso3?.toLocaleLowerCase(),
    },
  });

  console.info(response);

  const { response: pdcExposureResponse } = useRequest<ListResponse<PDCExposure>>({
    skip: !country,
    url: 'https://risk-module-api.togglecorp.com/api/v1/pdc-displacement/',
    query: {
      iso3: country?.iso3?.toLocaleLowerCase(),
    },
  });

  const [selectedHazard, setSelectedHazard] = useInputState<ImminentHazardTypes | undefined>(undefined);
  const [selectedSource, setSelectedSource] = useInputState<typeof sourceOptions[number]['value'] | undefined>('pdc');
  const [activeEvent, setActiveEvent] = React.useState<number | undefined>(undefined);

  const [
    hazardList,
    hazardOptions,
  ]: [HazardData[], StringValueOption[]] = React.useMemo(() => {
    if (selectedSource === 'pdc') {
      const hazardOptions = unique([
        ...(pdcExposureResponse?.results?.map(d => ({ value: d.hazard_type, label: d.hazard_type_display }))) ?? [],
      ], d => d.value) ?? [];

      return [
        (pdcExposureResponse?.results ?? []).filter(
          h => !selectedHazard || h.hazard_type === selectedHazard,
        ).map(d => ({
          id: d.id,
          hazardType: d.hazard_type,
          hazardTypeDisplay: d.hazard_type_display,
          hazardTitle: d.pdc_details.hazard_name,
          latitude: d.pdc_details.latitude,
          longitude: d.pdc_details.longitude,
          peopleExposed: d.population_exposure ?? null,
          peopleDisplaced: null,
          buildingsExposed: null,
          fileType: null,
          mapboxLayerId: null,
          description: d.pdc_details.description,
          startDate: d.pdc_details.start_date,
          source: 'pdc',
        })),
        hazardOptions,
      ];
    }

    if (selectedSource === 'oddrin') {
      return [
        [],
        [],
      ];
    }

    return [
      [],
      [],
    ];
  }, [pdcExposureResponse, selectedHazard, selectedSource]);

  const handleEventDetailClick = React.useCallback((eventId: number) => {
    setActiveEvent((oldEventId) => {
      if (oldEventId === eventId) {
        return undefined;
      }

      return eventId;
    });
  }, []);

  return (
    <>
      <div className={styles.tabDescription}>
        This page displaces information about the modeled impact of specific forecasted or detected natural hazards. By hovering over the icons, you can see the forecasted/observed footprint of the hazard; when you click on it, the table of modeled impact estimates will appear, as well as an information about who produced the impact estimate.
      </div>
      <Container
        heading="Risk map"
        className={styles.imminentEvents}
        descriptionClassName={styles.description}
        description={(
          <>
            <div className={styles.filters}>
              <RadioInput
                name=""
                options={sourceOptions}
                value={selectedSource}
                onChange={setSelectedSource}
                radioKeySelector={d => d.value}
                radioLabelSelector={d => d.label}
              />
              <SelectInput
                className={styles.hazardSelectInput}
                name={undefined}
                options={hazardOptions}
                value={selectedHazard}
                onChange={setSelectedHazard}
                placeholder="All hazards"
                isClearable
              />
            </div>
            <Button
              name={undefined}
              icons={<RiDownloadLine />}
              variant="secondary"
              disabled
            >
              Export
            </Button>
          </>
        )}
        sub
      >
        <div className={styles.mapSection}>
          <Map
            hazardList={hazardList}
            countryId={countryId}
            className={styles.map}
          />
          <Container
            className={styles.sideBar}
            contentClassName={styles.eventList}
            heading={country?.name}
            sub
          >
            {hazardList.map((hazard) => (
              <EventDetail
                eventId={hazard.id}
                key={hazard.id}
                title={hazard.hazardTitle}
                type={hazard.hazardTypeDisplay}
                description={hazard.description}
                startDate={hazard.startDate}
                onClick={handleEventDetailClick}
                isActive={activeEvent === hazard.id}
              />
            ))}
          </Container>
        </div>
      </Container>
    </>
  );
}

export default ImminentEvents;
