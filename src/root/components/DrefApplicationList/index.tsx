import React from 'react';
import { Link } from 'react-router-dom';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import Table from '#components/Table';
import SelectInput from '#components/SelectInput';
import Pager from '#components/Pager';
import DrefExportButton from '#components/DrefExportButton';
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

const ITEM_PER_PAGE = 20;

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
  const [activePage, setActivePage] = React.useState(1);
  const {
    response,
  } = useRequest<ListResponse<DrefApplication>>({
    url: 'api/v2/dref/',
    query: {
      country,
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (activePage - 1),
    },
  });

  // TODO: use strings
  const editLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.drefTableEdit,
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
        className: styles.actions,
        children: (
          <>
            <Link
              to={`/dref-application/${rowKey}/edit/`}
              {...editLinkProps}
            />
            <DrefExportButton
              drefId={rowKey}
            />
          </>
        ),
      }),
      { cellRendererClassName: styles.actionsCell },
    ),
  ]), [editLinkProps, strings]);

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
        {response && (
          <div className={styles.footer}>
            <Pager
              activePage={activePage}
              onActivePageChange={setActivePage}
              itemsCount={response.count}
              maxItemsPerPage={ITEM_PER_PAGE}
            />
          </div>
        )}
      </Container>
    </Container>
  );
}

export default DrefApplicationList;
