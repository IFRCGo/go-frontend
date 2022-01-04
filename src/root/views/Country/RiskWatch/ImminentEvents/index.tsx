import React from 'react';
import { RiDownloadLine } from 'react-icons/ri';

import { useRequest } from '#utils/restRequest';
import Container from '#components/Container';
import SelectInput from '#components/SelectInput';
import Button from '#components/Button';
import RadioInput from '#components/RadioInput';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import { StringValueOption } from '#types';

import PDCExposureMap from './PDCExposureMap';

import {
  ImminentHazardTypes,
  ImminentResponse,
} from './common';
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

const hazardOptions: StringValueOption[] = [];

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

  const { response } = useRequest<ImminentResponse>({
    skip: !country,
    url: 'https://risk-module-api.togglecorp.com/api/v1/imminent/',
    query: { iso3: country?.iso3?.toLocaleLowerCase() },
  });

  const [selectedHazard, setSelectedHazard] = useInputState<ImminentHazardTypes | undefined>(undefined);
  const [selectedSource, setSelectedSource] = useInputState<typeof sourceOptions[number]['value'] | undefined>('pdc');
  const [activeEventId, setActiveEventId] = React.useState<number | undefined>(undefined);

  const handleEventDetailClick = React.useCallback((eventId: number | undefined) => {
    setActiveEventId((oldEventId) => {
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
                disabled
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
        {response?.pdc_data && (
          <div className={styles.mapSection}>
            <PDCExposureMap
              countryId={countryId}
              className={styles.map}
              activeEventId={activeEventId}
              data={response.pdc_data}
              onActiveEventChange={handleEventDetailClick}
            />
            <Container
              className={styles.sideBar}
              contentClassName={styles.eventList}
              heading={country?.name}
              sub
            >
              {response?.pdc_data?.map((hazard) => (
                <EventDetail
                  eventId={hazard.id}
                  key={hazard.id}
                  title={hazard.pdc_details.hazard_name}
                  type={hazard.hazard_type_display}
                  description={hazard.pdc_details.description}
                  startDate={hazard.pdc_details.start_date}
                  onClick={handleEventDetailClick}
                  isActive={activeEventId === hazard.id}
                />
              ))}
            </Container>
          </div>
        )}
      </Container>
    </>
  );
}

export default ImminentEvents;
