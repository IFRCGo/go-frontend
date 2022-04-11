import React from 'react';
import { Link } from 'react-router-dom';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import Table from '#components/Table';
import SelectInput from '#components/SelectInput';
import Pager from '#components/Pager';
import EmptyMessage from '#components/EmptyMessage';
import DrefExportButton from '#components/DrefExportButton';
import Button, { useButtonFeatures } from '#components/Button';
import {
  createStringColumn,
  createDateColumn,
  createActionColumn,
} from '#components/Table/predefinedColumns';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import {
  ListResponse,
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import { compareLabel } from '#utils/common';
import useAlert from '#hooks/useAlert';

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
  is_published: boolean;
}

const drefKeySelector = (d: DrefApplication) => d.id;
interface Props { }
interface DrefOperationalResponseFields {
  id: number;
}

function DrefApplicationList(props: Props) {
  const alert = useAlert();
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
    pending,
    response,
    retrigger: showALlDref,
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

  const operationalUpdateLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.drefOperationalUpdateOperationalUpdateButtonLabel,
  });

  const {
    pending: publishPending,
    trigger: submitPublish,
  } = useLazyRequest<DrefOperationalResponseFields, Partial<DrefApplication>>({
    url: (ctx) => `api/v2/dref/${ctx.id}/publish/`,
    body: () => ({}),
    method: 'POST',
    onSuccess: (response) => {
      showALlDref();
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefFormLoadRequestFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    }
  });

  //const {
  //  pending: pendingOpData,
  //  trigger: submitUpdateData,
  //} = useLazyRequest<DrefOperationalUpdateFields, Partial<DrefOperationalResponseFields>>({
  //  url: (ctx) => `api/v2/dref/${ctx.id}/op-update/`,
  //  body: () => ({}),
  //  method: 'POST',
  //  onSuccess: (response) => {
  //    console.log({ response });
  //  },
  //  onFailure: ({
  //    value: { messageForNotification },
  //    debugMessage,
  //  }) => {
  //    alert.show(
  //      <p>
  //        {strings.drefFormLoadRequestFailureMessage}
  //        &nbsp;
  //        <strong>
  //          {messageForNotification}
  //        </strong>
  //      </p>,
  //      {
  //        variant: 'danger',
  //        debugMessage,
  //      },
  //    );
  //  }
  //});

  //const handleUpdate = React.useCallback((id: number) => {
  //  submitUpdateData({ id });
  //}, [submitUpdateData]);

  const handlePublish = React.useCallback((id: number) => {
    submitPublish({ id });
  }, [submitPublish]);


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
      (rowKey: number, item: DrefApplication) => ({
        className: styles.actions,
        children: (
          <>
            {item?.is_published ?
              <Link
                to={`/dref/${rowKey}/op-update/`}
                {...operationalUpdateLinkProps}
              />
              //<Button
              //  name={rowKey}
              //  onClick={handleUpdate}
              //>
              //  update
              //</Button>
              :
              <>
                <Button
                  name={rowKey}
                  onClick={handlePublish}
                >
                  {strings.drefPublishButtonLabel}
                </Button>
                <Link
                  to={`/dref-application/${rowKey}/edit/`}
                  {...editLinkProps}
                />
              </>
            }
            <DrefExportButton
              drefId={rowKey}
            />
          </>
        ),
      }),
      { cellRendererClassName: styles.actionsCell },
    ),
  ]), [editLinkProps, operationalUpdateLinkProps, handlePublish, strings]);

  return (
    <Container
      className={styles.drefApplicationList}
    >
      {pending && <BlockLoading />}
      {!pending && response && (
        <>
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
        </>
      )}
      {!pending && response?.results?.length === 0 && (
        <EmptyMessage />
      )}
      {!pending && !response && (
        <div className={styles.error}>
          <p>
            There was an error fetching the DREF application list
          </p>
        </div>
      )}
    </Container>
  );
}

export default DrefApplicationList;
