import React from 'react';

import Container from '#components/Container';
import SelectInput from '#components/SelectInput';
import Table from '#components/Table';
import { createStringColumn } from '#components/Table/predefinedColumns';
import useInputState from '#hooks/useInputState';
import { StringValueOption, } from '#types/common';
import { HazardTypes } from '#types/risk';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import { Country } from '#types/country';

import {
  PossibleEarlyActionsResponse,
  tableKeySelector,
} from '../common';

import styles from './styles.module.scss';
import Button from '#components/Button';

interface Sector {
  id: number;
  name: string;
}
interface Props {
  hazardOptions: StringValueOption[];
  countryOptions?: StringValueOption[];
  country?: Country;
}

const getPossibleActionColumns = () => ([
  createStringColumn<PossibleEarlyActionsResponse, string | number>(
    'hazard_type_display',
    'Hazard',
    (item) => item?.hazard_type_display
  ),
  createStringColumn<PossibleEarlyActionsResponse, string | number>(
    'early_actions',
    'Possible Early Actions',
    (item) => item?.early_actions
  ),
  createStringColumn<PossibleEarlyActionsResponse, string | number>(
    'location',
    'Location',
    (item) => item?.location
  ),
  createStringColumn<PossibleEarlyActionsResponse, string | number>(
    'sector',
    'Sector',
    (item) => item?.sector
  ),
  createStringColumn<PossibleEarlyActionsResponse, string | number>(
    'intended_purpose',
    'Intended Purpose',
    (item) => item?.intended_purpose
  ),
  createStringColumn<PossibleEarlyActionsResponse, string | number>(
    'organization',
    'Organisation',
    (item) => item?.organization
  ),
  createStringColumn<PossibleEarlyActionsResponse, string | number>(
    'implementation_date_raw',
    'Implementation Date',
    (item) => item?.implementation_date_raw
  ),
  createStringColumn<PossibleEarlyActionsResponse, string | number>(
    'impact_actions',
    'Impact/Action',
    (item) => item?.impact_actions
  ),
  createStringColumn<PossibleEarlyActionsResponse, string | number>(
    'evidence_of_success',
    'Evidence of Success',
    (item) => item?.evidence_of_success
  ),
]);

function PossibleEarlyActionTable(props: Props) {
  const {
    hazardOptions,
    countryOptions,
    country,
  } = props;

  const possibleActionColumns = getPossibleActionColumns();
  const [hazardType, setHazardType] = useInputState<HazardTypes | undefined>(undefined);
  const [countryFilter, setCountryFilter] = useInputState<string | undefined>(undefined);
  const [sector, setSector] = useInputState<string | undefined>(undefined);

  const { response } = useRequest<ListResponse<PossibleEarlyActionsResponse>>({
    skip: !country,
    query: {
      iso3: countryFilter?.toLocaleLowerCase(),
      hazard_type: hazardType,
      sectors: sector,
    },
    url: 'risk://api/v1/early-actions/'
  });
  const { response: actionOptions } = useRequest<{ sectors: Sector[] }>({
    skip: !country,
    url: 'risk://api/v1/early-actions/options/'
  });

  const earlyActionsOptions = React.useMemo(
    () => actionOptions?.sectors?.map((c) => ({
      value: c.name,
      label: c.name
    })), [actionOptions]);

  const handleClearFilter = React.useCallback(() => {
    setHazardType(undefined);
    setCountryFilter(undefined);
    setSector(undefined);

  }, [
    setHazardType,
    setCountryFilter,
    setSector,
  ]);

  return (
    <Container
      heading='Possible Early Actions'
      visibleOverflow
      className={styles.earlyActionTableContainer}
      descriptionClassName={styles.containerDescription}
      description={(
        <>
          <div className={styles.filters}>
            <SelectInput
              className={styles.filterInput}
              value={hazardType}
              onChange={setHazardType}
              name="hazardType"
              options={hazardOptions}
            />
            <SelectInput
              className={styles.filterInput}
              value={countryFilter}
              onChange={setCountryFilter}
              name="countryFilter"
              options={countryOptions}
            />
            <SelectInput
              className={styles.filterInput}
              value={sector}
              onChange={setSector}
              name="sector"
              options={earlyActionsOptions}
            />
            <Button
              name='clear'
              variant='transparent'
              onClick={handleClearFilter}
            >
              Clear Filter
            </Button>
          </div>
        </>
      )}
      sub
    >
      <Table
        className={styles.earlyActionTable}
        data={response?.results}
        columns={possibleActionColumns}
        keySelector={tableKeySelector}
      />
    </Container>
  );
}

export default PossibleEarlyActionTable;
