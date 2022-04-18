import React from 'react';
import { History } from 'history';
import { isDefined } from '@togglecorp/fujs';
import {
  IoClose,
  IoAdd,
  IoList,
} from 'react-icons/io5';
import {
  MdEdit,
  MdPublish,
} from 'react-icons/md';

import LanguageContext from '#root/languageContext';
import Backdrop from '#components/backdrop';
import Button from '#components/Button';
import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import Table from '#components/Table';
import SelectInput from '#components/SelectInput';
import Pager from '#components/Pager';
import EmptyMessage from '#components/EmptyMessage';
import DrefExportButton from '#components/DrefExportButton';
import DropdownMenuItem from '#components/DropdownMenuItem';
import {
  createStringColumn,
  createDateColumn,
  createActionColumn,
} from '#components/Table/predefinedColumns';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import useConfirmation from '#hooks/useConfirmation';
import {
  ListResponse,
  useLazyRequest, useRequest,
} from '#utils/restRequest';
import { compareLabel } from '#utils/common';
import useAlert from '#hooks/useAlert';
import { DrefOperationalUpdateResponse } from '#types';

import styles from './styles.module.scss';

const ITEM_PER_PAGE = 6;

interface OperationalUpdateDetails {
  id: number;
  title: string;
  is_published: boolean;
}

interface DrefApplicationResponse {
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
  operational_update: OperationalUpdateDetails[];
}

const drefKeySelector = (d: DrefApplicationResponse) => d.id;
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
  } = useRequest<ListResponse<DrefApplicationResponse>>({
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
  } = useRequest<ListResponse<DrefApplicationResponse>>({
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
    publishDrefConfirmationModal,
    onDrefPublishClick,
  ] = useConfirmation({
    message: strings.drefOperationalUpdatePublishConfirmationMessage,
    onConfirm: handlePublishButtonClick,
  });

  const [
    inProgressApplicationColumns,
    publishedApplicationColumns,
  ] = React.useMemo(() => {
    const baseDrefColumns = [
      createDateColumn<DrefApplicationResponse, string | number>(
        'created_at',
        strings.drefTableCreatedOn,
        (item) => item.created_at,
      ),
      createStringColumn<DrefApplicationResponse, string | number>(
        'appeal_code',
        strings.drefTableAppealNumber,
        (item) => item.appeal_code,
      ),
      createStringColumn<DrefApplicationResponse, string | number>(
        'title',
        strings.drefTableName,
        (item) => item.title,

      ),
      createStringColumn<DrefApplicationResponse, string | number>(
        'submission_to_geneva',
        strings.drefTableSubmittedToGeneva,
        (item) => item.submission_to_geneva,
      ),
    ];

    return ([
      [
        ...baseDrefColumns,
        createActionColumn(
          'actions',
          (rowKey: number, item: DrefApplicationResponse) => ({
            children: (
              <DrefExportButton
                drefId={rowKey}
              />
            ),
            extraActions: (
              <>
                <DropdownMenuItem
                  icon={<MdEdit />}
                  href={`/dref-application/${rowKey}/edit/`}
                  label={strings.drefTableEdit}
                />
                <DropdownMenuItem
                  icon={<MdPublish />}
                  name={rowKey}
                  label={strings.drefPublishButtonLabel}
                  onClick={onDrefPublishClick}
                  disabled={drefPublishPending}
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
        ...baseDrefColumns,
        createActionColumn(
          'actions',
          (rowKey: number, item: DrefApplicationResponse) => {
            const hasOperationalUpdate = item.operational_update && item.operational_update.length > 0;
            const hasUnpublishedOperationalUpdate = item.operational_update?.some(d => d.is_published === false) ?? false;
            const canAddNewOperationalUpdate = item.is_published && !hasUnpublishedOperationalUpdate;

            const lastOperationalUpdateId = item.operational_update?.find(ou => !ou.is_published)?.id;

            return {
              extraActions: (
                <>
                  <DropdownMenuItem
                    icon={<IoAdd />}
                    name={rowKey}
                    onClick={postDrefNewOperationalUpdate}
                    label="New Operational Update"
                    disabled={!canAddNewOperationalUpdate}
                  />
                  <DropdownMenuItem
                    icon={<MdEdit />}
                    href={`/dref-operational-update/${lastOperationalUpdateId}`}
                    label="Edit last Operational Update"
                    disabled={!hasOperationalUpdate || !hasUnpublishedOperationalUpdate}
                  />
                  <DropdownMenuItem
                    icon={<IoList />}
                    name={item}
                    onClick={setSelectedDrefForOperationalUpdateList}
                    label="View all Operational Updates"
                    disabled={!hasOperationalUpdate}
                  />
                </>
              ),
              children: (
                <DrefExportButton
                  drefId={rowKey}
                />
              ),
            };
          },
          {
            cellRendererClassName: styles.actionsCell,
            headerContainerClassName: styles.actionsHeader,
          },
        ),
      ],
    ]);
  }, [
    postDrefNewOperationalUpdate,
    drefPublishPending,
    onDrefPublishClick,
    strings,
  ]);

  const operationalUpdateColumns = React.useMemo(() => (
    [
      createStringColumn<OperationalUpdateDetails, string | number>(
        'title',
        'Title',
        (item) => item.title,
      ),
      createStringColumn<OperationalUpdateDetails, string | number>(
        'published',
        'Published',
        (item) => item.is_published ? 'Yes' : 'No',
      ),
      createActionColumn<OperationalUpdateDetails, string | number>(
        'actions',
        (rowKey, item) => ({
          children: (
            <>
              <Button name={undefined}>
                Edit
              </Button>
              <Button name={undefined}>
                Publish
              </Button>
            </>
          ),
        }),
        {
          cellRendererClassName: styles.actionsCell,
          headerContainerClassName: styles.actionsHeader,
        }
      ),
    ]
  ), []);

  const [
    selectedDrefForOperationalUpdateList,
    setSelectedDrefForOperationalUpdateList,
  ] = React.useState<DrefApplicationResponse>();

  const pending = publishedDrefPending || inProgressDrefPending || newOperationalUpdatePending;

  return (
    <Container
      className={styles.drefApplicationList}
      contentClassName={styles.content}
      descriptionClassName={styles.filters}
      description={(
        <SelectInput
          name={undefined}
          placeholder="Select Country"
          options={countryOptions}
          value={country}
          onChange={setCountry}
          isClearable
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
        <Table
          className={styles.inProgressDrefTable}
          data={inProgressApplicationList}
          columns={inProgressApplicationColumns}
          keySelector={drefKeySelector}
          variant="large"
        />
        {inProgressDrefPending && <BlockLoading />}
        {!inProgressDrefPending && inProgressDrefResponse?.results?.length === 0 && (
          <EmptyMessage />
        )}
        {!pending && !inProgressDrefResponse && (
          <div className={styles.error}>
            There was an error fetching the DREF application list
          </div>
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
        <Table
          className={styles.publishedDrefTable}
          data={publishedApplicationList}
          columns={publishedApplicationColumns}
          keySelector={drefKeySelector}
          variant="large"
        />
        {publishedDrefPending && <BlockLoading />}
        {!publishedDrefPending && publishedDrefResponse?.results?.length === 0 && (
          <EmptyMessage />
        )}
        {!pending && !publishedDrefResponse && (
          <div className={styles.error}>
            There was an error fetching the DREF application list
          </div>
        )}
      </Container>
      {selectedDrefForOperationalUpdateList && (
        <Backdrop className={styles.operationalUpdateListModalBackdrop}>
          <Container
            sub
            className={styles.operationalUpdateListModal}
            heading="Operational Updates"
            actions={(
              <Button
                name={undefined}
                variant="action"
                onClick={setSelectedDrefForOperationalUpdateList}
              >
                <IoClose />
              </Button>
            )}
          >
            <Table
              className={styles.operationalUpdateTable}
              data={selectedDrefForOperationalUpdateList.operational_update}
              columns={operationalUpdateColumns}
              keySelector={d => d.id}
            />
          </Container>
        </Backdrop>
      )}
      {publishDrefConfirmationModal}
    </Container>
  );
}

export default DrefApplicationList;
