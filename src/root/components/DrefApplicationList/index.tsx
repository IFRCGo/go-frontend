import React from 'react';
import { History } from 'history';
import {
  EntriesAsList, Error,
  PartialForm,
} from '@togglecorp/toggle-form';
import {
  ArrowDropRightLineIcon,
  ArrowDropLeftLineIcon,
} from '@ifrc-go/icons';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import SelectInput from '#components/SelectInput';
import Pager from '#components/Pager';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import { compareLabel } from '#utils/common';
import ButtonLikeLink from '#components/ButtonLikeLink';
import Button from '#components/Button';

import useDrefApplicationListOptions from './useDrefApplicationListOptions';
import ActiveDrefTable from './ActiveDrefTable';
import CompletedDrefTable from './CompletedDrefTable';
import styles from './styles.module.scss';

const ITEM_PER_PAGE = 6;

interface DrefImportFields {
  file: number;
  dref: number;
  id: number;
}

type Value = PartialForm<DrefImportFields>;
interface Props {
  history: History;
  value: Value,
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
}

function DrefApplicationList(props: Props) {
  const {history} = props;
  const [drefActivePage, setDrefActivePage] = React.useState(1);
  const [country, setCountry] = useInputState<number | undefined>(undefined); const [drefVisibility, setDrefVisibility] = React.useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');
  const [drefType, setDrefType] = React.useState<number>();
  const [drefCount, setDrefCount] = React.useState<number>(0);

  const { drefTypeOptions,fetchingDrefOptions } = useDrefApplicationListOptions();
  const { strings } = React.useContext(LanguageContext);
  const allCountries = useReduxState('allCountries');

  const countryOptions = React.useMemo(
    () => allCountries?.data?.results.filter((c) => (
      c.independent && !c.is_deprecated && c.name
    )).map((c) => ({
        value: c.id,
        label: c.name,
      })).sort(compareLabel) ?? [],
    [allCountries],
  ); // a code duplication can be found in per-account.js

  const pending = fetchingDrefOptions;

  const filters = React.useMemo(
    () => (
      <>
        <SelectInput
          name={undefined}
          className={styles.countryFilter}
          placeholder="Select Country"
          options={countryOptions}
          value={country}
          onChange={setCountry}
          isClearable
          disabled={pending}
        />
        <SelectInput
          name={undefined}
          className={styles.countryFilter}
          placeholder="Type of DREF"
          options={drefTypeOptions}
          value={drefType}
          onChange={setDrefType}
          isClearable
          disabled={pending}
        />
      </>

    ),[
      drefType,
      setDrefType,
      drefTypeOptions,
      country,
      countryOptions,
      setCountry,
      pending,
    ]
  );

  const handleToggleDref = React.useCallback(
    (name) => setDrefVisibility(name), [ setDrefVisibility]);

  const handleDrefCount = React.useCallback(
    (count: number) => setDrefCount(count), [setDrefCount]
  );

  return (
    <Container
      className={styles.drefApplicationList}
      contentClassName={styles.content}
      descriptionClassName={styles.newDrefButton}
      description={
        <ButtonLikeLink
          variant='secondary'
          to='/dref-application/new/'
        >
          Start a New DREF Application
        </ButtonLikeLink>
      }
    >
      {drefVisibility === 'COMPLETED' && (
        <Button
          name='ACTIVE'
          variant="transparent"
          onClick={handleToggleDref}
        >
          <ArrowDropLeftLineIcon fontSize='2rem' />
          View active DREF operations
        </Button>
      )}
      <Container
        heading={drefVisibility === 'ACTIVE' ?
          strings.drefActiveTableHeading
          :strings.drefCompletedTableHeading
        }
        description={filters}
        descriptionClassName={styles.filters}
        actions={drefVisibility === 'ACTIVE' && (
          <Button
            name='COMPLETED'
            variant="transparent"
            onClick={handleToggleDref}
          >
            View completed DREF operations
            <ArrowDropRightLineIcon fontSize='2rem' />
          </Button>
        )}
        footerActions={drefCount > 0 && (
          <Pager
            activePage={drefActivePage}
            onActivePageChange={setDrefActivePage}
            itemsCount={drefCount}
            maxItemsPerPage={ITEM_PER_PAGE}
          />
        )}
        sub
      >
        {drefVisibility === 'ACTIVE' && (
          <ActiveDrefTable
            className={styles.drefTable}
            history={history}
            country={country}
            drefType={drefType}
            drefActivePage={drefActivePage}
            itemPerPage={ITEM_PER_PAGE}
            onChanngeDrefCount={handleDrefCount}
          />
        )}

        {drefVisibility === 'COMPLETED' && (
          <CompletedDrefTable
            className={styles.drefTable}
            history={history}
            country={country}
            drefType={drefType}
            drefActivePage={drefActivePage}
            itemPerPage={ITEM_PER_PAGE}
            onChanngeDrefCount={handleDrefCount}
          />
        )}
      </Container>
    </Container>
  );
}

export default DrefApplicationList;

