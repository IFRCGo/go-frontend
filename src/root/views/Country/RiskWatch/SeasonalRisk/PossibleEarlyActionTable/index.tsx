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
import Pager from '#components/Pager';

import {
  PossibleEarlyActionsResponse,
  Sector,
  tableKeySelector,
} from '../common';

import styles from './styles.module.scss';

interface Props {
  hazardOptions: StringValueOption[];
  country?: Country;
}

const ITEM_PER_PAGE = 5;

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
    (item) => item?.sectors_details?.map(d => d.name).join(', ')
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
    (item) => item?.impact_action
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
    country,
  } = props;

  const [hazardType, setHazardType] = useInputState<HazardTypes | undefined>(undefined);
  const [sector, setSector] = useInputState<string | undefined>(undefined);
  const [activePage, setActivePage] = React.useState<number>(1);

  const possibleActionColumns = React.useMemo(getPossibleActionColumns, []);
  const { response } = useRequest<ListResponse<PossibleEarlyActionsResponse>>({
    skip: !country,
    url: 'risk://api/v1/early-actions',
    query: {
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (activePage - 1),
      iso3: country?.iso3,
      hazard_type: hazardType,
      sectors: sector,
    },
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

  if (!hazardType && !sector && (!response || response.count === 0)) {
    return null;
  }

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
              placeholder="Hazard Type"
              className={styles.filterInput}
              value={hazardType}
              onChange={setHazardType}
              name="hazardType"
              options={hazardOptions}
              isClearable
            />
            <SelectInput
              className={styles.filterInput}
              placeholder="Sector"
              value={sector}
              onChange={setSector}
              name="sector"
              options={earlyActionsOptions}
              isClearable
            />
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
        variant="large"
      />
      {response &&
        <div className={styles.pagerContainer}>
          <Pager
            itemsCount={response?.count}
            activePage={activePage}
            onActivePageChange={setActivePage}
            maxItemsPerPage={ITEM_PER_PAGE}
          />
        </div>
      }
    </Container>
  );
}

export default PossibleEarlyActionTable;
