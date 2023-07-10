import React from 'react';
import { History } from 'history';
import {
  ArrowDropRightLineIcon,
  ArrowDropLeftLineIcon,
} from '@ifrc-go/icons';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import SelectInput from '#components/SelectInput';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import { compareLabel } from '#utils/common';
import ButtonLikeLink from '#components/ButtonLikeLink';
import Button from '#components/Button';
import TextInput from '#components/TextInput';

import useDrefApplicationListOptions from './useDrefApplicationListOptions';
import ActiveDrefList from './ActiveDrefList';
import CompletedDrefList from './CompletedDrefList';

import styles from './styles.module.scss';

interface Props {
  history: History;
}

function DrefApplicationList(props: Props) {
  const {history} = props;
  const { strings } = React.useContext(LanguageContext);
  const allCountries = useReduxState('allCountries');
  const allDisasterTypes = useReduxState('disasterTypes');
  const { drefTypeOptions,fetchingDrefOptions } = useDrefApplicationListOptions();
  const [country, setCountry] = useInputState<number | undefined>(undefined);
  const [drefType, setDrefType] = React.useState<number>();
  const [appealCode, setAppealCode] = React.useState<string | undefined>();
  const [disasterType, setDisasterType] = React.useState<number>();
  const [drefVisibility, setDrefVisibility] = React.useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');

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

  const disasterOptions = React.useMemo(
    () => allDisasterTypes.data.results.map(
      (disaster) => ({
        label: disaster.name,
        value: disaster.id
      })).sort(compareLabel),
    [allDisasterTypes],
  );

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
        <SelectInput
          className={styles.countryFilter}
          name={undefined}
          placeholder="Select Hazard Type"
          options={disasterOptions}
          value={disasterType}
          onChange={setDisasterType}
          isClearable
          disabled={pending}
        />
        <TextInput
          className={styles.countryFilter}
          name={undefined}
          value={appealCode}
          placeholder="Appeal Code"
          onChange={setAppealCode}
          disabled={pending}
        />
      </>

    ),[
      disasterOptions,
      disasterType,
      appealCode,
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
          {strings.drefTableStartNewApplication}
        </ButtonLikeLink>
      }
    >
      {drefVisibility === 'COMPLETED' && (
        <Button
          className={styles.viewOperationHeading}
          name='ACTIVE'
          variant="transparent"
          onClick={handleToggleDref}
        >
          <ArrowDropLeftLineIcon fontSize='2rem' />
            {strings.drefTableActiveDescription}
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
            {strings.drefTableCompletedDescription}
            <ArrowDropRightLineIcon fontSize='2rem' />
          </Button>
        )}
        sub
      >
        {drefVisibility === 'ACTIVE' && (
          <ActiveDrefList
            className={styles.drefTable}
            history={history}
            country={country}
            drefType={drefType}
            appealCode={appealCode}
            disasterType={disasterType}
          />
        )}

        {drefVisibility === 'COMPLETED' && (
          <CompletedDrefList
            className={styles.drefTable}
            history={history}
            country={country}
            drefType={drefType}
            appealCode={appealCode}
            disasterType={disasterType}
          />
        )}
      </Container>
    </Container>
  );
}

export default DrefApplicationList;

