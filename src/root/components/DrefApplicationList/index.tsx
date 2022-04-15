import React from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history';
import { isDefined } from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import Table from '#components/Table';
import SelectInput from '#components/SelectInput';
import Pager from '#components/Pager';
import EmptyMessage from '#components/EmptyMessage';
import ConfirmButton from '#components/ConfirmButton';
import DrefExportButton from '#components/DrefExportButton';
import DropdownMenuItem from '#components/DropdownMenuItem';
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
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import { compareLabel } from '#utils/common';
import useAlert from '#hooks/useAlert';
import { DrefOperationalUpdateResponse } from '#types';

import styles from './styles.module.scss';

const ITEM_PER_PAGE = 6;

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
interface Props {
  history: History;
}
interface DrefOperationalResponseFields {
  id: number;
}

function DrefApplicationList(props: Props) {
  const { history } = props;
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

  const [inProgressDrefActivePage, setInProgressDrefActivePage] = React.useState(1);
  const [publishedDrefActivePage, setPublishedDrefActivePage] = React.useState(1);

  const {
    pending: publishedDrefPending,
    response: publishedDrefResponse,
    retrigger: refetchPublishedDrefList,
  } = useRequest<ListResponse<DrefApplication>>({
    url: 'api/v2/dref/',
    query: {
      country,
      is_published: true,
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (publishedDrefActivePage - 1),
    },
  });

  const {
    pending: inProgressDrefPending,
    response: inProgressDrefResponse,
    retrigger: refetchInProgressDrefList,
  } = useRequest<ListResponse<DrefApplication>>({
    url: 'api/v2/dref/',
    query: {
      country,
      is_published: false,
      limit: ITEM_PER_PAGE,
      offset: ITEM_PER_PAGE * (inProgressDrefActivePage - 1),
    },
  });

  const publishedApplicationList = React.useMemo(() => (
    publishedDrefResponse?.results?.filter(d => d.is_published)
  ), [publishedDrefResponse]);

  const inProgressApplicationList = React.useMemo(() => (
    inProgressDrefResponse?.results?.filter(d => !d.is_published)
  ), [inProgressDrefResponse]);


  const editLinkProps = useButtonFeatures({
    variant: 'secondary',
    children: strings.drefTableEdit,
  });

  const {
    pending: drefPublishPending,
    trigger: postDrefPublishRequest,
  } = useLazyRequest<DrefOperationalResponseFields, number>({
    url: (drefId) => drefId ? `api/v2/dref/${drefId}/publish/` : undefined,
    body: () => ({}),
    method: 'POST',
    onSuccess: (response) => {
      refetchPublishedDrefList();
      refetchInProgressDrefList();
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

  const {
    pending: newOperationalUpdatePending,
    trigger: postDrefNewOperationalUpdate,
  } = useLazyRequest<DrefOperationalUpdateResponse, number>({
    url: (drefId) => drefId ? `api/v2/dref-op-update/` : undefined,
    body: (drefId) => ({ dref: drefId }),
    method: 'POST',
    onSuccess: (response) => {
      if (isDefined(response?.id)) {
        history.push(`/dref-operational-update/${response.id}/edit/`);
      }
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          Failed to create new operational update
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

  const handlePublishButtonClick = React.useCallback((drefId: number) => {
    postDrefPublishRequest(drefId);
  }, [postDrefPublishRequest]);

  const [
    inProgressApplicationColumns,
    publishedApplicationColumns,
  ] = React.useMemo(() => {
    const baseColumns = [
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
    ];

    return ([
      [
        ...baseColumns,
        createActionColumn(
          'actions',
          (rowKey: number, item: DrefApplication) => ({
            children: (
              <>
                <ConfirmButton
                  name={rowKey}
                  message="Are you sure you want to publish the DREF?"
                  onConfirm={handlePublishButtonClick}
                  variant="secondary"
                  disabled={drefPublishPending}
                >
                  {strings.drefPublishButtonLabel}
                </ConfirmButton>
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
          {
            cellRendererClassName: styles.actionsCell,
            headerContainerClassName: styles.actionsHeader,
          },
        ),
      ],
      [
        ...baseColumns,
        createActionColumn(
          'actions',
          (rowKey: number, item: DrefApplication) => ({
            className: styles.actions,
            extraActions: (
              <>
                <DropdownMenuItem
                  name={rowKey}
                  onClick={postDrefNewOperationalUpdate}
                  label="New Operational Update"
                />
                <DropdownMenuItem
                  onClick={() => { }}
                  label="Edit last Operational Update"
                />
                <DropdownMenuItem
                  onClick={() => { }}
                  label="View all Operational Updates"
                />
              </>
            ),
            children: (
              <DrefExportButton
                drefId={rowKey}
              />
            ),
          }),
          {
            cellRendererClassName: styles.actionsCell,
            headerContainerClassName: styles.actionsHeader,
          },
        ),
      ],
    ]);
  }, [postDrefNewOperationalUpdate, drefPublishPending, editLinkProps, handlePublishButtonClick, strings]);

  const pending = publishedDrefPending || inProgressDrefPending || newOperationalUpdatePending;

  return (
    <Container
      className={styles.drefApplicationList}
      description={(
        <SelectInput
          name={undefined}
          placeholder="Select Country"
          options={countryOptions}
          value={country}
          onChange={setCountry}
        />
      )}
    >
      <Container
        heading="In-progress Applications"
        sub
        footerActions={inProgressDrefResponse && (
          <Pager
            activePage={inProgressDrefActivePage}
            onActivePageChange={setInProgressDrefActivePage}
            itemsCount={inProgressDrefResponse.count}
            maxItemsPerPage={ITEM_PER_PAGE}
          />
        )}
      >
        {inProgressDrefPending && <BlockLoading />}
        {!inProgressDrefPending && inProgressDrefResponse?.results?.length === 0 && (
          <EmptyMessage />
        )}
        {!pending && !inProgressDrefResponse && (
          <div className={styles.error}>
            There was an error fetching the DREF application list
          </div>
        )}
        {!inProgressDrefPending && inProgressDrefResponse && (
          <Table
            className={styles.inProgressDrefTable}
            data={inProgressApplicationList}
            columns={inProgressApplicationColumns}
            keySelector={drefKeySelector}
            variant="large"
          />
        )}
      </Container>
      <Container
        heading="Published Applications"
        sub
        footerActions={publishedDrefResponse && (
          <Pager
            activePage={publishedDrefActivePage}
            onActivePageChange={setPublishedDrefActivePage}
            itemsCount={publishedDrefResponse.count}
            maxItemsPerPage={ITEM_PER_PAGE}
          />
        )}
      >
        {publishedDrefPending && <BlockLoading />}
        {!publishedDrefPending && publishedDrefResponse?.results?.length === 0 && (
          <EmptyMessage />
        )}
        {!pending && !publishedDrefResponse && (
          <div className={styles.error}>
            There was an error fetching the DREF application list
          </div>
        )}
        <Table
          className={styles.publishedDrefTable}
          data={publishedApplicationList}
          columns={publishedApplicationColumns}
          keySelector={drefKeySelector}
          variant="large"
        />
      </Container>
    </Container>
  );
}

export default DrefApplicationList;
