import React from 'react';
import { Link } from 'react-router-dom';
import { isDefined } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import Table from '#components/Table';
import SelectInput from '#components/SelectInput';
import { useButtonFeatures } from '#components/Button';
import {
  createStringColumn,
  createDateColumn,
  createActionColumn,
} from '#components/Table/predefinedColumns';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import { compareLabel } from '#utils/common';

import styles from './styles.module.scss';

interface DrefApplication {
  id: number;
  created_at: string;
  country_district: {
    id: number;
    country: number;
    district: number[];
  }[];
  appeal_code: string;
  title: string;
  submission_to_geneva: string;
}

const drefKeySelector = (d: DrefApplication) => d.id;

interface Props {
}

function DrefApplicationList(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const allCountries = useReduxState('allCountries');
  const [country, setCountry] = useInputState<number | undefined>(undefined);
  const countryOptions = React.useMemo(
    () => allCountries?.data?.results.filter((c) => (
      c.independent && !c.is_deprecated && c.name
    )).map((c) => ({
      value: c.id,
      label: c.name,
    })).sort(compareLabel) ?? [],
    [allCountries],
  );
  const {
    response,
  } = useRequest<ListResponse<DrefApplication>>({
    url: 'api/v2/dref/',
    query: isDefined(country) ? ({ country }) : undefined,
  });
  const linkProps = useButtonFeatures({
    variant: 'secondary',
    children: 'Edit',
  });
  const exportProps = useButtonFeatures({
    variant: 'secondary',
    children: 'Export',
  });

  const columns = React.useMemo(() => ([
    createDateColumn<DrefApplication, string | number>(
      'created_at',
      strings.drefTableCreatedOn,
      (item) => item.created_at,
    ),
    createStringColumn<DrefApplication, string | number>(
      'appeal_code',
      strings.drefTableAppealNumber,
      (item) => item.appeal_code,
    ),
    createStringColumn<DrefApplication, string | number>(
      'title',
      strings.drefTableName,
      (item) => item.title,
    ),
    createStringColumn<DrefApplication, string | number>(
      'submission_to_geneva',
      strings.drefTableSubmittedToGeneva,
      (item) => item.submission_to_geneva,
    ),
    createActionColumn(
      'actions',
      (rowKey: number) => ({
        children: (
          <>
            <Link
              to={`/dref-application/${rowKey}/edit/`}
              {...linkProps} />
            <Link
              to={`/dref-application/${rowKey}/export/`}
              {...exportProps} />
          </>
        ),
      }),
    ),
  ]), [linkProps, strings]);

  return (
    <Container
      className={styles.drefApplicationList}
    >
      <div className={styles.filters}>
        <SelectInput
          name={undefined}
          placeholder="Select Country"
          options={countryOptions}
          value={country}
          onChange={setCountry}
        />
      </div>
      <Container
        heading="In-progress Applications"
        sub
      >
        <Table
          className={styles.table}
          data={response?.results}
          columns={columns}
          keySelector={drefKeySelector}
          variant="large"
        />
      </Container>
    </Container>
  );
}

export default DrefApplicationList;
