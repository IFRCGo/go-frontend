import React from 'react';
import { Link } from 'react-router-dom';

import {
  ListResponse,
  useRequest,
} from '#utils/restRequest';
import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import Table from '#components/Table';
import { useButtonFeatures } from '#components/Button';
import {
  createStringColumn,
  createDateColumn,
  createActionColumn,
} from '#components/Table/predefinedColumns';

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
  const {
    response,
  } = useRequest<ListResponse<DrefApplication>>({ url: 'api/v2/dref/' });
  const linkProps = useButtonFeatures({
    variant: 'secondary',
    children: 'Edit',
  });

  const columns = React.useMemo(() => ([
    createDateColumn<DrefApplication, string>(
      'created_at',
      strings.drefTableCreatedOn,
      (item) => item.created_at,
    ),
    createStringColumn<DrefApplication, string>(
      'appeal_code',
      strings.drefTableAppealNumber,
      (item) => item.appeal_code,
    ),
    createStringColumn<DrefApplication, string>(
      'title',
      strings.drefTableName,
      (item) => item.title,
    ),
    createStringColumn<DrefApplication, string>(
      'submission_to_geneva',
      strings.drefTableSubmittedToGeneva,
      (item) => item.submission_to_geneva,
    ),
    createActionColumn(
      'actions',
      (rowKey: number) => ({
        children: (
          <Link
            to={`/dref-application/${rowKey}/edit/`}
            {...linkProps}
          />
        ),
      }),
    ),
  ]), [linkProps, strings]);

  return (
    <Container>
      <Table
        className={styles.table}
        data={response?.results}
        columns={columns}
        keySelector={drefKeySelector}
        variant="large"
      />
    </Container>
  );
}

export default DrefApplicationList;
