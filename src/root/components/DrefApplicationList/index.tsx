import React from 'react';
import { History } from 'history';
import {
  isDefined,
  isNotDefined,
} from '@togglecorp/fujs';
import {
  IoClose,
  IoAdd,
  IoList,
  IoPushOutline,
} from 'react-icons/io5';
import {
  MdEdit,
  MdPublish,
} from 'react-icons/md';
import {
  EntriesAsList,
  Error,
  getErrorObject,
  PartialForm,
} from '@togglecorp/toggle-form';

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
  createNumberColumn,
  createDateColumn,
  createActionColumn,
} from '#components/Table/predefinedColumns';
import useReduxState from '#hooks/useReduxState';
import useInputState from '#hooks/useInputState';
import useConfirmation from '#hooks/useConfirmation';
import {
  ListResponse,
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import { compareLabel } from '#utils/common';
import useAlert from '#hooks/useAlert';
import { DrefOperationalUpdateResponse } from '#types';
import OperationalUpdateExport from '#components/OperationalUpdateExport';
import DREFFileImport from '#components/DREFFileImport';

import styles from './styles.module.scss';

const ITEM_PER_PAGE = 6;

interface OperationalUpdateDetails {
  id: number;
  title: string;
  is_published: boolean;
  operational_update_number: number;
}
interface FinalReportDetails {
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
  operational_update_details: OperationalUpdateDetails[];
  dref_final_report_details: FinalReportDetails[];
  is_final_report_created: boolean;
}

const drefKeySelector = (d: DrefApplicationResponse) => d.id;
const operationalUpdateKeySelector = (d: OperationalUpdateDetails) => d.id;


interface DrefOperationalResponseFields {
  id: number;
}

interface DREFFileField {
  file: number;
}
type Value = PartialForm<DREFFileField>;

interface Props {
  history: History;
  value: Value,
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  fileIdToUrlMap: Record<number, string>;
  setFileIdToUrlMap?: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  error: Error<Value> | undefined;
}

function DrefApplicationList(props: Props) {
  const {
    history,
    onValueChange,
    value,
    setFileIdToUrlMap,
    fileIdToUrlMap,
    error: formError,
  } = props;

  const error = getErrorObject(formError);

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
    pending: operationalUpdatePublishPending,
    trigger: postOperationalUpdatePublishRequest,
  } = useLazyRequest<DrefOperationalResponseFields, number>({
    url: (operationalUpdateId) => operationalUpdateId ? `api/v2/dref-op-update/${operationalUpdateId}/publish/` : undefined,
    body: () => ({}),
    method: 'POST',
    onSuccess: (response) => {
      refetchPublishedDrefList();
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefOperationalUpdatePublishConfirmationFailureMessage}
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
          {strings.drefOperationalUpdateFailureMessage}
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
    pending: newFinalReportPending,
    trigger: postDrefNewFinalReport,
  } = useLazyRequest<DrefOperationalUpdateResponse, number>({
    url: (drefId) => drefId ? `api/v2/dref-final-report/` : undefined,
    body: (drefId) => ({ dref: drefId }),
    method: 'POST',
    onSuccess: (response) => {
      if (isDefined(response?.id)) {
        history.push(`/dref-final-report/${response.id}/edit/`);
      }
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefOperationalUpdateFailureMessage}
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
    pending: finalReportPublishPending,
    trigger: postFinalReportPublishRequest,
  } = useLazyRequest<DrefOperationalResponseFields, number>({
    url: (finalReportId) => finalReportId ? `api/v2/dref-final-report/${finalReportId}/publish/` : undefined,
    body: () => ({}),
    method: 'POST',
    onSuccess: (response) => {
      refetchPublishedDrefList();
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.finalReportPublishConfirmationFailureMessage}
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

  const handleDrefPublishConfirm = React.useCallback((drefId: number) => {
    postDrefPublishRequest(drefId);
  }, [postDrefPublishRequest]);

  const handleOperationalUpdatePublishConfirm = React.useCallback((operationalUpdateId: number) => {
    postOperationalUpdatePublishRequest(operationalUpdateId);
  }, [postOperationalUpdatePublishRequest]);

  const handleFinalReportPublishConfirm = React.useCallback((finalReportId: number) => {
    postFinalReportPublishRequest(finalReportId);
  }, [postFinalReportPublishRequest]);

  const [
    publishDrefConfirmationModal,
    onDrefPublishClick,
  ] = useConfirmation({
    message: strings.drefPublishConfirmationMessage,
    onConfirm: handleDrefPublishConfirm,
  });

  const [
    publishOperationalUpdateConfirmationModal,
    onOperationalUpdatePublishClick,
  ] = useConfirmation({
    message: strings.drefOperationalUpdatePublishConfirmationMessage,
    onConfirm: handleOperationalUpdatePublishConfirm,
  });

  const [
    publishFinalReportConfirmationModal,
    onFinalReportPublishClick,
  ] = useConfirmation({
    message: strings.finalReportPublishConfirmationMessage,
    onConfirm: handleFinalReportPublishConfirm,
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
        createActionColumn<DrefApplicationResponse, number>(
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
            const hasOperationalUpdate = item.operational_update_details && item.operational_update_details.length > 0;
            const hasUnpublishedOperationalUpdate = item.operational_update_details?.some(d => d.is_published === false) ?? false;
            const canAddNewOperationalUpdate = item.is_published && !hasUnpublishedOperationalUpdate && item.dref_final_report_details;
            const lastOperationalUpdateId = item.operational_update_details?.find(ou => !ou.is_published)?.id;

            //TODO: Field Report
            const hasFinalReport = item.dref_final_report_details && item.dref_final_report_details.length > 0;
            const hasUnpublishedFinalReport = item.dref_final_report_details?.some(d => d.is_published === false) ?? false;
            const canAddNewFinalReport = item.is_published && !hasUnpublishedFinalReport && !hasUnpublishedOperationalUpdate;
            const lastFinalReportId = item.dref_final_report_details?.find(ou => !ou.is_published)?.id;
            console.log({ hasFinalReport });
            console.log({ hasUnpublishedFinalReport });
            console.log({ canAddNewFinalReport });

            return {
              extraActions: (
                <>
                  <DropdownMenuItem
                    icon={<IoAdd />}
                    name={rowKey}
                    onClick={postDrefNewFinalReport}
                    label={strings.finalReportCreateButtonLabel}
                    disabled={!canAddNewFinalReport}
                  />
                  <DropdownMenuItem
                    icon={<MdEdit />}
                    href={`/dref-final-report/${lastFinalReportId}/edit/`}
                    label={strings.finalReportEditButtonLabel}
                    disabled={!hasFinalReport || !hasUnpublishedFinalReport || finalReportPublishPending}
                  />
                  <DropdownMenuItem
                    icon={<IoPushOutline />}
                    name={+rowKey}
                    label={strings.finalReportPublishButtonLabel}
                    onClick={onFinalReportPublishClick}
                    disabled={!hasFinalReport}
                  />
                  {
                    !hasFinalReport &&
                    <>
                      <DropdownMenuItem
                        icon={<IoAdd />}
                        name={rowKey}
                        onClick={postDrefNewOperationalUpdate}
                        label={strings.drefOperationalUpdateNewLabel}
                        disabled={!canAddNewOperationalUpdate}
                      />
                      <DropdownMenuItem
                        icon={<MdEdit />}
                        href={`/dref-operational-update/${lastOperationalUpdateId}/edit/`}
                        label={strings.drefOperationalUpdateEditLastLabel}
                        disabled={!hasOperationalUpdate || !hasUnpublishedOperationalUpdate || hasFinalReport}
                      />
                    </>
                  }
                  <DropdownMenuItem
                    icon={<IoList />}
                    name={item.id}
                    onClick={setSelectedDrefIdForOperationalUpdateList}
                    label={strings.drefOperationalUpdateViewAllLabel}
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
    postDrefNewFinalReport,
    finalReportPublishPending,
    onFinalReportPublishClick,
    postDrefNewOperationalUpdate,
    drefPublishPending,
    onDrefPublishClick,
    strings,
  ]);

  const operationalUpdateColumns = React.useMemo(() => (
    [
      createNumberColumn<OperationalUpdateDetails, string | number>(
        'number',
        'Update Number',
        (item) => item.operational_update_number,
      ),
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
      createActionColumn<OperationalUpdateDetails, number>(
        'actions',
        (rowKey: number, item: OperationalUpdateDetails) => ({
          extraActions: (
            <>
              <DropdownMenuItem
                icon={<MdEdit />}
                href={`/dref-operational-update/${rowKey}/edit/`}
                label="Edit"
                disabled={item.is_published}
              />
              <DropdownMenuItem
                icon={<MdPublish />}
                name={+rowKey}
                label={strings.drefPublishButtonLabel}
                onClick={onOperationalUpdatePublishClick}
                disabled={operationalUpdatePublishPending || item.is_published}
              />
              <OperationalUpdateExport
                operationalId={rowKey}
              />
            </>
          ),
        }),
        {
          cellRendererClassName: styles.actionsCell,
          headerContainerClassName: styles.actionsHeader,
        }
      ),
    ]
  ), [
    operationalUpdatePublishPending,
    onOperationalUpdatePublishClick,
    strings,
  ]);

  const [
    selectedDrefIdForOperationalUpdateList,
    setSelectedDrefIdForOperationalUpdateList,
  ] = React.useState<number>();

  const selectedDrefForOperationalUpdateList = React.useMemo(() => {
    if (isNotDefined(selectedDrefIdForOperationalUpdateList)) {
      return undefined;
    }

    return publishedDrefResponse?.results?.find((d) => d.id === selectedDrefIdForOperationalUpdateList);
  }, [selectedDrefIdForOperationalUpdateList, publishedDrefResponse]);

  const pending = publishedDrefPending || inProgressDrefPending || newOperationalUpdatePending || newFinalReportPending;

  return (
    <Container
      className={styles.drefApplicationList}
      contentClassName={styles.content}
      descriptionClassName={styles.filters}
      description={(
        <>
          <SelectInput
            name={undefined}
            placeholder="Select Country"
            options={countryOptions}
            value={country}
            onChange={setCountry}
            isClearable
          />
          <div className={styles.buttonImport}>
            <DREFFileImport
              accept=".docx"
              error={error?.file}
              fileIdToUrlMap={fileIdToUrlMap}
              name="file"
              onChange={onValueChange}
              setFileIdToUrlMap={setFileIdToUrlMap}
              value={value?.file}
              multiple={false}
            >
              {strings.drefFileImportLabel}
            </DREFFileImport>
          </div>
        </>
      )}
    >
      <Container
        heading={strings.drefTableInProgressHeading}
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
        {!inProgressDrefPending && (
          <Table
            className={styles.inProgressDrefTable}
            data={inProgressApplicationList}
            columns={inProgressApplicationColumns}
            keySelector={drefKeySelector}
            variant="large"
          />
        )}
        {!inProgressDrefPending && inProgressDrefResponse?.results?.length === 0 && (
          <EmptyMessage />
        )}
        {!pending && !inProgressDrefResponse && (
          <div className={styles.error}>
            {strings.drefFetchingErrorMessage}
          </div>
        )}
      </Container>
      <Container
        heading={strings.drefTablePublishedHeading}
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
        {!publishedDrefPending && (
          <Table
            className={styles.publishedDrefTable}
            data={publishedApplicationList}
            columns={publishedApplicationColumns}
            keySelector={drefKeySelector}
            variant="large"
          />
        )}
        {!publishedDrefPending && publishedDrefResponse?.results?.length === 0 && (
          <EmptyMessage />
        )}
        {!pending && !publishedDrefResponse && (
          <div className={styles.error}>
            {strings.drefFetchingErrorMessage}
          </div>
        )}
      </Container>
      {selectedDrefForOperationalUpdateList && (
        <Backdrop className={styles.operationalUpdateListModalBackdrop}>
          <Container
            sub
            className={styles.operationalUpdateListModal}
            heading={strings.drefOperationalUpdateTitle}
            actions={(
              <Button
                name={undefined}
                variant="action"
                onClick={setSelectedDrefIdForOperationalUpdateList}
              >
                <IoClose />
              </Button>
            )}
          >
            {(publishedDrefPending || operationalUpdatePublishPending) && <BlockLoading />}
            {!(publishedDrefPending || operationalUpdatePublishPending) && (
              <Table
                className={styles.operationalUpdateTable}
                data={selectedDrefForOperationalUpdateList.operational_update_details}
                columns={operationalUpdateColumns}
                keySelector={operationalUpdateKeySelector}
                variant="large"
              />
            )}
          </Container>
        </Backdrop>
      )}
      {publishDrefConfirmationModal}
      {publishOperationalUpdateConfirmationModal}
      {publishFinalReportConfirmationModal}
    </Container>
  );
}

export default DrefApplicationList;
