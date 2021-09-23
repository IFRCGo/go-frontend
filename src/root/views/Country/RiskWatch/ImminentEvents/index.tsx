import React from 'react';
import Container from '#components/Container';
import { RiDownloadLine } from 'react-icons/ri';

import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';

import SelectInput from '#components/SelectInput';
import Button from '#components/Button';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';

import Map, { EarthquakeListItem } from './Map';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  countryId: number;
}

const hazardOptions = [
  { label: 'Earthquake', value: 'EQ' },
];

function ImminentEvents(props: Props) {
  const {
    countryId
  } = props;

  const allCountries = useReduxState('allCountries');
  const country = React.useMemo(() => (
    allCountries?.data.results.find(d => d.id === countryId)
  ), [allCountries, countryId]);

  const { response } = useRequest<ListResponse<EarthquakeListItem>>({
    skip: !country,
    url: 'https://risk-module-api.togglecorp.com/api/v1/earthquake/',
    query: { country: country?.name },
  });

  const [hazardFilter, setHazardFilter] = useInputState('EQ');

  return (
    <Container
      heading="Risk map"
      className={styles.imminentEvents}
      descriptionClassName={styles.description}
      description={(
        <>
          <SelectInput
            className={styles.hazardSelectInput}
            name={undefined}
            options={hazardOptions}
            value={hazardFilter}
            onChange={setHazardFilter}
          />
          <Button
            icons={<RiDownloadLine />}
            variant="secondary"
          >
            Export
          </Button>
        </>
      )}
      sub
    >
      <div className={styles.mapSection}>
        <Map
          earthquakeList={response?.results}
          countryId={countryId}
          className={styles.map}
        />
        <Container
          className={styles.sideBar}
          contentClassName={styles.eventList}
          heading={country?.name}
          sub
        >
          {response?.results?.map((eqItem) => (
            <div className={styles.eventDetail}>
              {eqItem.event_title}
            </div>
          ))}
        </Container>
      </div>
    </Container>
  );
}

export default ImminentEvents;
